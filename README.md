# Tiny Transit

A browser transit puzzle in the spirit of Mini Metro.

**Play it:** https://alekb.github.io/tiny-transit/

Stations keep appearing; you draw lines between them and keep the passengers moving. When a station stays crowded for too long, the network shuts down.

Single file, no build step, no dependencies. Open `index.html` in a browser, or serve the folder with any static server. The two online modes, Co-op and Rivals, need the small relay in `server/` (a Cloudflare Worker); everything else works from the file alone.

## Cities and modes

- **Riverside**: one river across the map, three tunnels to start.
- **Islands**: one river that forks around one or two islands and rejoins, four tunnels to start. Crossing an island costs a tunnel per channel; a station can appear on an island, reachable only by tunnel.
- **Dry Basin**: no water, but stations arrive faster and crowds run heavier.
- **Anywhere**: rolled from the seed when you start. Roughly one run in five is dry, three in ten have a river, three in ten a river with islands, and one in five a lake to tunnel under or route around. Tunnels follow the water (0, 3, 4 or 4) and the pace varies a little either way. The recap names what was rolled beside the seed, so a good map can be shared. Not in the daily rotation.
- **Normal**: a crowded station ends the run. **Endless**: no game over, overflowing passengers give up and leave, end the run yourself for the recap. **Extreme**: lines only grow (no retracting, removing, bypassing or opening loops).
- **Co-op**: two browsers, one city. Pick Co-op and *Find a partner*: you wait until another player does the same and the two of you are paired, or copy the invite link and send it to a friend, who joins you directly. You play under a name: a random two-word handle at first ("Brisk Tram"), editable on the matchmaking card and remembered on your device; your partner sees it in the score line, on the Monday card and in the recap. Each player draws four lines (the first to arrive hosts and draws A to D; the guest draws E to H) and has their own depot; stations, tunnels and the game over are shared. Every Monday both players receive a locomotive and take turns choosing the upgrade. Both browsers run the same simulation and only exchange edits through a small relay, so a slow connection shows as a short pause, never as a different map. The relay is a Cloudflare Worker in `server/`; see `server/README.md` to deploy it and set `RELAY_URL` in `index.html`.
- **Rivals**: the competitive two-player mode, on the same relay, matchmaking and names as Co-op (pick Rivals and *Find a rival*, or send a friend the link; the two modes queue separately, so a co-op seeker never lands in a match). Every station belongs to one player: they alternate as they appear, host first, and carry the owner's tint (pale blue for the host, pale pink for the guest). A passenger delivered to your station is your point, whoever's train brought them; the `+N` float shows in the owner's colour and the score line reads `Alek 34 · Sam 29`. Lines, tunnels (half the city's budget each, rounded up) and Monday picks are your own: each player rolls their own three choices, and the map waits until both have picked. The first station to overflow ends the match and its owner loses, whatever the score. The result card says who won, the map label names the station's owner, and the recap adds Score and Stations rows. No personal best is kept for Rivals.
- **Today's daily**: the same seeded map for everyone, chosen from the UTC date. It is laid out on a fixed reference map and fitted to your screen (turned on its side in portrait), and the stations that appear do not depend on how you play. Every other run is a fresh seed; the seed is shown in the recap so a map can be described.

## How to play

- **Draw a line**: drag from one station to another, or drag a ready letter (A to H) from the tray onto a station and on to a second one.
- **Select a line**: tap it on the map, tap its letter in the tray, or press its letter key. A selected line shows handles: a lettered square at each end (drag to extend, back onto the previous stop to retract, onto the other end to close a loop), a hollow square at each segment midpoint (drag onto a station to add it as a stop), and a small square above each middle stop (drag it away to bypass that stop). Loop trains run one way and 25% faster; long-press or right-click a loop segment to open it.
- **Remove a line**: select it and use **Remove line**, or press Delete. Its train goes back to the depot.
- **Rivers**: every crossing spends a tunnel. The drag preview prices each crossing at the river and turns red when the budget would run out. Retracting a crossing refunds it. The budget sits at the right end of the tray.
- **Passengers** board the first arriving train with room that heads toward a station that brings them closer, and change lines where lines meet. This also applies when both players connect the same stations: passengers do not prefer either owner's train. Arrivals in the same simulation step are handled in train creation order, so the earlier-created train boards first. Rare shapes draw demand from the whole map. A hollow passenger glyph has no route yet.
- **Crowding**: more than 6 waiting passengers (12 at an interchange) starts a red ring, with a ripple the moment it begins and a count badge from 8. When the ring closes, the game ends. Interchanges also halve stopping time. Red on the map always means "needs you now": no line is red.
- **Every Monday** you receive a locomotive and choose one of three upgrades: a new line, a carriage (+6 seats, tap the train you want it on), an interchange, or two tunnels. A new locomotive joins its line where the gap between trains is widest. The map pauses while you decide and while you place. In Co-op the players take turns choosing; in Rivals each chooses for themselves and the card waits for both.
- **Recap**: the end card shows the top line, the busiest station, the longest and average wait, and your best for that city and mode. Co-op adds how many each player carried; Rivals adds each player's score and station count instead of a best.
- **Two-player lines**: your routes are solid and the other player's routes are dashed, in both Co-op and Rivals. The legend above the tray shows your letters and the other player's name and letters; letter badges on the map identify individual lines. Its blue and pink tints also match station ownership in Rivals.
- **Co-op etiquette**: passengers change lines wherever your lines meet your partner's, so build a shared interchange early. You can select a partner's line to read its stop and train count, but only they can edit it.
- **Rivals tactics**: every line you draw carries passengers to your rival's stations too, and each of those is their point; hold back and your own stations crowd. Get passengers out of your stations first, then bring passengers in. Your own crowding station shows the red ring and count badge; a rival's shows the ring with an ink badge naming them, since it is theirs to fix, and the coach tells you whether to leave it or draw there and take the deliveries.
- **Keep in depot** during placement skips just that item and moves on to the next one; tap its token in the tray to place it later.
- **Messages**: the coach cell in the tray explains what to do next; short toasts confirm what just happened; a red note at the pointer explains a refusal.
- Keys: `Space` pause, `1` / `2` speed, `Esc` cancel placement or deselect, `A`–`H` select a line, `Delete` remove it. On phones, pause, speed, sound, theme and help live in the menu button.

## Notes

- Shared segments are drawn side by side; trains follow the offset path.
- The map is fitted above the bottom tray (and the ownership legend in two-player games), with room for a crowding ring, so no station is ever hidden behind the controls. The tray's height is fixed: toasts, the placement banner and **Remove line** appear inside the coach row on phones and in a reserved strip above the tray on wide screens, so the map never shifts while you play.
- Shared maps (the daily, Co-op and Rivals) are laid out once and fitted to each screen, turned on its side in portrait. To keep stations apart on phones, horizontal gaps count for less when stations are spaced, which widens the tightest phone gaps by about a fifth without changing desktop maps. Short landscape screens get a compact top bar and leave out the ownership legend. A station near the right edge queues its passengers to its left so none run off screen.
- Train travel uses the reference map, so resizing or opening controls does not change arrival times or either player's simulation.
- Best scores, the mute setting and your online player name are kept in `localStorage` (per browser).
- Light and dark themes follow the system setting, or pick one from the phone menu (remembered per browser).

## Checks

Run the simulation regression tests with `node tests/transit.test.cjs`. They cover matching arrivals across screen sizes, shared-route boarding, loops and carriage spacing.

## License

MIT. See `LICENSE`.
