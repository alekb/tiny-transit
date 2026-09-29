# Tiny Transit relay

The matchmaking server for co-op. It is a single Cloudflare Worker with one Durable Object, about a hundred lines, and it fits comfortably in the free plan.

What it does: a browser opens a WebSocket to `/ws?room=public` (or a private room name from a "play with a friend" link). The first arrival waits; the second is paired with it. After that the server forwards every message between the two, without reading it. Game state never leaves the browsers.

## Deploy

You need a Cloudflare account (free) and Node.

```sh
cd server
npx wrangler login      # opens a browser the first time
npx wrangler deploy
```

The last line of the output is the Worker's URL, something like `https://tiny-transit-relay.<your-subdomain>.workers.dev`. Open `index.html`, find `RELAY_URL` near the top of the script, and set it to that URL with `wss://` in place of `https://`. Commit and push; GitHub Pages picks it up.

To try it before deploying, `npx wrangler dev` runs the same code locally on `ws://localhost:8787`, and opening the game with `?relay=ws://localhost:8787` points it there for that visit.

## Notes

- No accounts, no persistence: the Durable Object only holds who is waiting right now.
- Room names are `[a-z0-9-]`, up to 32 characters. `public` is the open queue.
- A player who disconnects sends their partner a `gone` message; the game ends with a "connection lost" card and neither socket is reused.
