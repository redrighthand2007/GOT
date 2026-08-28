# Battle for Westeros - Project Showcase & Developer Documentation

## 1. The Core Idea
**Battle for Westeros** is an interactive, browser-based strategy game set in the Game of Thrones universe. Players are given a budget to strategically draft an alliance of iconic houses, which then faces off against an automated AI opponent. The game emphasizes resource management, synergistic drafting (Attack/Defense/Mix), and provides an immersive visual and auditory experience.

## 2. The Problem in Today's Development Landscape
- **Over-reliance on Frameworks:** In today's web development environment, there is a heavy reliance on monolithic frontend frameworks (React, Angular, Vue) even for relatively simple state-driven applications. This leads to bloated bundle sizes, complex build pipelines (Webpack, Vite), and high abstraction layers that can hide fundamental DOM behaviors.
- **Dependency Hell:** Projects often ship with hundreds of NPM packages (the `node_modules` black hole), causing security vulnerabilities, version conflicts, and maintenance nightmares over time.
- **Poor Performance on Low-End Hardware:** Heavy client-side rendering and massive JavaScript payloads can cause stuttering, high memory usage, and poor performance on older laptops or mobile devices.

## 3. How We Addressed It (The Solution)
- **Zero-Dependency Architecture:** We built the entire game engine from scratch using Vanilla JavaScript (ES6+), HTML5, and CSS3. There are zero NPM packages, no Webpack compilation, and no framework overhead. The entire application runs natively in the browser.
- **Single Page Application (SPA) via DOM Manipulation:** Instead of relying on a bloated framework router, we implemented custom state management and class toggling (e.g., adding/removing a `.hidden` CSS class) to transition between game states (Start Screen ➔ War Hall ➔ Combat Phase) instantly in memory. This ensures zero page reloads and allows for continuous, uninterrupted audio playback.
- **Modular JavaScript Design:** The game logic is strictly separated by concern (`data.js` for state and constants, `ui.js` for DOM rendering, and `combat.js` for battle logic and AI), mimicking the architectural cleanliness of modern frameworks without the overhead.

## 4. Key Features
- **Dynamic Drafting Engine:** Features 9 unique houses across 3 tiers (1, 2, 3) and 3 combat styles (Attack, Defense, Mix). Includes real-time budget tracking (999G limit) and dynamic roster rendering.
- **Intelligent Enemy AI:** An automated opponent algorithm that calculates its own budget constraints and drafts a highly competitive, randomized counter-alliance every game.
- **Responsive "Iron Throne" UI:** A mathematically calculated CSS Flexbox layout where the 9-card draft grid maps exactly 1:1 over the background image of the Iron Throne across *all* screen resolutions (from 4K desktop monitors to mobile phones).
- **Interactive Hover Modals:** Glassmorphism UI elements and non-intrusive hover-based tooltip modals for deep player statistical information.
- **Immersive Audio Loop:** Seamless background music and SFX (e.g., sword clashes) synchronized precisely with the JavaScript combat animations and interaction states.
- **Instant Combat Resolution:** A three-step animated combat sequence featuring dynamic health bars. The engine calculates a winner based on raw power stats combined with a slight RNG (Random Number Generator) modifier to simulate the chaos of war.

## 5. The Tech Stack (In Detail)
- **HTML5:** Semantic HTML structure relying on absolute positioning wrappers for bulletproof layout stability during dynamic DOM updates.
- **CSS3:** Advanced Flexbox (shrink-to-fit logic overriding), CSS Grid, mathematically locked aspect-ratio scaling (using `vh/vw`), Glassmorphism (`backdrop-filter`), and hardware-accelerated CSS transitions/animations.
- **Vanilla JavaScript (ES6+):** Arrow functions, template literals, higher-order array methods (`map`, `filter`, `forEach`), advanced event delegation, native DOM manipulation, and custom state management.
- **Version Control:** Git & GitHub.
- **Deployment:** GitHub Pages (Continuous Deployment).

## 6. Step-by-Step Development Journey

### Phase 1: Conceptualization and Data Structure
- Defined the core JSON-like structure in `data.js` for the 9 houses, assigning unique IDs, stats (Attack, Defense, Mix), budgets, and localized image paths.
- Established global state variables for `playerGold`, `playerRoster`, and `enemyRoster` to track game state across scripts.

