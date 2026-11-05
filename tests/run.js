// Minimal test runner: requires every tests/*.test.js, prints PASS/FAIL, exits 1 on any failure.
// A test file that does module.exports = <promise> (async checks) is awaited before it counts as passed.
const fs = require('fs');
const path = require('path');

async function main() {
  const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js')).sort();
  let failed = 0;
  for (const f of files) {
    try {
      const done = require(path.join(__dirname, f));
      if (done && typeof done.then === 'function') await done;
      console.log('PASS ' + f);
    } catch (e) {
      failed += 1;
      console.log('FAIL ' + f + ': ' + (e && e.message ? e.message : e));
    }
  }
  if (!files.length) console.log('no tests found');
  process.exit(failed ? 1 : 0);
}

main();
