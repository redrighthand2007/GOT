// DOM Elements
const startScreen = document.getElementById('start-screen');
const claimBtn = document.getElementById('claim-btn');

const bgMusic = document.getElementById('bg-music');
const sfxSword = document.getElementById('sfx-sword');

const battlePhase = document.getElementById('battle-phase');
const battleLog = document.getElementById('battle-log');
const titleDisplay = document.getElementById('battle-location-display');

// War Hall Elements
const playerGoldDisplay = document.getElementById('player-gold');
const enemyGoldDisplay = document.getElementById('enemy-gold');
const draftOptionsContainer = document.getElementById('draft-options');
const playerRosterContainer = document.getElementById('player-roster');
const enemyRosterContainer = document.getElementById('enemy-roster');
const btnBattle = document.getElementById('btn-battle');
const btnFight = document.getElementById('btn-fight');
const playerCodeword = document.getElementById('player-codeword');
const enemyCodeword = document.getElementById('enemy-codeword');

// --- Rules ---
const STARTING_GOLD = 999;
const ARMY_SIZE = 3;
const TYPE_EDGE = 0.05; // +/-5% strength for each house-vs-house type matchup

const ROLE_NAMES = { A: 'Attack', D: 'Defense', M: 'Mix' };
// Attack beats Mix, Mix beats Defense, Defense beats Attack
const BEATS = { A: 'M', M: 'D', D: 'A' };

// Emblems are drawn in CSS (.crest) from these colours and symbols, so no
// image files are needed and every house looks consistent
const HOUSES_DATA = [
    { id: "targ",  name: "Targaryen Dragons",  role: "A", tier: 1, cost: 500, power: 3, emblem: "🐉", colors: ["#b3121b", "#1a0204"], desc: "Dragonriders whose fire breaks any line." },
    { id: "doth",  name: "Dothraki Riders",    role: "A", tier: 2, cost: 300, power: 2, emblem: "🐎", colors: ["#9a6430", "#2b1a0c"], desc: "Horselords who strike fast across open ground." },
    { id: "dorn",  name: "Dornish Spears",     role: "A", tier: 3, cost: 150, power: 1, emblem: "☀️", colors: ["#d9822b", "#4a2208"], desc: "Desert spearmen, patient and deadly." },

    { id: "unsu",  name: "Unsullied",          role: "D", tier: 1, cost: 450, power: 3, emblem: "🛡️", colors: ["#7a6a55", "#1c1814"], desc: "Disciplined shield walls that never break." },
    { id: "night", name: "Night's Watch",      role: "D", tier: 2, cost: 280, power: 2, emblem: "❄️", colors: ["#3a3f52", "#05060a"], desc: "Sworn brothers who hold the frozen north." },
    { id: "rive",  name: "Riverlands Levies",  role: "D", tier: 3, cost: 130, power: 1, emblem: "🐟", colors: ["#2a5d8f", "#5a1a1a"], desc: "River folk, stubborn behind their fords." },

    { id: "storm", name: "Stormlanders",       role: "M", tier: 1, cost: 400, power: 3, emblem: "🦌", colors: ["#c9a227", "#1a1406"], desc: "Storm knights, strong in any kind of battle." },
    { id: "iron",  name: "Iron Fleet",         role: "M", tier: 2, cost: 280, power: 2, emblem: "🐙", colors: ["#a08a2a", "#0a0a0a"], desc: "Reavers who strike from the sea and vanish." },
    { id: "vale",  name: "Knights of the Vale", role: "M", tier: 3, cost: 150, power: 1, emblem: "🦅", colors: ["#7fa7c9", "#1a2a3a"], desc: "Mountain knights who charge from above." }
];

// The enemy always fields one of these (listed in the info panel)
const ENEMY_COMBOS = [
    { name: "Pure Attack",  ids: ["targ", "doth", "dorn"] },
    { name: "Pure Defense", ids: ["unsu", "night", "rive"] },
    { name: "Pure Mix",     ids: ["storm", "iron", "vale"] }
];

