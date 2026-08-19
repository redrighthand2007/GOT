// DOM Elements
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const claimBtn = document.getElementById('claim-btn');

const bgMusic = document.getElementById('bg-music');
const sfxSword = document.getElementById('sfx-sword');
const sfxWin = document.getElementById('sfx-win');

const battlePhase = document.getElementById('battle-phase');
const battleLog = document.getElementById('battle-log');
const bloodSplatter = document.getElementById('blood-splatter');
const particlesContainer = document.getElementById('particles-container');

// Settings & Modal
const settingsIcon = document.getElementById('settings-icon');
const infoModal = document.getElementById('info-modal');
const closeModal = document.getElementById('close-modal');

settingsIcon.addEventListener('click', () => infoModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => infoModal.classList.add('hidden'));

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
const draftingBoardTitle = draftingBoard.querySelector('h3');

// Post Battle
const postBattleScreen = document.getElementById('post-battle-screen');
const endResultText = document.getElementById('end-result-text');
const btnGoBack = document.getElementById('btn-go-back');
const playAgainBtn = document.getElementById('btn-play-again');

// State
let playerGold = 1900;
let playerRoster = [];
let enemyRoster = [];

const HOUSES_DATA = [
    { id: "targ", name: "Targaryen", role: "A", tier: 1, cost: 1000, power: 3, img: "assets/house-targaryen.png" },
    { id: "doth", name: "Dothraki", role: "A", tier: 2, cost: 600, power: 2, img: "assets/got-title.png" },
    { id: "dorn", name: "Dornish", role: "A", tier: 3, cost: 300, power: 1, img: "assets/got-title.png" },
    
    { id: "unsu", name: "Unsullied", role: "D", tier: 1, cost: 900, power: 3, img: "assets/got-title.png" },
    { id: "night", name: "Night's Watch", role: "D", tier: 2, cost: 550, power: 2, img: "assets/got-title.png" },
    { id: "rive", name: "Riverlands", role: "D", tier: 3, cost: 250, power: 1, img: "assets/house-stark.png" },
    
    { id: "storm", name: "Stormlanders", role: "M", tier: 1, cost: 800, power: 3, img: "assets/got-title.png" },
    { id: "iron", name: "Iron Fleet", role: "M", tier: 2, cost: 550, power: 2, img: "assets/got-title.png" },
    { id: "vale", name: "Vale", role: "M", tier: 3, cost: 300, power: 1, img: "assets/got-title.png" }
];

// Audio Setup
if (bgMusic) bgMusic.volume = 0.4;
if (sfxSword) sfxSword.volume = 0.7;

