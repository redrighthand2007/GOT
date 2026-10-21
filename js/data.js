// DOM Elements
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const claimBtn = document.getElementById('claim-btn');

const bgMusic = document.getElementById('bg-music');
const sfxSword = document.getElementById('sfx-sword');

const battlePhase = document.getElementById('battle-phase');
const battleLog = document.getElementById('battle-log');
const bloodSplatter = document.getElementById('blood-splatter');
const particlesContainer = document.getElementById('particles-container');

// Settings & Modal
const settingsIcon = document.getElementById('settings-icon');
const infoModal = document.getElementById('info-modal');


settingsIcon.addEventListener('mouseenter', () => infoModal.classList.remove('hidden'));
settingsIcon.addEventListener('mouseleave', () => infoModal.classList.add('hidden'));
// Touch screens have no hover: tap the gear to toggle, tap anywhere else to close
settingsIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    if (matchMedia('(hover: none)').matches) infoModal.classList.toggle('hidden');
});
document.addEventListener('click', (e) => {
    if (!infoModal.contains(e.target)) infoModal.classList.add('hidden');
});


// War Hall Elements
const playerGoldDisplay = document.getElementById('player-gold');
const draftOptionsContainer = document.getElementById('draft-options');
const playerRosterContainer = document.getElementById('player-roster');
const enemyRosterContainer = document.getElementById('enemy-roster');
const btnBattle = document.getElementById('btn-battle');
const btnFight = document.getElementById('btn-fight');

const playerCodeword = document.getElementById('player-codeword');
const enemyCodeword = document.getElementById('enemy-codeword');
const playerSide = document.getElementById('player-side');
const enemySide = document.getElementById('enemy-side');
const warHall = document.getElementById('war-hall');
const draftingBoard = document.getElementById('drafting-board');

const playerSideTitle = playerSide.querySelector('h3');
const enemySideTitle = enemySide.querySelector('h3');
const goldDisplayContainer = document.getElementById('gold-display');


// Post Battle
const postBattleScreen = document.getElementById('post-battle-screen');
const endResultText = document.getElementById('end-result-text');
const btnGoBack = document.getElementById('btn-go-back');
const playAgainBtn = document.getElementById('btn-play-again');

// State
let playerGold = 999;
let enemyGold = 999;
let playerRoster = [];
let enemyRoster = [];
let battleTimers = []; // pending fight steps, cleared when the player leaves mid-fight

const HOUSES_DATA = [
    { id: "targ", name: "Targaryen", role: "A", tier: 1, cost: 500, power: 3, img: "assets/images/house-targaryen.png" },
    { id: "doth", name: "Dothraki", role: "A", tier: 2, cost: 300, power: 2, img: "assets/images/got-title.png" },
    { id: "dorn", name: "Dornish", role: "A", tier: 3, cost: 150, power: 1, img: "assets/images/got-title.png" },
    
    { id: "unsu", name: "Unsullied", role: "D", tier: 1, cost: 450, power: 3, img: "assets/images/got-title.png" },
    { id: "night", name: "Night's Watch", role: "D", tier: 2, cost: 280, power: 2, img: "assets/images/got-title.png" },
    { id: "rive", name: "Riverlands", role: "D", tier: 3, cost: 130, power: 1, img: "assets/images/house-stark.png" },
    
    { id: "storm", name: "Stormlanders", role: "M", tier: 1, cost: 400, power: 3, img: "assets/images/got-title.png" },
    { id: "iron", name: "Iron Fleet", role: "M", tier: 2, cost: 280, power: 2, img: "assets/images/got-title.png" },
    { id: "vale", name: "Vale", role: "M", tier: 3, cost: 150, power: 1, img: "assets/images/got-title.png" }
];

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
    if (document.startViewTransition) document.startViewTransition(applyLayout);
    else morphWithoutViewTransition(applyLayout);
}
narrowQuery.addEventListener('change', syncLayout);
window.addEventListener('resize', syncLayout);

