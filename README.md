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
- **Today's daily**: the same seeded map for everyone, chosen from the UTC date. It is laid out on a fixed reference map and fitted to your screen (turned on its side in portrait), and the stations that appear do not depend on how you play. Every other run is a fresh seed; the seed is shown in the recap so a map can be described.

## How to play

- **Draw a line**: drag from one station to another, or drag a ready letter (A to H) from the tray onto a station and on to a second one.
- **Select a line**: tap it on the map, tap its letter in the tray, or press its letter key. A selected line shows handles: a lettered square at each end (drag to extend, back onto the previous stop to retract, onto the other end to close a loop), a hollow square at each segment midpoint (drag onto a station to add it as a stop), and a small square above each middle stop (drag it away to bypass that stop). Loop trains run one way and 25% faster; long-press or right-click a loop segment to open it.
- **Remove a line**: select it and use **Remove line**, or press Delete. Its train goes back to the depot.
- **Rivers**: every crossing spends a tunnel. The drag preview prices each crossing at the river and turns red when the budget would run out. Retracting a crossing refunds it. The budget sits at the right end of the tray.
- **Passengers** board only trains heading toward a station that brings them closer, and change lines where lines meet. Rare shapes draw demand from the whole map. A hollow passenger glyph has no route yet.
- **Crowding**: more than 6 waiting passengers (12 at an interchange) starts a red ring, with a ripple the moment it begins and a count badge from 8. When the ring closes, the game ends. Interchanges also halve stopping time. Red on the map always means "needs you now": no line is red.
- **Every Monday** you receive a locomotive and choose one of three upgrades: a new line, a carriage (+6 seats, tap the train you want it on), an interchange, or two tunnels. A new locomotive joins its line where the gap between trains is widest. The map pauses while you decide and while you place.
- **Recap**: the end card shows the top line, the busiest station, the longest and average wait, and your best for that city and mode.
- **Keep in depot** during placement skips just that item and moves on to the next one; tap its token in the tray to place it later.
- **Messages**: the coach cell in the tray explains what to do next; short toasts confirm what just happened; a red note at the pointer explains a refusal.
- Keys: `Space` pause, `1` / `2` speed, `Esc` cancel placement or deselect, `A`–`H` select a line, `Delete` remove it. On phones, pause, speed, sound, theme and help live in the menu button.

## Notes

- Shared segments are drawn side by side; trains follow the offset path.
- Best scores and the mute setting are kept in `localStorage` (per browser).
- Light and dark themes follow the system setting, or pick one from the phone menu (remembered per browser).

## License

MIT. See `LICENSE`.
