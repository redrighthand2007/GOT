// Tests for js/rules.js. Run by opening tests/index.html in a browser.

const army = (...ids) => ids.map(houseById);
const PURE_ATTACK = army('targ', 'doth', 'dorn');
const PURE_DEFENSE = army('unsu', 'night', 'rive');
const PURE_MIX = army('storm', 'iron', 'vale');

// Every possible 3-house army the player can afford
function affordableArmies() {
    const out = [];
    for (let i = 0; i < HOUSES_DATA.length; i++)
        for (let j = i + 1; j < HOUSES_DATA.length; j++)
            for (let k = j + 1; k < HOUSES_DATA.length; k++) {
                const a = [HOUSES_DATA[i], HOUSES_DATA[j], HOUSES_DATA[k]];
                if (armyCost(a) <= STARTING_GOLD) out.push(a);
            }
    return out;
}

// --- Data ---
test('there are 9 houses with unique ids', () => {
    assertEqual(HOUSES_DATA.length, 9);
    assertEqual(new Set(HOUSES_DATA.map(h => h.id)).size, 9, 'unique ids');
});

test('each type has one house per tier, and power follows tier (3, 2, 1)', () => {
    ['A', 'D', 'M'].forEach(role => {
        const tiers = HOUSES_DATA.filter(h => h.role === role).map(h => h.tier).sort();
        assertEqual(tiers.join(), '1,2,3', `${role} tiers`);
    });
    HOUSES_DATA.forEach(h => assertEqual(h.power, 4 - h.tier, `${h.id} power`));
});

test('every enemy alliance is affordable, has 3 houses and power 6', () => {
    ENEMY_COMBOS.forEach(c => {
        const a = army(...c.ids);
        assertEqual(a.length, ARMY_SIZE, `${c.name} size`);
        assert(a.every(Boolean), `${c.name} uses unknown house ids`);
        assert(armyCost(a) <= STARTING_GOLD, `${c.name} costs ${armyCost(a)}`);
        assertEqual(calculatePower(a), 6, `${c.name} power`);
    });
});

test('enemy alliance prices match the info panel (950 / 860 / 880)', () => {
    assertEqual(armyCost(PURE_ATTACK), 950);
    assertEqual(armyCost(PURE_DEFENSE), 860);
    assertEqual(armyCost(PURE_MIX), 880);
});

test('balance: no affordable army has more power than 6', () => {
    affordableArmies().forEach(a => {
        assert(calculatePower(a) <= 6, `${a.map(h => h.id).join('+')} has power ${calculatePower(a)} for ${armyCost(a)}G`);
    });
});

// --- Type triangle ---
test('each type beats exactly one other type and loses to exactly one', () => {
    const roles = Object.keys(BEATS);
    roles.forEach(r => {
        assert(roles.includes(BEATS[r]), `${r} beats a real type`);
        assert(BEATS[r] !== r, `${r} does not beat itself`);
        assertEqual(roles.filter(o => BEATS[o] === r).length, 1, `${r} has one counter`);
    });
});

test('type edge is opposite for the two sides', () => {
    affordableArmies().forEach(a => [PURE_ATTACK, PURE_DEFENSE, PURE_MIX].forEach(e => {
        assertClose(typeEdge(a, e), -typeEdge(e, a), 'edge symmetry');
    }));
});

test('pure Attack vs pure Mix is +45% (9 winning matchups x 5%)', () => {
    assertClose(typeEdge(PURE_ATTACK, PURE_MIX), 0.45);
    assertClose(typeEdge(PURE_MIX, PURE_ATTACK), -0.45);
});

test('same-type armies have no edge', () => {
    assertClose(typeEdge(PURE_DEFENSE, PURE_DEFENSE), 0);
});

test('a balanced army (one of each type) has no edge against any enemy', () => {
    const balanced = army('targ', 'night', 'vale');
    [PURE_ATTACK, PURE_DEFENSE, PURE_MIX].forEach(e => assertClose(typeEdge(balanced, e), 0));
});

test('strength = power x (1 + type edge)', () => {
    assertClose(strength(PURE_ATTACK, PURE_MIX), 6 * 1.45);
    assertClose(strength(PURE_MIX, PURE_ATTACK), 6 * 0.55);
});

// --- Luck ---
test('luck rolls stay between 0.85 and 1.15', () => {
    assertClose(luckRoll(() => 0), LUCK_MIN);
    assert(luckRoll(() => 0.999999) < LUCK_MAX, 'below max');
    for (let i = 0; i < 1000; i++) {
        const r = luckRoll();
        assert(r >= LUCK_MIN && r < LUCK_MAX, `roll ${r} out of range`);
    }
});

// --- Enemy AI ---
test('Normal difficulty picks the alliance chosen by the random roll', () => {
    assertEqual(pickEnemyArmy('normal', PURE_ATTACK, () => 0)[0].id, 'targ');
    assertEqual(pickEnemyArmy('normal', PURE_ATTACK, () => 0.5)[0].id, 'unsu');
    assertEqual(pickEnemyArmy('normal', PURE_ATTACK, () => 0.99)[0].id, 'storm');
});

test('Hard difficulty counters a pure army with the type that beats it', () => {
    assertEqual(pickEnemyArmy('hard', PURE_ATTACK)[0].role, 'D', 'Defense beats Attack');
    assertEqual(pickEnemyArmy('hard', PURE_DEFENSE)[0].role, 'M', 'Mix beats Defense');
    assertEqual(pickEnemyArmy('hard', PURE_MIX)[0].role, 'A', 'Attack beats Mix');
});

test('Hard difficulty counters a Mix + Defense heavy army with Pure Mix', () => {
    const power7 = army('storm', 'unsu', 'rive');
    assertEqual(calculatePower(power7), 7);
    assertEqual(pickEnemyArmy('hard', power7)[0].role, 'M');
});

test('balance: on Hard, no affordable army is stronger than the enemy before luck', () => {
    affordableArmies().forEach(a => {
        const enemy = pickEnemyArmy('hard', a);
        assert(strength(a, enemy) <= strength(enemy, a) + 1e-9,
            `${a.map(h => h.id).join('+')} beats Hard without luck`);
    });
});

test('balance: on Normal, every affordable army can lose to at least one alliance', () => {
    affordableArmies().forEach(a => {
        const canLose = [PURE_ATTACK, PURE_DEFENSE, PURE_MIX].some(e => strength(a, e) <= strength(e, a));
        assert(canLose, `${a.map(h => h.id).join('+')} beats every alliance`);
    });
});