### Phase 2: Building the SPA Engine (Redirections & State)
- Designed a single `index.html` file containing multiple full-screen overlay containers (`#start-screen`, `#battle-phase`).
- Created navigation controller functions in `ui.js` to toggle the `.hidden` utility class, allowing instant "redirections" between visual states without triggering a browser refresh.

### Phase 3: The Drafting UI and Flexbox Mathematics
- Built the "War Hall" where drafting occurs.
- Rendered the houses dynamically by iterating over the `HOUSES_DATA` array and using JavaScript `document.createElement` to construct the DOM nodes.
- Implemented real-time budget deduction logic and dynamically disabled DOM buttons to prevent players from overspending their 999G limit.

### Phase 4: Combat Logic and Enemy AI
- Wrote the `generateEnemyRoster()` algorithm in `combat.js` to intelligently draft a mystery roster that maximizes a 999G budget without exceeding the 3-house hard limit.
- Implemented the `calculatePower()` formula to determine the true numerical strength of alliances based on their chosen tiers and synergy.

### Phase 5: Polishing and Audio Integration
- Applied advanced CSS styling, utilizing glassmorphism to give the UI a premium, metallic "Game of Thrones" aesthetic.
- Integrated background music and timed sound effects triggered directly by Javascript DOM event listeners.

## 7. Hardest Challenges & How I Solved Them (Showcase Focus)

### Challenge 1: The "Shrink-to-Fit" Flexbox Collapse Bug
**The Problem:** When transitioning the UI from the selected state (where houses were drafted) back to an empty draft board, the browser's Flexbox engine encountered a circular dependency. It couldn't determine the absolute width of the side panels because there was no physical content inside them to measure. This caused the entire central draft grid to collapse inward toward the center of the screen, completely ruining the 1:1 layout mapping over the Iron Throne background image.

**The Solution:** I had to enforce strict parent-to-child width dependencies. I applied `align-items: stretch` to the absolute parent flex container (`#battle-phase`) and gave the child container (`#war-hall`) an explicit `width: 95%` combined with `margin: 5px auto`. This mathematically locked the flex boundaries, breaking the circular dependency and guaranteeing that the empty state remained pixel-for-pixel identical to the populated state.

### Challenge 2: Diagonal Button Misalignment and Text Overflow
**The Problem:** In the inline combat resolution screen, the "SURRENDER" and "FIGHT!" flex-item buttons were skewing diagonally (one pushed up, one pushed down) inside a strictly defined 50px height wrapper. Furthermore, text strings like "BATTLE AGAIN" were wrapping to a second line and overflowing their containers entirely.

**The Solution:** I traced the vertical offset issue to a global `.theme-btn` CSS class that was silently applying `margin: 10px` universally. Inside a tight horizontal flex wrapper, the vertical margins were causing the buttons to overflow their container bounds. For the text wrapping issue, default side paddings (`30px`) were crushing the text. I solved both by utilizing inline overrides: explicitly setting `margin: 0` to fix the diagonal offset, stripping horizontal padding (`padding: 0`), and setting `white-space: nowrap` to strictly forbid the browser from breaking long strings onto a second line.

### Challenge 3: Responsive Background Image Mapping
**The Problem:** The design requirement was strict: the 9 draft cards had to hover perfectly inside the boundaries of the Iron Throne background image (exceeding the top swords, while sitting directly on the stairs) across *all* possible screen resolutions (laptops, mobile phones, ultrawide monitors). Using traditional hardcoded pixel widths (`px`) caused the UI to shatter and overflow on smaller screens.

**The Solution:** I abandoned static pixels entirely and built a proportional scaling system using Viewport Heights (`vh`), Viewport Widths (`vw`), and percentage-based widths. By locking the main game container to a strict 16:9 `aspect-ratio` based on screen height (`max-width: 179.16vh`), and setting the draft grid to exactly `41%` of the center panel, I mathematically guaranteed that the cards would automatically compute to exactly ~21% of the total screen width. This ensured the cards perfectly mapped to the physical throne geometry regardless of whether the user played on a 4K desktop or a 13-inch laptop.
