# 📚 Battle for Westeros: Learning Progress

This file walks through the whole project **from an empty folder to the current game**, in the order you would build it yourself.
Every row is one small thing to build and understand.

**How to use it**
- **Done** means you built it (or rebuilt it yourself).
- **Learned** means you can explain it without looking.
- Tick a box by changing `⬜` to `✅`.
- The **Where** column shows which file to open to see the real code.

---

## Phase 0: Tools and setup

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 0.1 | ⬜ | ⬜ | Install a code editor (VS Code) | — | The program you write code in. Gives colours, auto-complete and a built-in terminal. |
| 0.2 | ⬜ | ⬜ | Use a modern browser and its DevTools (F12) | — | DevTools let you inspect HTML, edit CSS live, see JS errors in the **Console** and test phone sizes with the **device toolbar**. |
| 0.3 | ⬜ | ⬜ | Create the project folder `GOT/` | — | Every file of the game lives here. |
| 0.4 | ⬜ | ⬜ | VS Code workspace file | `GOT.code-workspace` | Saves which folders VS Code opens for this project. Optional and personal. |
| 0.5 | ⬜ | ⬜ | Install Git and run `git init` | `.git/` | Git records every version of your files, so you can go back in time and see what changed. |
| 0.6 | ⬜ | ⬜ | First commit (`git add`, `git commit`) | git history | A commit is a saved snapshot with a message. Small commits with clear messages make history easy to read. |
| 0.7 | ⬜ | ⬜ | Create a GitHub repo and `git push` | GitHub | Puts the code online, backs it up and lets you host the game for free. |
| 0.8 | ⬜ | ⬜ | Folder structure: `assets/`, `css/`, `js/`, `tools/` | project root | Keeping images, sound, styles and scripts in separate folders makes the project easy to find your way around. |
| 0.9 | ⬜ | ⬜ | `.gitignore` | `.gitignore` | Lists files Git must **not** track: editor settings, OS junk (`.DS_Store`, `Thumbs.db`), logs, `node_modules/`, `.claude/`. |
| 0.10 | ⬜ | ⬜ | `.gitattributes` | `.gitattributes` | Forces LF line endings for text (so Windows and Mac don't fight) and marks images/MP3 as **binary** so Git never edits them. |
| 0.11 | ⬜ | ⬜ | Run a local web server | `python -m http.server 5173` | Opening `index.html` directly (`file://`) blocks some features (Web Audio routing). A local server at `http://localhost:5173` behaves like the real website. |
| 0.12 | ⬜ | ⬜ | Preview launch config | `.claude/launch.json` | Tells Claude Code's preview how to start that same Python server. Personal and git-ignored. |

---

## Phase 1: HTML skeleton (the structure)

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 1.1 | ⬜ | ⬜ | `<!DOCTYPE html>` and `<html lang="en">` | `index.html` | Doctype turns on modern standards mode. `lang` helps screen readers and translation. |
| 1.2 | ⬜ | ⬜ | `<meta charset="UTF-8">` | `index.html` | Lets the page show any character: emoji, ⚔️, accents. Without it, symbols turn into garbage. |
| 1.3 | ⬜ | ⬜ | Viewport meta with `viewport-fit=cover` | `index.html` | `width=device-width` makes phones use real width instead of a zoomed-out desktop view. `viewport-fit=cover` lets the page reach behind the iPhone notch (handled later with safe-area). |
| 1.4 | ⬜ | ⬜ | `<title>` and `meta description` | `index.html` | Title shows in the browser tab and Google. Description is the Google snippet text. |
| 1.5 | ⬜ | ⬜ | `meta theme-color` | `index.html` | Colours the phone browser's address bar black so it matches the game. |
| 1.6 | ⬜ | ⬜ | Open Graph and Twitter card tags | `index.html` | `og:title`, `og:image`… control the preview card when the link is shared on WhatsApp, Discord, X or LinkedIn. |
| 1.7 | ⬜ | ⬜ | Emoji favicon as an inline SVG data URI | `index.html` | The ⚔️ tab icon is drawn from text inside a `data:` URL, so no icon file is needed. |
| 1.8 | ⬜ | ⬜ | Google Font "Cinzel" with `preconnect` | `index.html` | Cinzel gives the medieval look. `preconnect` opens the connection to Google early so the font arrives faster. `display=swap` shows a fallback font until it loads. |
| 1.9 | ⬜ | ⬜ | Link the stylesheet | `index.html` | `<link rel="stylesheet" href="css/got-theme.css?v=50">`. The `?v=50` part is for cache busting (see 15.4). |
| 1.10 | ⬜ | ⬜ | `<audio>` elements with `preload="auto"` | `index.html` | `#bg-music` (looping theme) and `#sfx-sword`. Preloading means the sound is ready the moment the player taps. |
| 1.11 | ⬜ | ⬜ | Main wrapper `#game-container` | `index.html` | One box that holds the whole game, so it can be positioned and clipped as a unit. |
| 1.12 | ⬜ | ⬜ | Background layer `#live-bg` | `index.html` | An empty div that only shows the Iron Throne picture behind everything. |
| 1.13 | ⬜ | ⬜ | Corner icon buttons (Home ⌂, Sound 🔊, Rules 📜) | `index.html` | Real `<button>` elements with **HTML entities** (`&#8962;`) for the symbols. They sit outside `.content` so the zoom animation doesn't move them. |
| 1.14 | ⬜ | ⬜ | Rules panel `#info-modal` with lists and tables | `index.html` | Rules (`<ul>`), house prices and enemy alliances (`<table>`). Starts with class `hidden`. Has `role="dialog"` for screen readers. Includes the fan disclaimer. |
| 1.15 | ⬜ | ⬜ | `.content` wrapper and `<h1>` title | `index.html` | Holds all screens. The `h1` "GAME OF THRONES" is the page's main heading. |
| 1.16 | ⬜ | ⬜ | Screen 1: `#start-screen` | `index.html` | JOIN button, difficulty button and an empty `#stats-line` that JS fills in. |
| 1.17 | ⬜ | ⬜ | Screen 2: `#battle-phase` → `#war-hall` with three columns | `index.html` | Left `#player-side`, middle `#drafting-board`, right `#enemy-side`. Each side has a heading, gold display, roster, codeword and health bar. |
| 1.18 | ⬜ | ⬜ | Action bar with all battle buttons | `index.html` | PREPARE FOR WAR, SURRENDER/FIGHT, HOME/BATTLE AGAIN. All exist from the start and JS shows/hides them. |
| 1.19 | ⬜ | ⬜ | "Screens" by showing and hiding, not separate pages | `index.html` | Single-page app idea: everything is one HTML file and the `hidden` class decides what you see. No page reloads. |
| 1.20 | ⬜ | ⬜ | `#blood-splatter` overlay | `index.html` | Empty div that flashes red on defeat. |
| 1.21 | ⬜ | ⬜ | `<script>` tags at the end, in order | `index.html` | `data.js` → `audio.js` → `ui.js` → `combat.js`. At the end of body the HTML already exists when scripts run. Order matters because later files use things earlier files define. |

---

## Phase 2: CSS basics (the look)

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 2.1 | ⬜ | ⬜ | Universal reset `* { margin:0; padding:0; box-sizing:border-box }` | `got-theme.css` | Removes browser default spacing. `border-box` means width includes padding and border, so maths is easier. Also sets the Cinzel font and centred text everywhere. |
| 2.2 | ⬜ | ⬜ | `rem` units everywhere | `got-theme.css` | `rem` = root font size. If the root changes (zoom, bigger screen), the whole game scales together. |
| 2.3 | ⬜ | ⬜ | Fluid root font size with `clamp()` | `got-theme.css` (`html`) | `clamp(100%, 0.55vw + 0.5rem, 150%)` grows text a bit on wide screens but never below 16px or above 24px. |
| 2.4 | ⬜ | ⬜ | `text-size-adjust: 100%` | `got-theme.css` | Stops phones from enlarging text on their own when rotated. |
| 2.5 | ⬜ | ⬜ | Button reset | `got-theme.css` | Buttons lose browser styling (`background:none; border:none; font:inherit`), then each kind styles itself. |
| 2.6 | ⬜ | ⬜ | `touch-action: manipulation` on buttons | `got-theme.css` | Removes the 300ms double-tap-zoom delay on phones, so taps feel instant. Also hides the blue tap flash. |
| 2.7 | ⬜ | ⬜ | `.hidden { display:none !important }` | `got-theme.css` | One utility class JS adds and removes to show/hide anything. `!important` makes sure nothing overrides it. |
| 2.8 | ⬜ | ⬜ | `min-height: 100vh` then `100dvh` | `got-theme.css` | `dvh` is the real visible height on phones (address bar included). Writing `vh` first is a fallback for old browsers. |
| 2.9 | ⬜ | ⬜ | `position: fixed; inset: 0` layers | `got-theme.css` | Background and blood overlay cover the whole screen and stay put when scrolling. `inset:0` = top/right/bottom/left all 0. |
| 2.10 | ⬜ | ⬜ | `z-index` stacking | `got-theme.css` | Background (1) < content (2) < blood (50) < icons (100) < rules panel (200). Higher numbers sit on top. |
| 2.11 | ⬜ | ⬜ | Background image with `cover` | `#live-bg` | `background-size: cover` fills the screen without stretching. `opacity: 0.6` darkens it so text is readable. |
| 2.12 | ⬜ | ⬜ | `@keyframes slowZoom` | `#live-bg` | 30-second zoom from 1× to 1.15× and back (`alternate`), so the background feels alive. |
| 2.13 | ⬜ | ⬜ | `overflow: hidden` then `overflow: clip` | `#game-container` | Stops the zoom animations from creating scrollbars. `clip` is stricter; `hidden` is the fallback. |
| 2.14 | ⬜ | ⬜ | Flexbox column layout | `.content`, `#start-screen` | `display:flex; flex-direction:column` stacks items vertically. `flex:1` lets a screen fill leftover height. `justify-content:flex-end` pushes the start button low. |
| 2.15 | ⬜ | ⬜ | Safe-area padding `env(safe-area-inset-*)` | `.content`, `.icon-btn` | Keeps content away from the iPhone notch and home bar. Works together with `viewport-fit=cover`. |
| 2.16 | ⬜ | ⬜ | Gradient text title | `#main-title` | `background: linear-gradient(...)` + `background-clip:text` + transparent text fill = metal-looking letters. |
| 2.17 | ⬜ | ⬜ | `text-shadow` and `box-shadow` glow | many | Glows and dark outlines make text readable over the picture and give the "steel" feel. |
| 2.18 | ⬜ | ⬜ | Glass buttons `.theme-btn` / `#claim-btn` | `got-theme.css` | Semi-transparent gradient + `backdrop-filter: blur()` blurs whatever is behind the button. |
| 2.19 | ⬜ | ⬜ | `:hover`, `:active`, `:disabled` states | `got-theme.css` | Hover grows and glows, active shrinks (feels pressed), disabled looks faded. `:not(:disabled)` stops effects on buttons you can't press. |
| 2.20 | ⬜ | ⬜ | `transition` | many | Animates a change smoothly (colour, size) instead of jumping. |
| 2.21 | ⬜ | ⬜ | `:focus-visible` gold outline | `got-theme.css` | Keyboard users see which button is selected; mouse users don't get an ugly ring. |
| 2.22 | ⬜ | ⬜ | Attribute selector `[aria-pressed="true"]` | `.text-btn` | Difficulty button turns red on Hard. CSS reads the same attribute screen readers use, so look and meaning stay in sync. |

---

## Phase 3: CSS for game pieces

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 3.1 | ⬜ | ⬜ | War hall CSS Grid `1fr 1.5fr 1fr` | `#war-hall` | Three columns with the middle one wider. `minmax(0, 1fr)` lets columns shrink without overflowing. |
| 3.2 | ⬜ | ⬜ | Roster side panels | `.roster-side` | Dark see-through boxes with `inset` shadow (looks carved in). |
| 3.3 | ⬜ | ⬜ | House crest drawn in pure CSS | `.crest` | A circle (`border-radius:50%`) with a `radial-gradient` in house colours + gold border. No image files needed. |
| 3.4 | ⬜ | ⬜ | CSS custom properties `--c1`, `--c2` | `.crest` + `ui.js` | JS sets each house's colours as variables on the element and CSS uses them with `var(--c1)`. One style, nine looks. |
| 3.5 | ⬜ | ⬜ | `aspect-ratio: 1 / 1` | `.crest`, `.roster-slot` | Keeps circles perfectly round at any width. |
| 3.6 | ⬜ | ⬜ | Container query units (`container-type`, `52cqi`) | `.crest-emblem` | The emoji size follows the **crest's** width, not the screen. `font-size:1.5rem` before it is the fallback. |
| 3.7 | ⬜ | ⬜ | Emoji made silver with `filter` | `.crest-emblem` | `grayscale + brightness + contrast` makes every device's emoji look the same uniform silver. |
| 3.8 | ⬜ | ⬜ | Draft grid `repeat(3, ...)` | `#draft-options` | Nine house cards in a 3×3 grid. |
| 3.9 | ⬜ | ⬜ | Draft card states: picked / disabled | `.draft-card` | Picked = gold border + ✓ drawn with `::after { content:"\2713" }`. Disabled = faded when the alliance is full. |
| 3.10 | ⬜ | ⬜ | `position: relative` parent + `absolute` child | `.draft-card::after` | The tick is placed in the card's corner because the card is the positioning parent. |
| 3.11 | ⬜ | ⬜ | `overflow-wrap: anywhere` | `.draft-name` | Long house names wrap instead of breaking the layout on small phones. |
| 3.12 | ⬜ | ⬜ | Stacked action bar | `.action-bar > *` | All button rows sit `absolute` in the same spot with a fixed height, so swapping them never makes the page jump. |
| 3.13 | ⬜ | ⬜ | Gold display and `.over-budget` red | `.gold-display` | Gold number turns red and glows when you overspend. |
| 3.14 | ⬜ | ⬜ | Health bars | `.health-container`, `.health-bar` | Outer box + inner red gradient bar. `transition: width 0.5s` makes it slide down when JS changes the width. |
| 3.15 | ⬜ | ⬜ | Codeword text | `.codeword-text` | Gold glowing line listing each army's houses after the reveal. |
| 3.16 | ⬜ | ⬜ | VICTORY / DEFEAT banner | `.result-banner` | Green or red glowing big text. `-webkit-text-fill-color` overrides the gradient-text of the parent. |
| 3.17 | ⬜ | ⬜ | Blood splatter flash | `#blood-splatter` | Radial gradient (clear centre, dark red edges). `opacity` 0→1 flash. `pointer-events:none` so it never blocks clicks. |
| 3.18 | ⬜ | ⬜ | Rules panel styling | `#info-modal` | Fixed in the top-right, `width: min(40rem, 100vw - 1.5rem)`, scrolls inside (`overflow:auto`) and `overscroll-behavior: contain` stops the page behind from scrolling. |
| 3.19 | ⬜ | ⬜ | Tables `border-collapse: collapse` | `.info-table` | Merges double borders into single clean lines. |
| 3.20 | ⬜ | ⬜ | Adjacent sibling selector `h2 + .info-table + h2` | `#info-modal-content` | Adds space only before headings that follow a table or list. |
| 3.21 | ⬜ | ⬜ | Corner icon positions | `.icon-btn`, `#sound-icon`… | `position:fixed` in corners, with safe-area added. Rules icon rotates a bit when open (`[aria-expanded="true"]`). |

---

## Phase 4: JavaScript foundations and game data

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 4.1 | ⬜ | ⬜ | Several plain `<script>` files sharing global scope | all JS | Without modules, a `const` at the top of one file is visible in the next file loaded. Simple, but order matters. |
| 4.2 | ⬜ | ⬜ | Cache DOM elements with `getElementById` | `data.js` top | Find each element once and keep it in a `const`, instead of searching the page every time. |
| 4.3 | ⬜ | ⬜ | `const` vs `let` | everywhere | `const` = never reassigned (rules, elements). `let` = changes during play (gold, rosters). |
| 4.4 | ⬜ | ⬜ | Rule constants | `data.js` | `STARTING_GOLD = 999`, `ARMY_SIZE = 3`, `TYPE_EDGE = 0.05`. Change a rule in one place. No "magic numbers" in the logic. |
| 4.5 | ⬜ | ⬜ | Lookup objects `ROLE_NAMES` and `BEATS` | `data.js` | `BEATS = { A:'M', M:'D', D:'A' }` stores the type triangle as data: "Attack beats Mix…". Logic just reads `BEATS[x]`. |
| 4.6 | ⬜ | ⬜ | `HOUSES_DATA`: an array of objects | `data.js` | Each house has `id, name, role, tier, cost, power, emblem, colors, desc`. All game content is data; the code never hard-codes a house. |
| 4.7 | ⬜ | ⬜ | Balancing: tier → power and price | `data.js` | Tier 1 = power 3, Tier 2 = 2, Tier 3 = 1. Prices make it impossible to take three Tier 1s with 999G, which forces choices. |
| 4.8 | ⬜ | ⬜ | `ENEMY_COMBOS` | `data.js` | The three fixed enemy alliances (Pure Attack / Defense / Mix) by house `id`. |
| 4.9 | ⬜ | ⬜ | Game state variables | `data.js` | `playerGold`, `enemyGold`, `playerRoster`, `enemyRoster`, `battleLocked`, `battleTimers`. The whole game is these values plus the UI drawing them. |
| 4.10 | ⬜ | ⬜ | Arrow functions and template literals | everywhere | `h => h.power` is a short function. `` `Wins ${stats.wins}` `` puts values inside text. |
| 4.11 | ⬜ | ⬜ | `addEventListener('click', ...)` | `ui.js`, `combat.js` | Connects a button to the code that runs when it's pressed. |
| 4.12 | ⬜ | ⬜ | `classList.add / remove / toggle` | everywhere | How JS shows/hides screens and switches styles, by adding CSS classes instead of writing styles in JS. |
| 4.13 | ⬜ | ⬜ | `innerText` / `textContent` vs `innerHTML` | everywhere | Text-only is safe for plain text. `innerHTML` is used only for our own trusted HTML (cards, banners). |

---

## Phase 5: Saving data on the device

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 5.1 | ⬜ | ⬜ | `localStorage` | `data.js` | Browser storage that survives closing the tab. Stores text only, per website, per device. |
| 5.2 | ⬜ | ⬜ | `JSON.stringify` / `JSON.parse` | `readStore`, `writeStore` | Turns an object into text to save it and back into an object to load it. |
| 5.3 | ⬜ | ⬜ | `try / catch` around storage | `readStore`, `writeStore` | In private mode or with storage blocked it throws an error. Catching it keeps the game working, just without saving. |
| 5.4 | ⬜ | ⬜ | Fallback values | `readStore(key, fallback)` | If nothing is saved yet, use a sensible default. |
| 5.5 | ⬜ | ⬜ | Defaults merged with `Object.assign` | `stats` | `{wins:0, losses:0, streak:0, best:0}` filled in from saved data, so missing fields never become `undefined`. |
| 5.6 | ⬜ | ⬜ | Validate loaded values | `difficulty` | Only `'hard'` counts as hard; anything else becomes `'normal'`. Never trust stored data blindly. |
| 5.7 | ⬜ | ⬜ | Storage keys in one place | `STORE_KEYS`, `MUTE_KEY` | `got-stats`, `got-difficulty`, `got-muted`. Named constants avoid typos. |

---

## Phase 6: Screens and navigation

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 6.1 | ⬜ | ⬜ | `showStartScreen()` | `ui.js` | Resets the battle, shows the title and start screen, hides the war hall, refreshes stats. |
| 6.2 | ⬜ | ⬜ | JOIN THE WORLD WAR button | `ui.js` (`claimBtn`) | Hides the start screen, shows the war hall, starts the music and calls `initWarHall()`. |
| 6.3 | ⬜ | ⬜ | Home button ⌂ | `ui.js` | Goes back to the start screen from anywhere. |
| 6.4 | ⬜ | ⬜ | Stats line | `renderStats()` | Shows "Win battles to build your streak" before any game, then wins, losses, streak and best. |
| 6.5 | ⬜ | ⬜ | Difficulty toggle | `renderDifficulty()` | Switches Normal ↔ Hard, saves it, updates the label, `aria-pressed` and tooltip. |
| 6.6 | ⬜ | ⬜ | `initWarHall()` | `ui.js` | Fresh game: full gold, empty rosters, enemy gold shows `???`, help text, draws the board. |
| 6.7 | ⬜ | ⬜ | `resetDraftingUI()` | `ui.js` | Puts every battle element back to how it starts: buttons, bars, banners, overlay, music level. |
| 6.8 | ⬜ | ⬜ | HOME / BATTLE AGAIN after a fight | `ui.js` | Reuses `showStartScreen` and `initWarHall`. Same functions, no duplicate code. |

---

## Phase 7: Drafting your army

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 7.1 | ⬜ | ⬜ | `crestHTML(house)` helper | `ui.js` | One function builds a crest's HTML, used by draft cards and both rosters. |
| 7.2 | ⬜ | ⬜ | `renderDraftingBoard()` | `ui.js` | Clears the grid, loops over `HOUSES_DATA` and makes a `<button>` card for each house with `document.createElement`. |
| 7.3 | ⬜ | ⬜ | "Render from state" pattern | `ui.js` | After any change, redraw from the data. The screen always matches the state, so there are no out-of-sync bugs. |
| 7.4 | ⬜ | ⬜ | Card states from data | `renderDraftingBoard` | `isPicked` (`.some()`) and `isFull` decide the classes and `disabled`. |
| 7.5 | ⬜ | ⬜ | `draftHouse(house)` | `combat.js` | Adds the house, subtracts its cost, redraws. Does nothing if locked or full (guard clause). |
| 7.6 | ⬜ | ⬜ | `removeHouse(index)` with `splice` | `combat.js` | Tapping a sigil in your alliance removes it and refunds the gold. |
| 7.7 | ⬜ | ⬜ | `renderPlayerRoster()` | `ui.js` | Your picked sigils as buttons. After the battle starts they become disabled (read-only). |
| 7.8 | ⬜ | ⬜ | `renderEnemyRoster()` | `ui.js` | Enemy sigils as plain `<div>`s, because you can't click them. |
| 7.9 | ⬜ | ⬜ | `updateGoldDisplay()` | `ui.js` | Shows gold and toggles `.over-budget` when below 0. |
| 7.10 | ⬜ | ⬜ | Smart PREPARE button | `updateBattleButton()` | Instead of hiding, it explains: "Pick 3 houses (1/3)", "Over budget", or becomes clickable "Prepare for war". |

---

## Phase 8: Battle maths

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 8.1 | ⬜ | ⬜ | `calculatePower()` with `reduce` | `combat.js` | Adds up the `power` of all houses in an army. `reduce` turns a list into one value. |
| 8.2 | ⬜ | ⬜ | `typeEdge(army, foe)` | `combat.js` | Compares every one of your houses with every enemy house (3×3 = 9 matchups). Each win +5%, each loss −5%. |
| 8.3 | ⬜ | ⬜ | `strength(army, foe)` | `combat.js` | `power × (1 + edge)`. Combines raw power and the type triangle. |
| 8.4 | ⬜ | ⬜ | Luck roll 0.85×–1.15× | `btnFight` handler | `Math.random() * 0.3 + 0.85`. Random number in a range, so better armies usually win but not always. |
| 8.5 | ⬜ | ⬜ | `formatEdge()` | `combat.js` | Turns `0.15` into `"+15%"` for display. |
| 8.6 | ⬜ | ⬜ | `toFixed(1)` | `endGameInline` | Shows final strength with one decimal. |

---

## Phase 9: Enemy AI

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 9.1 | ⬜ | ⬜ | Turn ids into house objects | `generateEnemyRoster` | `.map()` + `HOUSES_DATA.find(h => h.id === id)` turns `["targ", ...]` into full house data. |
| 9.2 | ⬜ | ⬜ | Normal: random pick | `generateEnemyRoster` | `Math.floor(Math.random() * 3)` picks index 0, 1 or 2. |
| 9.3 | ⬜ | ⬜ | Hard: best counter | `generateEnemyRoster` | Uses `reduce` to keep the alliance whose (enemy strength − your strength) is highest. A simple "look at every option, keep the best" AI. |
| 9.4 | ⬜ | ⬜ | Enemy gold left | `generateEnemyRoster` | 999 minus what the chosen alliance costs, shown after the reveal. |

---

## Phase 10: Battle flow

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 10.1 | ⬜ | ⬜ | PREPARE FOR WAR | `btnBattle` handler | Checks the army is valid, sets `battleLocked`, hides draft cards, makes the enemy army, reveals it, plays a sword sound, shows the codewords and both type edges. |
| 10.2 | ⬜ | ⬜ | `battleLocked` flag | `combat.js` | Once true, drafting/removing is blocked. Stops changing your army after seeing the enemy. |
| 10.3 | ⬜ | ⬜ | Codewords with `armyNames()` | `ui.js` | `.map(h => h.name).join(' + ')` → "Targaryen Dragons + Unsullied + …". |
| 10.4 | ⬜ | ⬜ | SURRENDER counts as a loss | `combat.js` | If the enemy was already revealed, `recordResult(false)`. No free escape. |
| 10.5 | ⬜ | ⬜ | FIGHT! | `btnFight` handler | Disables buttons (no double click), dips music, calculates both final strengths, decides the winner. |
| 10.6 | ⬜ | ⬜ | Save the result **before** the animation | `recordResult(playerWon)` | Leaving mid-fight can't dodge a loss. The result is already stored. |
| 10.7 | ⬜ | ⬜ | Win streak logic | `recordResult` | Win: wins+1, streak+1, `best = Math.max(best, streak)`. Loss: losses+1, streak = 0. Then save. |
| 10.8 | ⬜ | ⬜ | Three-round health bar animation | `rounds` + `setTimeout` | At 0.4s, 1.1s and 1.8s: sword sound and bars drop (winner to 75→45→15%, loser to 60→25→0%). The winner is decided first; the animation only shows it. |
| 10.9 | ⬜ | ⬜ | Track timers in `battleTimers` | `combat.js` | Every `setTimeout` id is stored, so leaving can cancel them with `clearTimeout` and an old fight can't change a new game. |
| 10.10 | ⬜ | ⬜ | `endGameInline()` | `combat.js` | Shows HOME/BATTLE AGAIN, writes the strength line, VICTORY (horn) or DEFEAT (blood + horn), music rises again later. |
| 10.11 | ⬜ | ⬜ | `flashBlood()` | `combat.js` | Adds `.splatter-active` and removes it 0.5s later. |
| 10.12 | ⬜ | ⬜ | `aria-live="polite"` messages | `#battle-log`, title | Screen readers read out new battle messages automatically. |

---

## Phase 11: Rules panel

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 11.1 | ⬜ | ⬜ | `setInfoOpen(open)` | `ui.js` | One function shows/hides the panel and updates `aria-expanded`. |
| 11.2 | ⬜ | ⬜ | Hover to peek (mouse only) | `mouseenter`/`mouseleave` | `matchMedia('(hover: hover)')` checks for a real mouse, so phones don't trigger it. |
| 11.3 | ⬜ | ⬜ | Click to pin | `infoPinned` | A click keeps it open after the mouse leaves. Tap toggles on phones. |
| 11.4 | ⬜ | ⬜ | `e.stopPropagation()` | icon click | Stops the same click from reaching the "click outside closes" handler. |
| 11.5 | ⬜ | ⬜ | Click outside closes | `document` click | `infoModal.contains(e.target)` checks whether the click was inside the panel. |
| 11.6 | ⬜ | ⬜ | Escape key closes | `keydown` | Standard keyboard behaviour for pop-ups. |

---

## Phase 12: Sound and music

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 12.1 | ⬜ | ⬜ | Module pattern (IIFE) `const Sound = (() => {...})()` | `audio.js` | Everything inside is private. Only the returned functions (`startMusic`, `victory`…) are public. Keeps globals clean. |
| 12.2 | ⬜ | ⬜ | Volume constants | `audio.js` | `MUSIC_LEVEL 0.4`, `FIGHT_LEVEL 0.15`, `SWORD_LEVEL 0.7`. Easy to tune. |
| 12.3 | ⬜ | ⬜ | Autoplay rule: sound only after a tap | `ensureContext()` | Browsers block sound until the user interacts. That's why music starts on JOIN, not on page load. |
| 12.4 | ⬜ | ⬜ | `AudioContext` (+ `webkitAudioContext`) | `audio.js` | The Web Audio API "sound engine". The webkit name supports older Safari. |
| 12.5 | ⬜ | ⬜ | Gain node graph: music/sfx → master → speakers | `ensureContext()` | A gain node is a volume knob. Separate knobs for music and effects, plus a master knob for mute. |
| 12.6 | ⬜ | ⬜ | `createMediaElementSource` | `ensureContext()` | Plugs the `<audio>` elements into Web Audio. Needed because **iPhones ignore `audio.volume`**. |
| 12.7 | ⬜ | ⬜ | `file://` fallback (`canRoute`) | `audio.js` | Opened from disk, routing is blocked, so it fades `.volume` instead. Always have a plan B. |
| 12.8 | ⬜ | ⬜ | Smooth fades `linearRampToValueAtTime` | `rampGain()` | Volume slides over time instead of jumping. `cancelScheduledValues` stops an old fade first. |
| 12.9 | ⬜ | ⬜ | Fallback fade with `requestAnimationFrame` | `fadeMusic()` | Changes volume a little every frame until it reaches the target. |
| 12.10 | ⬜ | ⬜ | `play()` returns a Promise | `startMusic()` | `.then()` fades in on success. `.catch()` handles a blocked play without crashing. |
| 12.11 | ⬜ | ⬜ | Music dips during fights | `fightStart` / `fightEnd` | `setLevel()` lowers music so sword clashes stand out, then raises it again. |
| 12.12 | ⬜ | ⬜ | Pause in background tabs | `visibilitychange` | `document.hidden` is true when you switch tabs. Fade out and pause, then fade back in when you return. |
| 12.13 | ⬜ | ⬜ | Sword sound restart | `playSword()` | `currentTime = 0` replays from the start even if it's still playing. |
| 12.14 | ⬜ | ⬜ | Mute button remembered | `toggleMute()`, `MUTE_KEY` | Fades the master gain to 0, swaps the 🔊/🔇 icon, saves to localStorage. Applied on load before any sound. |
| 12.15 | ⬜ | ⬜ | Synthesised war horn | `horn()` | Two slightly detuned **sawtooth oscillators** → **low-pass filter** that opens and closes → volume envelope. Sound made from maths, no file. |
| 12.16 | ⬜ | ⬜ | Synthesised war drum | `drum()` | A **sine oscillator** dropping from 110Hz to 40Hz with a fast fade = a deep "boom". |
| 12.17 | ⬜ | ⬜ | `exponentialRampToValueAtTime` | `horn`, `drum` | Ears hear volume and pitch on a log scale, so exponential ramps sound natural. Can't ramp to 0, so `0.0001` is used. |
| 12.18 | ⬜ | ⬜ | Victory and defeat stings | `victory()`, `defeat()` | Victory: drums + rising horns (D → A). Defeat: boom + one long sinking horn. |
| 12.19 | ⬜ | ⬜ | Optional real clips `STING_FILES` | `playSting()` | Put an MP3 path there to use a recorded sound instead; falls back to the synth if it fails. |

---

## Phase 13: Responsive layout and motion

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 13.1 | ⬜ | ⬜ | Breakpoint `max-width: 56em` | `data.js` + CSS | Below about 900px the three columns stack into one (your side, board, enemy). |
| 13.2 | ⬜ | ⬜ | `.narrow` class instead of `@media` in CSS | `got-theme.css` | JS sets the class so the switch can be **animated**. Pure media queries just snap. |
| 13.3 | ⬜ | ⬜ | Inline script in `<head>` sets `.narrow` before first paint | `index.html` | Runs before the page draws, so phones never flash the desktop layout first. |
| 13.4 | ⬜ | ⬜ | Hide page until the font loads | `index.html` + `.fonts-loading` | `document.fonts.load()` waits for Cinzel, then fades the page in. Stops text "jumping" when the font swaps. 2.5s timeout for slow networks. |
| 13.5 | ⬜ | ⬜ | `syncLayout()` on `change` **and** `resize` | `data.js` | Some browsers don't fire the media query's change event, so resize checks too. |
| 13.6 | ⬜ | ⬜ | View Transitions API | `document.startViewTransition` | The browser snapshots before/after and morphs panels into their new spots. `view-transition-name` in CSS tells it which panels to track. |
| 13.7 | ⬜ | ⬜ | `::view-transition-group(*)` timing | `got-theme.css` | Sets the morph speed and easing curve. |
| 13.8 | ⬜ | ⬜ | FLIP fallback for Firefox | `morphWithoutViewTransition()` | **F**irst (measure), **L**ast (switch and measure), **I**nvert (offset back), **P**lay (`element.animate` to 0). Classic animation trick. |
| 13.9 | ⬜ | ⬜ | `.catch(() => {})` on transition promises | `syncLayout()` | A newer resize can cancel an old animation. That's normal, so the error is ignored. |
| 13.10 | ⬜ | ⬜ | Smooth browser zoom (Ctrl +/−) | `data.js` resize handler | Detects a `devicePixelRatio` change, instantly scales content back to its old size, then animates to the new size. |
| 13.11 | ⬜ | ⬜ | Forced reflow `getBoundingClientRect()` | `data.js` | Makes the browser apply the start scale **now**, so the transition has a starting point. |
| 13.12 | ⬜ | ⬜ | `transitionend` cleanup | `data.js` | Removes the inline transition after the zoom finishes. |
| 13.13 | ⬜ | ⬜ | Fluid sizes with `clamp()` and `vw`/`vh` | many | Title, buttons and cards size between a min and max depending on the screen. |
| 13.14 | ⬜ | ⬜ | Transitions on font-size, padding, gap | MOTION section | Sizes that follow the window width ease into place on resize instead of jumping. |
| 13.15 | ⬜ | ⬜ | `fadeIn` with `animation-fill-mode: backwards` | MOTION section | Screens, buttons and bars slide up and fade in each time they appear. `backwards` holds the start state during any delay. |
| 13.16 | ⬜ | ⬜ | `prefers-reduced-motion` | CSS + `data.js` | If the user's OS asks for less motion, all animations are turned off. Accessibility and comfort. |
| 13.17 | ⬜ | ⬜ | `@media (hover: none)` | `got-theme.css` | Touch screens skip hover lift effects, which otherwise "stick" after a tap. |

---

## Phase 14: Accessibility (usable by everyone)

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 14.1 | ⬜ | ⬜ | Every control is a real `<button type="button">` | HTML + `ui.js` | Free keyboard support (Tab, Enter, Space) and screen-reader support. `type="button"` avoids accidental form submits. |
| 14.2 | ⬜ | ⬜ | `aria-label` on icon buttons and cards | HTML + `ui.js` | Icons have no words; the label tells screen readers "Home", "Remove Unsullied", full house details. |
| 14.3 | ⬜ | ⬜ | `aria-hidden="true"` on decorative crests | `crestHTML` | The emoji is decoration; the label already says it. |
| 14.4 | ⬜ | ⬜ | `aria-pressed`, `aria-expanded`, `aria-controls` | difficulty, rules icon | Tell assistive tech the button's state (on/off, open/closed) and what it controls. |
| 14.5 | ⬜ | ⬜ | `aria-live` regions | battle log, title | Announces changes without moving focus. |
| 14.6 | ⬜ | ⬜ | Visible keyboard focus + Escape key | CSS + `ui.js` | See 2.21 and 11.6. |
| 14.7 | ⬜ | ⬜ | Readable contrast and min text size | CSS | Root font never below 16px. Light text with shadows over a darkened image. |

---

## Phase 15: Performance and deployment

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 15.1 | ⬜ | ⬜ | Compress the background image | `assets/images/iron-throne-bg-v2.jpg` (~114 KB) | Smaller images load faster on phones. Commit "Shrank background image". |
| 15.2 | ⬜ | ⬜ | Know your heavy files | `assets/audio/got-theme.mp3` (~6 MB) | The music is by far the biggest download. A lower bitrate or shorter loop would speed up the first visit. |
| 15.3 | ⬜ | ⬜ | Browser caching problem | — | Browsers keep old CSS/JS copies, so players may not see your update. (Commit "fix js caching issue".) |
| 15.4 | ⬜ | ⬜ | Cache busting with `?v=50` | `index.html` | A new number = a new URL = the browser downloads the fresh file. |
| 15.5 | ⬜ | ⬜ | `bump-version.mjs` Node script | `tools/` | Reads `index.html`, finds every `?v=N` with a regex (`matchAll`), adds 1 to the highest, writes it back. Run `node tools/bump-version.mjs` before pushing CSS/JS changes. |
| 15.6 | ⬜ | ⬜ | ES module script (`.mjs`, `import`, `import.meta.url`) | `bump-version.mjs` | Modern Node syntax. `import.meta.url` finds `index.html` relative to the script itself, wherever you run it from. |
| 15.7 | ⬜ | ⬜ | Deploy with GitHub Pages | GitHub settings | Repo → Settings → Pages → branch `main`. The game goes live at `redrighthand2007.github.io/GOT/`. |
| 15.8 | ⬜ | ⬜ | Test on real devices | — | Phone (iOS Safari + Android Chrome), tablet, PC, zoomed in/out, muted/unmuted, private mode. Many commits ("Fixed all devices", "fix for mobile phones") came from this. |

---

## Phase 16: Documentation and legal

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 16.1 | ⬜ | ⬜ | README with badges | `README.md` | shields.io badges, preview image, features, tech stack, folder tree, how to run, how to play, how to change things, roadmap. It's the front page of your repo. |
| 16.2 | ⬜ | ⬜ | Markdown basics | `README.md`, this file | Headings `#`, lists, tables, code blocks, links, checkboxes `- [x]`. |
| 16.3 | ⬜ | ⬜ | MIT License | `LICENSE` | Lets others use your **code** freely if they keep your name in it. |
| 16.4 | ⬜ | ⬜ | Fan / IP disclaimer | README + rules panel | Game of Thrones names, art and music belong to HBO / George R. R. Martin and are **not** covered by your MIT license. Don't sell or monetise this version. |
| 16.5 | ⬜ | ⬜ | Good commit messages | git history | Early ones ("fix the layout", "remove bad css") are vague. Better: say *what* and *why*, e.g. "Stop draft grid overflowing on 360px phones". |

---

## Phase 17: Lessons from the commit history

| # | Done | Learned | Step / Feature | Where | Explanation |
|---|:---:|:---:|---|---|---|
| 17.1 | ⬜ | ⬜ | Layout trial and error (≈30 commits, Aug 25–28) | git log | "fix layout", "remove margins", "make stuff wider"… Lesson: plan the layout (grid + flex) first, and avoid fixed pixel widths and heights. |
| 17.2 | ⬜ | ⬜ | Splitting one big JS file into four | "split battle logic file" | Data, audio, UI and combat each in their own file = easier to read and fix. |
| 17.3 | ⬜ | ⬜ | Encoding issues | "fix utf8 encoding" | Save files as UTF-8. Note: `index.html` starts with an invisible BOM character (`﻿`); harmless, but good to know it exists. |
| 17.4 | ⬜ | ⬜ | Hard-coded values replaced by constants | "remove hardcoded values" | Same idea as 4.4. |
| 17.5 | ⬜ | ⬜ | Rules rework | "Reworked game rules" | Type triangle and difficulty added after the core game worked. Build the core first, then add depth. |
| 17.6 | ⬜ | ⬜ | Read your own git history | `git log --oneline` | The best diary of how the project grew. Use `git show <id>` to see exactly what a commit changed. |

---

## 🚀 Next steps (not built yet)

| # | Done | Learned | Step / Feature | Explanation |
|---|:---:|:---:|---|---|
| N.1 | ⬜ | ⬜ | Unit tests for battle maths | Test `typeEdge`, `strength` and the Hard AI with a small test runner (e.g. Vitest or Node's built-in `node --test`). |
| N.2 | ⬜ | ⬜ | Balance simulator script | Play thousands of random battles in Node and check that no alliance always wins. |
| N.3 | ⬜ | ⬜ | GitHub Actions CI | Run tests and `bump-version` automatically on every push. |
| N.4 | ⬜ | ⬜ | Work on branches and pull requests | `git switch -c feature/x`, then merge with a PR instead of committing straight to `main`. |
| N.5 | ⬜ | ⬜ | Installable app (PWA) | `manifest.json` + service worker = install on the phone home screen and play offline. |
| N.6 | ⬜ | ⬜ | Campaign across battlefields | From the README roadmap. |
| N.7 | ⬜ | ⬜ | Animated battle scenes | From the README roadmap. |
| N.8 | ⬜ | ⬜ | Original setting (rename houses, own art and music) | Removes the HBO IP problem so you could publish or sell it. |
