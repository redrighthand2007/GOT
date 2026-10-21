// --- Drafting ---
function draftHouse(house) {
    if (battleLocked || playerRoster.length >= ARMY_SIZE) return;
    playerRoster.push(house);
    playerGold -= house.cost;
    updateGoldDisplay();
    renderDraftingBoard();
}

function removeHouse(index) {
    if (battleLocked) return; // army is locked once the battle starts
    const [house] = playerRoster.splice(index, 1);
    playerGold += house.cost;
    updateGoldDisplay();
    renderDraftingBoard();
}

// --- Battle math ---
function calculatePower(roster) {
    return roster.reduce((sum, h) => sum + h.power, 0);
}

// Net type edge of `army` over `foe`: +TYPE_EDGE for every house-vs-house
// matchup it wins (Attack > Mix > Defense > Attack), -TYPE_EDGE for every one it loses
function typeEdge(army, foe) {
    let edge = 0;
    army.forEach(a => foe.forEach(f => {
        if (BEATS[a.role] === f.role) edge += TYPE_EDGE;
        else if (BEATS[f.role] === a.role) edge -= TYPE_EDGE;
    }));
    return edge;
}

function strength(army, foe) {
    return calculatePower(army) * (1 + typeEdge(army, foe));
}

// --- Enemy AI ---
// Normal: a random standard alliance. Hard: the one that counters the player best.
function generateEnemyRoster() {
    const combos = ENEMY_COMBOS.map(c => c.ids.map(id => HOUSES_DATA.find(h => h.id === id)));
    let chosen;
    if (difficulty === 'hard') {
        chosen = combos.reduce((best, c) =>
            strength(c, playerRoster) - strength(playerRoster, c) >
            strength(best, playerRoster) - strength(playerRoster, best) ? c : best);
    } else {
        chosen = combos[Math.floor(Math.random() * combos.length)];
    }
    enemyRoster = chosen;
    enemyGold = STARTING_GOLD - chosen.reduce((sum, h) => sum + h.cost, 0);
}

function formatEdge(edge) {
    const pct = Math.round(edge * 100);
    return (pct > 0 ? '+' : '') + pct + '%';
}

// --- Battle Resolution ---
btnBattle.addEventListener('click', () => {
    if (playerRoster.length < ARMY_SIZE || playerGold < 0) return;
    battleLocked = true;
    btnBattle.classList.add('hidden');
    titleDisplay.innerHTML = '';
    draftOptionsContainer.classList.add('draft-hidden');
    renderPlayerRoster(); // slots become read-only

    generateEnemyRoster();
    renderEnemyRoster();
    enemyGoldDisplay.innerText = enemyGold;
    Sound.playSword();

    playerCodeword.innerText = armyNames(playerRoster);
    enemyCodeword.innerText = armyNames(enemyRoster);
    playerCodeword.classList.remove('hidden');
    enemyCodeword.classList.remove('hidden');

    battleLog.innerText = `Type edge: you ${formatEdge(typeEdge(playerRoster, enemyRoster))} · enemy ${formatEdge(typeEdge(enemyRoster, playerRoster))}`;
    document.getElementById('action-buttons-container').classList.remove('hidden');
});

// Surrendering after the enemy is revealed counts as a loss
document.getElementById('btn-surrender').addEventListener('click', () => {
    if (battleLocked) recordResult(false);
    showStartScreen();
});

btnFight.addEventListener('click', () => {
    btnFight.disabled = true;
    document.getElementById('btn-surrender').disabled = true;
    Sound.fightStart(); // music dips so the clashes stand out

    // Luck: each side rolls between 0.85x and 1.15x
    const pFinal = strength(playerRoster, enemyRoster) * (Math.random() * 0.3 + 0.85);
    const eFinal = strength(enemyRoster, playerRoster) * (Math.random() * 0.3 + 0.85);
    const playerWon = pFinal > eFinal;
    // Saved now, so leaving mid-fight can't dodge a loss
    recordResult(playerWon);

    document.getElementById('player-health-container').classList.remove('hidden');
    document.getElementById('enemy-health-container').classList.remove('hidden');
    const pBar = document.getElementById('player-health-bar');
    const eBar = document.getElementById('enemy-health-bar');

    const rounds = [
        { at: 400,  winner: '75%', loser: '60%' },
        { at: 1100, winner: '45%', loser: '25%' },
        { at: 1800, winner: '15%', loser: '0%' }
    ];
    rounds.forEach(r => battleTimers.push(setTimeout(() => {
        Sound.playSword();
        pBar.style.width = playerWon ? r.winner : r.loser;
        eBar.style.width = playerWon ? r.loser : r.winner;
    }, r.at)));

    battleTimers.push(setTimeout(() => {
        battleTimers = [];
        endGameInline(playerWon, pFinal, eFinal);
    }, 2600));
});

function recordResult(playerWon) {
    if (playerWon) {
        stats.wins++;
        stats.streak++;
        stats.best = Math.max(stats.best, stats.streak);
    } else {
        stats.losses++;
        stats.streak = 0;
    }
    writeStore(STORE_KEYS.stats, stats);
}

function endGameInline(playerWon, pFinal, eFinal) {
    // Music rises again once the victory/defeat horn has sounded
    battleTimers.push(setTimeout(Sound.fightEnd, 2500));
    document.getElementById('action-buttons-container').classList.add('hidden');
    document.getElementById('btn-surrender').disabled = false;
    document.getElementById('inline-result').classList.remove('hidden');

    battleLog.innerText = `Strength ${pFinal.toFixed(1)} vs ${eFinal.toFixed(1)} · Streak ${stats.streak}`;
    if (playerWon) {
        Sound.victory();
        titleDisplay.innerHTML = "<span class='result-banner victory'>VICTORY</span>";
    } else {
        flashBlood();
        Sound.defeat();
        titleDisplay.innerHTML = "<span class='result-banner defeat'>DEFEAT</span>";
    }
}

function flashBlood() {
    const bloodSplatter = document.getElementById('blood-splatter');
    bloodSplatter.classList.add('splatter-active');
    battleTimers.push(setTimeout(() => bloodSplatter.classList.remove('splatter-active'), 500));
}