// State
let playerGold = STARTING_GOLD;
let enemyGold = STARTING_GOLD;
let playerRoster = [];
let enemyRoster = [];
let battleLocked = false; // true from PREPARE FOR WAR until the next draft
let battleTimers = [];    // pending fight steps, cleared when the player leaves mid-fight

// --- Saved settings & stats (this device only) ---
const STORE_KEYS = { stats: 'got-stats', difficulty: 'got-difficulty' };

function readStore(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}
function writeStore(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode */ }
}

let stats = Object.assign({ wins: 0, losses: 0, streak: 0, best: 0 }, readStore(STORE_KEYS.stats, {}));
let difficulty = readStore(STORE_KEYS.difficulty, 'normal') === 'hard' ? 'hard' : 'normal';

// --- Smooth zoom & layout changes ---
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const contentEl = document.querySelector('.content');

// Browser zoom (Ctrl + / Ctrl -) changes devicePixelRatio and redraws
// instantly. Start the page at its old on-screen size and ease it to the new one.
let lastPixelRatio = window.devicePixelRatio;
window.addEventListener('resize', () => {
    const ratio = window.devicePixelRatio;
    if (ratio === lastPixelRatio) return;
    const startScale = lastPixelRatio / ratio;
    lastPixelRatio = ratio;
    if (reducedMotion.matches) return;

    contentEl.style.transition = 'none';
    contentEl.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
    contentEl.style.transform = `scale(${startScale})`;
    contentEl.getBoundingClientRect(); // apply the start scale before animating
    contentEl.style.transition = 'transform 0.35s ease';
    contentEl.style.transform = '';
});
contentEl.addEventListener('transitionend', (e) => {
    if (e.target === contentEl && e.propertyName === 'transform') contentEl.style.transition = '';
});

// PC (three columns) <-> phone (one column). Same query as the inline
// script in index.html. The switch morphs instead of snapping.
// Checked on resize too, since some browsers don't fire the query's change event.
const narrowQuery = matchMedia('(max-width: 56em)');
const MORPH_TARGETS = ['#player-side', '#enemy-side', '#draft-options', '.action-bar', '#battle-location-display'];

// Fallback for browsers without view transitions (e.g. Firefox): note where
// each panel was, switch the layout, then slide each panel from old to new spot.
function morphWithoutViewTransition(applyLayout) {
    const panels = MORPH_TARGETS
        .map(sel => document.querySelector(sel))
        .filter(el => el && el.getClientRects().length > 0);
    const before = panels.map(el => el.getBoundingClientRect());
    applyLayout();
    panels.forEach((el, i) => {
        const after = el.getBoundingClientRect();
        const dx = before[i].left - after.left;
        const dy = before[i].top - after.top;
        if (!dx && !dy) return;
        el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
            { duration: 450, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
        );
    });
}

function syncLayout() {
    const narrow = narrowQuery.matches;
    if (document.documentElement.classList.contains('narrow') === narrow) return;
    const applyLayout = () => document.documentElement.classList.toggle('narrow', narrow);
    if (reducedMotion.matches || document.hidden) {
        applyLayout();
        return;
    }
    // Drop any running zoom animation; the layout morph animates this change
    contentEl.style.transition = 'none';
    contentEl.style.transform = '';
    contentEl.getBoundingClientRect();
    contentEl.style.transition = '';
    if (document.startViewTransition) {
        const transition = document.startViewTransition(applyLayout);
        // A newer resize can cut this animation short; that's expected, not an error
        transition.ready.catch(() => {});
        transition.finished.catch(() => {});
    } else {
        morphWithoutViewTransition(applyLayout);
    }
}
narrowQuery.addEventListener('change', syncLayout);
window.addEventListener('resize', syncLayout);
