// cache-bust.test.js: every local CSS and JS URL in index.html carries the same ?v= release stamp,
// and every file it names exists. A browser then never mixes a new index.html with scripts cached
// from an older release (the iPad showed a blank screen once when that happened).
// When you release: change the stamp in every URL at once (same value everywhere).
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');

const urls = [];
let m;
const SCRIPT = /<script\b[^>]*\bsrc="([^"]+)"/g;
while ((m = SCRIPT.exec(html))) urls.push(m[1]);
const STYLE = /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"/g;
while ((m = STYLE.exec(html))) urls.push(m[1]);

const local = urls.filter(u => !/^(https?:)?\/\//.test(u) && !u.startsWith('data:'));
assert.ok(local.length >= 40, 'found the local scripts and styles (' + local.length + ')');

const STAMPED = /^([^?#]+)\?v=([0-9A-Za-z.-]+)$/;
const unstamped = local.filter(u => !STAMPED.test(u));
assert.deepStrictEqual(unstamped, [], 'local URLs without ?v=');

const stamps = [...new Set(local.map(u => STAMPED.exec(u)[2]))];
assert.strictEqual(stamps.length, 1, 'one stamp for every URL, found: ' + stamps.join(', '));
assert.ok(/^\d{8}/.test(stamps[0]), 'the stamp starts with the release date (YYYYMMDD): ' + stamps[0]);

const missing = local.map(u => STAMPED.exec(u)[1]).filter(f => !fs.existsSync(path.join(ROOT, f)));
assert.deepStrictEqual(missing, [], 'files named in index.html that do not exist');

// Every script the app is made of is loaded (a new js/ file must be added to index.html too).
const loaded = new Set(local.map(u => STAMPED.exec(u)[1]));
['js', 'js/screens', 'js/render'].forEach(dir => {
  fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).forEach(f => {
    assert.ok(loaded.has(dir + '/' + f), dir + '/' + f + ' is not loaded by index.html');
  });
});
