# Product Requirements Document (PRD)

## 1. Project Overview
**Name:** Game of Thrones - Battle for Westeros
**Type:** Web-based Strategy Game
**Format:** Single Page Application (SPA)

## 2. Core Mechanics
- **Economy:** Players begin with 999G.
- **Roster:** Players can draft a maximum of 3 units (houses) into their alliance. Overdrafting is strictly forbidden by UI disabling logic.
- **Combat Resolution:** 
  - Each unit possesses a static power value determined by its Tier. 
  - Total alliance power is summed. 
  - A random RNG factor (0.85x to 1.15x) is multiplied to the final power to introduce slight unpredictability.
  - Highest final power wins.

## 3. Data Structure
Houses belong to 3 distinct categories with rational scaling:
* **Attack (A):** High impact, expensive. (Tier 1: 500G | Tier 2: 300G | Tier 3: 150G)
* **Defense (D):** High resilience, moderately priced. (Tier 1: 450G | Tier 2: 280G | Tier 3: 130G)
* **Mix (M):** Balanced, economical. (Tier 1: 400G | Tier 2: 280G | Tier 3: 150G)

## 4. Artificial Intelligence
The enemy AI simulates a master tactician by randomly selecting from one of three pre-programmed, flawless formations:
1. **Pure Attack** (A1, A2, A3) = 950G
2. **Pure Defense** (D1, D2, D3) = 860G
3. **Pure Mix** (M1, M2, M3) = 830G
The AI's budget dynamically updates upon revealing its hand to the player to prove it adhered to the 999G limit.

## 5. UI/UX Flow
- **Start Screen:** Cinematic title with a "Join the World War" call to action.
- **Drafting Board (The War Room):** Side-by-side flexbox layout. Player on the left, Enemy on the right. Central grid for drafting.
- **Transitions:** Handled seamlessly via JavaScript .hidden class toggling. No page reloads.
- **Result Output:** Handled dynamically via inline DOM injection beneath the fight controls, avoiding full-screen context switches.
