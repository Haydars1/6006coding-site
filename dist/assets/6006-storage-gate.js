(() => {
  "use strict";
  const key = "6006-storage-consent-v1";
  const proto = window.Storage && Storage.prototype;
  if (!proto || proto.__6006ConsentGate) return;

  const native = {
    get: proto.getItem,
    set: proto.setItem,
    remove: proto.removeItem,
    clear: proto.clear,
    key: proto.key,
    length: Object.getOwnPropertyDescriptor(proto, "length")
  };
  const local = () => { try { return window.localStorage; } catch { return null; } };
  const session = () => { try { return window.sessionStorage; } catch { return null; } };
  const isLocal = store => store === local();
  const comfortAllowed = () => {
    const store = local();
    if (!store) return false;
    try { return native.get.call(store, key) === "comfort"; } catch { return false; }
  };

  Object.defineProperty(proto, "__6006ConsentGate", { value: true });
  proto.getItem = function (name) {
    if (String(name) === key) return isLocal(this) ? native.get.call(this, key) : null;
    return comfortAllowed() ? native.get.call(this, name) : null;
  };
  proto.setItem = function (name, value) {
    if (String(name) === key && isLocal(this)) return native.set.call(this, key, value);
    if (comfortAllowed()) return native.set.call(this, name, value);
  };
  proto.removeItem = function (name) {
    if (String(name) === key && isLocal(this)) return native.remove.call(this, key);
    return native.remove.call(this, name);
  };
  proto.clear = function () {
    if (comfortAllowed()) return native.clear.call(this);
  };
  proto.key = function (index) {
    if (comfortAllowed()) return native.key.call(this, index);
    return null;
  };
  if (native.length?.get) {
    Object.defineProperty(proto, "length", {
      configurable: true,
      enumerable: true,
      get() { return comfortAllowed() ? native.length.get.call(this) : 0; }
    });
  }

  function eraseRememberedChoices() {
    const stores = [local(), session()].filter(Boolean);
    const keys = ["6006-language", "6006-language-session-v1", "6006-vehicle-choice", "6006-recent-codes", "6006.saved-codes.v1"];
    for (const store of stores) for (const name of keys) {
      try { native.remove.call(store, name); } catch {}
    }
    const store = session();
    if (store) {
      try {
        for (let i = native.length.get.call(store) - 1; i >= 0; i--) {
          const name = native.key.call(store, i);
          if (name && name.startsWith("6006-vpic:")) native.remove.call(store, name);
        }
      } catch {}
    }
  }
  if (!comfortAllowed()) eraseRememberedChoices();

  const copy = {
    de: {
      title: "Datenschutzeinstellungen",
      body: "Es sind keine Werbe- oder Analyse-Tracker eingebunden. Mit Komfortspeicherung merkt sich diese Website Sprache, Fahrzeugauswahl, Favoriten und zuletzt geöffnete Fehlercodes in diesem Browser. Bei „Nur notwendige“ werden diese Angaben nicht gespeichert; Suche und Katalog bleiben nutzbar.",
      necessary: "Nur notwendige",
      allow: "Komfortspeicherung erlauben",
      settings: "Datenschutzeinstellungen"
    },
    tr: {
      title: "Gizlilik tercihleri",
      body: "Sitede reklam veya analiz takipçisi kullanılmıyor. Kolaylık depolamasına izin verirsen bu tarayıcıda dil, araç seçimi, favoriler ve son baktığın arıza kodları hatırlanır. Yalnızca gerekli olanları seçersen bu bilgiler kaydedilmez; arama ve katalog çalışmaya devam eder.",
      necessary: "Yalnızca gerekli",
      allow: "Kolaylık depolamasına izin ver",
      settings: "Gizlilik tercihleri"
    },
    en: {
      title: "Privacy settings",
      body: "No advertising or analytics trackers are active. If you allow convenience storage, this browser remembers your language, vehicle selection, favourites and recently viewed fault codes. With “Necessary only”, those details are not stored; search and the catalogue remain available.",
      necessary: "Necessary only",
      allow: "Allow convenience storage",
      settings: "Privacy settings"
    }
  };

  function mount() {
    if (!document.body || document.getElementById("6006-privacy-controls")) return;
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = "/assets/6006-storage-gate.css";
    document.head.append(style);

    const root = document.createElement("section");
    root.id = "6006-privacy-controls";
    root.className = "p6006";
    root.setAttribute("aria-label", "Privacy settings");
    root.innerHTML = '<button class="p6006-open" type="button"></button><div class="p6006-panel" role="region" aria-labelledby="p6006-title" hidden><div class="p6006-copy"><strong id="p6006-title"></strong><p></p></div><div class="p6006-actions"><button class="p6006-necessary" type="button"></button><button class="p6006-allow" type="button"></button></div></div>';
    document.body.append(root);
    const open = root.querySelector(".p6006-open");
    const panel = root.querySelector(".p6006-panel");
    const title = root.querySelector("#p6006-title");
    const body = root.querySelector(".p6006-copy p");
    const necessary = root.querySelector(".p6006-necessary");
    const allow = root.querySelector(".p6006-allow");
    const t = () => copy[(document.documentElement.lang || navigator.language || "de").slice(0, 2)] || copy.de;
    const paint = () => {
      const text = t();
      title.textContent = text.title;
      body.textContent = text.body;
      necessary.textContent = text.necessary;
      allow.textContent = text.allow;
      open.textContent = text.settings;
      open.setAttribute("aria-expanded", String(!panel.hidden));
    };
    const reveal = () => { panel.hidden = false; paint(); open.setAttribute("aria-expanded", "true"); necessary.focus(); };
    const close = () => { panel.hidden = true; paint(); open.setAttribute("aria-expanded", "false"); open.focus(); };
    open.addEventListener("click", () => panel.hidden ? reveal() : close());
    necessary.addEventListener("click", () => {
      const store = local();
      if (!store) return;
      native.set.call(store, key, "necessary");
      eraseRememberedChoices();
      close();
    });
    allow.addEventListener("click", () => {
      const store = local();
      if (!store) return;
      native.set.call(store, key, "comfort");
      window.location.reload();
    });
    new MutationObserver(paint).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    paint();
    const store = local();
    if (store && !native.get.call(store, key)) reveal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
