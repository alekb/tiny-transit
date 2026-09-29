# Tiny Transit relay

The matchmaking server for co-op. It is a single Cloudflare Worker with one Durable Object, about a hundred lines, and it fits comfortably in the free plan.

What it does: a browser opens a WebSocket to `/ws?room=public` (or a private room name from a "play with a friend" link). The first arrival waits; the second is paired with it. After that the server forwards every message between the two, without reading it. Game state never leaves the browsers.

## Deploy

You need a Cloudflare account (free, no card) and Node. The whole thing takes a few minutes; the steps below include the snags we hit the first time.

### 1. Log in

```sh
cd server
npx wrangler login
```

`npx` downloads wrangler on the fly. The command opens a browser tab asking you to allow wrangler access; click **Allow** and the terminal prints "Successfully logged in". On WSL, if no tab opens, copy the printed URL into a Windows browser; the redirect back to `localhost` still works.

Run this in a real terminal. Wrangler asks questions on first use, and a non-interactive shell (a script, an editor task runner) cannot answer them and fails with an unhelpful error.

### 2. Pick a workers.dev subdomain

Every Worker on the account is served at `<worker-name>.<subdomain>.workers.dev`, and an account has exactly one subdomain. Before the first deploy, that subdomain has to exist. Two ways:

- Open **Workers & Pages** in the dashboard (`https://dash.cloudflare.com/?to=/:account/workers/workers-and-pages`). The first visit offers to register one; pick a personal name such as your handle. The relay then lives at `https://tiny-transit-relay.<name>.workers.dev`.
- Or let `npx wrangler deploy` ask you. It only asks in an interactive terminal; otherwise it tries to register one named after the current folder (`server`), which is taken, and stops with "Wrangler could not automatically register 'server' as your workers.dev subdomain".

Choosing the name is worth a moment: it can be changed later, but that changes the URL of every Worker on the account, and the API refuses to replace an existing subdomain, so a rename means deleting it and registering again. Names are first come, first served across all of Cloudflare, so a short one may already be gone.

### 3. Deploy

```sh
npx wrangler deploy
```

This uploads `worker.js` and creates the Durable Object from `wrangler.toml`; confirm the migration if asked. The output ends with the Worker's URL:

```
Deployed tiny-transit-relay triggers
  https://tiny-transit-relay.<name>.workers.dev
```

Open that URL. It should say **Tiny Transit relay is up.** Right after a subdomain is registered, its TLS certificate takes a minute or two to issue; until then the browser shows a connection error and `curl` reports `sslv3 alert handshake failure`. Wait and retry, nothing is wrong.

### 4. Point the game at it

Open `index.html`, find `RELAY_URL` near the top of the script, and set it to the Worker's URL with `wss://` in place of `https://`:

```js
const RELAY_URL = new URLSearchParams(location.search).get('relay') || 'wss://tiny-transit-relay.<name>.workers.dev';
```

Commit and push; GitHub Pages rebuilds from `main` within a minute or two. The current build points at `wss://tiny-transit-relay.albey.workers.dev`.

### Trying it locally

`npx wrangler dev` runs the same code on `ws://localhost:8787`, and opening the game with `?relay=ws://localhost:8787` points it there for that visit. To test co-op alone, open the game in two windows, press **Copy link** in one, and open that link in the other.

## Notes

- No accounts, no persistence: the Durable Object only holds who is waiting right now.
- Room names are `[a-z0-9-]`, up to 32 characters. `public` is the open queue.
- A player who disconnects sends their partner a `gone` message; the game ends with a "connection lost" card and neither socket is reused.
