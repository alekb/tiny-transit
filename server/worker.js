// Tiny Transit matchmaking relay: a Cloudflare Worker with one Durable Object.
//
// A browser opens a WebSocket to /ws?room=<name>. The first arrival in a room waits; the second is paired with it.
// "public" is the open queue; any other name is a private room shared by link. Once paired, every message a
// player sends is forwarded verbatim to their partner. The server never reads the game state: the two browsers
// run the same deterministic simulation and only exchange commands (see index.html, "co-op networking").
//
// Deploy: `cd server && npx wrangler deploy`, then point RELAY_URL in index.html at the printed workers.dev URL.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/ws') {
      if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected a WebSocket', { status: 426 });
      // one lobby object for everyone; a Durable Object comfortably holds thousands of idle sockets
      const id = env.LOBBY.idFromName('lobby');
      return env.LOBBY.get(id).fetch(request);
    }
    if (url.pathname === '/') return new Response('Tiny Transit relay is up.', { headers: { 'content-type': 'text/plain' } });
    return new Response('Not found', { status: 404 });
  },
};

const ROOM_RE = /^[a-z0-9-]{1,32}$/;

export class Lobby {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const room = (url.searchParams.get('room') || 'public').toLowerCase();
    if (!ROOM_RE.test(room)) return new Response('Bad room name', { status: 400 });
    const pair = new WebSocketPair();
    const [client, server] = [pair[0], pair[1]];
    // Hibernatable sockets: the object may be evicted between messages, so everything a socket needs to know
    // lives in its attachment and is rebuilt from getWebSockets() on wake.
    this.state.acceptWebSocket(server, [room]);
    const me = { id: crypto.randomUUID(), room, peer: null };
    server.serializeAttachment(me);
    const partner = this.state.getWebSockets(room).find((ws) => {
      const a = ws.deserializeAttachment();
      return a && a.id !== me.id && a.peer === null;
    });
    if (partner) {
      const them = partner.deserializeAttachment();
      them.peer = me.id; me.peer = them.id;
      partner.serializeAttachment(them); server.serializeAttachment(me);
      // the one who waited longest hosts: their city choice is used and their commands apply first
      this.send(partner, { t: 'matched', me: 0, room });
      this.send(server, { t: 'matched', me: 1, room });
    } else {
      this.send(server, { t: 'waiting', room });
    }
    return new Response(null, { status: 101, webSocket: client });
  }

  send(ws, m) { try { ws.send(JSON.stringify(m)); } catch (e) { /* socket already gone */ } }

  peerOf(ws) {
    const a = ws.deserializeAttachment();
    if (!a || !a.peer || a.peer === 'gone') return null;
    return this.state.getWebSockets(a.room).find((o) => { const b = o.deserializeAttachment(); return b && b.id === a.peer; }) || null;
  }

  webSocketMessage(ws, message) {
    if (typeof message !== 'string' || message.length > 64 * 1024) return;
    const peer = this.peerOf(ws);
    if (peer) { try { peer.send(message); } catch (e) { /* peer closed under us; its close handler will follow */ } }
  }

  webSocketClose(ws) { this.drop(ws); }
  webSocketError(ws) { this.drop(ws); }

  drop(ws) {
    const a = ws.deserializeAttachment();
    const peer = this.peerOf(ws);
    if (peer) {
      const b = peer.deserializeAttachment();
      b.peer = 'gone'; peer.serializeAttachment(b);   // never re-pair a socket whose game is over
      this.send(peer, { t: 'gone' });
    }
    if (a) { a.peer = 'gone'; try { ws.serializeAttachment(a); } catch (e) { /* closing */ } }
    try { ws.close(1000, 'bye'); } catch (e) { /* already closed */ }
  }
}
