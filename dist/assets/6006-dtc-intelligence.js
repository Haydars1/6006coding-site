// 6006 Performance: explain the diagnostic *type* of any P/B/C/U definition.
// This is not an OEM repair lookup: subtype-specific checks are shared across
// faults and must never be presented as confirmed component diagnoses.
(function(){
"use strict";
const text={
 tr:{
  label:"Bu kod için hedefli ilk kontrol",note:"Bu adımlar kod açıklamasındaki hata türüne göre oluşturulan ön kontroldür. Kesin neden, marka/motor, üretici alt kodu, arıza anı verisi ve canlı ölçümlerle doğrulanır.",
  fam:{P:"Motor / aktarma sistemi",B:"Gövde / güvenlik elektroniği",C:"Fren / şasi / direksiyon",U:"Elektronik modüller / haberleşme"},
  safety:{P:"Yağ basıncı, yüksek hararet, ağır tekleme veya güç kaybında güvenli dur ve motoru zorlamadan kontrol ettir.",B:"Hava yastığı ve emniyet kemeri sisteminde piroteknik hatları test cihazıyla ölçme; uzman desteği al.",C:"Fren veya direksiyon işlevi etkilenmişse sürüşe devam etme; uzman kontrolü yaptır.",U:"Birçok modülde aynı anda kod varsa akü, şase ve beslemeyi önce değerlendir."},
  types:{
   short:{name:"Kısa devre olasılığı",causes:["Tesisatın besleme veya şaseye kısa devresi","İlgili sensör, valf ya da aktüatör devresinde hasar"],checks:["Hata açıklamasında belirtilen devreyi üretici elektrik şemasında belirle.","Kablo, konnektör, izolasyon ve doğru besleme/şase değerlerini kontrol et."]},
   low:{name:"Düşük sinyal / voltaj",causes:["Düşük besleme veya şaseye kısa devre","Sinyal kablosu, bağlantı ya da sensör kaynaklı sapma"],checks:["Belirtilen devrenin referans, besleme ve şase hatlarını üretici şartlarında ölç.","Canlı ölçüm ve arıza anı verisini beklenen çalışma koşullarıyla karşılaştır."]},
   high:{name:"Yüksek sinyal / voltaj",causes:["Kopuk kablo veya sensör bağlantısı","Beslemeye kısa devre ya da beklenmedik yüksek ölçüm"],checks:["Sinyal, şase ve beslemeyi ayrı ayrı doğrula; konnektörde korozyon arama.","Gerçek fiziksel değeri sensör okumasıyla karşılaştır."]},
   open:{name:"Açık devre / kopukluk",causes:["Kablo/fiş teması kopmuş olabilir","Aktüatör ya da sensör iç devresi açık olabilir"],checks:["Devreyi doğru modül ve pin numarası üzerinden tanımla.","Enerjisi kesilmiş uygun devrede süreklilik ve konnektör testi yap; güvenlik devrelerini ölçme."]},
   intermittent:{name:"Aralıklı hata",causes:["Titreşim veya ısıya bağlı temassızlık","Sporadik besleme, sensör veya haberleşme kesilmesi"],checks:["Freeze-frame ve hata zaman damgasını kaydet.","Görsel kablo/konnektör incelemesi ve kontrollü titreşim/ısı koşullarında canlı değer takibi yap."]},
   comm:{name:"Haberleşme kaybı",causes:["Modül beslemesi, sigorta veya şase sorunu","Ağ hattı kopukluğu ya da kontrol ünitesinin yanıt vermemesi"],checks:["İlgili kontrol ünitesine ayrı ayrı bağlanmayı dene ve tüm ağ hatalarını oku.","Akü gerilimini, sigorta ve şaseyi kontrol ettikten sonra CAN/LIN hattını üretici şemasına göre test et."]},
   invalid:{name:"Alınan veriler tutarsız",causes:["Gönderen modülün bağlı sensöründe hata","Ağ mesajı, yazılım veya kalibrasyon uyumsuzluğu"],checks:["Mesajı gönderen modülün kendi arıza hafızasını oku.","Sensör canlı değerleriyle ağ iletişimindeki veriyi kıyasla."]},
   pressure:{name:"Basınç ölçümü / regülasyon",causes:["Sensör, hat, kaçak veya besleme sapması","Pompa, regülatör ya da mekanik sistemin gerçekten yetersiz çalışması"],checks:["Hedef ve gerçek basıncı aynı yük/sıcaklıkta karşılaştır.","Sistemine göre bağlantı, kaçak, sensör ve regülatör testlerini ayrı ayrı yap."]},
   temperature:{name:"Sıcaklık ölçümü / kontrolü",causes:["Sensör, termostat, fan veya ısıtıcı sapması","Isıtma/soğutma sistemi fiziksel olarak yanlış çalışıyor olabilir"],checks:["Soğuk motorda sensör sıcaklığını ortam koşullarıyla karşılaştır.","Isınma, soğutma ve kontrol komutlarını üretici eşikleriyle izle."]},
   misfire:{name:"Yanma / tekleme",causes:["Ateşleme veya yakıt püskürtme bozukluğu","Kompresyon, hava kaçağı veya zamanlama sorunu"],checks:["Hangi silindirde, hangi yük ve devirde tekleme olduğunu sayacından belirle.","Motor tipine uygun ateşleme, enjektör, hava/yakıt ve kompresyon kontrollerini sırala."]},
   efficiency:{name:"Verimlilik / sistem eşiği",causes:["İlgili sistem yeterli verimi sağlamıyor","Sıcaklık, sensör veya önceki başka arızalar sonucu ölçüm yanıltılıyor"],checks:["Aynı anda görünen ilişkili hata kodlarını ve çalışma sıcaklıklarını incele.","Sistemin giriş/çıkış sensörlerini ve gerçek performansını üretici test döngüsünde karşılaştır."]},
   position:{name:"Konum / mekanik hareket",causes:["Aktüatör ya da bağlantı mekanizması sıkışabilir","Konum geri bildirimi, elektrik beslemesi veya uyarlama bozuk olabilir"],checks:["Komut edilen ve ölçülen konumu birlikte izle.","Bağlantı/aktüatör hareketini güvenli testle değerlendir; adaptasyonu yalnızca gerekli şartlarda uygula."]},
   lean:{name:"Fakir karışım / yakıt düzeltmesi",causes:["Hava kaçağı veya yetersiz yakıt beslemesi","Hatalı hava kütlesi ve lambda sensörü ölçümü"],checks:["Kısa/uzun dönem yakıt düzeltmelerini çalışma koşullarına göre kaydet.","Emiş kaçağı, besleme basıncı ve lambda ölçümünü ayrı ayrı doğrula."]},
   rich:{name:"Zengin karışım / fazla yakıt",causes:["Enjektör kaçağı ya da yüksek yakıt basıncı","Hatalı hava/lambda ölçümü veya ateşleme problemi"],checks:["Yakıt düzeltme değerleri ve lambda ölçümlerini incele.","Enjektör, basınç regülasyonu ve hava yolu verilerini kontrol et."]},
   general:{name:"Üreticiye göre değişen sistem arızası",causes:["Açıklamada adı geçen bileşen veya devrede bir problem olabilir","Başka bir sistemin arızası bu kayda neden olmuş olabilir"],checks:["Tam kodu, üretici yorumunu ve varsa alt kodu doğrula.","Freeze-frame, eşzamanlı diğer kodlar ve canlı değerler üzerinden OEM test planını seç."]}
  }
 },
 de:{
  label:"Gezielte Erstprüfung für diesen Code",note:"Diese Hinweise ordnen den Fehlertyp anhand des Quelltextes ein. Keine bestätigte Bauteildiagnose: Hersteller, Motorcode, Untercode, Freeze-Frame und Istwerte abgleichen.",
  fam:{P:"Motor / Antrieb",B:"Karosserie / Rückhaltesystem",C:"Bremse / Fahrwerk / Lenkung",U:"Steuergeräte / Datenkommunikation"},
  safety:{P:"Bei Öldruckwarnung, Überhitzung, starkem Misfire oder plötzlichem Leistungsverlust sicher anhalten.",B:"Airbag-/Gurtstrafferkreise nicht mit gewöhnlichen Messgeräten prüfen; Fachbetrieb beauftragen.",C:"Bei Einschränkung von Bremse oder Lenkung nicht weiterfahren.",U:"Bei gleichzeitigen Netzwerkfehlern zuerst Spannung, Versorgung und Masse bewerten."},
  types:{
   short:{name:"Möglicher Kurzschluss",causes:["Kabelschluss gegen Plus oder Masse","Beschädigung im Sensor- oder Stellgliedkreis"],checks:["Betroffenen Stromkreis aus dem Schaltplan identifizieren.","Stecker, Isolierung, Versorgung und Masse unter korrekten Bedingungen prüfen."]},
   low:{name:"Signal / Eingang zu niedrig",causes:["Unterspannung oder Kurzschluss nach Masse","Signalweg oder Sensorsignal unplausibel"],checks:["Versorgung, Referenzspannung und Masse nach Vorgabe prüfen.","Signalverlauf mit tatsächlichem Betriebszustand und Freeze-Frame abgleichen."]},
   high:{name:"Signal / Eingang zu hoch",causes:["Unterbrochene Verbindung oder Masse","Kurzschluss nach Plus oder tatsächlich hoher Messwert"],checks:["Signal, Referenz und Masse getrennt überprüfen.","Realen Systemwert mit Sensorwert vergleichen."]},
   open:{name:"Leitungsunterbrechung",causes:["Kabelbruch oder Kontaktfehler","Elektrisch offenes Sensorelement oder Stellglied"],checks:["Richtige Steckverbindung und Pinbelegung bestimmen.","Durchgang nur im sicher spannungsfreien geeigneten Kreis prüfen; nicht an SRS."]},
   intermittent:{name:"Sporadischer / intermittierender Fehler",causes:["Wärme- oder vibrationsabhängiger Wackelkontakt","Zeitweilige Versorgung oder Signalunterbrechung"],checks:["Freeze-Frame und Fehlerzeitpunkte sichern.","Leitung, Stecker und Istwerte kontrolliert auf sporadische Ausfälle untersuchen."]},
   comm:{name:"Steuergerätekommunikation fehlt",causes:["Versorgung, Sicherung oder Masse eines Steuergeräts","Busunterbrechung oder ausgefallener Netzwerkteilnehmer"],checks:["Erreichbarkeit des betroffenen Moduls und Gesamtfehlerspeicher prüfen.","Erst Versorgung/Masse, dann CAN/LIN-Verkabelung nach Schaltplan prüfen."]},
   invalid:{name:"Ungültige Daten eines Steuergeräts",causes:["Sensordaten im sendenden Modul unplausibel","Netzwerk-/Software-/Kalibrierungskonflikt"],checks:["Fehler im sendenden Steuergerät separat lesen.","Dessen Istwerte und Buskommunikation vergleichen."]},
   pressure:{name:"Druck / Druckregelung",causes:["Sensor, Leitung oder Undichtigkeit","Pumpe, Regler oder tatsächliche Druckabweichung"],checks:["Druck Soll/Ist unter gleichen Lastbedingungen erfassen.","Sensor, Leitungen, Regler und mechanische Versorgung gezielt eingrenzen."]},
   temperature:{name:"Temperatur / Thermomanagement",causes:["Geber, Heizung, Thermostat oder Lüfter","Tatsächliche Kühlungs- bzw. Erwärmungsstörung"],checks:["Kaltes Sensorsignal mit Umgebungstemperatur vergleichen.","Verlauf und Stellbefehle mit Hersteller-Grenzwerten vergleichen."]},
   misfire:{name:"Verbrennungsaussetzer",causes:["Zündung oder Einspritzung","Gemisch, Ansaugleck oder Kompression"],checks:["Aussetzerzähler nach Zylinder, Last und Drehzahl auswerten.","Zündung/Einspritzung und gegebenenfalls Kompression gezielt prüfen."]},
   efficiency:{name:"Wirkungsgrad / Leistungsgrenze",causes:["Tatsächliche Systemwirkung zu gering","Sensor- oder Temperaturbedingungen verfälschen Bewertung"],checks:["Begleitfehler und Freigabebedingungen auslesen.","Eingangs-/Ausgangssignale unter gültigen Messbedingungen vergleichen."]},
   position:{name:"Position / Stellbewegung",causes:["Mechanik oder Stellglied klemmt","Positionsgeber, Versorgung oder Anlernung unplausibel"],checks:["Stellungs-Sollwert und Istwert vergleichen.","Stellweg, Aktuator und Verkabelung nach Vorgaben prüfen."]},
   lean:{name:"Gemisch zu mager",causes:["Falschluft oder zu geringe Kraftstoffzufuhr","Luftmassen-/Lambdasignalabweichung"],checks:["Kurz- und Langzeit-Kraftstofftrims vergleichen.","Ansaugdichtheit, Kraftstoffdruck und Lambda auswerten."]},
   rich:{name:"Gemisch zu fett",causes:["Undichter Injektor oder zu hoher Kraftstoffdruck","Falsche Luft-/Lambdawerte oder Zündproblem"],checks:["Kraftstofftrims und Lambdasignale vergleichen.","Injektoren, Kraftstoffdruck und Ansaugsystem testen."]},
   general:{name:"Fahrzeugspezifische Systemstörung",causes:["Störung im beschriebenen Bauteil oder Stromkreis","Folgecode eines anderen Problems"],checks:["Kompletten Code, Herstellerdefinition und Untercode prüfen.","Freeze-Frame, zugehörige Fehler und OEM-Prüfplan heranziehen."]}
  }
 },
 en:{
  label:"Targeted first checks for this code",note:"These preliminary checks are inferred from the diagnostic fault type, not a confirmed component failure. Verify vehicle, engine, OEM subcode, freeze-frame and live data.",
  fam:{P:"Powertrain / engine / transmission",B:"Body and restraint systems",C:"Brakes, chassis and steering",U:"Module communication / network"},
  safety:{P:"Stop safely for oil-pressure, overheating, severe misfire or loss-of-power warnings.",B:"Do not probe airbag/pretensioner pyrotechnic circuits; use a trained technician.",C:"Do not continue driving with impaired brakes or steering.",U:"If many modules report network faults, verify battery, power and grounds first."},
  types:{
   short:{name:"Possible circuit short",causes:["Short to supply or ground","Damaged sensor or actuator circuit"],checks:["Identify the circuit from the correct wiring diagram.","Check harness, insulation, connections, supplies and grounds safely."]},
   low:{name:"Low signal / input",causes:["Low supply or short to ground","Signal-path or sensor issue"],checks:["Verify reference, power and ground against service specs.","Compare live reading with actual conditions and freeze-frame."]},
   high:{name:"High signal / input",causes:["Open circuit or ground issue","Short to supply or genuinely high system value"],checks:["Check signal, reference and ground independently.","Compare measured physical value with sensor signal."]},
   open:{name:"Open circuit",causes:["Broken wire or connector","Open element inside sensor/actuator"],checks:["Identify exact wiring pins and circuit.","Perform suitable continuity checks only when safe; not on pyrotechnic circuits."]},
   intermittent:{name:"Intermittent fault",causes:["Heat- or vibration-sensitive connection","Transient power or signal loss"],checks:["Save freeze-frame and fault timestamp.","Observe connectors and live data under controlled changes."]},
   comm:{name:"Lost module communication",causes:["Missing module power, fuse or ground","Damaged bus wiring or unresponsive module"],checks:["Attempt to address the module and scan all controllers.","Check supply and ground before testing CAN/LIN wiring."]},
   invalid:{name:"Invalid module data",causes:["Bad sensor input at transmitting controller","Network/software/calibration mismatch"],checks:["Read sending module fault memory.","Compare its live values with network messages."]},
   pressure:{name:"Pressure control or measurement",causes:["Pressure sensor, plumbing or leaks","Pump/regulator or real low/high pressure"],checks:["Record commanded and actual pressure at same load.","Individually test lines, sensors and mechanical regulation."]},
   temperature:{name:"Temperature / thermal management",causes:["Sensor, heater, thermostat or fan","Actual cooling/heating fault"],checks:["Compare cold reading with ambient temperature.","Log warmup, cool-down and command values versus OEM specs."]},
   misfire:{name:"Misfire / combustion",causes:["Ignition or injector fault","Mixture, air leaks or compression"],checks:["Identify affected cylinder, load and RPM via counters.","Test ignition, injection, mixture and compression as applicable."]},
   efficiency:{name:"Efficiency / performance below threshold",causes:["System may underperform","Wrong sensor or temperature readings skew monitoring"],checks:["Check related codes and enabling conditions first.","Compare upstream/downstream values during OEM monitor conditions."]},
   position:{name:"Position / actuator motion",causes:["Sticking actuator or linkage","Position sensor, wiring or adaptation problem"],checks:["Compare commanded and actual position.","Inspect movement and connections; adapt only when specified."]},
   lean:{name:"Lean air/fuel mixture",causes:["Intake air leak or inadequate fuel delivery","MAF/oxygen sensor discrepancy"],checks:["Inspect short- and long-term fuel trims.","Check intake leakage, fuel pressure and oxygen signals."]},
   rich:{name:"Rich air/fuel mixture",causes:["Leaking injector or excess fuel pressure","Incorrect air/oxygen signal or ignition issue"],checks:["Inspect trims and oxygen readings.","Test fuel pressure, injectors and intake measurements."]},
   general:{name:"Vehicle-specific system fault",causes:["Issue within named component or circuit","Possible secondary code from another fault"],checks:["Confirm full code, manufacturer and subcode.","Review freeze-frame, associated codes and OEM test plan."]}
  }
 }
};
function faultType(code,description){
 const d=String(description||"").toLowerCase(),codeValue=String(code||"").toUpperCase();
 if(/short to (ground|earth|positive|battery)|short(ed)? circuit|circuit short|kurzschluss/i.test(d))return "short";
 if(/intermittent|sporadic|erratic|implausible intermittent/i.test(d))return "intermittent";
 if(/lost communicat|no communicat|communication (lost|failure)|no signal received|bus off/i.test(d)||(/^U0/.test(codeValue)&&/communication|communicatio|lost|bus|network/.test(d)))return "comm";
 if(/invalid data received|invalid data|implausible data/i.test(d))return "invalid";
 if(/open circuit|circuit open|circuit\/open|electrical open|open or short/i.test(d))return "open";
 if(/circuit low|input low|signal low|low voltage|voltage below|short to ground/i.test(d))return "low";
 if(/circuit high|input high|high input|signal high|high signal|high voltage|voltage above|short to battery/i.test(d))return "high";
 if(/misfire|combustion fault|ignition miss/i.test(d))return "misfire";
 if(/system too lean|mixture too lean|lean bank/i.test(d))return "lean";
 if(/system too rich|mixture too rich|rich bank/i.test(d))return "rich";
 if(/position|actuator|stuck open|stuck closed|stuck off|stuck on|position sensor/i.test(d))return "position";
 if(/pressure|boost|rail pressure|barometric|vacuum/i.test(d))return "pressure";
 if(/temperature|coolant|thermostat|overheat|heater|heat sensor/i.test(d))return "temperature";
 if(/efficiency|performance|range|threshold|below limit|above limit/i.test(d))return "efficiency";
 return "general";
}
function explain(code,description,manufacturer,language){
 const l=text[language]||text.de;
 const limited=/airbag|srs|pretension|restraint|squib|high.voltage|hybrid|traction battery|pyrotechnic/i.test(description);
 const pending=/(?:readiness|monitor testing|systems? test).*(?:not complete|not completed|incomplete)/i.test(description);
 const missing=/^(?:manufacturer controlled dtc|(?:iso[ /-]*)?sae reserved|reserved(?:\s.*)?|not (?:used|defined|assigned)|unknown|no definition available)[.!\s]*$/i.test(String(description).trim());
 if(limited||pending||missing){
  const copy={
   tr:pending?["OBD testi henüz tamamlanmadı","Bu kayıt tek başına parça arızası göstermez.","Hazırlık durumunu ve diğer kodları kaydet; hata silme işlemi test durumunu sıfırlayabilir.","Araç üreticisinin test koşullarını güvenli biçimde uygula; bu kayda dayanarak parça değiştirme."]:["Uzman incelemesi gereken güvenlik sistemi","Genel elektrik kontrolleri bu sisteme uygulanmamalıdır.","Tam kodu, alt kodu ve araç bilgilerini kaydet.","Piroteknik veya yüksek voltaj devrelerini ölçme; uygun eğitimli uzman ve üretici prosedürü gerekir."],
   de:pending?["OBD-Prüfstatus unvollständig","Dieser Eintrag allein bestätigt keinen Bauteildefekt.","Readiness und weitere Fehler sichern; Löschen kann den Prüfstatus zurücksetzen.","Fahrzeugspezifische Prüfbedingungen sicher anwenden; aus diesem Eintrag keinen Teiletausch ableiten."]:["Sicherheitsrelevantes System: Fachprüfung","Allgemeine elektrische Tests sind hier nicht übertragbar.","Vollständigen Code, Untercode und Fahrzeugdaten sichern.","Pyrotechnische und Hochvolt-Kreise nicht selbst messen; qualifizierte Fachkräfte und Herstellerverfahren erforderlich."],
   en:pending?["OBD monitor testing incomplete","This entry alone does not confirm a component failure.","Record readiness and other codes; clearing codes can reset monitor status.","Follow vehicle-specific monitor conditions safely; do not replace parts based on this entry."]:["Safety-critical system: specialist assessment","General electrical tests must not be applied to this system.","Record the complete code, subcode and vehicle details.","Do not probe pyrotechnic or high-voltage circuits; qualified personnel and manufacturer procedures are required."]
  }[language]||null;
  const unknown={tr:['Kaynakta somut tanım yok','Bu kayıttan parça arızası veya onarım çıkarılamaz.','Araç, kontrol ünitesi ve üretici alt koduyla tam arıza açıklamasını edin.','Kod numarası yerine doğrulanmış üretici açıklamasını esas al.'],de:['Keine konkrete Definition vorhanden','Aus diesem Eintrag lässt sich kein Bauteildefekt oder Reparaturbedarf ableiten.','Vollständigen Diagnosetext mit Fahrzeug, Steuergerät und Hersteller-Untercode beschaffen.','Die bestätigte Herstellerdefinition statt der Nummer allein als Grundlage verwenden.'],en:['No specific definition available','This entry cannot establish a component failure or required repair.','Obtain the complete diagnostic text with vehicle, control module and OEM subcode.','Use the confirmed manufacturer definition rather than the code number alone.']}[language];
  const selected=missing?unknown:copy;
  if(selected)return {mode:missing?'undefined':pending?'readiness':'specialist',limited:true,classification:selected[0],family:l.fam[String(code)[0]]||l.types.general.name,label:l.label,note:l.note,causes:[selected[1]],checks:selected.slice(2),safety:l.safety[String(code)[0]]||l.safety.P,manufacturer:manufacturer||'GENERIC'};
 }
 const mode=faultType(code,description), type=l.types[mode]||l.types.general;
 const fam=l.fam[String(code||"")[0]]||l.types.general.name;
 return {mode,classification:type.name,family:fam,label:l.label,note:l.note,causes:[...type.causes],checks:[...type.checks],safety:l.safety[String(code||"")[0]]||l.safety.P,manufacturer:manufacturer||"GENERIC"};
}
const API={explain,faultType};
if(typeof window!=="undefined")window.DTCIntelligence6006=API;
if(typeof module!=="undefined"&&module.exports)module.exports=API;
})();
