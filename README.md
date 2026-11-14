<div align="center">

# ⚔️ Battle for Westeros ⚔️

**A fast strategy game for the browser, built with plain HTML, CSS and JavaScript. No frameworks, no build step.**

[![Play Game](https://img.shields.io/badge/Play-Live_Demo-E34F26?style=for-the-badge&logo=google-chrome&logoColor=white)](https://redrighthand2007.github.io/GOT/)
[![Tests](https://img.shields.io/github/actions/workflow/status/redrighthand2007/GOT/tests.yml?branch=main&label=tests&style=for-the-badge)](https://github.com/redrighthand2007/GOT/actions/workflows/tests.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-323330?style=for-the-badge)](./LICENSE)

</div>

## 📸 Screenshots

<div align="center">
  <img src="docs/screenshots/desktop-start.jpg" alt="Start screen with difficulty choice and win streak" width="100%">
  <br><br>
  <img src="docs/screenshots/desktop-draft.jpg" alt="Drafting three houses within the 999 gold budget" width="49%">
  <img src="docs/screenshots/desktop-result.jpg" alt="Victory screen with both alliances revealed" width="49%">
  <br><br>
  <img src="docs/screenshots/phone-draft.jpg" alt="Phone layout while drafting" width="32%">
  <img src="docs/screenshots/phone-result.jpg" alt="Phone layout after a victory" width="32%">
</div>

## ✨ Features

- **💰 Draft with a budget:** pick 3 of 9 houses with 999 gold. Every house has a type (Attack, Defense or Mix), a tier and a price.
- **🔺 Type triangle:** Attack beats Mix, Mix beats Defense, Defense beats Attack. Every winning house-vs-house matchup gives +5% strength, every losing one -5%.
- **🤖 Two difficulties:** on *Normal* the enemy picks a random alliance; on *Hard* it picks the alliance that counters yours.
- **🏆 Win streaks:** wins, losses, current and best streak are saved on your device.
- **📱 Works everywhere:** one layout for phones, tablets and PCs; browser zoom scales smoothly; layout changes animate instead of jumping.
- **🎵 Sound:** theme music starts when you join the war, dips during fights, pauses in background tabs; war horns for victory and defeat are generated in the browser. Mute is remembered.
- **♿ Keyboard and screen-reader friendly:** every control is a real button with a label.

## 🛠️ Tech Stack

- HTML5, CSS3, vanilla JavaScript: no frameworks, libraries or build tools
- Web Audio API for fades and the generated horn/drum sounds
- View Transitions API (with a fallback) for smooth layout changes
- Rule tests that run in the browser, checked on every push by GitHub Actions
- Hosted on GitHub Pages

## 📁 Project Structure

```text
GOT/
├── assets/
│   ├── audio/          # theme music and sword sound
│   └── images/         # background art
├── css/
│   └── got-theme.css   # all styles, layout and animations
├── js/
│   ├── rules.js        # houses, prices, type triangle, battle maths, enemy AI (no page code)
│   ├── data.js         # page elements, game state, saved stats, layout/zoom motion
│   ├── audio.js        # music, sound effects, mute
│   ├── ui.js           # screens, drafting board, info panel
│   └── combat.js       # drafting, battle flow, results
├── tests/
│   ├── index.html      # open in a browser to run the rule tests
│   └── rules.test.js   # 17 tests for js/rules.js
├── docs/screenshots/   # images used in this README
├── index.html
├── LICENSE
└── README.md
```

## ⚙️ Run it locally

1. Clone the repository:
   ```bash
   git clone https://github.com/redrighthand2007/GOT.git
   ```
2. Open `index.html` in a browser, or serve the folder (recommended, so all sound features work):
   ```bash
   python -m http.server 5173
   ```
   then open `http://localhost:5173`.

## 🚀 How to play

1. Tap **JOIN THE WORLD WAR** (choose *Normal* or *Hard* first).
2. Pick **3 houses** within **999G**. Tap a sigil in your alliance to remove it. The 📜 button shows all rules and prices.
3. **Prepare for war** reveals the enemy alliance and both sides' type edge.
4. **Fight!** Strength = total power × (1 + type edge) × luck (0.85x–1.15x). Higher strength wins.

## 🧪 Tests

Open `tests/index.html` in any browser. It checks the rules in `js/rules.js`: prices, the type triangle, luck range, the Hard-mode enemy, and game balance (for example, that no army you can afford is stronger than the Hard enemy before luck). The same page runs automatically on every push through GitHub Actions in headless Chrome.

## 🔧 Changing things

- **Houses, prices, power, rules:** `HOUSES_DATA`, `ENEMY_COMBOS`, `STARTING_GOLD` and `TYPE_EDGE` in `js/rules.js`. Open `tests/index.html` afterwards to check the balance still holds.
- **Music levels or your own victory/defeat clips:** `MUSIC_LEVEL`, `FIGHT_LEVEL` and `STING_FILES` at the top of `js/audio.js`.

## 🗺️ Roadmap

- [x] Core game, Iron Throne theme and enemy AI
- [x] Type triangle and difficulty levels
- [x] Win/loss streaks saved on the device
- [x] Phone, tablet and PC layouts with smooth zoom
- [x] Automated rule and balance tests
- [ ] Campaign across Westeros battlefields
- [ ] Animated battle scenes
- [ ] Installable app (PWA) with offline play

## 📄 License

The source code is released under the [MIT License](./LICENSE).

**This is an unofficial fan project and is not affiliated with HBO.** *Game of Thrones* names, artwork and music belong to their respective owners (HBO / George R. R. Martin) and are **not** covered by the MIT license.

## 👨‍💻 Author

**Kush Aghera** · GitHub: [@redrighthand2007](https://github.com/redrighthand2007)
