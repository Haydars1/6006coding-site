(function (global) {
  'use strict';
  const words = {
    de: { title: 'Praktische Diagnose und Reparatur', note: 'Allgemeiner OBD-Prüfweg. Die Herstellerdefinition, den Untercode und die gewählte Fahrzeugvariante oben zuerst abgleichen.', symptoms: 'Symptome', checks: 'So wird geprüft', repair: 'Befund und Lösung', verify: 'Nach der Reparatur', findings: 'Was der Befund bedeutet', action: 'Nächster Schritt / Reparatur', repairs: 'Bestätigte Ursache beheben', sources: 'Technische Quellen', scope: 'Die Quellen erklären die Systemfunktion und Diagnoseprinzipien. Pinbelegung, Grenzwerte, Anzugsdrehmomente und Freigabebedingungen stammen aus der passenden Herstelleranweisung.', safety: 'Wann die Prüfung unterbrochen wird', related: 'Verwandte Codes', vehicle: 'Gewähltes Fahrzeug', choose: 'Fahrzeug auswählen', updated: 'Stand: 13.10.2026', all: 'Alle Fehlercodes', guides: 'Diagnoseanleitungen', stage: 'Fahrzeugkatalog', footer: '6006 Performance · Fahrzeugdiagnose und Reparaturwissen', intro: 'Bedeutung und konkreter Prüfweg', load: 'Prüfanleitung wird geladen…', retry: 'Prüfanleitung konnte nicht geladen werden. Seite erneut laden.', generic: 'Allgemeiner Prüfweg; keine fahrzeugspezifische Teilefreigabe.' },
    tr: { title: 'Uygulamalı teşhis ve onarım', note: 'Genel OBD kontrol yolu. Önce yukarıdaki üretici tanımı, alt kod ve seçilen araç varyantıyla eşleştir.', symptoms: 'Belirtiler', checks: 'Nasıl kontrol edilir?', repair: 'Bulgu ve çözüm', verify: 'Onarım sonrası', findings: 'Bulgular ne anlama gelir?', action: 'Sonraki kontrol / onarım', repairs: 'Doğrulanan nedeni giderme', sources: 'Teknik kaynaklar', scope: 'Kaynaklar sistemin işleyişini ve teşhis yöntemini açıklar. Pin bilgisi, sınır değer, sıkma torku ve işlem koşulları ilgili aracın üretici talimatından alınır.', safety: 'Kontrol ne zaman durdurulur?', related: 'İlgili kodlar', vehicle: 'Seçilen araç', choose: 'Aracını seç', updated: 'Güncelleme: 13.10.2026', all: 'Tüm arıza kodları', guides: 'Teşhis rehberleri', stage: 'Araç kataloğu', footer: '6006 Performance · Araç teşhis ve onarım bilgisi', intro: 'Anlamı ve uygulanabilir kontrol yolu', load: 'Kontrol rehberi yükleniyor…', retry: 'Kontrol rehberi yüklenemedi. Sayfayı yeniden yükle.', generic: 'Genel kontrol yolu; araca özel parça uygunluk onayı değildir.' },
    en: { title: 'Practical diagnosis and repair', note: 'General OBD test path. First match the manufacturer definition, subcode and selected vehicle variant above.', symptoms: 'Symptoms', checks: 'How to test', repair: 'Findings and fixes', verify: 'After repair', findings: 'What the finding means', action: 'Next test / repair', repairs: 'Fix the confirmed cause', sources: 'Technical sources', scope: 'Sources explain system operation and diagnostic principles. Pin assignments, limits, tightening torques and enabling conditions require the matching manufacturer procedure.', safety: 'When to stop testing', related: 'Related codes', vehicle: 'Selected vehicle', choose: 'Choose your vehicle', updated: 'Updated: 13 October 2026', all: 'All fault codes', guides: 'Diagnostic guides', stage: 'Vehicle catalogue', footer: '6006 Performance · Vehicle diagnosis and repair information', intro: 'Meaning and practical test path', load: 'Loading the diagnostic guide…', retry: 'Could not load the guide. Reload this page.', generic: 'General test path; not a vehicle-specific parts approval.' }
  };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const language = value => Object.hasOwn(words, value) ? value : 'de';
  const localized = (value, locale) => value?.[locale] ?? value?.de;
  const list = (values, ordered = false) => `<${ordered ? 'ol' : 'ul'}>${(values || []).map(value => `<li>${esc(value)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;
  function render(data, code, requestedLanguage, standalone = false) {
    const entry = data?.codes?.[code];
    if (!entry || !data.families?.[entry.family]) return '';
    const locale = language(requestedLanguage), w = words[locale], family = data.families[entry.family];
    const uid = `playbook-${code.toLowerCase()}`;
    const tabs = ['symptoms', 'checks', 'repair', 'verify'];
    const imageFamily = { dpf_sensor: 'dpf', dpf_load: 'dpf', agr: 'egr', scr_supply: 'adblue', nox: 'adblue', turbo: 'turbo' }[entry.family];
    const imageNote = { de: 'Symbolische Bauteildarstellung; Einbauort und Ausführung sind fahrzeugabhängig.', tr: 'Temsili parça görseli; yerleşim ve parça tipi araca göre değişir.', en: 'Illustrative component rendering; placement and part design vary by vehicle.' }[locale];
    const illustration = standalone && imageFamily ? `<figure class="playbook-illustration"><img src="/assets/realparts/${imageFamily}.webp" alt="${esc(localized(family.title, locale))}" loading="lazy" decoding="async"><figcaption>${esc(imageNote)}</figcaption></figure>` : '';
    const navigation = illustration + `<div class="playbook-tabs" role="tablist" aria-label="${esc(w.title)}">${tabs.map((key, index) => `<button type="button" role="tab" id="${uid}-tab-${key}" aria-controls="${uid}-${key}" aria-selected="${index === 1}" tabindex="${index === 1 ? 0 : -1}" data-playbook-tab="${key}">${esc(w[key])}</button>`).join('')}</div>`;
    const panel = (key, body) => `<section class="playbook-panel" id="${uid}-${key}" role="tabpanel" aria-labelledby="${uid}-tab-${key}" tabindex="0" data-playbook-panel="${key}"><h3>${esc(w[key])}</h3>${body}</section>`;
    const branches = `<div class="playbook-findings">${(localized(family.branches, locale) || []).map(branch => `<div class="playbook-finding"><h4>${esc(branch.finding)}</h4><p><strong>${esc(w.action)}:</strong> ${esc(branch.action)}</p></div>`).join('')}</div>`;
    const sources = family.sourceIds.map(id => data.sources.find(source => source.id === id)).filter(Boolean);
    const sourceLinks = sources.map(source => `<li><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)}</a></li>`).join('');
    return `<${standalone ? 'article' : 'section'} class="diagnostic-playbook" data-playbook-code="${esc(code)}" lang="${locale}"><div class="playbook-header"><span class="playbook-kicker">${esc(code)} · ${esc(localized(family.title, locale))}</span><${standalone ? 'h1' : 'h3'}>${standalone ? `${esc(code)}: ${esc(localized(entry.title, locale))}` : esc(w.title)}</${standalone ? 'h1' : 'h3'}><p>${esc(localized(entry.meaning, locale))}</p><p class="playbook-note">${esc(w.note)}</p><p class="playbook-focus">${esc(localized(entry.focus, locale))}</p><div data-playbook-vehicle></div></div>${navigation}${panel('symptoms', list(localized(family.symptoms, locale)))}${panel('checks', list(localized(family.steps, locale), true))}${panel('repair', `<h4>${esc(w.findings)}</h4>${branches}<h4>${esc(w.repairs)}</h4>${list(localized(family.repair, locale))}`)}${panel('verify', list(localized(family.verify, locale), true))}<aside class="playbook-stop"><strong>${esc(w.safety)}</strong><p>${esc(localized(family.stop, locale))}</p></aside><details class="playbook-sources"><summary>${esc(w.sources)}</summary><ul>${sourceLinks}</ul><p>${esc(w.scope)}</p><small>${esc(w.updated)}</small></details><p class="playbook-related">${esc(w.related)}: ${(entry.related || []).map(related => `<a href="/fehlercodes/?code=${encodeURIComponent(related)}">${esc(related)}</a>`).join(' · ')}</p></${standalone ? 'article' : 'section'}>`;
  }
  function report(data, code, requestedLanguage) {
    const entry = data?.codes?.[code], family = entry && data.families?.[entry.family];
    if (!family) return '';
    const locale = language(requestedLanguage), w = words[locale];
    return [w.title, localized(entry.focus, locale), '', w.checks, ...(localized(family.steps, locale) || []).map((step, index) => `${index + 1}. ${step}`), '', w.repair, ...(localized(family.branches, locale) || []).map(branch => `${branch.finding}: ${branch.action}`), '', w.repairs, ...(localized(family.repair, locale) || []).map(step => `• ${step}`), '', w.verify, ...(localized(family.verify, locale) || []).map(step => `• ${step}`), '', w.safety, localized(family.stop, locale), '', w.generic, ...family.sourceIds.map(id => data.sources.find(source => source.id === id)?.url).filter(Boolean)].join('\n');
  }
  const API = { render, report: (code, locale) => report(database, code, locale), reportData: report };
  let database = null;
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  if (!global.document) return;
  global.DiagnosticPlaybooks6006 = API;
  const document = global.document;
  const locale = () => language(global.Locale6006?.getLanguage() || document.documentElement.lang);
  let selected = null, selectedTab = 'checks';
  const articleHost = document.querySelector('[data-diagnostic-article]');
  function readVehicle() {
    try { const value = JSON.parse(global.sessionStorage.getItem('6006-vehicle-choice') || 'null'); return value && typeof value === 'object' ? value : null; } catch (_) { return null; }
  }
  function enhance(root) {
    if (!root) return;
    const vehicle = readVehicle(), vehicleHost = root.querySelector('[data-playbook-vehicle]');
    if (vehicleHost && vehicle?.brand && vehicle?.model) {
      const w = words[locale()], label = document.createElement('p'), link = document.createElement('a');
      label.className = 'playbook-vehicle';
      label.textContent = `${w.vehicle}: ${[vehicle.brand, vehicle.model, vehicle.year, vehicle.engine, vehicle.gearbox].filter(Boolean).join(' · ')}`;
      link.href = '/fahrzeug/'; link.textContent = w.stage; label.append(' · ', link); vehicleHost.append(label);
    }
    const buttons = [...root.querySelectorAll('[data-playbook-tab]')], panels = [...root.querySelectorAll('[data-playbook-panel]')];
    const activate = (key, focus) => {
      selectedTab = key;
      buttons.forEach(button => { const active = button.dataset.playbookTab === key; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; if (active && focus) button.focus(); });
      panels.forEach(panel => panel.hidden = panel.dataset.playbookPanel !== key);
    };
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(button.dataset.playbookTab, false));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft') next = (index + buttons.length - 1) % buttons.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        if (next !== undefined) { event.preventDefault(); activate(buttons[next].dataset.playbookTab, true); }
      });
    });
    activate(selectedTab, false);
  }
  function updateArticleChrome(code) {
    const w = words[locale()], entry = database.codes[code];
    document.querySelectorAll('[data-guide-label]').forEach(node => { node.textContent = w[node.dataset.guideLabel] || node.textContent; });
    document.title = `${code}: ${localized(entry.title, locale())} | 6006 Performance`;
    const description = document.querySelector('meta[name="description"]'); if (description) description.content = localized(entry.meaning, locale());
  }
  function update() {
    if (!database) return;
    if (articleHost) {
      const code = articleHost.dataset.diagnosticArticle;
      articleHost.innerHTML = render(database, code, locale(), true); enhance(articleHost.querySelector('.diagnostic-playbook')); updateArticleChrome(code); return;
    }
    const host = document.getElementById('detay');
    if (!host || !selected) return;
    if (host.querySelector('.code-big')?.textContent !== selected.code) return;
    host.querySelector('.diagnostic-playbook')?.remove();
    const content = render(database, selected.code, locale());
    if (content) {
      // Put the actionable guide directly after the definition, ahead of the
      // illustrative gallery and automatic first-pass diagnostic suggestions.
      const marker = host.querySelector('.real-photo, .dtc-targeted, .u6006-report-actions');
      if (marker) marker.insertAdjacentHTML('beforebegin', content);
      else host.insertAdjacentHTML('beforeend', content);
      enhance(host.querySelector('.diagnostic-playbook'));
    }
  }
  document.addEventListener('6006:dtc-selected', event => { if (selected?.code !== event.detail?.code) selectedTab = 'checks'; selected = event.detail; update(); });
  global.addEventListener('pageshow', update);
  new MutationObserver(update).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  const embedded = document.getElementById('6006-playbook-data');
  if (embedded) { try { database = JSON.parse(embedded.textContent); update(); } catch (_) {} }
  if (!database) fetch('/assets/6006-diagnostic-playbooks.json?v=20261013-guides').then(response => { if (!response.ok) throw new Error('Guide unavailable'); return response.json(); }).then(data => { database = data; if (!selected) { const code = document.querySelector('#detay .code-big')?.textContent; if (code) selected = { code }; } update(); }).catch(() => { /* The original DTC catalogue remains usable without optional playbooks. */ });
})(typeof window !== 'undefined' ? window : globalThis);
