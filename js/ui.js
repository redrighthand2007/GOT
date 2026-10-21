// --- Shared bits ---
function crestHTML(house) {
    return `<span class="crest" style="--c1:${house.colors[0]};--c2:${house.colors[1]}" aria-hidden="true">` +
           `<span class="crest-emblem">${house.emblem}</span></span>`;
}

function armyNames(roster) {
    return roster.map(h => h.name).join(' + ');
}

// --- Screen 1: Start Game ---
const statsLine = document.getElementById('stats-line');
const difficultyBtn = document.getElementById('difficulty-btn');

function renderStats() {
    const played = stats.wins + stats.losses;
    statsLine.textContent = played === 0
        ? 'Win battles to build your streak'
        : `Wins ${stats.wins} · Losses ${stats.losses} · Streak ${stats.streak} (best ${stats.best})`;
}

function renderDifficulty() {
    difficultyBtn.textContent = `Difficulty: ${difficulty === 'hard' ? 'Hard' : 'Normal'}`;
    difficultyBtn.setAttribute('aria-pressed', String(difficulty === 'hard'));
    difficultyBtn.title = difficulty === 'hard'
        ? 'The enemy picks the alliance that counters yours'
        : 'The enemy picks a random alliance';
}

difficultyBtn.addEventListener('click', () => {
    difficulty = difficulty === 'hard' ? 'normal' : 'hard';
    writeStore(STORE_KEYS.difficulty, difficulty);
    renderDifficulty();
});

function showStartScreen() {
    resetDraftingUI();
    document.getElementById('main-title').classList.remove('hidden');
    startScreen.classList.remove('hidden');
    battlePhase.classList.add('hidden');
    renderStats();
}

document.getElementById('btn-back-nav').addEventListener('click', showStartScreen);

claimBtn.addEventListener('click', () => {
    document.getElementById('main-title').classList.add('hidden');
    startScreen.classList.add('hidden');
    battlePhase.classList.remove('hidden');
    Sound.startMusic(); // the theme begins when the player joins the war
    initWarHall();
});

renderStats();
renderDifficulty();

// --- Info panel (rules & prices) ---
// Mouse: shows on hover, a click pins it open. Touch/keyboard: tap or Enter toggles.
const infoBtn = document.getElementById('settings-icon');
const infoModal = document.getElementById('info-modal');
let infoPinned = false;

function setInfoOpen(open) {
    infoModal.classList.toggle('hidden', !open);
    infoBtn.setAttribute('aria-expanded', String(open));
}

infoBtn.addEventListener('mouseenter', () => { if (matchMedia('(hover: hover)').matches) setInfoOpen(true); });
infoBtn.addEventListener('mouseleave', () => { if (!infoPinned) setInfoOpen(false); });
infoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    infoPinned = !infoPinned;
    setInfoOpen(infoPinned);
});
document.addEventListener('click', (e) => {
    if (!infoModal.contains(e.target)) { infoPinned = false; setInfoOpen(false); }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { infoPinned = false; setInfoOpen(false); }
});

document.getElementById('sound-icon').addEventListener('click', Sound.toggleMute);

// --- Screen 2: War Hall Drafting ---
function initWarHall() {
    resetDraftingUI();
    playerGold = STARTING_GOLD;
    enemyGold = STARTING_GOLD;
    playerRoster = [];
    enemyRoster = [];
    enemyGoldDisplay.innerText = '???'; // hidden until the enemy reveals its army
    enemyRosterContainer.innerHTML = '';
    battleLog.innerText = 'Pick 3 houses. Tap a sigil in your alliance to remove it.';
    updateGoldDisplay();
    renderDraftingBoard();
}

