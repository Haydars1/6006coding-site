(() => {
  const supported = ['de', 'tr', 'en'];
  const lang = (navigator.languages || [navigator.language || 'de'])
    .map((value) => String(value).toLowerCase().split(/[-_]/)[0])
    .find((value) => supported.includes(value)) || 'de';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-de]').forEach((element) => {
    element.textContent = element.dataset[lang] || element.dataset.de;
  });
  const title = { de: '6006 Coding | Fahrzeugtechnik & Codierung', tr: '6006 Coding | Araç teknolojisi ve kodlama', en: '6006 Coding | Vehicle technology & coding' };
  const description = {
    de: 'Fahrzeugtechnik und Codierung.',
    tr: 'Araç teknolojisi ve kodlama.',
    en: 'Vehicle technology and coding.'
  };
  document.title = title[lang];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = description[lang];
})();