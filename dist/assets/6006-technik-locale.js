(() => {
  "use strict";

  // Native translations of the German technical guide. URLs, code identifiers
  // and the original German document remain intact; no translation proxy is used.
  const common = new Map([
    ["Direkt zu den Technikthemen", ["Teknik konulara geç", "Skip to technical topics"]],
    ["Stage 1", ["Stage 1", "Stage 1"]],
    ["Schnellsuche", ["Hızlı arama", "Quick search"]],
    ["Fehlercode-Wissen", ["Arıza kodu rehberi", "Fault-code guide"]],
    ["Technik-Ratgeber", ["Teknik rehber", "Technical guide"]],
    ["Reparatur & Wartung", ["Tamir ve bakım", "Repair & maintenance"]],
    ["Leistungen", ["Hizmetler", "Services"]],
    ["Kontakt", ["İletişim", "Contact"]],
    ["6006 Performance · Fahrzeugwissen", ["6006 Performance · Araç bilgileri", "6006 Performance · Vehicle knowledge"]],
    ["Technik klar", ["Araç tekniğini", "Understand vehicle"]],
    ["einordnen.", ["anlayın.", "technology."]],
    ["Nicht jeder Defekt beginnt mit einem OBD-Code. Hier finden Fahrer von Pkw, Transporter und Lkw typische Symptome, die betroffenen Systeme, sichere erste Kontrollen und eine klare Grenze zwischen „selbst prüfen“ und „Fachwerkstatt“.", ["Her arıza bir OBD koduyla başlamaz. Burada otomobil, hafif ticari araç ve kamyon sürücüleri yaygın belirtileri, ilgili sistemleri ve güvenli ilk kontrolleri bulabilir; hangi kontrolü kendilerinin yapabileceğini ve ne zaman uzman servise başvurmaları gerektiğini öğrenebilir.", "Not every fault starts with an OBD code. Here, car, van and truck drivers can find common symptoms, the systems involved, safe initial checks and a clear distinction between checks they can perform themselves and work for a specialist workshop."]],
    ["Kein Raten, kein gefährliches DIY.", ["Tahminlere ve tehlikeli müdahalelere yer yok.", "No guesswork or dangerous DIY."]],
    ["Herstellerdaten, Motorvariante, Baujahr und vollständige Fehlereinträge entscheiden. Diese Inhalte geben eine saubere Richtung, ersetzen aber keine Diagnose am Fahrzeug.", ["Üretici verileri, motor varyantı, üretim yılı ve eksiksiz arıza kayıtları belirleyicidir. Bu içerik doğru bir başlangıç sağlar; araç üzerinde yapılan teşhisin yerini tutmaz.", "Manufacturer data, engine variant, model year and complete fault records are decisive. This information provides a clear starting point, but does not replace diagnosis on the vehicle."]],
    ["Was ist das Problem?", ["Sorun nedir?", "What is the problem?"]],
    ["Nach Symptom, System oder Fahrzeugart filtern.", ["Belirtiye, sisteme veya araç türüne göre filtreleyin.", "Filter by symptom, system or vehicle type."]],
    ["Thema suchen", ["Konu ara", "Search topics"]],
    ["Alle Themen", ["Tüm konular", "All topics"]],
    ["Pkw & Transporter", ["Otomobil ve hafif ticari", "Cars & vans"]],
    ["Lkw & Nutzfahrzeug", ["Kamyon ve ticari araç", "Trucks & commercial vehicles"]],
    ["Sicher selbst prüfen", ["Güvenli bireysel kontroller", "Safe checks you can perform"]],
    ["Nur Fachwerkstatt", ["Yalnızca uzman servis", "Specialist workshop only"]],
    ["Vom Symptom zur richtigen Prüfung", ["Belirtiden doğru kontrole", "From symptom to the right check"]],
    ["Die Themen sind als Einstieg gedacht. Bei einem bekannten P-, U-, B- oder C-Code führt der", ["Bu konular başlangıç niteliğindedir. P, U, B veya C ile başlayan bir kodunuz varsa", "These topics provide a starting point. If you already have a P, U, B or C code, the"]],
    ["Fehlercode‑Leitfaden", ["arıza kodu rehberi", "fault-code guide"]],
    ["gezielter weiter.", ["daha hedefli bilgi sunar.", "provides more targeted information."]],
    ["01 · Pkw & Transporter", ["01 · Otomobil ve hafif ticari", "01 · Cars & vans"]],
    ["02 · Lkw & Nutzfahrzeug", ["02 · Kamyon ve ticari araç", "02 · Trucks & commercial vehicles"]],
    ["Selbst prüfen", ["Kendiniz kontrol edebilirsiniz", "Checks you can perform"]],
    ["Sicher prüfen", ["Güvenli kontrol", "Safe checks"]],
    ["Werkstatt wenn", ["Servise başvurulacak durumlar", "When to contact a workshop"]],
    ["Nicht weiterfahren wenn", ["Sürüşe devam etmeyin", "Do not continue driving if"]],
    ["Fachwerkstatt", ["Uzman servis", "Specialist workshop"]],
    ["Erster Schritt", ["İlk adım", "First step"]],
    ["Nicht selbst öffnen", ["Kendiniz sökmeyin", "Do not open yourself"]],
    ["Sicherheitskritisch", ["Güvenlik açısından kritik", "Safety-critical"]],
    ["Sofort beachten", ["Hemen dikkat edilmesi gerekenler", "Immediate precautions"]],
    ["Keine DIY-Reparatur", ["Bireysel onarım yapmayın", "No DIY repair"]],
    ["Basis-Check", ["Temel kontrol", "Basic check"]],
    ["Legal & OEM", ["Yasal ve üreticiye uygun", "Legal & OEM-compliant"]],
    ["Klarer Rahmen", ["Kapsam", "Scope"]],
    ["Motor schützen", ["Motoru koruyun", "Protect the engine"]],
    ["Sofort abstellen", ["Aracı hemen durdurun", "Stop immediately"]],
    ["Sicher handeln", ["Güvenli hareket edin", "Act safely"]],
    ["Nicht tun", ["Yapılmaması gerekenler", "Do not"]],
    ["Keine Eigenarbeit", ["Kendiniz müdahale etmeyin", "No DIY work"]],
    ["Hochvolt", ["Yüksek gerilim", "High voltage"]],
    ["Fachbetrieb", ["Yetkin uzman servis", "Qualified specialist workshop"]],
    ["Fachdiagnose", ["Uzman teşhisi", "Specialist diagnosis"]],
    ["Bereithalten", ["Hazır bulundurulacak bilgiler", "Information to have ready"]],
    ["Wichtig", ["Önemli", "Important"]],
    ["Nicht selbst reparieren", ["Kendiniz tamir etmeyin", "Do not repair yourself"]],
    ["Nicht weiterfahren", ["Sürüşe devam etmeyin", "Do not continue driving"]],
    ["Druckluftsystem", ["Basınçlı hava sistemi", "Compressed-air system"]],
    ["Priorität", ["Öncelik", "Priority"]],
    ["Kein Umgehen", ["Sistemi devre dışı bırakmayın", "No bypassing"]],
    ["Sicher selbst prüfen – bevor Teile getauscht werden.", ["Parça değişiminden önce güvenli kontroller.", "Safe checks before replacing parts."]],
    ["Diese drei Schritte sind bei vielen Themen sinnvoll. Sie ersetzen keine Reparaturanleitung und verhindern vor allem, dass wichtige Diagnoseinformationen verloren gehen.", ["Bu üç adım birçok durumda yararlıdır. Bir tamir kılavuzunun yerini tutmaz; özellikle önemli teşhis bilgilerinin kaybolmasını önlemeye yardımcı olur.", "These three steps are useful for many problems. They do not replace a repair manual; their main purpose is to prevent important diagnostic information from being lost."]],
    ["01 · Dokumentieren", ["01 · Kaydedin", "01 · Document"]],
    ["Warnung & Situation festhalten", ["Uyarıyı ve koşulları kaydedin", "Record the warning and circumstances"]],
    ["Foto der Anzeige, exakter Code, Kilometerstand, Außentemperatur und Auftreten notieren. Fehler nicht zuerst löschen.", ["Uyarının fotoğrafını, tam kodu, kilometreyi, dış sıcaklığı ve ne zaman ortaya çıktığını kaydedin. İlk iş olarak arıza kaydını silmeyin.", "Record a photo of the warning, the exact code, mileage, outside temperature and when it occurred. Do not start by clearing the fault."]],
    ["02 · Sichtbar prüfen", ["02 · Gözle kontrol edin", "02 · Inspect visually"]],
    ["Nur kalt und ohne Demontage", ["Yalnızca soğukken ve sökmeden", "Only when cold and without dismantling"]],
    ["Auf Leckagen, lose Gegenstände, sichtbare Kabelschäden, Reifen- und Flüssigkeitswarnungen achten – immer nach Betriebsanleitung.", ["Kullanım kılavuzuna uyarak kaçaklara, gevşek nesnelere, görünür kablo hasarlarına, lastik ve sıvı uyarılarına bakın.", "Follow the owner's manual when checking for leaks, loose objects, visible cable damage and tyre or fluid warnings."]],
    ["03 · Richtig weitergeben", ["03 · Doğru bilgileri iletin", "03 · Share the right information"]],
    ["Daten statt Vermutungen senden", ["Tahmin yerine verileri paylaşın", "Send data rather than guesses"]],
    ["Fahrzeug, Baujahr, Motor, Kraftstoff, Code, Symptom und vorhandene Live-Werte ergeben eine wesentlich bessere erste Richtung.", ["Araç, üretim yılı, motor, yakıt türü, kod, belirti ve mevcut canlı veriler ilk değerlendirmeyi çok daha sağlıklı hâle getirir.", "Vehicle details, model year, engine, fuel type, code, symptoms and available live data provide a much better starting point."]],
    ["Basis-DIY: nur einfache Wartung nach Betriebsanleitung", ["Temel bakım: yalnızca kullanım kılavuzundaki basit işlemler", "Basic DIY: simple maintenance following the owner's manual"]],
    ["Diese Arbeiten sind nur dann sinnvoll, wenn sie für das konkrete Fahrzeug im Handbuch vorgesehen sind und keine Warnung zu Bremse, Lenkung, Airbag, Hochvolt, Kraftstoff oder Abgasnachbehandlung aktiv ist.", ["Bu işlemler ancak aracın kullanım kılavuzunda öngörülmüşse ve fren, direksiyon, hava yastığı, yüksek gerilim, yakıt veya egzoz arıtma sistemiyle ilgili aktif bir uyarı yoksa uygundur.", "These tasks are appropriate only if the vehicle's owner's manual permits them and there is no active warning involving brakes, steering, airbags, high voltage, fuel or exhaust aftertreatment."]],
    ["Scheibenwaschwasser mit geeigneter Flüssigkeit nachfüllen", ["Cam yıkama sıvısını uygun ürünle tamamlayın", "Top up the windscreen washer reservoir with a suitable fluid"]],
    ["Reifendruck am kalten Reifen nach Fahrzeugaufkleber kontrollieren", ["Soğuk lastik basıncını araç etiketindeki değerlere göre kontrol edin", "Check cold tyre pressures against the vehicle label"]],
    ["Wischerblätter nach Herstellerhinweis wechseln", ["Silecekleri üretici talimatına göre değiştirin", "Replace wiper blades following the manufacturer's instructions"]],
    ["Innenraumfilter nur gemäß Handbuch ersetzen", ["Kabin filtresini yalnızca kullanım kılavuzuna uygun şekilde değiştirin", "Replace the cabin filter only as described in the owner's manual"]],
    ["Sicherung nur mit identischem Typ und Wert ersetzen – niemals überbrücken", ["Sigortayı yalnızca aynı tip ve amper değerindeki sigortayla değiştirin; asla köprülemeyin", "Replace a fuse only with the same type and rating; never bypass it"]],
    ["Beleuchtung von außen prüfen; LED-/Xenon-/Hochvolt-Systeme nicht öffnen", ["Aydınlatmayı dışarıdan kontrol edin; LED, xenon veya yüksek gerilim sistemlerini açmayın", "Check lights externally; do not open LED, xenon or high-voltage systems"]],
    ["Nicht selbst reparieren oder freischalten:", ["Kendiniz tamir etmeyin veya enerjisini keserek müdahaleye hazırlamayın:", "Do not repair or isolate these systems yourself:"]],
    ["Bremsen, Lenkung, Airbag/Gurtstraffer, Hochvolt, Hochdruck-Kraftstoff, CNG/LNG, Lkw-Druckluft, Abgasnachbehandlung, Kilometer-/Tachografen- oder Sicherheitsmanipulationen.", ["Fren, direksiyon, hava yastığı/kemer gergisi, yüksek gerilim, yüksek basınçlı yakıt, CNG/LNG, kamyon basınçlı hava ve egzoz arıtma sistemleri; kilometre, takograf veya güvenlik sistemlerine müdahale.", "Brakes, steering, airbags/seat-belt pretensioners, high voltage, high-pressure fuel, CNG/LNG, truck compressed-air systems, exhaust aftertreatment, or mileage, tachograph and safety-system tampering."]],
    ["Kurz beantwortet", ["Kısa yanıtlar", "Quick answers"]],
    ["Für eine saubere Entscheidung vor der nächsten Fahrt oder Reparatur.", ["Bir sonraki sürüş veya onarım öncesinde doğru karar vermek için.", "For an informed decision before your next drive or repair."]],
    ["Kann ich eine Warnleuchte oder einen Fehlercode selbst löschen?", ["Bir uyarı lambasını veya arıza kodunu kendim silebilir miyim?", "Can I clear a warning light or fault code myself?"]],
    ["Ein Code sollte zuerst vollständig gelesen und dokumentiert werden. Löschen ohne Ursachenprüfung kann wichtige Umgebungsdaten entfernen und behebt die Störung nicht.", ["Önce kod eksiksiz okunmalı ve kaydedilmelidir. Nedeni araştırmadan silmek önemli arıza anı verilerini kaybettirebilir; sorunu gidermez.", "First, read and document the complete code. Clearing it without investigating the cause can erase important operating-condition data and does not fix the fault."]],
    ["Welche Fahrzeugprobleme kann ich selbst sicher prüfen?", ["Hangi araç sorunlarını kendim güvenle kontrol edebilirim?", "Which vehicle problems can I safely check myself?"]],
    ["Sicher sind meist Sichtprüfungen, Reifendruck nach Herstellervorgabe, Füllstandskontrollen bei kaltem Fahrzeug nach Betriebsanleitung, Warnhinweise dokumentieren und Fehlerspeicher auslesen.", ["Genellikle gözle kontrol, üreticinin önerdiği lastik basıncı kontrolü, soğuk araçta kullanım kılavuzuna göre sıvı seviyesi kontrolü, uyarıları kaydetmek ve arıza hafızasını okumak güvenli başlangıç adımlarıdır.", "Typical safe checks include visual inspection, tyre pressures to the manufacturer's specification, fluid levels on a cold vehicle following the owner's manual, documenting warnings and reading fault memory."]],
    ["Was bedeuten SPN und FMI beim Lkw?", ["Kamyonda SPN ve FMI ne anlama gelir?", "What do SPN and FMI mean on a truck?"]],
    ["SPN bezeichnet im J1939-Umfeld den betroffenen Parameter beziehungsweise die Komponente, FMI beschreibt die Art der Auffälligkeit. Die konkrete Bedeutung bleibt hersteller- und fahrzeugabhängig.", ["J1939 kapsamında SPN ilgili parametreyi veya bileşeni, FMI ise tespit edilen anormalliğin türünü belirtir. Kesin anlam üreticiye ve araca bağlıdır.", "In J1939, SPN identifies the affected parameter or component, while FMI describes the type of abnormal condition. The exact meaning depends on the manufacturer and vehicle."]],
    ["Gibt es Anleitungen zum Abschalten von DPF, AGR oder AdBlue?", ["DPF, EGR/AGR veya AdBlue'yu devre dışı bırakma talimatları var mı?", "Are there instructions for disabling DPF, EGR or AdBlue?"]],
    ["Nein. 6006 Performance behandelt bei emissionsrelevanten Systemen ausschließlich legale Fehlerfindung und OEM-orientierte Instandsetzung, keine Deaktivierung, Umgehung oder Manipulation.", ["Hayır. 6006 Performance, emisyonla ilgili sistemlerde yalnızca yasal arıza teşhisini ve üretici prosedürlerine uygun onarımı ele alır; devre dışı bırakma, atlatma veya manipülasyon içermez.", "No. For emissions-related systems, 6006 Performance covers only legal fault diagnosis and OEM-oriented repair, with no disabling, bypassing or tampering."]],
    ["Dein Thema ist nicht dabei?", ["Aradığınız konu burada yok mu?", "Can't find your issue?"]],
    ["Schicke Fahrzeugart, Marke/Modell, Baujahr, Motor oder Antrieb, den vollständigen Code und das Symptom. Für Lkw zusätzlich SPN/FMI, Warnstatus und Motor-/Fahrzeugvariante. Keine Diagnose auf Basis eines einzelnen Stichworts – aber ein sauberer Start.", ["Araç türünü, marka/modeli, üretim yılını, motor veya güç aktarımı bilgisini, tam kodu ve belirtiyi paylaşın. Kamyon için SPN/FMI, uyarı durumu ve motor/araç varyantını da ekleyin. Tek bir kelimeyle teşhis konulamaz; ancak bu bilgiler doğru bir başlangıç sağlar.", "Send the vehicle type, make/model, model year, engine or powertrain, complete code and symptoms. For trucks, also include SPN/FMI, warning status and engine/vehicle variant. A single keyword cannot establish a diagnosis, but these details provide a clear starting point."]],
    ["Fehlercode-Leitfaden öffnen", ["Arıza kodu rehberini aç", "Open the fault-code guide"]],
    ["WhatsApp Business", ["WhatsApp Business", "WhatsApp Business"]],
    ["E-Mail", ["E-posta", "Email"]],
    ["© 2026 6006 Performance · Technische Orientierung, keine Ferndiagnose.", ["© 2026 6006 Performance · Teknik bilgilendirme; uzaktan teşhis değildir.", "© 2026 6006 Performance · Technical guidance, not remote diagnosis."]],
    ["Startseite", ["Ana sayfa", "Home"]],
    ["Suchen", ["Ara", "Search"]]
  ]);

  // Each entry follows the five existing article fields: title, summary,
  // first check, escalation/second check, and destination-link label.
  const topics = {
    A01: {
      tr: ["Motor çalışmıyor veya zor çalışıyor", "Çalıştırma sorunu; zayıf 12 V akü, gerilim düşümü, yakıt beslemesi, marş sistemi, immobilizer veya motor kaynaklı bir arızadan doğabilir. Sıcaklık ve önceki belirtiler incelemenin yönünü değiştirir.", "Uyarıların fotoğrafını çekin, çalıştırma davranışını tarif edin, akü durumunu kullanım kılavuzuna göre değerlendirin ve mevcut kodları silmeden önce kaydedin.", "Yanık kokusu, tekrarlayan tıklama sesi, yalnızca takviyeyle çalıştırma veya birden fazla kontrol ünitesinde arıza varsa.", "Çalıştırma ve elektrik kodlarını oku"],
      en: ["Engine will not start or is hard to start", "Starting problems can result from a weak 12 V battery, voltage drop, fuel supply, starter system, immobiliser or an engine fault. Temperature and previous symptoms affect the diagnostic direction.", "Photograph warnings, describe the starting behaviour, assess battery condition according to the owner's manual and record existing codes before clearing them.", "There is a burning smell, repeated clicking, starting is possible only with a jump start, or several control units report faults.", "Read starting and electrical codes"]
    },
    A02: {
      tr: ["Motor arıza lambası, tekleme veya koruma modu", "Güç kaybı ve düzensiz çalışma; hava, ateşleme, enjeksiyon, sensör veya egzoz sistemlerinden kaynaklanabilir. Eksiksiz arıza verileri ve lambanın yanıp sönmesi ya da sürekli yanması belirleyicidir.", "Kodu, devir aralığını, sıcaklığı ve sorunu tetikleyen koşulları kaydedin. Görünür şekilde gevşek emiş hortumlarına yalnızca araç kapalı ve soğukken bakın.", "Arıza lambası yanıp sönüyorsa, motor şiddetle sarsılıyorsa, duman çıkıyorsa veya güç aniden büyük ölçüde düşüyorsa.", "Motor çalışma arızası kodlarını oku"],
      en: ["Engine warning light, rough running or limp mode", "Power loss and rough running can involve air supply, ignition, injection, sensors or exhaust systems. Complete fault data and whether the light is flashing or continuously lit are decisive.", "Record the code, RPM range, temperature and conditions that trigger the fault. Inspect visibly loose intake hoses only with the vehicle switched off and cool.", "The warning light flashes, the engine shakes severely, smoke appears or power drops sharply and suddenly.", "Read engine-running fault codes"]
    },
    A03: {
      tr: ["Turbo, şarj basıncı ve emiş sistemi", "Islık sesi, güç kaybı, P0299 veya P0234 her zaman turbonun arızalı olduğu anlamına gelmez. Sızdırmazlık, vakum, aktüatör, sensörler ve hedef/gerçek değerler birlikte değerlendirilmelidir.", "Tam yük testleri yapmayın. Arıza anı ve basınç verilerini kaydedin; görünür yağ izlerini veya yerinden çıkmış hatları belgeleyin.", "Yağ dumanı, yüksek sürtünme sesi, aşırı basınç kodu veya tekrarlayan koruma modu varsa.", "P0299 ve şarj basıncı hakkında oku"],
      en: ["Turbo, boost pressure & intake system", "Whistling, power loss, P0299 or P0234 do not automatically mean the turbocharger is defective. Leak-tightness, vacuum, actuator, sensors and target/actual values must be assessed together.", "Do not perform full-load tests. Save fault-condition and pressure data; document visible oil traces or detached lines.", "There is oil smoke, loud scraping, an overboost code or recurring limp mode.", "Read about P0299 and boost pressure"]
    },
    A04: {
      tr: ["Yakıt basıncı ve enjeksiyon", "Zor çalışma, yük altında tekleme veya yakıt rail basıncı kodlarının birçok nedeni olabilir. Yüksek basınç sistemleri yalnızca gözle bakılarak veya hatları gelişigüzel açarak teşhis edilemez.", "Yakıt alımını, yakıt kalitesini ve belirtilerin zamanını ilişkilendirin; kodları ve arıza anı verilerini kaydedin.", "Yüksek basınç hatları, enjektörler ve yakıt rail bileşenleri basınç ve yangın güvenliği açısından kritiktir.", "Yakıt rail basıncı kodunu oku"],
      en: ["Fuel pressure & injection", "Poor starting, hesitation under load or fuel-rail pressure codes can have many causes. High-pressure systems cannot be diagnosed through visual inspection or improvised opening of components.", "Relate refuelling, fuel quality and symptoms to their timing; save codes and freeze-frame data.", "High-pressure lines, injectors and fuel-rail components involve pressure and fire-safety risks.", "Read the fuel-rail pressure code"]
    },
    A05: {
      tr: ["Soğutma sıvısı sıcaklığı, fan veya aşırı ısınma", "Sıcaklık uyarısı; sıvı kaybı, fan, termostat, sensör veya dolaşım sorunlarından kaynaklanabilir. Kırmızı uyarıda öncelik motoru korumaktır.", "Güvenli şekilde durun, aracın tamamen soğumasını bekleyin ve seviyeyi yalnızca kullanım kılavuzuna göre kontrol edin. Sıcak soğutma sıvısı kapağını asla açmayın.", "Kırmızı sıcaklık uyarısı, buhar, soğutma sıvısı kokusu veya görünür kaçak varsa.", "Güvenli ilk kontrolleri gör"],
      en: ["Coolant temperature, fan or overheating", "A temperature warning can result from fluid loss, fan, thermostat, sensor or circulation problems. With a red warning, protecting the engine comes first.", "Stop safely, allow the vehicle to cool completely and check the level only as described in the owner's manual. Never open a hot coolant cap.", "There is a red temperature warning, steam, coolant smell or a visible leak.", "View safe initial checks"]
    },
    A06: {
      tr: ["Akü, alternatör ve 12 V şarj sistemi", "Akü uyarı lambası, zayıf marş veya elektrikli donanımlarda titreme; akünün yaşlanması, şarj sorunu, kayış tahriki, bağlantı sorunları veya olağandışı bekleme akımından kaynaklanabilir.", "Uyarıyı, marş davranışını ve anormal çalışan elektrikli donanımları kaydedin. Gevşek nesneleri uzaklaştırın; motor çalışırken akü kutup başlarını sökmeyin.", "Şarj uyarısı sürüş sırasında yanmaya devam ediyorsa, kablolar ısınıyorsa veya birden fazla elektrik arızası aynı anda beliriyorsa.", "Elektrik arıza kodlarını oku"],
      en: ["Battery, alternator & 12 V charging system", "A battery warning light, weak starting or flickering electrical equipment can result from battery ageing, charging problems, belt drive, poor connections or unusual parasitic current draw.", "Record the warning, starting behaviour and unusual electrical loads. Remove loose objects, but never disconnect battery terminals while the engine is running.", "The charging warning stays on while driving, cables become hot or several electrical faults appear at once.", "Read electrical fault codes"]
    },
    A07: {
      tr: ["Fren, ABS, ESP ve fren uyarı lambası", "Fren mesafesi, pedal hissi, kırmızı fren uyarısı ve ABS/ESP mesajları güvenlik açısından önemlidir. Tekerlek sensörü kodu her fren sorununu açıklamaz; bunun tersi de geçerlidir.", "Yumuşak pedal, yana çekme, sürtünme sesi, kırmızı uyarı veya sıvı kaybı varsa aracı kullanmaya devam etmeyin.", "Fren sistemi, ABS hidrolik ünitesi ve fren sıvısı işlemleri yalnızca üretici talimatıyla ve gerekli uzmanlıkla yapılmalıdır.", "Fren rehberini aç"],
      en: ["Brakes, ABS, ESP & brake warning light", "Stopping distance, pedal feel, red brake warnings and ABS/ESP messages are safety-critical. A wheel-sensor code does not automatically explain a braking problem, or vice versa.", "Do not continue using the vehicle if the pedal is soft, it pulls to one side, there is scraping, a red warning or fluid loss.", "Work on brakes, ABS hydraulics and brake fluid requires the manufacturer's procedures and appropriate expertise.", "Open the brake guide"]
    },
    A08: {
      tr: ["Direksiyon, süspansiyon, lastikler ve titreşim", "Direksiyon titreşimi, yana çekme, vuruntu veya direksiyon uyarısı; lastik, jant, süspansiyon, direksiyon desteği veya aks geometrisinden kaynaklanabilir. Sürüşte hissedilen değişiklikleri göz ardı etmeyin.", "Lastik basıncını araç verilerine göre kontrol edin; görünür hasarları, şişkinlikleri ve eksik tekerlek cıvatalarını ciddiye alın.", "Direksiyon ağırlaşıyorsa, araç güçlü biçimde yana çekiyorsa, lastikler hasarlı görünüyorsa veya olağandışı darbeler hissediliyorsa.", "Süspansiyon rehberini aç"],
      en: ["Steering, suspension, tyres & vibrations", "Steering-wheel vibration, pulling, knocking or a steering warning can involve tyres, wheels, suspension, power assistance or wheel alignment. Do not dismiss changes in how the vehicle feels.", "Check tyre pressures against vehicle specifications and take visible damage, bulges or missing wheel bolts seriously.", "Steering becomes heavy, the vehicle pulls strongly, tyres appear damaged or unusual impacts occur.", "Open the suspension guide"]
    },
    A09: {
      tr: ["Şanzıman, debriyaj ve güç aktarımı", "Vites değişiminde sarsıntı, geç devreye girme veya şanzıman uyarıları; sıcaklık, yazılım, sensör, hidrolik veya mekanik nedenlerle ilgili olabilir. P0700 çoğu zaman başka şanzıman kodlarına işaret eden genel bir kayıttır.", "Adaptasyon değerlerini sıfırlamayın veya tahminen yağ değiştirmeyin. Alt kodları, sıcaklığı ve sürüş koşullarını kaydedin.", "Vites devreye girmiyorsa, şiddetli darbe oluşuyorsa, yağ kaçağı varsa veya kırmızı şanzıman uyarısı görünüyorsa.", "Şanzıman kodunu oku"],
      en: ["Transmission, clutch & drivetrain", "Jerky shifts, delayed engagement or transmission warnings can involve temperature, software, sensors, hydraulics or mechanical faults. P0700 often only indicates that additional transmission codes are present.", "Do not reset adaptations or change fluids based on guesswork. Document detailed codes, temperature and driving conditions.", "A gear will not engage, there is a severe jolt, oil leaks or a red transmission warning appears.", "Read the transmission code"]
    },
    A10: {
      tr: ["Klima, üfleme fanı ve konfor elektroniği", "Soğutmama, koku, çalışmayan üfleme fanı veya konfor sistemi arızaları; basit kullanım, sigorta veya filtre sorunlarından kaynaklanabilir. Basınç, servomotor veya haberleşme sorunları da mümkündür.", "Ayarları, hava akışını ve sigortayla ilgili kılavuz bilgilerini karşılaştırın. Aracın dışına damlayan yoğuşma suyu tek başına arıza değildir.", "Soğutucu akışkan sistemi, yüksek gerilimli klima, olağandışı koku veya birden fazla kontrol ünitesi arızası söz konusuysa.", "Konfor ve bakım konularını gör"],
      en: ["Air conditioning, blower & comfort electronics", "No cooling, odours, a failed blower or comfort-system faults can have simple operating, fuse or filter causes, but may also involve pressure, actuators or communication.", "Check settings, airflow and fuse information in the owner's manual. Condensation dripping outside the vehicle is not automatically a fault.", "The refrigerant circuit, high-voltage air conditioning, unusual odours or multiple control-unit failures are involved.", "View comfort and maintenance topics"]
    },
    A11: {
      tr: ["DPF, EGR/AGR, SCR/AdBlue ve egzoz arıtma", "Uyarı lambaları, güç sınırlaması veya rejenerasyon sorunları ölçüm verileriyle ve sistemin bütünüyle değerlendirilmelidir. Partikül filtresi, EGR ve SCR emisyon ve araç uygunluğu açısından önemlidir.", "Tam kodları, seviye uyarılarını ve sürüş alışkanlıklarını kaydedin. Yalnızca kullanım kılavuzunda onaylanan sıvıları kullanın.", "Devre dışı bırakma, sökme veya sistemi atlatma talimatı verilmez. Bu rehber yalnızca kontrol ve onarımı kapsar.", "Egzoz sistemi kodlarını oku"],
      en: ["DPF, EGR, SCR/AdBlue & exhaust aftertreatment", "Warning lights, power limitation or regeneration problems require measurement data and system context. The particulate filter, EGR and SCR are relevant to emissions and vehicle approval.", "Record complete codes, fluid-level warnings and driving patterns. Use only fluids approved in the owner's manual.", "No instructions for disabling, removing or bypassing systems. This guide covers inspection and repair only.", "Read exhaust-system codes"]
    },
    A12: {
      tr: ["Yağ basıncı, yağ uyarı lambası ve yağ kaybı", "Kırmızı yağ basıncı uyarısı sıradan bir bakım hatırlatıcısı değildir. Yetersiz yağ basıncı, büyük yağ kaybı, sensör veya motor içi soruna işaret edebilir; motorun çalışmaya devam etmesi hasara yol açabilir.", "Güvenli şekilde durun ve motoru kapatın. Gaz vererek, tahminen yağ ekleyerek veya tekrar çalıştırarak test etmeyin.", "Üretici talimatına göre yağ basıncı ölçümü, kaçak araştırması ve kontrol gerekir. Görünür yağ izi veya ses varsa sürüşe devam etmeyin.", "Güvenlik kontrolünü gör"],
      en: ["Oil pressure, oil warning light & oil loss", "A red oil-pressure warning is not an ordinary service reminder. It can indicate insufficient oil pressure, severe oil loss, a sensor fault or an internal engine problem; continued running can cause damage.", "Stop safely and switch off the engine. Do not test by revving, topping up on guesswork or restarting.", "Oil-pressure measurement, leak investigation and checks following the manufacturer's instructions are necessary. Do not continue driving with a visible oil trail or unusual noise.", "View the safety check"]
    },
    A13: {
      tr: ["Duman, yanık kokusu veya sıvı kaybı", "Duman, olağandışı koku, yakıt kokusu veya aracın altındaki sıvı, sürmeye devam edip gözlemlenecek belirtiler değildir. Sıvının rengi tek başına güvenilir teşhis sağlamaz.", "Güvenli bir yerde durun, kontağı kapatın ve sıcak parçalardan uzak durun. Duman veya yanık kokusunda duruma göre yol yardımı ya da acil yardım çağırın.", "Kaçağı elle aramayın, sıcak kapakları açmayın ve yakıt kaçağından şüphelenilen aracı çalıştırmayın.", "Güvenlik bilgilerini oku"],
      en: ["Smoke, burning smell or fluid loss", "Smoke, unusual odours, fuel smell or fluid beneath the vehicle are not signs to keep driving and observe. Fluid colour alone does not provide a reliable diagnosis.", "Stop in a safe place, switch off the ignition and keep away from hot components. With smoke or a burning smell, contact roadside assistance or emergency services as appropriate.", "Do not search for leaks by hand, open hot caps or start a vehicle with a suspected fuel leak.", "Read the safety advice"]
    },
    A14: {
      tr: ["Hava yastığı, SRS ve sürüş destek sistemleri", "Hava yastığı, kemer gergisi ve sürüş destek sistemi uyarıları doğru değerlendirilmelidir. Kayıtlı arıza; gerilim kesintisinden sensör veya kalibrasyon sorununa kadar farklı nedenlere dayanabilir.", "Uyarı metnini ve zamanı kaydedin. Cam, tampon veya akü işlemlerinden sonra arızanın ortaya çıkması önemli bir ipucudur.", "Sarı konnektörleri, hava yastığı bileşenlerini, kemer sistemlerini, kameraları veya radar sensörlerini açmayın, ölçmeyin ya da kodlamayla devre dışı bırakmayın.", "Tamir rehberini aç"],
      en: ["Airbags, SRS & driver assistance", "Airbag, seat-belt pretensioner and driver-assistance warnings need careful assessment. A stored fault can range from a power interruption to a sensor or calibration problem.", "Record the warning text and timing. Its relationship to windscreen, bumper or battery work is important.", "Do not open, measure or code out yellow connectors, airbag components, restraint systems, cameras or radar sensors.", "Open the repair guide"]
    },
    A15: {
      tr: ["Hibrit ve elektrikli araç: yüksek gerilim uyarısı", "Yüksek gerilim bileşenleri, turuncu kablolar, çekiş aküsü, şarj elektroniği ve klima yetkin personelin uygulayacağı işlemler gerektirir. Aynı anda sıradan bir 12 V arızası da bulunabilir; bu, yüksek gerilim teşhisiyle aynı değildir.", "Uyarının fotoğrafını çekin, aracı kullanım kılavuzuna göre durdurun. Kaza, duman, hasarlı alt gövde veya şarj sorununda bireysel onarıma başlamayın.", "Yüksek gerilim sisteminin güvenli enerjisiz bırakılması, ölçümü, yalıtım testi ve onarımı yalnızca gerekli yetkinliğe sahip personelce yapılmalıdır.", "Tamir rehberini aç"],
      en: ["Hybrid & electric vehicle: high-voltage warning", "High-voltage components, orange cables, the traction battery, charging electronics and air conditioning require qualified procedures. An ordinary 12 V fault may also occur, but it is not the same as high-voltage diagnosis.", "Photograph the warning and park the vehicle as instructed in the owner's manual. Do not attempt DIY repair after an accident, with smoke, underbody damage or charging problems.", "High-voltage isolation, measurement, insulation testing and repair must be carried out only by appropriately qualified personnel.", "Open the repair guide"]
    },
    N01: {
      tr: ["Kamyon arıza kodları: SPN, FMI ve J1939", "Ticari araçlarda J1939 kapsamındaki SPN ve FMI, ilgili parametreyi ve anormalliğin türünü tanımlar. Kayıt ancak üretici, kontrol ünitesi, durum ve eşlik eden değerlerle anlam kazanır.", "SPN, FMI, OC/durum, üretici, araç ve motor varyantı, aktif uyarılar ve arızanın zamanı.", "Genel bir kod tablosu üreticiye özgü teşhisin yerini tutmaz. Güvenlik ve egzoz uyarılarını kaydetmeden sıfırlamayın.", "SPN/FMI temellerini oku"],
      en: ["Truck fault codes: SPN, FMI & J1939", "In commercial vehicles, SPN and FMI in J1939 describe the affected parameter and type of abnormal condition. Manufacturer, control unit, status and accompanying values are needed to interpret the record.", "SPN, FMI, OC/status, manufacturer, vehicle and engine variant, active warnings and the time the fault occurred.", "A generic code table does not replace OEM diagnosis. Do not reset safety or exhaust warnings before documenting them.", "Read SPN/FMI basics"]
    },
    N02: {
      tr: ["Havalı fren, ABS ve EBS", "Basınçlı hava uyarıları, yavaş basınç oluşumu veya EBS/ABS mesajları kamyonlarda güvenlik açısından kritiktir. Neden; hava beslemesi, sensörler, valfler, römork veya elektrik sistemi olabilir.", "Uyarı simgesini, gösterilen basıncı, aracın tepkisini ve römork durumunu kaydedin. Kullanım kılavuzu ve filo talimatları önceliklidir.", "Fren uyarısı, yetersiz hava basıncı, anormal pedal veya belirsiz fren davranışında sürüşe devam etmeyin.", "Güvenlik kontrolünü gör"],
      en: ["Air brakes, ABS & EBS", "Compressed-air warnings, slow pressure build-up or EBS/ABS messages are safety-critical on trucks. Causes may involve air supply, sensors, valves, the trailer or electrical systems.", "Document the warning symbol, displayed pressure, vehicle response and trailer status. The owner's manual and fleet procedures take priority.", "Do not continue driving with a brake warning, insufficient air pressure, abnormal pedal feel or uncertain braking behaviour.", "View the safety check"]
    },
    N03: {
      tr: ["24 V elektrik, akü ve CAN haberleşmesi", "Birden fazla uyarı, çalıştırma sorunu veya haberleşme kodları; besleme gerilimi, şase bağlantıları, konnektörler veya CAN ağlarından kaynaklanabilir. Kamyonda genellikle birden fazla kontrol ünitesi etkilenir.", "Uyarıları ve olayların sırasını kaydedin; dış konnektörlerde görünür oksitlenme veya nemi belgeleyin. Enerji altındayken hiçbir bağlantıyı açmayın.", "Birden fazla kontrol ünitesi devre dışı kalıyorsa, kablolar ısınıyorsa, sigortalar sürekli atıyorsa veya çalıştırma izni yoksa.", "Elektrik arıza kodlarını oku"],
      en: ["24 V electrics, battery & CAN communication", "Multiple warnings, starting problems or communication codes can result from power supply, ground connections, connectors or CAN networks. On trucks, more than one control unit is often involved.", "Record warnings and the sequence of events; document visible corrosion or moisture on external connectors. Do not open anything while energised.", "Several control units fail, cables become warm, fuses repeatedly blow or starting authorisation is missing.", "Read electrical fault codes"]
    },
    N04: {
      tr: ["Hava beslemesi, kompresör ve hava kurutucu", "Basıncın yavaş oluşması veya sık hava takviyesi; kaçak, kompresör, regülatör ya da kurutucu sorununa işaret edebilir. Sistem konforun yanı sıra frenleri ve yardımcı işlevleri de etkileyebilir.", "Manometre değerini, çalışma basıncına ulaşma süresini, duyulan kaçak seslerini ve koşulları kaydedin; basınç altındaki hatları sökmeyin.", "Havalı fren uyarısında veya çalışma basıncına ulaşılamadığında aracı durdurun ve üretici/filo talimatlarına uyun.", "Güvenli ilk kontrolleri gör"],
      en: ["Air supply, compressor & air dryer", "Slow pressure build-up or frequent recharging can indicate leaks or compressor, regulator or dryer problems. The system can affect brakes and auxiliary functions as well as comfort.", "Record gauge readings, time to operating pressure, audible leaks and conditions; do not disconnect pressurised lines.", "With an air-brake warning or failure to reach operating pressure, park the vehicle and follow manufacturer/fleet procedures.", "View safe initial checks"]
    },
    N05: {
      tr: ["SCR/AdBlue, NOx ve güç sınırlaması", "Ticari araçlarda güç sınırlaması veya egzoz uyarısı zaman açısından kritik olabilir. Dozaj, tank/ısıtma sistemi, NOx değerleri ve motor yönetimi doğru üretici prosedürüyle değerlendirilmelidir.", "Göstergeyi eksiksiz kaydedin, yalnızca uygun sıvıları kullanın ve mevcut SPN/FMI veya üretici kodlarını saklayın.", "Devre dışı bırakma, emülatör veya manipülasyon yoktur. Emisyon sistemleri yalnızca yasal olarak teşhis edilir ve onarılır.", "Egzoz sistemi kodlarını oku"],
      en: ["SCR/AdBlue, NOx & power limitation", "A derate or exhaust warning on a commercial vehicle can be time-critical. Dosing, tank/heating system, NOx readings and engine management must be assessed using the correct OEM procedure.", "Document the display precisely, use only suitable fluids and save available SPN/FMI or manufacturer codes.", "No disabling, emulators or tampering. Emissions systems are diagnosed and repaired legally only.", "Read exhaust-system codes"]
    },
    N06: {
      tr: ["ECAS, havalı süspansiyon ve römork bağlantısı", "Alçalmış havalı süspansiyon, seviye kontrol arızası, römork ABS'si veya aydınlatma arızaları; mekanik, hava beslemesi, sensör veya elektrik bağlantısıyla ilgili olabilir.", "Araç yüksekliğini, göstergeyi, kaplin/konnektör bağlantısını ve zamanı kaydedin. Alçalmış veya güvenli şekilde desteklenmemiş aracın altında çalışmayın.", "Sürüş yüksekliği dengesizse, römork fren uyarısı aktifse, hat hasarlıysa veya manevra/sürüş davranışı anormalse.", "Tamir rehberini aç"],
      en: ["ECAS, air suspension & trailer connection", "Lowered air suspension, ride-height control faults, trailer ABS or lighting faults may involve mechanical components, air supply, sensors or the electrical connection.", "Document vehicle height, display, coupling/connector connection and timing. Do not work beneath a lowered or unsecured vehicle.", "Ride height is unstable, a trailer brake warning is active, a line is damaged or manoeuvring/driving behaviour is abnormal.", "Open the repair guide"]
    }
  };

  const attributeCopy = new Map([
    ["Zur Startseite von 6006 Performance", ["6006 Performance ana sayfasına git", "Go to the 6006 Performance home page"]],
    ["Hauptnavigation", ["Ana gezinme", "Main navigation"]],
    ["Orientierungshinweis", ["Bilgilendirme notu", "Guidance note"]],
    ["Technikthemen filtern", ["Teknik konuları filtrele", "Filter technical topics"]],
    ["Fußnavigation", ["Alt gezinme", "Footer navigation"]],
    ["z. B. startet nicht, Bremse, Ladedruck, SPN/FMI …", ["Örn. çalışmıyor, fren, turbo basıncı, SPN/FMI…", "e.g. will not start, brakes, boost pressure, SPN/FMI…"]]
  ]);
  const translatedNodes = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest("script, style")) continue;
    const source = node.nodeValue.trim();
    if (common.has(source)) translatedNodes.push({ node, original: node.nodeValue, source });
  }
  const translatedAttributes = [];
  document.querySelectorAll("[aria-label], [placeholder]").forEach((element) => {
    ["aria-label", "placeholder"].forEach((attribute) => {
      const original = element.getAttribute(attribute);
      if (attributeCopy.has(original)) translatedAttributes.push({ element, attribute, original });
    });
  });
  const articleSelectors = [":scope > h3", ":scope > p", ".topic-grid > div:first-child > p", ".topic-grid > div:last-child > p", ".topic-link"];
  const articles = [...document.querySelectorAll("article.topic")].map((article) => ({
    key: article.querySelector(".topic-index").textContent.trim(),
    fields: articleSelectors.map((selector) => {
      const element = article.querySelector(selector);
      return { element, original: element.textContent };
    })
  }));
  const metadata = {
    de: ["Fahrzeugtechnik & Selbstprüfung | Auto & Lkw | 6006 Performance", "Fahrzeugtechnik verständlich einordnen: typische Auto-, Transporter- und Lkw-Probleme, sichere Selbstprüfungen, Warnzeichen und der passende nächste Schritt."],
    tr: ["Araç tekniği ve güvenli kontroller | Otomobil ve kamyon | 6006 Performance", "Otomobil, hafif ticari ve kamyonlarda yaygın sorunlar, güvenli ilk kontroller, uyarı işaretleri ve uygun sonraki adımlar hakkında anlaşılır teknik bilgiler."],
    en: ["Vehicle technology & safe checks | Cars & trucks | 6006 Performance", "Understand common car, van and truck problems, safe initial checks, warning signs and the appropriate next step."]
  };
  let appliedLanguage = "";
  function apply() {
    const requested = window.Locale6006?.getLanguage() || (document.documentElement.lang || "de").slice(0, 2);
    const language = ["de", "tr", "en"].includes(requested) ? requested : "de";
    if (language === appliedLanguage) return;
    appliedLanguage = language;
    const index = language === "tr" ? 0 : 1;
    translatedNodes.forEach(({ node, original, source }) => {
      node.nodeValue = language === "de" ? original : original.replace(source, common.get(source)[index]);
    });
    translatedAttributes.forEach(({ element, attribute, original }) => {
      element.setAttribute(attribute, language === "de" ? original : attributeCopy.get(original)[index]);
    });
    articles.forEach(({ key, fields }) => {
      fields.forEach(({ element, original }, fieldIndex) => {
        element.textContent = language === "de" ? original : topics[key][language][fieldIndex];
      });
    });
    document.documentElement.lang = language;
    document.title = metadata[language][0];
    document.querySelector('meta[name="description"]').content = metadata[language][1];
    document.querySelector('meta[property="og:title"]').content = metadata[language][0];
    document.querySelector('meta[property="og:description"]').content = metadata[language][1];
    document.querySelector('meta[property="og:locale"]').content = { de: "de_DE", tr: "tr_TR", en: "en_GB" }[language];
    // Re-run the existing filter so its count and translated search text agree.
    document.getElementById("topic-search").dispatchEvent(new Event("input"));
  }
  apply();
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  window.addEventListener("6006:languagechange", apply);
})();
