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

// State (the rules and houses live in js/rules.js)
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
