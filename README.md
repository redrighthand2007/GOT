<div align="center">

# ⚔️ Game of Thrones: Battle for Westeros ⚔️

**A sleek, fast-paced strategy web game built entirely with pure Vanilla Web Technologies.**

[![Play Game](https://img.shields.io/badge/Play-Live_Demo-E34F26?style=for-the-badge&logo=google-chrome&logoColor=white)](https://redrighthand2007.github.io/Gameofthrones-Webgame/)
[![Documentation](https://img.shields.io/badge/Docs-Project_Summary-1572B6?style=for-the-badge&logo=read-the-docs&logoColor=white)](./docs/1project_summary.pdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-323330?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

## 📸 Preview / Demo

<div align="center">
  <img src="assets/images/iron-throne-bg-v2.jpg" alt="Game of Thrones: Battle for Westeros" width="100%" style="border-radius: 12px; box-shadow: 0 8px 16px rgba(0,0,0,0.6); margin-bottom: 20px;">
</div>

## ✨ Features

- **💰 Dynamic Economy & Strategy:** Draft units balancing a strict 999G budget across 9 different houses.
- **🤖 Automated Master-Tactician AI:** Face off against a computer adversary that utilizes mathematically flawless formations.
- **⚡ Single Page Architecture (SPA):** Absolute zero page reloads via semantic CSS class toggling.
- **🎭 Cinematic UI/UX:** Thematic dark aesthetics, glassmorphism panels, and interactive hover modals.
- **🎵 Custom Audio Engine:** Integrated themes and sword clash effects controlled via a minimalist UI toggle.

## 🎯 Why This Project?

> **The Problem:** Modern web development is often bogged down by heavy frontend frameworks (like React, Vue, or Angular) even for relatively straightforward state-driven applications.
>
> **The Solution:** *Battle for Westeros* serves as a masterclass in raw DOM manipulation, state management, and CSS layout architecture. It proves that a complex, cinematic, state-driven interactive web application can be built elegantly using **Zero Dependencies**.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend:** N/A (Client-side execution)
- **Database:** N/A (In-memory state management)
- **Deployment:** GitHub Pages

## 📁 Project Structure

```text
Gameofthrones-Webgame/
├── assets/
│   ├── audio/        # Background themes and SFX (mp3)
│   └── images/       # Background art and UI icons (jpg, png)
├── css/
│   └── got-theme.css # Advanced stylesheets
├── docs/             # PRDs and PDF summaries
├── js/               # Modular JS engine
│   ├── combat.js
│   ├── data.js
│   └── ui.js
├── index.html        # Singular DOM entry point
└── README.md
```

## ⚙️ Installation

No complex build pipelines or NPM packages are required. It's completely plug-and-play.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/redrighthand2007/Gameofthrones-Webgame.git
   ```
2. **Navigate into the directory:**
   ```bash
   cd Gameofthrones-Webgame
   ```
3. **Open the application:**
   Simply double-click `index.html` to open it in your default web browser, or serve it via a local live server extension (like VS Code Live Server).

## 🚀 Usage

1. **Enter the War Room:** Review your starting budget of **999G**.
2. **Draft Your Alliance:** Select up to 3 house cards. Hover over the info gear for a strategic pricing table.
3. **Prepare for War:** Finalize your draft to force the AI into locking its mystery counter-alliance.
4. **The Clash:** Hit **FIGHT!** The engine calculates raw power, applies an RNG modifier (0.85x to 1.15x), and determines the victor.

## 🔧 Configuration

This project is completely client-side and requires **no environment variables** or **API keys**.
*   **Audio Tuning:** Base volume and settings can be manually adjusted within `js/data.js`.
*   **Game Balance:** Budget constraints and unit power tiers are hardcoded cleanly in the `HOUSES_DATA` array inside `js/data.js` for easy modding and tweaking.

## 📊 Results / Performance

*   **Load Time:** Near-instantaneous (Zero NPM bundle bloat).
*   **Transitions:** `< 10ms` UI state changes using `.hidden` CSS class toggles instead of HTTP page routing.
*   **Responsiveness:** Perfect 1:1 scaling from 4K desktop displays down to mobile screens using calculated Flexbox and CSS Grid logic.

## 🧠 How It Works

The underlying architecture delegates responsibilities cleanly across three separate JavaScript modules:
*   `data.js`: Centralized State Management (Player/AI budgets, Audio Context, Entity Data).
*   `ui.js`: Presentation Layer (Event listeners, DOM injection, visual hover interactions).
*   `combat.js`: Core Business Logic (AI generation algorithms, mathematical power evaluations, and victory/defeat routing).

## 🗺️ Roadmap

- [x] Design core UI and Iron Throne theme
- [x] Implement Vanilla JS SPA routing
- [x] Build automated AI opponent algorithm
- [x] Integrate custom audio engine
- [ ] Add LocalStorage functionality for saving win/loss streaks
- [ ] Implement responsive multiplayer mode (WebSockets)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](https://github.com/redrighthand2007/Gameofthrones-Webgame/issues) if you want to contribute.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Author

**Kush Aghera**
* GitHub: [@redrighthand2007](https://github.com/redrighthand2007)

## ⭐ Acknowledgements

*   Inspired by HBO's Game of Thrones & George R.R. Martin's *A Song of Ice and Fire*.
*   All art and audio assets are credited to their respective thematic creators.
