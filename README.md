# Tiny Transit

A browser transit puzzle in the spirit of Mini Metro. Stations keep appearing; you draw lines between them and keep the passengers moving. When a station stays crowded for too long, the network shuts down.

Single file, no build step, no dependencies. Open `index.html` in a browser, or serve the folder with any static server.

## How to play

- **Draw a line**: drag from one station to another, or drag a colour pill from the tray onto a station and on to a second one.
- **Extend or retract**: drag a line's end cap to a new station; drag it back onto the previous stop to retract. Drag the cap onto the line's other end to close a loop; long-press or right-click a loop segment to open it again.
- **Manage lines**: tap a drawn pill in the tray to select its line, then **Remove** to return its train to the depot.
- **Passengers** board any train that brings them closer to a station of their shape and change lines where lines meet.
- **Crowding**: more than 6 waiting passengers (12 at an interchange) starts a red ring. When the ring closes, the game ends.
- **Every Monday** you receive a locomotive and choose one upgrade: a new line, a carriage (+6 seats), or an interchange. Place them from the depot tray, or keep them for later.
- Keys: `Space` pause, `1` / `2` speed, `Esc` cancel placement.

## Notes

- Shared segments are drawn side by side; trains follow the offset path.
- Best score is kept in `localStorage` (per browser).
- Light and dark themes follow the system setting.
- Design review canvas with the UI decisions: https://claude.ai/artifact/W1TgbFAqW6MGrWWD56BJ4G
