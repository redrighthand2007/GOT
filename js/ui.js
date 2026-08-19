// --- Screen 1: Start Game ---
const btnBackNav = document.getElementById('btn-back-nav');
btnBackNav.addEventListener('click', () => {
    startScreen.classList.remove('hidden');
    battlePhase.classList.add('hidden');
    btnBackNav.classList.add('hidden');
    resetDraftingUI();
});

claimBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    battlePhase.classList.remove('hidden');
    if (bgMusic) bgMusic.play().catch(e => console.log("Audio play failed:", e));
    initWarHall();
    btnBackNav.classList.remove('hidden');
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

function updateGoldDisplay() {
    playerGoldDisplay.innerText = playerGold;
    if (playerGold < 0) {
        playerGoldDisplay.classList.add('over-budget');
    } else {
        playerGoldDisplay.classList.remove('over-budget');
    }
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
    initWarHall();
    btnBackNav.classList.remove('hidden'); // Restarts the drafting phase directly
});
