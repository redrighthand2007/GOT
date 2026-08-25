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
    
    if (playerRoster.length === 0) { btnBattle.classList.add('hidden'); }
    
    battleLog.innerText = "";
    renderDraftingBoard();
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
        enemyGold -= house.cost;
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
        return;
    }
    
    // Fade the 'Prepare for War' button instead of hiding it
    btnBattle.disabled = true;
    btnBattle.style.visibility = 'hidden';
    
    
    document.getElementById('battle-location-display').innerHTML = "GET READY TO FIGHT.";
    
    // Hide the draft options entirely
    draftOptionsContainer.style.visibility = 'hidden';
    
    // Ensure background is transparent so the buttons look nice
    draftingBoard.classList.add('transparent-board');
    
    generateEnemyRoster(); // Still generates the mystery slots technically, but we immediately overwrite below
    
    // INSTANT REVEAL:
    enemyRosterContainer.innerHTML = "";
    enemyRoster.forEach(h => {
        const slot = document.createElement('div');
        slot.className = 'roster-slot';
        slot.innerHTML = `<img src="${h.img}">`;
        enemyRosterContainer.appendChild(slot);
    });
    
    if (sfxSword) sfxSword.play().catch(e=>e);
    
    // Show stats explicitly 
    const pCode = playerRoster.map(h => h.id).join(' + ');
    const eCode = enemyRoster.map(h => h.id).join(' + ');
    playerCodeword.innerText = pCode;
    enemyCodeword.innerText = eCode;
    playerCodeword.classList.remove('hidden');
    enemyCodeword.classList.remove('hidden');
    
    document.getElementById('enemy-gold').innerText = enemyGold;

    // Show Fight button inline directly below Prepare for War
    document.getElementById('action-buttons-container').classList.remove('hidden');
});

btnFight.addEventListener('click', () => {
    btnFight.disabled = true;
    
    let pPower = calculatePower(playerRoster);
    let ePower = calculatePower(enemyRoster);
    
    const pRoll = Math.random() * 0.3 + 0.85; 
    const eRoll = Math.random() * 0.3 + 0.85; 
    const pFinal = Math.floor(pPower * pRoll);
    const eFinal = Math.floor(ePower * eRoll);
    
    const playerWon = pFinal >= eFinal;
    
    document.getElementById('player-health-container').classList.remove('hidden');
    document.getElementById('enemy-health-container').classList.remove('hidden');
    
    const pBar = document.getElementById('player-health-bar');
    const eBar = document.getElementById('enemy-health-bar');
    
    const playClash = () => {
        if (sfxSword) {
            sfxSword.currentTime = 0;
            sfxSword.play().catch(e=>e);
        }
    };
    
    setTimeout(() => {
        playClash();
        pBar.style.width = playerWon ? '75%' : '60%';
        eBar.style.width = playerWon ? '60%' : '75%';
    }, 400);
    
    setTimeout(() => {
        playClash();
        pBar.style.width = playerWon ? '45%' : '25%';
        eBar.style.width = playerWon ? '25%' : '45%';
    }, 1100);
    
    setTimeout(() => {
        playClash();
        pBar.style.width = playerWon ? '15%' : '0%';
        eBar.style.width = playerWon ? '0%' : '15%';
    }, 1800);
    
    setTimeout(() => {
        endGameInline(playerWon);
    }, 2600);
});

function endGameInline(playerWon) {
    const inlineResult = document.getElementById('inline-result');
    const titleDisplay = document.getElementById('battle-location-display');
    
    inlineResult.classList.remove('hidden');
    document.getElementById('action-buttons-container').classList.add('hidden');
    btnBattle.style.visibility = 'hidden';
    
    
    if(playerWon) {
        if (sfxWin) sfxWin.play().catch(e=>e);
        titleDisplay.innerHTML = "<span style='color:#32cd32; font-size: 3.5rem; letter-spacing: 5px; text-shadow: 0 0 20px rgba(50,205,50,0.8); font-weight:bold;'>VICTORY</span>";
        
    } else {
        flashBlood();
        titleDisplay.innerHTML = "<span style='color:#ff0000; font-size: 3.5rem; letter-spacing: 5px; text-shadow: 0 0 20px rgba(255,0,0,0.8); font-weight:bold;'>DEFEAT</span>";
        
    }
    
    
    
    

    
}
function flashBlood() {
    const bloodSplatter = document.getElementById('blood-splatter');
    bloodSplatter.classList.add('splatter-active');
    setTimeout(() => bloodSplatter.classList.remove('splatter-active'), 500);
}
function calculatePower(roster) {
    return roster.reduce((sum, h) => sum + h.power, 0);
}



