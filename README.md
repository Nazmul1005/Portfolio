# macOS-style personal portfolio

A responsive developer portfolio styled as a macOS desktop, with a translucent menu bar and Dock, Finder sidebars, traffic-light window controls, Spotlight-style search, Terminal, and a Macintosh Spectrum live wallpaper. Built with HTML, CSS, and JavaScript. No dependency installation required.

The Macintosh wallpaper cycles through green, yellow, orange, red, purple, and blue, showing one color at a time with smooth transitions over an 84-second loop. Retro scenes fade between classic icon, Finder, MacPaint, and control-panel graphics while a slow perspective pan provides motion. Dark appearance dims the same spectrum. **View → Macintosh · Spectrum → Pause** stops the animation and saves that preference; reduced-motion preferences keep a static scene. Hidden tabs pause playback.

The four PNG textures in `assets/macintosh/` are original Apple artwork copied from the local macOS `WallpaperMacintoshExtension.appex/Contents/Resources` package. `wallpaper.js` and CSS recreate the presentation in the browser; the native Apple wallpaper renderer is not used. [Macintosh wallpaper reference](https://9to5mac.com/2024/06/24/macos-15-sequoia-top-features-awesome-new-macintosh-wallpaper-window-tiling-and-more-video/).

## Run locally

```sh
npm run dev
```

Open http://localhost:3000. Set `PORT` to use another port.

## Personalize

Edit `profile.js` with your name, role, bio, availability, location, email, social links, and resume URL. Unset links stay hidden. Personal content was imported from [Nazmul’s previous portfolio](https://nazmul1005.github.io/Nazmul_islam/) on 2026-10-15; the university was supplied directly by Nazmul. Education dates and a résumé remain unset because the source does not provide them.

Projects use `{ title, description, tags: [], url, github }`. Experience entries use `{ role, company, period, description }` and describe independent learning and projects. `education` and `journey` contain university details and the learning timeline. Skills are a list of strings, organized for display by `skillGroups`. `services` contains titles, descriptions, and feature lists. `socials` stores additional contact links.

The 19 public GitHub repositories from `Nazmul1005` are saved in `projects.js` and imported by `profile.js`. The projects folder includes search, category filters, source links, published demo links, and labels for forks. This is a saved list, so it works without GitHub API requests from visitors' browsers.

The interface includes movable windows, close/minimize/maximize traffic lights, a pinned Dock with running indicators, Finder sidebar navigation, working File/View/Window menus, Spotlight search with Cmd/Ctrl+K, a terminal with command history, and four saved color themes. Minimized windows reopen from the Dock; closing a window clears its running indicator. View contains appearance and typography preferences. On mobile, sidebars collapse and windows remain above the Dock.

On opening, a full-screen Matrix code rain introduction plays for about five seconds: glowing green character streams fall while a central editor types the name and university from `profile.js`, then reveals the macOS desktop. **Skip intro** or Escape opens the desktop immediately. Reduced-motion preferences bypass the intro. Open `terminal.sh` for an interactive terminal with its own replayable introduction (`demo`). Both introductions are visual simulations.

Matrix rain is confined to the landing screen. Its rendering and event listeners stop when the macOS desktop is revealed.

## Deploy

Upload `index.html`, `style.css`, `macos.css`, `wallpaper.js`, the entire `assets/macintosh/` directory, `app.js`, `intro.js`, `matrix-rain.js`, `projects.js`, `profile.js`, and `favicon.svg` to any static web host. The interface uses system fonts, including native Apple fonts on macOS.

## Check

```sh
npm run check
```
