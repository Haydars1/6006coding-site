(() => {
  "use strict";
  const supported = ["de", "tr", "en"];
  const sessionKey = "6006-language-session-v1";
  const preferences = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages : [navigator.language || "de"];
  const fingerprint = preferences.map(value => String(value).toLowerCase()).join("|");
  const phoneLanguage = preferences
    .map(value => String(value).toLowerCase().split(/[-_]/)[0])
    .find(value => supported.includes(value)) || "de";

  let currentLanguage = phoneLanguage;
  // Old permanent preferences must not override the phone's language.
  // An explicit choice applies only to this tab and these device preferences.
  try {
    const choice = JSON.parse(sessionStorage.getItem(sessionKey) || "null");
    if (choice && choice.device === fingerprint && supported.includes(choice.language)) {
      currentLanguage = choice.language;
    }
  } catch {}

  function sync() {
    document.documentElement.lang = currentLanguage;
    // Existing catalogue widgets use this key. Keep them in sync without
    // reading a legacy preference as the initial language.
    try { localStorage.setItem("6006-language", currentLanguage); } catch {}
  }

  function setLanguage(language) {
    if (!supported.includes(language)) return false;
    currentLanguage = language;
    try {
      sessionStorage.setItem(sessionKey, JSON.stringify({ device: fingerprint, language }));
    } catch {}
    sync();
    return true;
  }

  window.Locale6006 = Object.freeze({
    getLanguage: () => currentLanguage,
    phoneLanguage,
    setLanguage
  });
  sync();
})();
