// Bumps the ?v=N cache-busting number on every CSS/JS link in index.html,
// so browsers load fresh files after a deploy instead of old cached copies.
// Usage (from the project folder):  node tools/bump-version.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const file = new URL('../index.html', import.meta.url);
const html = readFileSync(file, 'utf8');
const versions = [...html.matchAll(/\?v=(\d+)/g)].map(m => Number(m[1]));
if (versions.length === 0) {
    console.error('No ?v=N links found in index.html');
    process.exit(1);
}
const next = Math.max(...versions) + 1;
writeFileSync(file, html.replace(/\?v=\d+/g, `?v=${next}`));
console.log(`index.html: ${versions.length} links now use ?v=${next}`);
