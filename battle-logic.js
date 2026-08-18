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
    { id: "targ", name: "Targaryen", role: "A", tier: 1, cost: 1000, power: 3, img: "house-targaryen.png" },
    { id: "doth", name: "Dothraki", role: "A", tier: 2, cost: 600, power: 2, img: "got-title.png" },
    { id: "dorn", name: "Dornish", role: "A", tier: 3, cost: 300, power: 1, img: "got-title.png" },
    
    { id: "unsu", name: "Unsullied", role: "D", tier: 1, cost: 900, power: 3, img: "got-title.png" },
    { id: "night", name: "Night's Watch", role: "D", tier: 2, cost: 550, power: 2, img: "got-title.png" },
    { id: "rive", name: "Riverlands", role: "D", tier: 3, cost: 250, power: 1, img: "house-stark.png" },
    
    { id: "storm", name: "Stormlanders", role: "M", tier: 1, cost: 800, power: 3, img: "got-title.png" },
    { id: "iron", name: "Iron Fleet", role: "M", tier: 2, cost: 550, power: 2, img: "got-title.png" },
    { id: "vale", name: "Vale", role: "M", tier: 3, cost: 300, power: 1, img: "got-title.png" }
];

// Audio Setup
if (bgMusic) bgMusic.volume = 0.4;
if (sfxSword) sfxSword.volume = 0.7;

// --- Screen 1: Start Game ---
claimBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    battlePhase.classList.remove('hidden');
    if (bgMusic) bgMusic.play().catch(e => console.log("Audio play failed:", e));
    initWarHall();
});

// --- Screen 2: War Hall Drafting ---
function initWarHall() {
    playerGold = 1900;
    playerRoster = [];
    enemyRoster = [];
    playerGoldDisplay.innerText = playerGold;
    playerGoldDisplay.classList.remove('over-budget');
    playerRosterContainer.innerHTML = "";
    enemyRosterContainer.innerHTML = "";
    battleLog.innerText = "";
    
    btnBattle.classList.add('hidden');
    btnFight.classList.add('hidden');
    
    btnBattle.disabled = false;
    btnFight.disabled = false;
    
    renderDraftingBoard();
}

function renderDraftingBoard() {
    draftOptionsContainer.innerHTML = "";
    HOUSES_DATA.forEach(h => {
        // Disabled if already in roster, OR if roster is full
        const isPicked = playerRoster.find(r => r.id === h.id);
        const isFull = playerRoster.length >= 3;
        const isDisabled = isPicked || (isFull && !isPicked);
        
        const card = document.createElement('div');
        card.className = `draft-card ${isDisabled ? 'disabled' : ''}`;
        
        let roleName = h.role === 'A' ? "Attack" : (h.role === 'D' ? "Defense" : "Mix");
        
        card.innerHTML = `
            <img src="${h.img}" alt="${h.name}">
            <div class="draft-role">${roleName} (Tier ${h.tier})</div>
            <div class="draft-cost">${h.role}${h.tier} | ${h.cost}G</div>
        `;
        
        if (!isDisabled) {
            card.addEventListener('click', () => draftHouse(h));
        }
        draftOptionsContainer.appendChild(card);
    });
    
    renderPlayerRoster();
}

function renderPlayerRoster() {
    playerRosterContainer.innerHTML = "";
    playerRoster.forEach((house, index) => {
        const slot = document.createElement('div');
        slot.className = 'roster-slot';
        slot.innerHTML = `<img src="${house.img}">`;
        slot.style.cursor = 'pointer';
        slot.addEventListener('click', () => removeHouse(index));
        playerRosterContainer.appendChild(slot);
    });
}

function draftHouse(house) {
    if (playerRoster.length < 3) {
        playerRoster.push(house);
        playerGold -= house.cost;
        updateGoldDisplay();
        
        renderDraftingBoard(); 
        
        if (playerRoster.length > 0) {
            btnBattle.classList.remove('hidden');
        }
    }
}

function removeHouse(index) {
    const house = playerRoster[index];
    playerRoster.splice(index, 1);
    playerGold += house.cost;
    updateGoldDisplay();
    
    if (playerRoster.length === 0) {
        btnBattle.classList.add('hidden');
    }
    
    battleLog.innerText = "";
    renderDraftingBoard();
}

function updateGoldDisplay() {
    playerGoldDisplay.innerText = playerGold;
    if (playerGold < 0) {
        playerGoldDisplay.classList.add('over-budget');
    } else {
        playerGoldDisplay.classList.remove('over-budget');
    }
}

// --- Enemy AI Drafting ---
function generateEnemyRoster() {
    // The computer only selects from the 3 standard combos
    const combos = [
        ["targ", "doth", "dorn"],   // Pure Attack
        ["unsu", "night", "rive"],  // Pure Defense
        ["storm", "iron", "vale"]   // Pure Mix
    ];
    
    const selectedCombo = combos[Math.floor(Math.random() * combos.length)];
    
    selectedCombo.forEach(id => {
        const house = HOUSES_DATA.find(h => h.id === id);
        enemyRoster.push(house);
    });

    // Render Mystery Slots initially
    for (let i = 0; i < 3; i++) {
        const slot = document.createElement('div');
        slot.className = 'roster-slot';
        slot.innerHTML = `<div class="mystery-icon">?</div>`;
        enemyRosterContainer.appendChild(slot);
    }
}

