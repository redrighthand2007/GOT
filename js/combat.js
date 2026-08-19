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
        logMsg("OUT OF BUDGET!");
        return;
    }
    
    // Fade the 'Prepare for War' button instead of hiding it
    btnBattle.disabled = true;
    btnBattle.style.opacity = '0.5';
    btnBattle.style.cursor = 'default';
    
    // Hide the draft options entirely
    draftOptionsContainer.classList.add('hidden');
    draftingBoardTitle.classList.add('hidden');
    
    // Ensure background is transparent so the buttons look nice
    draftingBoard.classList.add('transparent-board');
    
    logMsg("Two alliances clash!");
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
    
    // Display Codewords
    playerCodeword.innerText = getCodewordString(playerRoster);
    enemyCodeword.innerText = getCodewordString(enemyRoster);
    playerCodeword.classList.remove('hidden');
    enemyCodeword.classList.remove('hidden');
    
    // Add Fight button just below Prepare for War
    btnFight.classList.remove('hidden');
    btnFight.style.opacity = '1';
});

btnFight.addEventListener('click', () => {
    btnFight.disabled = true;
    
    // Fade the Fight button after 1 sec
    setTimeout(() => {
        btnFight.style.opacity = '0.5';
    }, 1000);
    
    // Display results after 3 secs
    setTimeout(() => {
        resolveBattle();
    }, 3000);
});

function resolveBattle() {
    let playerPower = playerRoster.reduce((sum, h) => sum + h.power, 0);
    let enemyPower = enemyRoster.reduce((sum, h) => sum + h.power, 0);
    
    // Slight RNG
    playerPower *= (0.85 + Math.random() * 0.3);
    enemyPower *= (0.85 + Math.random() * 0.3);
    
    if (playerPower >= enemyPower) {
        endGameInline(true);
    } else {
        endGameInline(false);
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

function endGameInline(playerWon) {
    const inlineResult = document.getElementById('inline-result');
    inlineResult.classList.remove('hidden');
    
    let resultHTML = "";
    if(playerWon) {
        logMsg("VICTORY! YOUR ALLIANCE PREVAILS!");
        if (sfxWin) sfxWin.play().catch(e=>e);
        spawnParticles('snow');
        resultHTML = `
            <h2 style='color:#32cd32; font-size: 3rem; margin-bottom:10px; letter-spacing: 5px; text-shadow: 0 0 20px rgba(50,205,50,0.8);'>VICTORY</h2>
            <button id='btn-restart-inline' style='font-size: 1.2rem; padding: 10px 20px;'>BATTLE AGAIN</button>
        `;
    } else {
        logMsg("DEFEAT. YOUR HOUSE FALLS INTO RUIN.");
        flashBlood();
        spawnParticles('fire');
        resultHTML = `
            <h2 style='color:#ff0000; font-size: 3rem; margin-bottom:10px; letter-spacing: 5px; text-shadow: 0 0 20px rgba(255,0,0,0.8);'>DEFEAT</h2>
            <button id='btn-restart-inline' style='font-size: 1.2rem; padding: 10px 20px;'>BATTLE AGAIN</button>
        `;
    }
    
    inlineResult.innerHTML = resultHTML;
    
    document.getElementById('btn-restart-inline').addEventListener('click', () => {
        inlineResult.classList.add('hidden');
        resetDraftingUI(); // Assuming resetDraftingUI is available via ui.js
        initWarHall();
    });
}
