// 6006 Performance — paste several OBD-II DTCs and open each in the existing catalogue.
// This tool extracts identifiers only; it never guesses a fault diagnosis.
(function () {
"use strict";
const MAX_CODES = 50;
function parseCodes(value, limit = MAX_CODES) {
  const found = String(value || "").toUpperCase().match(/\b[PBCU][0-3][0-9A-F]{3}\b/g) || [];
  return [...new Set(found)].slice(0, Math.max(0, limit));
}
if (typeof module !== "undefined" && module.exports) module.exports = {parseCodes};
if (typeof document === "undefined") return;
const root = document.getElementById("dtc-batch");
if (!root) return;
const $ = id => document.getElementById("dtc-batch-" + id);
const input = $("input"), run = $("run"), copy = $("copy"), status = $("status"), results = $("results");
if (![input, run, copy, status, results].every(Boolean)) return;
const messages = {
  tr: {summary:"Birden fazla arıza kodunu incele", label:"OBD tarama çıktısını buraya yapıştır", placeholder:"Örnek: P0299, P0401, U0100\nTarama cihazından kopyaladığın metni de yapıştırabilirsin.", run:"Kodları ayıkla", copy:"Kod listesini kopyala", none:"Geçerli P/B/C/U kodu bulunamadı. Örnek: P0299 veya U0100.", count:n=>"Bulunan "+n+" benzersiz kod. Ayrıntılar için bir kod seç.", limit:"İlk 50 benzersiz kod gösteriliyor.", copied:"Kodlar panoya kopyalandı.", copyError:"Otomatik kopyalama kullanılamıyor; kodları seçip kopyalayabilirsin.", family:{P:"Motor / aktarma",B:"Gövde / güvenlik",C:"Şasi / fren",U:"Modül / iletişim"}, warning:"Kodlar yalnızca metinden ayıklandı; araç özelindeki anlamı ve nedeni ayrıca doğrulanmalıdır."},
  de: {summary:"Mehrere Fehlercodes auswerten", label:"OBD-Scan hier einfügen", placeholder:"Beispiel: P0299, P0401, U0100\nAuch ein kopierter Scan-Bericht ist möglich.", run:"Codes erkennen", copy:"Codeliste kopieren", none:"Kein gültiger P/B/C/U-Code erkannt. Beispiel: P0299 oder U0100.", count:n=>n+" unterschiedliche Codes erkannt. Einen Code für Details auswählen.", limit:"Die ersten 50 unterschiedlichen Codes werden angezeigt.", copied:"Codes kopiert.", copyError:"Automatisches Kopieren nicht möglich; Codes bitte manuell markieren.", family:{P:"Motor / Antrieb",B:"Karosserie / Sicherheit",C:"Fahrwerk / Bremse",U:"Steuergerät / Netzwerk"}, warning:"Nur Textcodes erkannt; fahrzeugspezifische Bedeutung und Ursache müssen geprüft werden."},
  en: {summary:"Check multiple fault codes", label:"Paste an OBD scan report", placeholder:"Example: P0299, P0401, U0100\nYou can also paste text copied from a scanner.", run:"Extract codes", copy:"Copy code list", none:"No valid P/B/C/U code found. Example: P0299 or U0100.", count:n=>n+" unique codes found. Select one for details.", limit:"Showing the first 50 unique codes.", copied:"Codes copied.", copyError:"Clipboard unavailable; select and copy the codes manually.", family:{P:"Powertrain",B:"Body / safety",C:"Chassis / brakes",U:"Module / network"}, warning:"Only code identifiers were extracted. Vehicle-specific meaning and root cause still require verification."}
};
const locale = () => {const l=(document.documentElement.lang||"de").slice(0,2).toLowerCase();return messages[l]?l:"de";};
let codes = [], truncated = false;
function render() {
  const t = messages[locale()];
  $("summary").textContent = t.summary;
  $("label").textContent = t.label;
  input.placeholder = t.placeholder;
  run.textContent = t.run;
  copy.textContent = t.copy;
  copy.hidden = codes.length === 0;
  results.replaceChildren();
  if (!codes.length) return;
  const list = document.createElement("div");
  list.className = "suggest";
  for (const code of codes) {
    const link = document.createElement("a");
    link.href = "/fehlercodes/?code=" + code + "#detay";
    link.textContent = code + " · " + t.family[code[0]] + " →";
    link.style.cssText = "display:inline-flex;align-items:center;min-height:44px;padding:10px 13px;border:1px solid #ba915c;border-radius:6px;background:#392a1d;color:#f6dfbd;text-decoration:none;font-size:.84rem";
    list.append(link);
  }
  const warning = document.createElement("p");
  warning.className = "hint";
  warning.textContent = t.warning;
  results.append(list, warning);
  status.textContent = t.count(codes.length) + (truncated ? " " + t.limit : "");
}
run.addEventListener("click", () => {
  const all = parseCodes(input.value, MAX_CODES + 1);
  truncated = all.length > MAX_CODES;
  codes = all.slice(0, MAX_CODES);
  render();
  if (!codes.length) status.textContent = messages[locale()].none;
});
input.addEventListener("keydown", event => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {event.preventDefault();run.click();}
});
copy.addEventListener("click", async () => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(codes.join(", "));
    status.textContent = messages[locale()].copied;
  } catch (_) {
    status.textContent = messages[locale()].copyError;
    input.value = codes.join(", ");
    input.focus();
    input.select();
  }
});
new MutationObserver(render).observe(document.documentElement, {attributes:true, attributeFilter:["lang"]});
render();
})();