function renderDraftingBoard() {
    draftOptionsContainer.innerHTML = '';
    const isFull = playerRoster.length >= ARMY_SIZE;
    HOUSES_DATA.forEach(h => {
        const isPicked = playerRoster.some(r => r.id === h.id);
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'draft-card' + (isPicked ? ' picked' : '') + (isFull && !isPicked ? ' disabled' : '');
        card.disabled = isPicked || isFull;
        card.title = h.desc;
        card.setAttribute('aria-label',
            `${h.name}, ${ROLE_NAMES[h.role]} tier ${h.tier}, ${h.cost} gold. ${h.desc}` + (isPicked ? ' Picked.' : ''));
        card.innerHTML = `
            ${crestHTML(h)}
            <span class="draft-name">${h.name}</span>
            <span class="draft-meta"><span class="draft-role">${ROLE_NAMES[h.role]} T${h.tier}</span> <span class="draft-cost">${h.cost}G</span></span>
        `;
        card.addEventListener('click', () => draftHouse(h));
        draftOptionsContainer.appendChild(card);
    });
    renderPlayerRoster();
    updateBattleButton();
}

function renderPlayerRoster() {
    playerRosterContainer.innerHTML = '';
    playerRoster.forEach((house, index) => {
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'roster-slot';
        slot.title = battleLocked ? house.name : `Remove ${house.name}`;
        slot.setAttribute('aria-label', battleLocked ? house.name : `Remove ${house.name}`);
        slot.disabled = battleLocked;
        slot.innerHTML = crestHTML(house);
        slot.addEventListener('click', () => removeHouse(index));
        playerRosterContainer.appendChild(slot);
    });
}

function renderEnemyRoster() {
    enemyRosterContainer.innerHTML = '';
    enemyRoster.forEach(house => {
        const slot = document.createElement('div');
        slot.className = 'roster-slot';
        slot.title = house.name;
        slot.innerHTML = crestHTML(house);
        enemyRosterContainer.appendChild(slot);
    });
}

function updateGoldDisplay() {
    playerGoldDisplay.innerText = playerGold;
    playerGoldDisplay.classList.toggle('over-budget', playerGold < 0);
}

// PREPARE FOR WAR is shown while drafting and explains what is missing
function updateBattleButton() {
    if (battleLocked) return;
    btnBattle.classList.remove('hidden');
    if (playerRoster.length < ARMY_SIZE) {
        btnBattle.disabled = true;
        btnBattle.textContent = `Pick ${ARMY_SIZE} houses (${playerRoster.length}/${ARMY_SIZE})`;
    } else if (playerGold < 0) {
        btnBattle.disabled = true;
        btnBattle.textContent = 'Over budget';
    } else {
        btnBattle.disabled = false;
        btnBattle.textContent = 'Prepare for war';
    }
}

// --- Navigation Flow ---
function resetDraftingUI() {
    // Leaving mid-fight: stop the fight's pending steps so they can't change the next game
    battleTimers.forEach(clearTimeout);
    battleTimers = [];
    battleLocked = false;
    document.getElementById('blood-splatter').classList.remove('splatter-active');
    Sound.fightEnd(); // bring the music back up if a fight was cut short

    titleDisplay.innerHTML = 'MAKE YOUR ARMY';
    draftOptionsContainer.classList.remove('draft-hidden');
    btnBattle.classList.add('hidden');
    btnBattle.disabled = false;
    btnFight.disabled = false;
    document.getElementById('btn-surrender').disabled = false;
    document.getElementById('action-buttons-container').classList.add('hidden');
    document.getElementById('inline-result').classList.add('hidden');
    document.getElementById('player-health-container').classList.add('hidden');
    document.getElementById('enemy-health-container').classList.add('hidden');
    document.getElementById('player-health-bar').style.width = '100%';
    document.getElementById('enemy-health-bar').style.width = '100%';
    playerCodeword.classList.add('hidden');
    enemyCodeword.classList.add('hidden');
}

document.getElementById('btn-home-inline').addEventListener('click', showStartScreen);
document.getElementById('btn-restart-inline').addEventListener('click', initWarHall);
