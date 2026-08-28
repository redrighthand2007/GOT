<div align="center">
  <img src="assets/got-bg.jpg" alt="Game of Thrones Webgame" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.5);">
  
  <br />
  <h1>?? Battle for Westeros ??</h1>
  
  <p>
    <strong>A sleek, fast-paced strategy web game built entirely with Vanilla Web Technologies.</strong>
  </p>

  <p>
    <a href="https://redrighthand2007.github.io/Gameofthrones-Webgame/"><b>?? Play the Game Live Here ??</b></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" alt="JavaScript" />
    <img src="https://img.shields.io/badge/No_Frameworks-000000?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Vanilla Web" />
  </p>
</div>

<hr />

## ?? The Concept

**Battle for Westeros** is a beautifully crafted Single Page Application (SPA) that tests your strategic drafting skills. You are given a budget of **999G** to assemble a three-house alliance from the iconic factions of Westeros. 

Once your army is forged, you clash against a fully automated AI opponent in a sudden-death calculation of power, strategy, and a little bit of RNG chaos.

## ?? Features

- **Dynamic Drafting System:** Strategically balance your budget across 9 different houses, categorized by Tiers (1-3) and Combat Styles (Attack, Defense, Mix).
- **Responsive "Iron Throne" UI:** A meticulously calculated flexbox grid system that maps cards 1:1 perfectly over the background Iron Throne across all devices, from 4K desktop monitors to mobile screens.
- **Single Page Architecture (SPA):** Zero page reloads. Transitions between the Start Screen, War Hall, and Combat Phase happen instantly via DOM manipulation, ensuring a seamless experience.
- **Immersive Atmosphere:** Thematic Game of Thrones CSS styling, translucent glassmorphism panels, interactive hover modals, and integrated audio loops.
- **Automated AI Opponent:** A dynamic computer adversary that intelligently drafts a counter-alliance within its own budget constraints.

## ?? Tech Stack & Architecture

This project was built to prove that you don't need heavy frontend frameworks (like React or Vue) to build a complex, state-driven, and highly polished web application.

*   **Zero Dependencies:** No external libraries, no NPM packages, and no complex build pipelines.
*   **Modular Vanilla JS (ES6+):** The game engine is cleanly separated into logic modules (data.js, ui.js, combat.js) for State Management, DOM Manipulation, and AI routing.
*   **Advanced CSS3:** Features responsive mathematical scaling (spect-ratio, h/vw), flexbox shrink-to-fit logic overriding, and custom glassmorphism UI elements.

## ?? How to Play

1.  **Enter the War Room:** You will be greeted by the Iron Throne and a starting budget of 999G.
2.  **Draft Your Alliance:** Click on the house cards to spend your gold. You can recruit up to 3 houses. Hover over the info gear for strategic stats.
3.  **Prepare for War:** Once your roster is locked in, finalize your draft. The AI will instantly reveal its own mystery drafted houses.
4.  **The Clash:** Hit **FIGHT!** The JavaScript engine will calculate raw power scores, apply modifiers, and determine who takes the Throne.

## ?? Repository Structure

`	ext
+-- assets/         # Images, background art, and audio files
+-- css/            # Stylesheets (got-theme.css)
+-- js/             # Modular Javascript game engine (data.js, ui.js, combat.js)
+-- docs/           # Product Requirements (PRD) and documentation
+-- index.html      # The singular DOM entry point
`

---
<div align="center">
  <p>Forged in fire by <b>Kush Aghera</b>.</p>
</div>
