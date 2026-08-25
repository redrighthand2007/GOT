const fs = require('fs');
let text = fs.readFileSync('js/combat.js', 'utf8');

text = text.replace(/if \(playerRoster\.length === 0\) \{\s+btnBattle\.style\.opacity = '0\.5';\s+\}/, "if (playerRoster.length === 0) { btnBattle.classList.add('hidden'); }");
text = text.replace(/btnBattle\.style\.opacity = '0\.5';/g, "btnBattle.style.visibility = 'hidden';");
text = text.replace(/btnFight\.classList\.remove\('hidden'\);/g, "document.getElementById('action-buttons-container').classList.remove('hidden');");
text = text.replace(/btnFight\.classList\.add\('hidden'\);/g, "document.getElementById('action-buttons-container').classList.add('hidden');");

// Strip out the old inlineResult.innerHTML injection inside endGameInline
text = text.replace(/inlineResult\.innerHTML = \[\s\S]*?\;/g, "");

fs.writeFileSync('js/combat.js', text);
