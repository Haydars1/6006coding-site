#!/usr/bin/env node
/* Browser regression checks for vehicle software, coding and diagnosis journeys.
 * Run a local server for dist, then:
 * JOURNEY_BASE_URL=http://127.0.0.1:8766 node scripts/verify-journey-browser.cjs
 */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const { chromium } = require('playwright');

const base = (process.env.JOURNEY_BASE_URL || 'http://127.0.0.1:8766').replace(/\/$/, '');
const selectedTests = process.env.JOURNEY_TEST_FILTER ? new RegExp(process.env.JOURNEY_TEST_FILTER, 'i') : null;
const results = [];
const profile = { brand:'Volkswagen', model:'Golf', year:'2016', powertrain:'Diesel', engine:'2.0 TDI CRLB', ps:'150', nm:'340', gearbox:'DSG/DCT' };
let browser;

async function pageFor(locale = 'de-DE', width = 393) {
  const context = await browser.newContext({ locale, viewport:{ width, height:852 }, reducedMotion:'reduce', acceptDownloads:true });
  await context.route(/googlesyndication|googletagmanager|google-analytics|doubleclick/, route => route.fulfill({ status:204, body:'' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  return { context, page, errors };
}
async function finish(env) {
  assert.deepEqual(env.errors, [], 'No uncaught page errors');
  await env.context.close();
}
async function run(name, task) {
  if (selectedTests && !selectedTests.test(name)) return;
  const started = Date.now();
  try { await task(); results.push({name, ok:true, ms:Date.now()-started}); console.log('PASS '+name); }
  catch (error) { results.push({name, ok:false, error:error.stack, ms:Date.now()-started}); console.error('FAIL '+name+'\n'+error.message); }
}
async function finder(page, path = '/fahrzeug/') {
  await page.goto(base + path);
  await page.waitForFunction(() => document.querySelector('#vin6-make option[value="Volkswagen"]'));
}
async function golf(page) {
  await page.selectOption('#vin6-make', {label:'Volkswagen'});
  await page.selectOption('#vin6-model', {label:'Golf'});
  await page.selectOption('#vin6-year', '2016');
  await page.waitForFunction(() => document.querySelector('#vin6-engine')?.options.length > 20);
}
async function stored(page) {
  return page.evaluate(() => JSON.parse(sessionStorage.getItem('6006-vehicle-choice') || 'null'));
}
async function dtcReady(page) {
  await page.waitForFunction(() => /^\d/.test(document.querySelector('#total-defs')?.textContent || '') && document.querySelector('#brand')?.options.length > 5);
}
async function saveProfile(page, value = profile) {
  await page.goto(base + '/');
  await page.evaluate(value => sessionStorage.setItem('6006-vehicle-choice', JSON.stringify(value)), value);
}
async function noOverflow(page) {
  const sizes = await page.evaluate(() => ({viewport:innerWidth, document:document.documentElement.scrollWidth}));
  assert.ok(sizes.document <= sizes.viewport + 1, 'Mobile page exceeds viewport: '+JSON.stringify(sizes));
}
async function search(page, query) {
  await page.fill('#q', query);
  await page.click('#submit');
  await page.waitForFunction(query => document.querySelector('#q')?.value === query && !/\.\.\.|…/.test(document.querySelector('#count')?.textContent || ''), query);
}
async function suggestions(page, query) {
  await page.fill('#q', query);
  await page.focus('#q');
  await page.waitForTimeout(280);
  await page.waitForFunction(() => {
    const box = document.querySelector('#dtc-video-suggest');
    return box && !box.hidden && !/loading|geladen|yükleniyor/i.test(box.textContent);
  });
  return page.locator('#dtc-video-suggest .dtc-video-option').evaluateAll(options => options.map(link => ({code:link.querySelector('strong').textContent, description:link.querySelector('span').textContent, make:link.querySelector('small').textContent, href:link.href})));
}

async function main() {
  browser = await chromium.launch({headless:true, args:['--no-sandbox']});

  await run('Selecting a model without an engine never chooses the first catalogue engine', async () => {
    const env = await pageFor(); const {page} = env;
    await finder(page); await golf(page);
    assert.equal(await page.inputValue('#vin6-engine'), '');
    assert.equal((await stored(page)).engine, '');
    await page.reload();
    await page.waitForFunction(() => document.querySelector('#vin6-engine')?.options.length > 20);
    assert.equal(await page.inputValue('#vin6-engine'), '', 'Reload must preserve an unchosen engine');
    assert.equal(await page.inputValue('#vin6-ps'), '', 'No electric-engine power leaked into an incomplete choice');
    assert.equal((await stored(page)).engine, '');
    await finish(env);
  });

  await run('Exact selected engine, generation, torque and transmission survive a reload', async () => {
    const env = await pageFor(); const {page} = env;
    await finder(page); await golf(page); await page.selectOption('#vin6-fuel', 'Diesel');
    const candidate = await page.locator('#vin6-engine').evaluate(select => [...select.options].find(option => /2\.0L TDI BlueMotion 6AT FWD/.test(option.textContent) && /Golf 5 Doors/.test(option.textContent))?.value);
    assert.ok(candidate, 'Distinct DSG variant is available');
    await page.selectOption('#vin6-engine', candidate);
    const label = await page.locator('#vin6-engine').evaluate(select => select.selectedOptions[0].textContent);
    const choice = await stored(page);
    assert.match(choice.gearbox, /DSG|automatic/i); assert.ok(Number(choice.nm) > 0);
    await page.reload(); await page.waitForFunction(() => document.querySelector('#vin6-engine')?.value !== '');
    assert.equal(await page.locator('#vin6-engine').evaluate(select => select.selectedOptions[0].textContent), label, 'Restore exact variant rather than another generation');
    assert.equal((await stored(page)).gearbox, choice.gearbox);
    assert.equal(await page.inputValue('#vin6-nm'), choice.nm);
    await finish(env);
  });

  await run('A BMW URL does not inherit the remembered Volkswagen engine', async () => {
    const env = await pageFor(); const {page} = env;
    await saveProfile(page);
    await page.goto(base + '/?brand=BMW&model=X3');
    await page.waitForFunction(() => document.querySelector('#brandSelect')?.value === 'BMW' && document.querySelector('#modelSelect')?.value === 'X3');
    assert.equal(await page.inputValue('#engineInput'), '');
    assert.equal(await page.inputValue('#powerInput'), '');
    assert.equal(await page.inputValue('#gearboxSelect'), '');
    assert.doesNotMatch(await page.locator('main').innerText(), /2\.0 TDI CRLB/);
    await finish(env);
  });

  await run('VIN lookup identifies the make without transmitting or storing the complete VIN', async () => {
    const env = await pageFor('tr-TR'); const {page} = env; const requests = [];
    page.on('request', request => requests.push(request.url()));
    await finder(page);
    await page.fill('#vin6-vin', 'WVW'); await page.click('#vin6-decode');
    assert.match(await page.locator('#vin6-feedback').innerText(), /17/);
    await page.fill('#vin6-vin', 'WVWZZZ3CZGE123456'); await page.click('#vin6-decode');
    await page.waitForFunction(() => document.querySelector('#vin6-make')?.value === 'Volkswagen');
    assert.match(await page.locator('#vin6-feedback').innerText(), /Volkswagen/);
    assert.ok(await page.locator('.vin6006-next').isVisible(), 'Explain how to complete model and engine confirmation');
    assert.equal(await page.inputValue('#vin6-model'), '');
    assert.ok(requests.every(url => !url.includes('WVWZZZ3CZGE123456')));
    const storage = await page.evaluate(() => JSON.stringify({session:{...sessionStorage}, local:{...localStorage}}));
    assert.ok(!storage.includes('WVWZZZ3CZGE123456'));
    await noOverflow(page); await finish(env);
  });

  await run('Unavailable public VIN data retains a usable manual vehicle selector', async () => {
    const env = await pageFor(); const {page} = env;
    await env.context.route('**/vpic.nhtsa.dot.gov/**', route => route.fulfill({status:503, body:'temporarily unavailable'}));
    await finder(page); await page.fill('#vin6-vin', 'ZZZ12345678912345'); await page.click('#vin6-decode');
    await page.waitForFunction(() => !document.querySelector('#vin6-decode')?.disabled);
    assert.match(await page.locator('#vin6-feedback').innerText(), /manuell|nicht|kein/i);
    await page.selectOption('#vin6-make', {label:'Volkswagen'});
    await page.selectOption('#vin6-model', {label:'Golf'});
    assert.equal(await page.inputValue('#vin6-model'), 'Golf');
    await finish(env);
  });

  await run('Legacy comparison bookmarks cannot inject an engine or stock power', async () => {
    const env = await pageFor(); const {page} = env; const requests = [];
    page.on('request', request => requests.push(request.url()));
    const params = new URLSearchParams({brand:'Volkswagen',model:'Passat B8',year:'2016',stageRef:'vw-passat-b8-crl-150-ecuperformance'});
    await finder(page, '/fahrzeug/?'+params);
    await page.waitForFunction(() => document.querySelector('#vin6-model')?.value === 'Passat B8');
    assert.equal(await page.inputValue('#vin6-engine'), '');
    assert.equal(await page.inputValue('#vin6-manual'), '');
    assert.equal(await page.inputValue('#vin6-ps'), '');
    assert.equal(await page.inputValue('#vin6-nm'), '');
    const choice = await stored(page);
    assert.ok(!choice || (!choice.engine && !choice.ps && !choice.nm), 'A retired source identifier must not populate the saved vehicle');
    assert.ok(requests.every(url => !/6006-stage1-(?:references|directory|seo|open)/.test(url)), 'Retired reference data and browsers must not be loaded');
    assert.equal(await page.locator('#vin6-ref-source').count(), 0);
    await finish(env);
  });

  await run('Stock vehicle specifications stay separate from software and coding services', async () => {
    const env = await pageFor(); const {page} = env;
    const params = new URLSearchParams({brand:'Volkswagen',model:'Passat B8',year:'2016',powertrain:'Diesel',engine:'2.0 TDI CRLB',ps:'150',nm:'340',stageRef:'vw-passat-b8-crl-150-ecuperformance'});
    await finder(page, '/fahrzeug/?'+params);
    await page.waitForFunction(() => !document.querySelector('#vin6-result')?.hidden);
    const table = await page.locator('#vin6-metrics').innerText();
    for (const value of ['150 PS','340 Nm']) assert.ok(table.includes(value), 'Entered stock reference must show '+value);
    assert.equal(await page.locator('#vin6-result thead th').count(), 2, 'Technical table has specification and stock columns only');
    assert.doesNotMatch(table, /190 PS|420 Nm|\+40|\+80/);
    assert.equal(await page.locator('#vin6-ref-source').count(), 0);
    assert.equal(await page.locator('#vin6-services article').count(), 3);
    const services = await page.locator('#vin6-services').innerText();
    assert.match(services, /Softwarestand/); assert.match(services, /Spiegelanklappen/); assert.match(services, /Fehlercodes/);
    assert.doesNotMatch(await page.locator('#vin6-result').innerText(), /stage[\s-]*1\b|\+\d+\s*(?:PS|Nm)/i);
    assert.equal(await page.locator('#vin6-result a[href*="stage1-referenzen"]').count(), 0);
    const requestURL = new URL(await page.locator('#vin6-quote-whatsapp').getAttribute('href'));
    const request = requestURL.searchParams.get('text');
    assert.match(request, /2\.0 TDI CRLB/); assert.match(request, /Software|Codierung/);
    assert.doesNotMatch(request, /stage[\s-]*1\b|\+40|\+80/i);
    await noOverflow(page);
    await page.fill('#vin6-ps', '151'); await page.locator('#vin6-ps').dispatchEvent('change');
    assert.match(await page.locator('#vin6-metrics').innerText(), /151 PS/);
    assert.doesNotMatch(await page.locator('#vin6-metrics').innerText(), /190 PS|420 Nm/);
    await page.locator('#vin6-stage-link').click();
    await page.waitForURL(url => url.pathname === '/' && url.hash === '#hizmetler');
    assert.ok(await page.locator('#hizmetler').isVisible(), 'The software and coding link opens the real services section');
    await finish(env);
  });

  await run('An unlisted engine still offers useful services without invented power output', async () => {
    const env = await pageFor('en-GB'); const {page} = env;
    await finder(page, '/fahrzeug/?brand=Volkswagen&model=Golf&year=2016&powertrain=Diesel&engine=unknown-custom-engine&ps=147&nm=331');
    await page.waitForFunction(() => !document.querySelector('#vin6-result')?.hidden);
    assert.equal(await page.locator('#vin6-ref-source').count(), 0);
    const table = await page.locator('#vin6-metrics').innerText();
    assert.match(table, /147 PS/); assert.match(table, /331 Nm/);
    assert.doesNotMatch(table, /1[89]\d PS|4[0-9]\d Nm/);
    assert.match(await page.locator('#vin6-provenance').innerText(), /manual|manufacturer/i);
    const services = await page.locator('#vin6-services').innerText();
    assert.match(services, /software version/); assert.match(services, /mirror folding/); assert.match(services, /live measurements/);
    assert.match(await page.locator('#vin6-eligibility').innerText(), /does not confirm/);
    assert.equal(await page.locator('#vin6-result a[href*="stage1-referenzen"]').count(), 0);
    await finish(env);
  });

  for (const [locale, words] of Object.entries({
    'de-DE': {heading:'Motorsoftware & Fahrzeugcodierung', home:/Software.*Codierung|Software.*Fahrzeugcodierung/s, comfort:/Spiegel|Komfort/, credit:/Ausstattungs- und Software-Kompatibilität werden am Fahrzeug geprüft/, data:'Offene Daten', language:'de'},
    'tr-TR': {heading:'Motor yazılımı & araç kodlama', home:/yazılım.*kodlama/is, comfort:/ayna|konfor/i, credit:/Donanım ve yazılım uyumu araç üzerinde doğrulanır/, data:'Açık veri', language:'tr'},
    'en-GB': {heading:'Engine software & vehicle coding', home:/software.*coding/is, comfort:/mirror|comfort/i, credit:/Equipment and software compatibility are checked on the vehicle/, data:'Open data', language:'en'}
  })) {
    await run(words.language+' mobile vehicle services replace public gain calculators', async () => {
      const env = await pageFor(locale, 320); const {page} = env;
      await page.goto(base + '/');
      await page.waitForSelector('#vehicle-service-overview', {state:'attached'});
      assert.equal(await page.locator('html').getAttribute('lang'), words.language);
      const home = await page.locator('#aracin').innerText();
      assert.match(home, words.home);
      assert.match(home, words.comfort);
      assert.match(await page.locator('.vehicle-data-credit').innerText(), words.credit);
      assert.equal(await page.locator('.vehicle-data-credit a[href="/assets/vehicle-data/index.json"]').innerText(), words.data);
      assert.ok(await page.locator('.vehicle-data-credit a[href*="opendatacommons.org/licenses/odbl/"]').isVisible(), 'Source licence attribution remains visible');
      if (words.language !== 'tr') assert.doesNotMatch(await page.locator('.vehicle-data-credit').innerText(), /Araç ve motor referans verileri|Donanım ve yazılım uyumu|Açık veri/, 'Attribution must not retain Turkish copy in another phone language');
      assert.doesNotMatch(home, /stage[\s-]*1\b|\+\d+\s*(?:PS|Nm)/i);
      assert.equal(await page.locator('#psValue,#nmValue,.power-grid,.dyno-chart').count(), 0, 'No power gain display or dyno chart remains');
      assert.equal(await page.locator('a[href*="stage1-referenzen"]').count(), 0);
      await noOverflow(page);
      await finder(page);
      assert.equal(await page.locator('#vin6-heading').innerText(), words.heading);
      assert.equal(await page.locator('#vin6-quote-whatsapp').getAttribute('href'), null, 'An incomplete vehicle cannot send a fabricated request');
      await noOverflow(page); await finish(env);
    });
  }

  await run('Retired comparison bookmark opens vehicle services instead of an old offer', async () => {
    const env = await pageFor(); const {page} = env;
    const response = await env.context.request.get(base + '/stage1-referenzen/');
    const redirect = await response.text();
    assert.match(redirect, /noindex/);
    assert.match(redirect, /location\.replace/);
    assert.doesNotMatch(redirect, /stage[\s-]+1\b|publishedStage1|stage-item/i);
    await page.goto(base + '/stage1-referenzen/');
    await page.waitForURL(url => url.pathname === '/' && url.hash === '#aracin');
    await page.waitForSelector('#vehicle-service-overview', {state:'attached'});
    assert.doesNotMatch(await page.locator('#aracin').innerText(), /stage[\s-]*1\b/i);
    await finish(env);
  });

  await run('Vehicle → diagnostic link carries context into the actual manufacturer filter', async () => {
    const env = await pageFor(); const {page} = env;
    await finder(page); await golf(page); await page.selectOption('#vin6-fuel', 'Diesel');
    await page.fill('#vin6-manual', '2.0 TDI CRLB'); await page.locator('#vin6-manual').dispatchEvent('change');
    const href = await page.locator('#vin6-code-list a').first().getAttribute('href');
    const params = new URL(href, base).searchParams;
    assert.equal(params.get('brand'), 'Volkswagen'); assert.equal(params.get('model'), 'Golf'); assert.equal(params.get('engine'), '2.0 TDI CRLB');
    await page.locator('#vin6-code-list a').first().click(); await dtcReady(page);
    assert.equal(await page.inputValue('#brand'), 'VOLKSWAGEN');
    assert.match(await page.locator('#vehicle-picker-dtc').innerText(), /Volkswagen.*Golf/);
    assert.match(await page.locator('#detay .dtc-report-vehicle').innerText(), /2\.0 TDI CRLB/);
    await finish(env);
  });

  await run('Saved manufacturer is applied implicitly while an explicit URL selection takes priority', async () => {
    const env = await pageFor(); const {page} = env;
    await saveProfile(page); await page.goto(base + '/fehlercodes/?code=P0299'); await dtcReady(page);
    assert.equal(await page.inputValue('#brand'), 'VOLKSWAGEN');
    assert.match(await page.locator('#vehicle-picker-dtc').innerText(), /Volkswagen.*Golf/);
    await page.goto(base + '/fehlercodes/?brand=BMW&code=P0299'); await dtcReady(page);
    assert.equal(await page.inputValue('#brand'), 'BMW');
    assert.match(await page.locator('#vehicle-picker-dtc').innerText(), /BMW/);
    await page.goto(base + '/fehlercodes/?brand=ALL&code=P0299'); await dtcReady(page);
    assert.equal(await page.inputValue('#brand'), 'ALL', 'An explicit all-manufacturer view is respected');
    await finish(env);
  });

  await run('AGR and EGR return the same substantive diagnostic search results', async () => {
    const env = await pageFor(); const {page} = env;
    await page.goto(base + '/fehlercodes/'); await dtcReady(page);
    await search(page, 'AGR'); const agr = {count:await page.locator('#count').innerText(), codes:await page.locator('.codeitem .code-top b').allTextContents()};
    await search(page, 'EGR'); const egr = {count:await page.locator('#count').innerText(), codes:await page.locator('.codeitem .code-top b').allTextContents()};
    assert.deepEqual(agr, egr); assert.ok(agr.codes.length > 10);
    await finish(env);
  });

  await run('Autocomplete honours manufacturer, code family and system filters', async () => {
    const env = await pageFor(); const {page} = env;
    await page.goto(base + '/fehlercodes/?brand=BMW&family=C&category=brake'); await dtcReady(page);
    assert.deepEqual(await suggestions(page, 'P0299'), [], 'A powertrain turbo code is not offered in C/brake filters');
    const rows = await suggestions(page, 'brake');
    assert.ok(rows.length > 0, 'Positive filtered suggestions remain usable');
    rows.forEach(row => {assert.ok(row.code.startsWith('C')); assert.ok(['BMW','OBD-II'].includes(row.make));});
    await page.goto(base + '/fehlercodes/?brand=ALL&family=P&category=dpf'); await dtcReady(page);
    const dpf = await suggestions(page, 'DPF');
    assert.ok(dpf.length > 0);
    dpf.forEach(row => {assert.ok(row.code.startsWith('P')); assert.match(row.description, /particulate|soot|diesel filter|regenerat/i);});
    await finish(env);
  });

  await run('Downloaded diagnostic report includes selected vehicle and actual manufacturer context', async () => {
    const env = await pageFor('en-GB'); const {page} = env;
    await saveProfile(page); await page.goto(base + '/fehlercodes/?code=P2453'); await dtcReady(page);
    await page.waitForSelector('.u6006-report-actions');
    await page.waitForSelector('.diagnostic-playbook[data-playbook-code="P2453"]');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('.u6006-report-actions button').filter({hasText:/Download diagnostic report/}).click();
    const download = await downloadPromise; const text = await fs.readFile(await download.path(), 'utf8');
    assert.match(text, /Volkswagen.*Golf/); assert.match(text, /2\.0 TDI CRLB/); assert.match(text, /VOLKSWAGEN|Volkswagen/); assert.match(text, /P2453/);
    assert.match(text, /Practical diagnosis and repair/); assert.match(text, /https:\/\/(?:www\.)?hella\.com\//);
    await finish(env);
  });

  const tabWords = {
    'de-DE': {language:'de', checks:'So wird geprüft', repair:'Befund und Lösung', sources:'Technische Quellen'},
    'tr-TR': {language:'tr', checks:'Nasıl kontrol edilir?', repair:'Bulgu ve çözüm', sources:'Teknik kaynaklar'},
    'en-GB': {language:'en', checks:'How to test', repair:'Findings and fixes', sources:'Technical sources'}
  };
  for (const [locale, labels] of Object.entries(tabWords)) {
    for (const code of ['P2453','P20E8','P229F']) {
      for (const direct of [false, true]) {
        await run(code+' '+labels.language+' '+(direct?'direct guide':'catalogue')+' has localized, actionable, sourced diagnostic tabs', async () => {
          const env = await pageFor(locale, direct ? 320 : 393); const {page} = env;
          await saveProfile(page);
          await page.goto(base + (direct ? '/fehlercodes/'+code.toLowerCase()+'/' : '/fehlercodes/?code='+code));
          if (!direct) await dtcReady(page);
          const guide = page.locator('.diagnostic-playbook[data-playbook-code="'+code+'"]');
          await guide.waitFor({state:'visible'});
          assert.equal(await page.locator('html').getAttribute('lang'), labels.language);
          assert.equal(await guide.getAttribute('lang'), labels.language);
          assert.equal(await guide.locator('[data-playbook-tab="checks"]').innerText(), labels.checks);
          assert.equal(await guide.locator('[data-playbook-tab="repair"]').innerText(), labels.repair);
          assert.match(await guide.locator('[data-playbook-vehicle]').innerText(), /Volkswagen.*Golf/);
          for (const tab of ['symptoms','checks','repair','verify']) {
            await guide.locator('[data-playbook-tab="'+tab+'"]').click();
            const active = guide.locator('[data-playbook-panel="'+tab+'"]');
            assert.ok(await active.isVisible(), 'Selected '+tab+' panel is visible');
            assert.ok((await active.innerText()).length > 100, 'Panel provides substantive information');
            const other = guide.locator('[data-playbook-panel]:not([data-playbook-panel="'+tab+'"])');
            assert.ok(await other.evaluateAll(panels => panels.every(panel => panel.hidden)), 'Only the active tab panel remains shown');
          }
          assert.ok(await guide.locator('.playbook-finding').count() >= 2, 'Diagnostic findings lead to different next actions');
          await guide.locator('[data-playbook-tab="checks"]').focus();
          await page.keyboard.press('ArrowRight');
          assert.equal(await guide.locator('[data-playbook-tab="repair"]').getAttribute('aria-selected'), 'true');
          assert.equal(await guide.locator('.playbook-sources summary').innerText(), labels.sources);
          const sources = await guide.locator('.playbook-sources a').evaluateAll(links => links.map(link => ({href:link.href, text:link.textContent, rel:link.rel})));
          assert.ok(sources.length > 0);
          sources.forEach(source => { assert.match(source.href, /^https:\/\//); assert.doesNotMatch(source.href, /wa\.me|whatsapp/); assert.ok(source.text.length > 5); assert.ok(source.rel.includes('noopener')); });
          if (direct) {
            assert.match(await page.title(), new RegExp(code));
            assert.ok((await page.title()).includes(await guide.locator('h1').innerText()), 'Search title matches the visible translated guide title');
            assert.ok((await page.locator('meta[name="description"]').getAttribute('content')).length > 35);
          }
          await noOverflow(page); await finish(env);
        });
      }
    }
  }

  await browser.close();
  const failed = results.filter(result => !result.ok);
  console.log(JSON.stringify({base,passed:results.length-failed.length,failed:failed.length,results}, null, 2));
  process.exitCode = failed.length ? 1 : 0;
}
main().catch(error => { console.error(error.stack); process.exitCode=1; if (browser) browser.close(); });
