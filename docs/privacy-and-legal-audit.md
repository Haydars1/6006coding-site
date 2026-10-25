# 6006coding.de — Rechtliches und Datenschutz: Bestandsaufnahme

Stand: 25. Oktober 2026. Diese technische Bestandsaufnahme ist keine Rechtsberatung.

## Technischer Datenschutz-Befund

- Zum Zeitpunkt der ursprünglichen Bestandsaufnahme gab es keine Seiten `/impressum/` oder `/datenschutz/` und keine Cookie-Einstellungen. Die Arbeitskopie enthält jetzt eine Datenschutzseite mit Speicheroptionen, jedoch kein Impressum.
- Im HTML der Startseite werden Google Fonts von `fonts.googleapis.com` geladen. Der Seitenaufruf stellt dadurch eine Verbindung zu einem Dritten her.
- Die Startseite bindet kein Google Analytics, Google Tag Manager, AdSense-Werbeskript, YouTube-Video oder Karten-Widget ein. Der AdSense-Kontoverifizierungs-Metatag allein ist kein Anzeigen- oder Analytics-Skript.
- Die Website legt laut aktuellem Code keine Cookies an. Sie verwendet aber Browser-Speicher: Sprache (`6006-language`), zuletzt betrachtete Fehlercodes (`6006-recent-codes`), Favoriten, ausgewähltes Fahrzeug sowie kurzzeitige Fahrzeugauswahldaten und NHTSA-Abfrage-Caches (`sessionStorage`). § 25 TDDDG erfasst auch das Speichern und Auslesen anderer Informationen auf dem Endgerät, nicht nur Cookies.
- Die bisher veröffentlichte Fassung hat beim Laden der Fahrzeugauswahl außerdem die öffentliche NHTSA-vPIC-API unter `vpic.nhtsa.dot.gov` angefragt. Dadurch erhält der API-Anbieter die IP-Adresse.
- WhatsApp wird erst geöffnet, nachdem der Nutzer den WhatsApp-Link auswählt. E-Mail-Links öffnen den E-Mail-Client des Nutzers.
- Das Hosting ist als Render Static Site konfiguriert. Für eine vollständige Datenschutzerklärung sind Render-Vertrag/DPA, eingesetzte Logs, Aufbewahrung und mögliche Drittlandübermittlungen anhand des konkreten Kontos zu verifizieren.
- Die damals geprüfte Live-Startseite enthielt ältere Marken-/Kontakttexte („6006 Performance“ und `6006performance@gmail.com`). Die Arbeitskopie ist inzwischen auf „6006 Coding“ und `kontakt@6006coding.de` umgestellt. Dieser Befund beschreibt den ursprünglichen Live-Stand, nicht den aktuellen Arbeitsstand.

## Aktueller Arbeitsstand — technische Änderungen getestet, noch nicht veröffentlicht

Die drei Schriftfamilien Manrope, Newsreader und IBM Plex Mono werden aus `/assets/fonts/` geladen. Die Startseite ruft Google Fonts nicht mehr auf. Schriftdateien und SIL Open Font License-Dateien liegen gemeinsam in `dist/assets/fonts/`. Die Seiten `/projektinfo/` und `/datenschutz/` sind in der Arbeitskopie vorhanden; als Verantwortlicher steht dort ausschließlich der vom Betreiber mitgeteilte Name „Özer“, ohne erfundene Anschrift.

Eine mehrsprachige Datenschutzeinstellungsseite und ein Einstellungsdialog lassen Sprache, Fahrzeugauswahl, Favoriten und zuletzt geöffnete Fehlercodes standardmäßig ungespeichert. Diese Komfortspeicherung wird erst nach aktiver Zustimmung eingeschaltet und kann später über „Datenschutzeinstellungen“ wieder ausgeschaltet werden. Beim Ablehnen werden bekannte gespeicherte 6006-Auswahlen gelöscht. Der Dialog blockiert im Arbeitsstand auch die automatische NHTSA-Anfrage beim Laden; nur wenn für eine ausdrücklich gewählte Marke keine lokalen Modelldaten verfügbar sind, fragt der Katalog die NHTSA-API ab.

Der Dialog ersetzt weder Impressum noch Datenschutzerklärung und macht diese nicht automatisch vollständig.

## Vor einer Veröffentlichung zu klären

1. **Impressum:** vollständiger bürgerlicher Name des tatsächlichen Diensteanbieters und eine ladungsfähige Anschrift, unter der dieser niedergelassen ist. Ein Markenname, eine E-Mail-Adresse, ein Postfach oder eine erfundene Adresse ersetzen diese Angaben nicht. Bei einem Einzelunternehmen ist keine GmbH/UG- oder Handelsregisterangabe zu erfinden; einschlägige Pflichtangaben hängen von der tatsächlichen Rechts- und Geschäftslage ab.
2. **Gewerbe-/Steuerstatus:** klären, ob und ab wann die regelmäßig angebotenen entgeltlichen Fahrzeugleistungen gewerblich ausgeübt werden und welche Anmeldungen/Steuerangaben gelten.
3. **Datenschutzinformation:** Verantwortlicher (Name und Anschrift), Kontakt, konkrete Hosting-/Log-Verarbeitung und Aufbewahrung mit Render-DPA abgleichen, Browser-Speicherfunktionen und NHTSA-API benennen, Rechtsgrundlagen/Zwecke festlegen und Betroffenenrechte sowie Beschwerdeaufsicht korrekt angeben.
4. **Cookies/Einwilligung:** derzeit wurde kein nicht notwendiger Cookie- oder Werbe-/Analyse-Tag im Startseiten-HTML gefunden. Für das aktuelle Inventar ist ein pauschales „Alle akzeptieren“-Banner nicht sinnvoll. Vor dem Hinzufügen von Analytics, Werbung, externen Medien oder vergleichbaren nicht notwendigen Zugriffen ist eine zustimmungsbasierte, gleichwertige Ablehnen-/Annehmen-Auswahl vor deren Laden zu ergänzen.
5. **Prüfung:** alle SEO-Unterseiten und Live-Netzwerkaufrufe sowie die konkrete Render-Konfiguration vor endgültiger Datenschutzerklärung prüfen.

## Primärquellen

- Digitale-Dienste-Gesetz (DDG), § 5 Informationspflichten: https://www.gesetze-im-internet.de/ddg/__5.html
- TDDDG, § 25 Zugriff auf Endeinrichtungen: https://www.gesetze-im-internet.de/ttdsg/__25.html
- DSGVO, insbesondere Art. 13 Informationspflichten: https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de
- Render Privacy Policy: https://www.render.com/privacy
