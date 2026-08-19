# Game of Thrones - Battle for Westeros

A sleek, fast-paced Single Page Application (SPA) strategy web game where players draft alliances of iconic Game of Thrones houses and battle against the computer. Built entirely from scratch using Vanilla Web Technologies.

## ?? Gameplay
1. **The War Room:** You start with a budget of 999G.
2. **Drafting:** Select up to 3 houses to form your alliance. Houses are categorized by Roles (Attack, Defense, Mix) and Tiers (1 to 3).
3. **The Clash:** Once your alliance is ready, click **Prepare for War**. The AI will instantly lock in its counter-strategy and reveal its budget and choices.
4. **Resolution:** Click **FIGHT!** to calculate raw power (with a slight RNG modifier) to determine the fate of Westeros.

## ?? Technology Stack
This project proves that you do not need heavy frameworks to build seamless web applications!
- **Vanilla JavaScript (ES6+):** Modularized logic (data.js, ui.js, combat.js) handling State, DOM Manipulation, and AI decisions.
- **HTML5:** Semantic layouts and Single-Page Architecture using .hidden class toggling to prevent page reloads.
- **CSS3:** Advanced flexbox layouts, text-clipping gradients, animations, and particle effects.

## ??? Architecture
- **No Dependencies:** Zero external libraries, no NPM packages, and no build steps. 
- **DOM Manipulation:** The entire game runs in index.html. Navigation between the Start Screen and War Hall occurs instantly in memory, preserving the audio loop and game state.

## ?? Folder Structure
- /assets: Images, backgrounds, and audio files.
- /css: Stylesheets (got-theme.css).
- /js: Modular Javascript game engine.
- /docs: Project documentation and PRD.

