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
