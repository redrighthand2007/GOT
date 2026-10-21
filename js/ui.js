// --- Screen 1: Start Game ---
const btnBackNav = document.getElementById('btn-back-nav');
btnBackNav.addEventListener('click', () => {
    document.getElementById('main-title').classList.remove('hidden');
    startScreen.classList.remove('hidden');
    battlePhase.classList.add('hidden');
    
    resetDraftingUI();
});

claimBtn.addEventListener('click', () => {
    document.getElementById('main-title').classList.add('hidden');
    startScreen.classList.add('hidden');
    battlePhase.classList.remove('hidden');
    Sound.startMusic(); // the theme begins when the player joins the war
    initWarHall();
    
});

// --- Screen 2: War Hall Drafting ---
function initWarHall() {
    playerGold = 999;
    enemyGold = 999;
    document.getElementById('enemy-gold').innerText = enemyGold;
    playerRoster = [];
    enemyRoster = [];
    playerGoldDisplay.innerText = playerGold;
    playerGoldDisplay.classList.remove('over-budget');
    playerRosterContainer.innerHTML = "";
    enemyRosterContainer.innerHTML = "";
    battleLog.innerText = "";
    
    btnBattle.classList.add('hidden'); btnBattle.style.opacity = '1'; btnBattle.style.visibility = 'visible'; btnBattle.disabled = false;
    document.getElementById('action-buttons-container').classList.add('hidden'); btnFight.disabled = false;
    document.getElementById('player-health-container').classList.add('hidden');
    document.getElementById('enemy-health-container').classList.add('hidden');
    document.getElementById('player-health-bar').style.width = '100%';
    document.getElementById('enemy-health-bar').style.width = '100%'; btnFight.disabled = false;
    document.getElementById('inline-result').classList.add('hidden');
    
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
    // Leaving mid-fight: stop the fight's pending steps so they can't change the next game
    battleTimers.forEach(clearTimeout);
    battleTimers = [];
    document.getElementById('blood-splatter').classList.remove('splatter-active');
    Sound.fightEnd(); // bring the music back up if a fight was cut short

    document.getElementById('battle-location-display').innerHTML = "MAKE YOUR ARMY";
    draftingBoard.classList.remove('transparent-board');
    playerSideTitle.classList.remove('hidden');
    enemySideTitle.classList.remove('hidden');
    goldDisplayContainer.classList.remove('hidden');
    draftOptionsContainer.classList.remove('draft-hidden');
    

    document.getElementById('drafting-board').style.opacity = '1';
    document.getElementById('drafting-board').style.pointerEvents = 'auto';
    particlesContainer.innerHTML = "";
    btnBattle.classList.add('hidden'); btnBattle.style.opacity = '1'; btnBattle.style.visibility = 'visible'; btnBattle.disabled = false;
    document.getElementById('action-buttons-container').classList.add('hidden'); btnFight.disabled = false;
    document.getElementById('player-health-container').classList.add('hidden');
    document.getElementById('enemy-health-container').classList.add('hidden');
    document.getElementById('player-health-bar').style.width = '100%';
    document.getElementById('enemy-health-bar').style.width = '100%'; btnFight.disabled = false;
    document.getElementById('inline-result').classList.add('hidden');
    
    playerCodeword.classList.add('hidden');
    enemyCodeword.classList.add('hidden');
}

// "Go Back" -> Return to Main Hall (Start Screen)
btnGoBack.addEventListener('click', () => {
    postBattleScreen.classList.add('hidden');
    battlePhase.classList.add('hidden');
    startScreen.classList.remove('hidden');
    document.getElementById('main-title').classList.remove('hidden');

    resetDraftingUI();
});

// "Battle Again" -> Go to Team Selection Stage (War Hall)
playAgainBtn.addEventListener('click', () => {
    postBattleScreen.classList.add('hidden');
    resetDraftingUI();
    initWarHall();
     // Restarts the drafting phase directly
});
document.getElementById('sound-icon').addEventListener('click', Sound.toggleMute);
document.getElementById('btn-surrender').addEventListener('click', () => {
    document.getElementById('btn-back-nav').click();
});
document.getElementById('btn-home-inline').addEventListener('click', () => {
    document.getElementById('inline-result').classList.add('hidden');
    document.getElementById('battle-location-display').innerHTML = "MAKE YOUR ARMY";
    document.getElementById('btn-back-nav').click();
});
document.getElementById('btn-restart-inline').addEventListener('click', () => {
    document.getElementById('inline-result').classList.add('hidden');
    document.getElementById('battle-location-display').innerHTML = "MAKE YOUR ARMY";
    resetDraftingUI();
    initWarHall();
});

