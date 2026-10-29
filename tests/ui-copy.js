// ui-copy.js: collects the app's own Korean copy for tests/ui-strings.test.js (see there).
// collect() -> Map(uiKey -> first source file that needs it). Not a test file itself.
const fs = require('fs');
const path = require('path');

global.window = global.window || {};
require('../lessons.js');
const GT = require('../js/gloss-text.js');
const STRATEGIES = require('../js/strategies.js');

const ROOT = path.join(__dirname, '..');
const SYLLABLE = /[가-힣]/;
const READ_ATTR = /\b(?:aria-label|title|placeholder|alt)="([^"]*)"?/g;
const REGEX_AFTER = /[(,=:[!&|?{};+\-*%<>~^]$/;
const REGEX_WORDS = /\b(?:return|typeof|case|in|of|delete|void|throw|new)$/;

// String literal values of a JS source, in order (comments and regex literals skipped;
// a template literal gives one value per static fragment).
function jsStrings(src) {
  const out = [];
  let i = 0;
  let before = '';
  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { const j = src.indexOf('\n', i); i = j < 0 ? src.length : j; continue; }
    if (c === '/' && d === '*') { const j = src.indexOf('*/', i + 2); i = j < 0 ? src.length : j + 2; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      let j = i + 1;
      let s = '';
      while (j < src.length && src[j] !== c) {
        if (src[j] === '\\') { s += src[j + 1]; j += 2; continue; }
        if (c === '`' && src[j] === '$' && src[j + 1] === '{') {
          out.push(s);
          s = '';
          let depth = 1;
          j += 2;
          while (j < src.length && depth) { depth += src[j] === '{' ? 1 : src[j] === '}' ? -1 : 0; j += 1; }
          continue;
        }
        s += src[j];
        j += 1;
      }
      out.push(s);
      i = j + 1;
      before = 'x';
      continue;
    }
    const isRegex = c === '/' && (REGEX_AFTER.test(before.trim().slice(-1)) || before.trim() === '' ||
      REGEX_WORDS.test(before.trim()));
    if (isRegex) {
      let j = i + 1;
      let inClass = false;
      while (j < src.length && (inClass || src[j] !== '/') && src[j] !== '\n') {
        if (src[j] === '\\') j += 1;
        else if (src[j] === '[') inClass = true;
        else if (src[j] === ']') inClass = false;
        j += 1;
      }
      i = j + 1;
      before = 'x';
      continue;
    }
    before = (before + c).replace(/\s+/g, ' ').slice(-12);
    i += 1;
  }
  return out;
}

// Korean pieces of one literal or one HTML text run.
function piecesOf(text) {
  const out = [];
  let m;
  READ_ATTR.lastIndex = 0;
  while ((m = READ_ATTR.exec(text))) out.push(m[1]);
  const bare = text
    .replace(/<[^>]*>/g, '\n')      // whole tags (their read attributes are taken above)
    .replace(/<[^>]*$/, '\n')       // a tag still open at the end of the literal
    .replace(/^[^<]*?>/, '\n');     // the tail of a tag opened in an earlier literal
  return out.concat(bare.split(/["\n]/));
}

function htmlPieces(src) {
  const body = src.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const out = [];
  let m;
  READ_ATTR.lastIndex = 0;
  while ((m = READ_ATTR.exec(body))) out.push(m[1]);
  return out.concat(body.replace(/<[^>]*>/g, '\n').split('\n'));
}

function list(dir) {
  return fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.js')).map(f => dir + '/' + f);
}

// js/util.js is in the list for the date line (formatDateKr: 년 월 일 and the weekdays).
const CODE = ['js/app.js', 'js/util.js', ...list('js/screens'), ...list('js/render'), 'js/strategies.js', 'js/deck-cards.js'];

function collect() {
  const need = new Map(); // uiKey -> first source that needs it
  const add = (piece, source) => {
    if (!SYLLABLE.test(piece)) return;
    const key = GT.uiKey(piece);
    if (SYLLABLE.test(key) && !need.has(key)) need.set(key, source);
  };
  htmlPieces(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8')).forEach(p => add(p, 'index.html'));
  CODE.forEach(file => {
    if (file === 'js/strategies.js') return; // structured below: titles and signal words only
    jsStrings(fs.readFileSync(path.join(ROOT, file), 'utf8')).forEach(s => piecesOf(s).forEach(p => add(p, file)));
  });
  Object.values(STRATEGIES).forEach(s => [s.title, ...(s.signals || [])].forEach(t => add(t, 'js/strategies.js')));
  const data = global.window.TOPIK2;
  data.sections.forEach(s => add(String(s.label).replace(/^\[[^\]]*\]\s*/, ''), 'lessons.js sections'));
  Object.values(data.lessons).forEach(l => add((l.groupInstruction || {}).kr || '', 'lessons.js groupInstruction'));
  return need;
}

module.exports = { collect, jsStrings, piecesOf, SYLLABLE };

