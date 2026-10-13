import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const script = fs.readFileSync('dist/assets/6006-locale.js', 'utf8');
const storage = initial => {
  const values = new Map(Object.entries(initial || {}));
  return {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
};
function boot(languages, legacy = 'de', session = {}, blocked = false) {
  const unavailable = {getItem() {throw Error('Storage unavailable');}, setItem() {throw Error('Storage unavailable');}};
  const context = {
    window: {}, document: {documentElement: {lang: 'de'}},
    navigator: {languages, language: languages[0]},
    localStorage: blocked ? unavailable : storage({'6006-language': legacy}),
    sessionStorage: blocked ? unavailable : storage(session)
  };
  vm.runInNewContext(script, context);
  return context;
}

for (const [languages, old, expected] of [
  [['tr-TR'], 'de', 'tr'], [['de-DE'], 'tr', 'de'], [['en-GB'], 'tr', 'en'],
  [['fr-FR', 'en-GB'], 'tr', 'en'], [['fr-FR'], 'tr', 'de'], [['TR_tr'], 'de', 'tr']
]) {
  const context = boot(languages, old);
  assert.equal(context.window.Locale6006.getLanguage(), expected);
  assert.equal(context.document.documentElement.lang, expected);
  assert.equal(context.localStorage.getItem('6006-language'), expected);
}
const manual = boot(['tr-TR'], 'de');
assert.equal(manual.window.Locale6006.setLanguage('en'), true);
assert.equal(manual.document.documentElement.lang, 'en');
const preference = manual.sessionStorage.getItem('6006-language-session-v1');
assert.equal(boot(['tr-TR'], 'de', {'6006-language-session-v1': preference}).window.Locale6006.getLanguage(), 'en');
assert.equal(boot(['de-DE'], 'tr', {'6006-language-session-v1': preference}).window.Locale6006.getLanguage(), 'de');
assert.equal(manual.window.Locale6006.setLanguage('invalid'), false);
assert.equal(manual.window.Locale6006.getLanguage(), 'en');
assert.equal(boot(['tr-TR'], 'de', {}, true).window.Locale6006.getLanguage(), 'tr');
assert.equal(boot(['tr-TR'], 'de', {'6006-language-session-v1': '{bad json'}).window.Locale6006.getLanguage(), 'tr');
console.log('PASS: phone language beats legacy preferences; manual tab choice, device changes and blocked storage work');
