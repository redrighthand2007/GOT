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
    btnBattle.style.opacity = '0.5';
    btnBattle.style.cursor = 'default';
    
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
    btnFight.classList.remove('hidden');
});

btnFight.addEventListener('click', () => {
    btnFight.disabled = true;
    if (sfxSword) {
        sfxSword.currentTime = 0;
        sfxSword.play().catch(e=>e);
    }
    
    let pPower = calculatePower(playerRoster);
    let ePower = calculatePower(enemyRoster);
    
    const pRoll = Math.random() * 0.3 + 0.85; 
    const eRoll = Math.random() * 0.3 + 0.85; 
    const pFinal = Math.floor(pPower * pRoll);
    const eFinal = Math.floor(ePower * eRoll);
    
    setTimeout(() => {
        endGameInline(pFinal >= eFinal);
    }, 3000);
});

function endGameInline(playerWon) {
    const inlineResult = document.getElementById('inline-result');
    const titleDisplay = document.getElementById('battle-location-display');
    
    inlineResult.classList.remove('hidden');
    btnFight.classList.add('hidden');
    btnBattle.classList.add('hidden');
    
    let resultText = "";
    if(playerWon) {
        if (sfxWin) sfxWin.play().catch(e=>e);
        titleDisplay.innerHTML = "<span style='color:#32cd32; font-size: 3.5rem; letter-spacing: 5px; text-shadow: 0 0 20px rgba(50,205,50,0.8); font-weight:bold;'>VICTORY</span>";
        resultText = "VICTORY! YOUR ALLIANCE PREVAILS.";
    } else {
        flashBlood();
        titleDisplay.innerHTML = "<span style='color:#ff0000; font-size: 3.5rem; letter-spacing: 5px; text-shadow: 0 0 20px rgba(255,0,0,0.8); font-weight:bold;'>DEFEAT</span>";
        resultText = "DEFEAT. YOUR HOUSE FALLS INTO RUIN.";
    }
    
    inlineResult.innerHTML = `
        <div style="font-size: 1.5rem; color: #fff; margin-bottom: 20px; letter-spacing: 2px;">${resultText}</div>
        <button id='btn-restart-inline' class='theme-btn' style='margin-right: 15px;'>BATTLE AGAIN</button>
        <button id='btn-home-inline' class='theme-btn'>HOME</button>
    `;
    
    document.getElementById('btn-restart-inline').addEventListener('click', () => {
        inlineResult.classList.add('hidden');
        titleDisplay.innerHTML = "MAKE YOUR ARMY";
        resetDraftingUI(); // Assuming resetDraftingUI is available via ui.js
        initWarHall();
    });

    document.getElementById('btn-home-inline').addEventListener('click', () => {
        inlineResult.classList.add('hidden');
        titleDisplay.innerHTML = "MAKE YOUR ARMY";
        document.getElementById('btn-back-nav').click(); // Re-use home logic
    });
}
function flashBlood() {
    const bloodSplatter = document.getElementById('blood-splatter');
    bloodSplatter.classList.add('splatter-active');
    setTimeout(() => bloodSplatter.classList.remove('splatter-active'), 500);
}