function getCodewordString(roster) {
    return roster.map(h => `${h.role}${h.tier}`).join(' + ');
}

// --- Battle Resolution ---
btnBattle.addEventListener('click', () => {
    if (playerGold < 0) {
        logMsg("OUT OF BUDGET!");
        return;
    }
    
    btnBattle.disabled = true;
    
    logMsg("The enemy reveals their alliance!");
    generateEnemyRoster();
    
    setTimeout(() => {
        // Reveal enemy cards
        enemyRosterContainer.innerHTML = "";
        enemyRoster.forEach(h => {
            const slot = document.createElement('div');
            slot.className = 'roster-slot';
            slot.innerHTML = `<img src="${h.img}">`;
            enemyRosterContainer.appendChild(slot);
        });
        
        if (sfxSword) sfxSword.play().catch(e=>e);
        
        // Hide selecting infos
        playerSideTitle.classList.add('hidden');
        enemySideTitle.classList.add('hidden');
        goldDisplayContainer.classList.add('hidden');
        draftOptionsContainer.classList.add('hidden');
        draftingBoardTitle.classList.add('hidden');
        
        // Make drafting board transparent (just holds the fight button)
        draftingBoard.classList.add('transparent-board');
        
        playerCodeword.innerText = getCodewordString(playerRoster);
        enemyCodeword.innerText = getCodewordString(enemyRoster);
        playerCodeword.classList.remove('hidden');
        enemyCodeword.classList.remove('hidden');
        
        // Hide Prepare, Show Fight
        btnBattle.classList.add('hidden');
        btnFight.classList.remove('hidden');
        
        logMsg("Two alliances clash!");
    }, 1500);
});

btnFight.addEventListener('click', () => {
    btnFight.disabled = true;
    resolveBattle();
});

function resolveBattle() {
    let playerPower = playerRoster.reduce((sum, h) => sum + h.power, 0);
    let enemyPower = enemyRoster.reduce((sum, h) => sum + h.power, 0);
    
    // Slight RNG
    playerPower *= (0.85 + Math.random() * 0.3);
    enemyPower *= (0.85 + Math.random() * 0.3);
    
    if (playerPower >= enemyPower) {
        endGame(true);
    } else {
        endGame(false);
    }
}

function flashBlood() {
    bloodSplatter.classList.add('splatter-active');
    setTimeout(() => bloodSplatter.classList.remove('splatter-active'), 500);
}

function spawnParticles(type) {
    for(let i=0; i<30; i++) {
        let p = document.createElement('div');
        p.classList.add('particle', type);
        p.style.left = Math.random() * 100 + "vw";
        p.style.top = -20 + "px";
        let size = Math.random() * 5 + 3 + "px";
        p.style.width = size; p.style.height = size;
        p.style.animationDuration = (Math.random() * 2 + 1) + "s";
        particlesContainer.appendChild(p);
    }
}

function logMsg(txt) {
    battleLog.innerText = txt;
}

function endGame(playerWon) {
    btnFight.classList.add('hidden');
    if(playerWon) {
        logMsg("VICTORY! YOUR ALLIANCE PREVAILS!");
        if (sfxWin) sfxWin.play().catch(e=>e);
        spawnParticles('snow');
        endResultText.innerText = "VICTORY";
        endResultText.style.color = "#32cd32";
    } else {
        logMsg("DEFEAT. YOUR HOUSE FALLS INTO RUIN.");
        flashBlood();
        spawnParticles('fire');
        endResultText.innerText = "DEFEAT";
        endResultText.style.color = "#ff0000";
    }
    
    setTimeout(() => {
        postBattleScreen.classList.remove('hidden');
    }, 2000);
}

// --- Navigation Flow ---
function resetDraftingUI() {
    draftingBoard.classList.remove('transparent-board');
    playerSideTitle.classList.remove('hidden');
    enemySideTitle.classList.remove('hidden');
    goldDisplayContainer.classList.remove('hidden');
    draftOptionsContainer.classList.remove('hidden');
    draftingBoardTitle.classList.remove('hidden');

    document.getElementById('drafting-board').style.opacity = '1';
    document.getElementById('drafting-board').style.pointerEvents = 'auto';
    particlesContainer.innerHTML = "";
    btnBattle.classList.add('hidden');
    btnFight.classList.add('hidden');
    
    playerCodeword.classList.add('hidden');
    enemyCodeword.classList.add('hidden');
}

// "Go Back" -> Return to Main Hall (Start Screen)
btnGoBack.addEventListener('click', () => {
    postBattleScreen.classList.add('hidden');
    battlePhase.classList.add('hidden');
    selectionPhase.classList.add('hidden');
    startScreen.classList.remove('hidden');
    
    fieldOptions.forEach(o => o.classList.remove('selected'));
    fieldChoice = "";
    playButton.classList.add('hidden');
    
    resetDraftingUI();
});

// "Battle Again" -> Go to Team Selection Stage (War Hall)
playAgainBtn.addEventListener('click', () => {
    postBattleScreen.classList.add('hidden');
    resetDraftingUI();
    initWarHall(); // Restarts the drafting phase directly
});
