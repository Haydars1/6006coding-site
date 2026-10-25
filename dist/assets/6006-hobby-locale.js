(() => {
  const supported = ['de', 'tr', 'en'];
  const lang = (navigator.languages || [navigator.language || 'de'])
    .map((value) => String(value).toLowerCase().split(/[-_]/)[0])
    .find((value) => supported.includes(value)) || 'de';
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-de]').forEach((element) => {
    element.textContent = element.dataset[lang] || element.dataset.de;
  });
  const title = { de: '6006 Coding | Privates Fahrzeugtechnik-Hobby', tr: '6006 Coding | Kişisel araç teknolojisi hobisi', en: '6006 Coding | Personal vehicle technology hobby' };
  const description = {
    de: 'Ein persönliches, nicht kommerzielles Hobbyprojekt rund um Fahrzeugtechnik und Codierung.',
    tr: 'Araç teknolojisi ve kodlama üzerine kişisel, ticari olmayan bir hobi projesi.',
    en: 'A personal, non-commercial hobby project about vehicle technology and coding.'
  };
  document.title = title[lang];
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = description[lang];
})();