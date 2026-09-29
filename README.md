# Tiny Transit

A browser transit puzzle in the spirit of Mini Metro.

**Play it:** https://alekb.github.io/tiny-transit/

Stations keep appearing; you draw lines between them and keep the passengers moving. When a station stays crowded for too long, the network shuts down.

Single file, no build step, no dependencies. Open `index.html` in a browser, or serve the folder with any static server.

## Cities and modes

- **Riverside**: one river across the map, three tunnels to start.
- **Twin Rivers**: two rivers, three banks, four tunnels to start.
- **Dry Basin**: no water, but stations arrive faster and crowds run heavier.
- **Normal**: a crowded station ends the run. **Endless**: no game over, overflowing passengers give up and leave, end the run yourself for the recap. **Extreme**: lines only grow (no retracting, removing, bypassing or opening loops).
- **Co-op**: two browsers, one city. Pick Co-op, then *Play together*. One player hosts and gets a code to send over any chat; the other joins by pasting it and sends back a reply code. There is no server: the two browsers talk directly (WebRTC), and the codes are how they find each other. Each player draws four colours (host: Red, Blue, Yellow, Green) and has their own depot; stations, tunnels and the game over are shared. Every Monday both players receive a locomotive and take turns choosing the upgrade. Both peers run the same simulation and only exchange edits, so a slow connection shows as a short pause, never as a different map. Some networks (symmetric NAT on both sides) cannot connect directly; there is no relay yet.
- **Today's daily**: the same seeded map for everyone, chosen from the UTC date. It is laid out on a fixed reference map and fitted to your screen (turned on its side in portrait), and the stations that appear do not depend on how you play. Every other run is a fresh seed; the seed is shown in the recap so a map can be described.

## How to play

- **Draw a line**: drag from one station to another, or drag a colour pill from the tray onto a station and on to a second one.
- **Extend or retract**: drag a line's end cap to a new station; drag it back onto the previous stop to retract. Drag the cap onto the line's other end to close a loop. Loop trains run one way, never reverse, and go 25% faster. Long-press or right-click a loop segment to open it.
- **Reroute**: drag a segment onto a station to add a stop in the middle. Select a line from the tray, then drag a middle stop off the line to bypass it.
- **Manage lines**: tap a drawn pill in the tray to select its line, then **Remove** to return its train to the depot.
- **Rivers**: every crossing uses a tunnel. Retracting a crossing gives it back. The tray shows how many remain.
- **Passengers** board only trains heading toward a station that brings them closer, and change lines where lines meet. Rare shapes draw demand from the whole map. A hollow passenger glyph has no route yet.
- **Crowding**: more than 6 waiting passengers (12 at an interchange) starts a red ring, with a ripple the moment it begins. When the ring closes, the game ends. Interchanges also halve stopping time.
- **Every Monday** you receive a locomotive and choose one upgrade: a new line, a carriage (+6 seats, tap the train you want it on), an interchange, or two tunnels. A new locomotive joins its line where the gap between trains is widest.
- **Recap**: the end card shows the top line, the busiest station, the longest and average wait, and your best for that city and mode.
- **Co-op etiquette**: passengers change lines wherever your lines meet your partner's, so build a shared interchange early. You can select a partner's line to read its stop and train count, but only they can edit it.
- **Keep in depot** during placement skips just that item and moves on to the next one; tap its token in the tray to place it later.
- Keys: `Space` pause, `1` / `2` speed, `Esc` cancel placement. Sound can be muted from the top bar.

## Notes

- Shared segments are drawn side by side; trains follow the offset path.
- Best scores and the mute setting are kept in `localStorage` (per browser).
- Light and dark themes follow the system setting.

## License

MIT. See `LICENSE`.
