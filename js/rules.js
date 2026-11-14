// --- Game rules ---
// Pure data and maths only (no page elements), so tests/index.html can check them on their own.

const STARTING_GOLD = 999;
const ARMY_SIZE = 3;
const TYPE_EDGE = 0.05; // +/-5% strength for each house-vs-house type matchup
const LUCK_MIN = 0.85;  // each side's strength is multiplied by a roll in [LUCK_MIN, LUCK_MAX)
const LUCK_MAX = 1.15;

const ROLE_NAMES = { A: 'Attack', D: 'Defense', M: 'Mix' };
// Attack beats Mix, Mix beats Defense, Defense beats Attack
const BEATS = { A: 'M', M: 'D', D: 'A' };

// Emblems are drawn in CSS (.crest) from these colours and symbols, so no
// image files are needed and every house looks consistent
const HOUSES_DATA = [
    { id: "targ",  name: "Targaryen Dragons",  role: "A", tier: 1, cost: 500, power: 3, emblem: "🐉", colors: ["#b3121b", "#1a0204"], desc: "Dragonriders whose fire breaks any line." },
    { id: "doth",  name: "Dothraki Riders",    role: "A", tier: 2, cost: 300, power: 2, emblem: "🐎", colors: ["#9a6430", "#2b1a0c"], desc: "Horselords who strike fast across open ground." },
    { id: "dorn",  name: "Dornish Spears",     role: "A", tier: 3, cost: 150, power: 1, emblem: "☀️", colors: ["#d9822b", "#4a2208"], desc: "Desert spearmen, patient and deadly." },

    { id: "unsu",  name: "Unsullied",          role: "D", tier: 1, cost: 450, power: 3, emblem: "🛡️", colors: ["#7a6a55", "#1c1814"], desc: "Disciplined shield walls that never break." },
    { id: "night", name: "Night's Watch",      role: "D", tier: 2, cost: 280, power: 2, emblem: "❄️", colors: ["#3a3f52", "#05060a"], desc: "Sworn brothers who hold the frozen north." },
    { id: "rive",  name: "Riverlands Levies",  role: "D", tier: 3, cost: 130, power: 1, emblem: "🐟", colors: ["#2a5d8f", "#5a1a1a"], desc: "River folk, stubborn behind their fords." },

    { id: "storm", name: "Stormlanders",       role: "M", tier: 1, cost: 450, power: 3, emblem: "🦌", colors: ["#c9a227", "#1a1406"], desc: "Storm knights, strong in any kind of battle." },
    { id: "iron",  name: "Iron Fleet",         role: "M", tier: 2, cost: 280, power: 2, emblem: "🐙", colors: ["#a08a2a", "#0a0a0a"], desc: "Reavers who strike from the sea and vanish." },
    { id: "vale",  name: "Knights of the Vale", role: "M", tier: 3, cost: 150, power: 1, emblem: "🦅", colors: ["#7fa7c9", "#1a2a3a"], desc: "Mountain knights who charge from above." }
];

// The enemy always fields one of these (listed in the info panel)
const ENEMY_COMBOS = [
    { name: "Pure Attack",  ids: ["targ", "doth", "dorn"] },
    { name: "Pure Defense", ids: ["unsu", "night", "rive"] },
    { name: "Pure Mix",     ids: ["storm", "iron", "vale"] }
];

function houseById(id) {
    return HOUSES_DATA.find(h => h.id === id);
}

function armyCost(army) {
    return army.reduce((sum, h) => sum + h.cost, 0);
}

function calculatePower(army) {
    return army.reduce((sum, h) => sum + h.power, 0);
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

function luckRoll(random = Math.random) {
    return LUCK_MIN + random() * (LUCK_MAX - LUCK_MIN);
}

// Normal: a random standard alliance. Hard: the one that counters the player best.
function pickEnemyArmy(difficulty, playerArmy, random = Math.random) {
    const combos = ENEMY_COMBOS.map(c => c.ids.map(houseById));
    if (difficulty !== 'hard') return combos[Math.floor(random() * combos.length)];
    const margin = c => strength(c, playerArmy) - strength(playerArmy, c);
    return combos.reduce((best, c) => (margin(c) > margin(best) ? c : best));
}
