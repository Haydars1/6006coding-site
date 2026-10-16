(() => {
"use strict";
const $=id=>document.getElementById(id);
const langMap={
tr:{title:"Arıza kodunu bul. Sistemi ve kontrol yolunu öğren.",lead:"Motor, şanzıman, ABS, hava yastığı, gövde elektroniği ve iletişim kodlarını tek yerde ara. Marka özelindeki farklı tanımları karşılaştır. Her kod için olası nedenleri ve güvenli kontrol adımlarını gör.",search:"Arıza kodu veya konu ara",submit:"Ara",brand:"Araç markası",allBrands:"Tüm markalar",family:"Kod grubu",results:"Eşleşen kodlar",count:"kod tanımı",unique:"Farklı DTC",makers:"Üretici kaydı",hint:"Kod tanımları bir parçanın kesin bozuk olduğunu göstermez. Sonuçlar araç, motor ve üreticiye göre doğrulanmalıdır.",more:"Daha fazla göster",loading:"Veri tabanı yükleniyor…",error:"Veri tabanı yüklenemedi, sayfayı yenile.",none:"Eşleşen tanım yok. Yazımı veya marka filtresini kontrol et.",choose:"Bir kod seçerek teknik tanımı ve kontrol adımlarını görüntüle.",causes:"Muhtemel nedenler",checks:"Kontrol ve onarım sırası",english:"Kaynakta geçen İngilizce teknik tanım",type:"Kod kategorisi",manufacturer:"Üretici tanımı",generic:"Genel OBD-II",verify:"Kesin parça değişimi önerisi değildir. Marka, motor kodu, alt DTC kodu, freeze-frame ve canlı verilerle doğrula.",unknown:"Üreticiye özel olabilecek kod. Marka ve ECU bilgisi olmadan net açıklama belirlenemez.",invalid:"Kod biçimi hatalı. DTC biçimi örneği: P0104, U0100, B0001.",suggest:"Şunları dene",origin:"Bu kayıt açık kaynaklı DTC tanımıdır; yetkili üretici tamir verisinin yerini tutmaz.",copy:"Kod bağlantısını kopyala",whatsapp:"Ustaya danış",attention:"Fren, direksiyon, hava yastığı, yüksek voltaj, yağ basıncı veya aşırı hararet uyarısı varsa aracı güvenli şekilde durdurup uzman desteği al.",codes:"Kod tanımı",browse:"Örnek kodlar",noBrand:"Bu marka için özel kayıt bulunmayabilir; genel tanımlar da gösteriliyor."},
de:{title:"Fehlercode finden. System verstehen. Prüfschritte sehen.",lead:"Durchsuche Motor-, Getriebe-, Brems-, Karosserie- und Kommunikationscodes. Vergleiche generische und herstellerspezifische Beschreibungen und sichere Prüfschritte.",search:"Fehlercode oder Stichwort",submit:"Suchen",brand:"Fahrzeugmarke",allBrands:"Alle Marken",family:"Codegruppe",results:"Treffer",count:"DTC-Definitionen",unique:"Unterschiedliche DTC",makers:"Hersteller",hint:"Ein DTC beweist keinen Bauteilschaden. Hersteller-, Motor- und Umgebungsdaten prüfen.",more:"Mehr anzeigen",loading:"Datenbank wird geladen…",error:"Datenbank konnte nicht geladen werden.",none:"Kein Treffer. Schreibweise und Markenfilter prüfen.",choose:"Code wählen, um Beschreibung und Prüfschritte anzuzeigen.",causes:"Mögliche Ursachen",checks:"Prüf- und Reparaturreihenfolge",english:"Technische Originalbeschreibung (Englisch)",type:"Codegruppe",manufacturer:"Herstellerdefinition",generic:"Generischer OBD-II",verify:"Keine definitive Reparaturempfehlung. Marke, Motorkennbuchstabe, Untercode, Freeze-Frame und Live-Daten prüfen.",unknown:"Möglicherweise herstellerspezifischer Code. Ohne ECU-Kontext keine eindeutige Bedeutung.",invalid:"Ungültiges DTC-Format. Beispiel: P0104 oder U0100.",suggest:"Probiere",origin:"Open-Source-DTC-Datensatz; ersetzt keine OEM-Reparaturinformation.",copy:"Code-Link kopieren",whatsapp:"Fachbetrieb kontaktieren",attention:"Bei Brems-, Lenkungs-, Airbag-, Hochvolt-, Öldruck- oder Überhitzungswarnungen sicher anhalten.",codes:"Definitionen",browse:"Beispielcodes",noBrand:"Allgemeine Definitionen werden zusätzlich angezeigt."},
en:{title:"Find the fault code. Understand the system and next tests.",lead:"Browse engine, transmission, safety, body and network codes. Compare generic and manufacturer interpretations with sensible diagnostic checks.",search:"Search code or symptom",submit:"Search",brand:"Vehicle brand",allBrands:"All brands",family:"Code family",results:"Matching codes",count:"Code definitions",unique:"Unique DTCs",makers:"Manufacturers",hint:"A code is not proof of a failed component. Verify vehicle, engine and freeze-frame data.",more:"Show more",loading:"Loading code database…",error:"Could not load database.",none:"No match. Check spelling or manufacturer filter.",choose:"Select a code to view its definition and diagnostic steps.",causes:"Possible causes",checks:"Testing and repair sequence",english:"Original English definition",type:"Code family",manufacturer:"Manufacturer definition",generic:"Generic OBD-II",verify:"Not a definitive repair instruction. Verify manufacturer, engine, fault subtype, freeze-frame and live data.",unknown:"Possibly manufacturer-specific. Exact meaning requires vehicle and ECU context.",invalid:"Invalid DTC format. Example: P0104 or U0100.",suggest:"Try",origin:"Open-source DTC data; not a replacement for OEM repair manuals.",copy:"Copy code link",whatsapp:"Ask a technician",attention:"For braking, steering, airbag, high voltage, low oil pressure or overheating warnings, stop safely and seek professional help.",codes:"Definitions",browse:"Example codes",noBrand:"Generic definitions are also shown."}};
const outlines={
tr:{
turbo:{name:"Turbo / şarj basıncı",causes:["Şarj havası hattında kaçak, gevşek kelepçe veya intercooler kaçağı","Vakum hattı, turbo aktüatörü veya basınç kontrol valfi sorunu","MAP/MAF sensörü ya da turbo mekanizması performans sorunu"],checks:["Turbo giriş, çıkış, intercooler ve hortumları gözle incele; kaçak testi uygula","İstenen ve gerçek şarj basıncını uygun sürüş koşullarında canlı veriden karşılaştır","Vakum/aktüatör hareketini ve kontrol sinyalini ölç","Kök neden doğrulandıktan sonra ilgili hortum, sensör veya aktüatörü onar; hata kodunu tekrar kontrol et"]},
dpf:{name:"Partikül filtresi / egzoz",causes:["Yüksek kurum yükü, tıkanma veya kaçak","Diferansiyel basınç sensörü, hortumu, egzoz sıcaklık sensörü arızası","Rejenerasyona engel olan motor veya yakıt sistemi problemi"],checks:["DPF basınç farkı, kurum/kül yükü, egzoz sıcaklıkları ve son rejenerasyon verilerini oku","Basınç sensörü ve bağlantı hortumlarında tıkanma/kaçak kontrolü yap","Rejenerasyonu engelleyen diğer motor kodlarını ve çalışma sıcaklığını kontrol et","Filtrenin fiziksel durumu doğrulanmadan zorunlu rejenerasyon veya parça değişimi yapma"]},
adblue:{name:"SCR / AdBlue / NOx",causes:["Redüktan kalitesi, seviye, pompa veya dozaj hatası","NOx sensörlerinin verileri veya kablolama sorunu","SCR katalizörü, ısıtıcı veya enjektör performansı"],checks:["Önce ilgili NOx, dozaj ve sıcaklık verilerini oku","Redüktan seviyesi/kalitesi ile pompa basıncını üretici prosedürüne göre kontrol et","Isıtma hatları, tesisat, enjektör ve sensörleri test et","Kesin arızalı bileşeni onar; SCR/AdBlue sistemini devre dışı bırakma"]},
fuel:{name:"Yakıt besleme / enjeksiyon",causes:["Düşük/yüksek yakıt basıncı veya besleme kısıtı","Yakıt filtresi, pompa, regülatör veya enjektör sorunu","Yakıt sensörü, bağlantısı ya da kablo hattı arızası"],checks:["Yakıt kaçaklarını ve filtreyi kontrol et","Rölantide ve yük altında hedef/gerçek rail basıncını ölç","Düşük basınç besleme, regülatör ve sensör devrelerini ayırarak test et","Ölçümlere göre onar; yüksek basınç hattını güvenli basınç düşürmeden açma"]},
brake:{name:"Fren / ABS / denge kontrolü",causes:["Tekerlek hız sensörü ya da manyetik halka sorunu","ABS modülü, hidrolik ünite veya kablolama arızası","Besleme voltajı, fren hidroliği veya hidrolik problem"],checks:["Kırmızı fren uyarısı varsa sürüşe devam etme","Dört tekerlek hızını canlı veride karşılaştır","Sensör, kablo, konnektör ve ABS beslemesini kontrol et","Fren ve ABS üzerinde işlemi yetkili uzman yapsın; güvenli çalışma doğrulansın"]},
network:{name:"CAN / ECU haberleşmesi",causes:["Zayıf akü veya modül besleme/topraklama sorunu","CAN hattında açık devre, kısa devre veya bağlantı oksitlenmesi","Bir kontrol ünitesinin yanıt vermemesi veya ağ geçidi sorunu"],checks:["Akü voltajını ve şase bağlantılarını ölç","Etkilenen kontrol ünitesini ve diğer iletişim kodlarını tüm modüllerden oku","Sigorta, CAN hattı ve modül beslemelerini üretici şemasına göre kontrol et","Onarımdan sonra modüllerin haberleşmesini ve kodların geri gelmediğini doğrula"]},
transmission:{name:"Şanzıman / aktarma",causes:["Şanzıman kontrol modülünde alt arıza kaydı","Sensör, hidrolik basınç, yağ durumu veya solenoid problemi","Debriyaj, vites seçici ve elektrik tesisatı sorunu"],checks:["Şanzıman ECU'sundaki ayrıntılı kodları oku","Uygun yağ seviye/sıcaklık prosedürünü ve canlı basınç verilerini kontrol et","İlgili sensör/solenoid elektriksel ölçümlerini yap","Doğrulanmış arızayı onar; adaptasyonları yalnızca OEM şartıyla uygula"]},
cooling:{name:"Soğutma / hararet",causes:["Termostat, sensör veya fan kontrolü sorunu","Soğutma sıvısı seviyesi, kaçak veya dolaşım problemi","Elektrik tesisatı ya da su pompası sorunu"],checks:["Aşırı hararet varsa güvenli yerde dur ve motoru soğut","Soğukken sıvı seviyesini ve dış kaçakları kontrol et","Canlı sıcaklık, termostat ve fan komutlarını doğrula","Arızalı parçayı testle doğrulamadan değiştirme; sıcak kapağı açma"]},
oil:{name:"Yağlama / motor koruması",causes:["Düşük yağ seviyesi/basıncı veya sensör hatası","Yağ pompası, tıkanma ya da tesisat sorunu","Motor iç mekanik aşınması"],checks:["Kırmızı yağ basıncı uyarısında motoru kapat","Üretici prosedürüyle yağ seviyesini ve fiziksel yağ basıncını ölç","Basınç sensörü/tesiset ve yağ filtresini değerlendir","Gerçek basınç düşüklüğü varsa motoru tekrar çalıştırmadan onarım yap"]},
airbag:{name:"Hava yastığı / emniyet sistemi",causes:["SRS sensörü, koltuk bağlantısı veya kablo demeti arızası","Kontrol ünitesi, besleme veya şase sorunu","Önceki kaza ve ilgili bileşen arızası"],checks:["SRS kodlarını uygun cihazla ayrıntılı oku","Üretici güvenlik prosedürüne göre besleme ve konnektörleri incele","Piroteknik devrelere standart ohmmetre uygulama","SRS onarımını yetkili uzman yapsın ve sistem kontrolünü doğrulasın"]},
body:{name:"Gövde elektroniği",causes:["İlgili düğme, aktüatör veya konum sensörü arızası","Sigorta, besleme, şase veya kablo kopması","Kontrol modülü ile iletişim/yazılım sorunu"],checks:["İlgili fonksiyonun çalışma koşullarını kontrol et","Sigorta, voltaj ve konnektörleri doğrula","Canlı durum/aktüatör testini uygun cihazla uygula","Kodun bağlı olduğu modülü onardıktan sonra tekrar tara"]},
sensor:{name:"Sensör / ölçüm devresi",causes:["Sensörde kirlenme veya ölçüm aralığı bozukluğu","Açık/kısa devre, 5V referans veya şase sorunu","İlgili mekanik sistemdeki gerçek değerlerin sınır dışında olması"],checks:["DTC'nin belirttiği sensör veya kanalı tanımla","Besleme, referans voltajı, şase ve sinyal hattını ölç","Canlı veriyi üretici normal değerleriyle karşılaştır","Sensör değil mekanik koşul bozuksa kök nedeni onar"]},
ignition:{name:"Ateşleme / yanma",causes:["Bujiler, bobin veya enjektör problemi","Hava/yakıt karışımı veya sıkıştırma sorunu","İlgili sensör ve elektrik tesisatı sorunu"],checks:["İlgili silindir ve freeze-frame verisini belirle","Ateşleme ve yakıt testleri yap; şiddetli tekleme varsa aracı zorlama","Sıkıştırma ve emme kaçaklarını gerektiğinde kontrol et","Bulunan nedeni giderip tekrar test et"]},
steering:{name:"Direksiyon / şasi",causes:["Direksiyon açı veya tork sensörü sorunu","Besleme, elektrik motoru veya kontrol modülü arızası","Süspansiyon ve konum sensörü arızası"],checks:["Direksiyon işlevi etkilenmişse sürüşe devam etme","Şasi kontrol modüllerini ve canlı açı/tork verilerini oku","Besleme, sensörler ve bağlantıları ölç","Güvenli mekanik ve elektronik testlerden sonra gerekli onarımı yap"]},
generic:{name:"Araç sistemi / kontrol ünitesi",causes:["Kod açıklamasında belirtilen parçaya bağlı elektriksel sorun","Mekanik veya çalışma koşulu kaynaklı ölçüm sapması","Kontrol ünitesi, sensör veya bağlantı sorunu"],checks:["Tam DTC, alt kod, araç markası ve motor kodunu kaydet","Freeze-frame, canlı sensör değerleri ve ilgili diğer kodları karşılaştır","Kablolama ve mekanik sistem için üretici test planını uygula","Kök neden doğrulandıktan sonra onar ve hata tekrar oluşuyor mu kontrol et"]}
}};
const localeGuides={de:{"turbo":{"name":"Turbolader / Ladedruck","causes":["Undichte Ladeluftstrecke","Defekte Unterdruck- oder Stellgliedregelung","Ladedrucksensor oder mechanischer Turbofehler"],"checks":["Ladeluftschläuche und Ladeluftkühler auf Dichtheit prüfen","Ladedruck-Sollwert mit Istwert vergleichen","Unterdruck, Stellglied und Drucksensor prüfen","Nur die nach Messung bestätigte Ursache reparieren"]},"dpf":{"name":"Dieselpartikelfilter / Abgas","causes":["Hohe Ruß- oder Aschebeladung","Defekter Differenzdruck- oder Temperatursensor","Abgebrochene Regeneration durch Motorfehler"],"checks":["Differenzdruck, Beladung und Temperaturen auslesen","Sensorleitungen und Druckschläuche prüfen","Weitere Motorcodes und Regenerationsbedingungen prüfen","Keine Zwangsregeneration ohne Zustandsprüfung"]},"adblue":{"name":"SCR / AdBlue / NOx","causes":["Fehler bei Reduktionsmittelqualität oder Dosierung","NOx-Sensor oder Verkabelung","SCR-Katalysator, Heizung oder Einspritzventil"],"checks":["NOx- und Dosierdaten auslesen","Füllstand, Qualität, Druck und Heizung prüfen","Leitungen und Sensoren testen","Defektes Bauteil reparieren, Abgasreinigung nicht deaktivieren"]},"fuel":{"name":"Kraftstoff / Einspritzung","causes":["Unpassender Kraftstoffdruck oder Fördermangel","Filter, Pumpe, Regler oder Injektor","Drucksensor oder Kabelproblem"],"checks":["Auf Kraftstofflecks und Filterprobleme prüfen","Soll- und Ist-Raildruck auswerten","Vorförderung, Regler und Sensoren getrennt testen","Hochdrucksystem nur nach OEM-Sicherheitsvorgabe öffnen"]},"brake":{"name":"Bremse / ABS","causes":["Raddrehzahlsensor oder Magnetring","ABS-Modul, Bremsdruck oder Verkabelung","Versorgungsspannung oder Hydraulikproblem"],"checks":["Bei roter Bremswarnung nicht weiterfahren","Alle Raddrehzahlen vergleichen","Sensorkabel, Stromversorgung und ABS-Einheit prüfen","Sicherheitsrelevante Reparatur fachgerecht durchführen"]},"network":{"name":"CAN / Steuergerätekommunikation","causes":["Schwache Batterie oder schlechte Masseverbindung","Unterbrochener/kurzgeschlossener CAN-Bus","Fehlerhaftes oder nicht erreichbares Steuergerät"],"checks":["Batterie und Massepunkte prüfen","Gesamten Fehlerspeicher und Netzwerkstatus auslesen","Versorgung, Sicherungen und CAN-Leitung messen","Kommunikation nach Reparatur erneut testen"]},"transmission":{"name":"Getriebe / Antriebsstrang","causes":["Weitere Fehler im Getriebesteuergerät","Hydraulik-, Magnetventil- oder Sensorsignal","Kupplungs-, Wählhebel- oder Kabelproblem"],"checks":["Getriebe-Steuergerät gezielt auslesen","Ölzustand und Druckdaten nach OEM-Vorgabe prüfen","Sensoren und Magnetventile messen","Bestätigte Störung reparieren und anschließend prüfen"]},"cooling":{"name":"Kühlung / Motortemperatur","causes":["Thermostat oder Lüfterstörung","Kühlmittelverlust oder mangelnde Umwälzung","Temperatursensor bzw. Wasserpumpe"],"checks":["Bei Überhitzung sicher anhalten","Kühlmittelstand und Lecks nur bei kaltem Motor prüfen","Isttemperaturen, Lüfter und Thermostat verifizieren","Defekte Komponente gezielt reparieren"]},"oil":{"name":"Schmierung / Öldruck","causes":["Zu geringer Ölstand oder Öldruck","Ölpumpe, Filter oder Öldruckgeber","Interner Motorschaden"],"checks":["Bei roter Öldruckwarnung Motor abstellen","Öldruck mechanisch prüfen lassen","Ölstand, Sensor und Versorgung untersuchen","Ohne Druckfreigabe den Motor nicht starten"]},"airbag":{"name":"Airbag / Rückhaltesystem","causes":["Sensor oder Steckverbinder am SRS-System","Stromversorgung oder Steuergerät","Vorheriger Unfallschaden"],"checks":["Detaillierten SRS-Speicher auslesen","Hersteller-Sicherheitsanweisung beachten","Pyrotechnische Kreise nicht mit Standardprüfer testen","Nur durch qualifizierte Fachkraft instand setzen"]},"body":{"name":"Karosserieelektronik","causes":["Schalter, Stellmotor oder Positionssensor","Sicherung, Versorgung oder Masse","Steuergerät oder Buskommunikation"],"checks":["Funktion und Betriebsbedingungen überprüfen","Sicherungen und Leitungen prüfen","Istwerte und Stellgliedtest einsetzen","Störung beheben und erneut scannen"]},"sensor":{"name":"Sensor / Signalstromkreis","causes":["Sensorfehler oder Verschmutzung","Leitungsbruch, Kurzschluss, Referenzspannung","Tatsächlicher mechanischer Wert außerhalb des Sollbereichs"],"checks":["Betroffenen Sensor und Untercode identifizieren","Versorgung, Masse und Signal messen","Live-Daten mit Sollwerten vergleichen","Erst nach Fehlernachweis Sensor oder Mechanik reparieren"]},"ignition":{"name":"Zündung / Verbrennung","causes":["Zündkerze, Zündspule oder Einspritzung","Unpassendes Gemisch oder Kompression","Sensorik oder Verkabelung"],"checks":["Betroffene Zylinder und Freeze-Frame-Daten auslesen","Zündung und Einspritzung prüfen","Ansaugleck und Kompression bei Bedarf testen","Ursache reparieren; bei starken Aussetzern nicht belasten"]},"steering":{"name":"Lenkung / Fahrwerk","causes":["Winkel- oder Drehmomentsensor","Spannungsversorgung oder Lenksteuergerät","Mechanische Fahrwerksstörung"],"checks":["Bei Beeinträchtigung der Lenkung nicht weiterfahren","Lenkwinkel- und Drehmomentdaten auslesen","Versorgung und Stellmotor überprüfen","Fachgerechte sichere Prüfung vor der Weiterfahrt"]},"generic":{"name":"Fahrzeugsystem / Steuergerät","causes":["Elektrischer Defekt im betroffenen Schaltkreis","Mechanische Abweichung oder unpassende Betriebsbedingungen","Sensor, Verkabelung oder Steuergerät"],"checks":["Kompletten DTC samt Untercode und Fahrzeugdaten sichern","Freeze-Frame und zugehörige Istwerte prüfen","Hersteller-Prüfplan für Kabel und Mechanik anwenden","Reparatur danach mit erneuter Diagnose kontrollieren"]},"egr":{"name":"AGR / Abgasrückführung","causes":["Verkoktes AGR-Ventil oder Kanäle","Stellmotor-/Rückmeldesensorfehler","Abgas- oder Ansaugproblem"],"checks":["AGR-Soll/Ist-Werte und Luftmasse vergleichen","AGR-Ventil, Leitungen und Kühler prüfen","Elektrische Ansteuerung kontrollieren","OEM-konform reinigen oder bestätigten Defekt beheben"]},"catalyst":{"name":"Katalysator / Lambda","causes":["Abgasleck vor dem Katalysator","Gemisch-/Zündungsproblem oder Lambdasonde","Alternder Katalysator"],"checks":["Vorhandene Fehlzündungs- und Gemischcodes prüfen","Vorkatalysator-Leck und Lambdasignal prüfen","Temperatur und Messwerte nach Herstellerangabe bewerten","Nur nach Messung defekte Teile ersetzen"]}},en:{"turbo":{"name":"Turbocharger / boost","causes":["Charge-air hose or intercooler leak","Vacuum, boost control solenoid or actuator fault","Pressure sensor or turbo mechanical issue"],"checks":["Inspect boost hoses and intercooler for leaks","Compare requested vs actual boost pressure","Test actuator, vacuum lines and pressure sensor","Repair the failure confirmed by measurements"]},"dpf":{"name":"Particulate filter / exhaust","causes":["High soot or ash loading","Differential pressure or temperature sensor fault","Blocked regeneration from another engine fault"],"checks":["Read soot/ash load, differential pressure and temperatures","Inspect sensor hoses and wiring","Check regeneration conditions and other engine codes","Avoid forced regeneration until root cause is verified"]},"adblue":{"name":"SCR / AdBlue / NOx","causes":["Reductant quality or dosing fault","NOx sensor or wiring","SCR catalyst, heater or dosing injector fault"],"checks":["Read NOx, temperatures and dosing data","Check reductant fluid quality, pressure and heaters","Test dosing lines and sensors","Repair the verified fault without disabling SCR"]},"fuel":{"name":"Fuel supply / injection","causes":["Fuel pressure or delivery problem","Fuel filter, pump, regulator or injector","Pressure sensor or harness issue"],"checks":["Inspect for fuel leaks and restricted filter","Compare commanded and actual rail pressure","Test low-pressure delivery and regulator separately","Observe high-pressure safety procedures"]},"brake":{"name":"Brakes / ABS","causes":["Wheel speed sensor or tone ring issue","ABS hydraulic controller or wiring","Power or hydraulic problem"],"checks":["Stop driving if red brake warning is present","Compare live wheel speeds","Inspect sensor wiring and module supply","Have safety-critical repairs verified professionally"]},"network":{"name":"CAN / control modules","causes":["Low battery or bad grounding","CAN bus open or short circuit","Control module not responding"],"checks":["Check battery voltage and grounds","Read all modules and communication faults","Test fuses, power supplies and CAN wiring","Confirm communication after repairs"]},"transmission":{"name":"Transmission / driveline","causes":["Transmission ECU holds additional codes","Hydraulic pressure, sensor or solenoid issue","Clutch or selector-related fault"],"checks":["Read detailed faults from transmission ECU","Check oil and live pressure by OEM procedure","Test sensors and solenoids","Repair the confirmed issue and retest"]},"cooling":{"name":"Cooling / temperature","causes":["Thermostat or fan fault","Coolant leak or circulation restriction","Temperature sensor or water pump fault"],"checks":["Stop safely if overheating","Check coolant and leaks only on a cold engine","Verify live temperatures and fan command","Repair the measured failure"]},"oil":{"name":"Lubrication / oil pressure","causes":["Low oil level or oil pressure","Oil pump, filter or pressure sensor","Internal engine damage"],"checks":["Switch off engine for red oil warning","Verify pressure with a mechanical gauge","Check level, sensor and oil supply","Do not restart before pressure has been verified"]},"airbag":{"name":"Airbag / restraints","causes":["SRS sensor or connector fault","Module or power supply issue","Prior crash-related fault"],"checks":["Read detailed SRS faults","Follow manufacturer safety procedures","Do not probe pyrotechnic circuits with regular meter","Qualified technician must verify repair"]},"body":{"name":"Body electrics","causes":["Switch, actuator or position sensor","Fuse, power supply or harness","Control module communication"],"checks":["Check affected feature and operating conditions","Inspect power, ground and fuses","Use live statuses and actuator tests","Repair confirmed fault and scan again"]},"sensor":{"name":"Sensor / circuit","causes":["Contaminated or faulty sensor","Open/short circuit or reference supply","True mechanical reading out of range"],"checks":["Identify exact sensor, circuit and failure subtype","Measure power, ground and signal","Compare live data with specifications","Fix the proven electrical or mechanical fault"]},"ignition":{"name":"Ignition / combustion","causes":["Plug, coil or injector problem","Mixture or compression issue","Sensor or wiring issue"],"checks":["Check cylinders and freeze-frame","Test ignition and injection","Check intake leaks and compression if needed","Correct cause and confirm no recurrence"]},"steering":{"name":"Steering / chassis","causes":["Angle or torque sensor","EPS power or controller","Mechanical chassis issue"],"checks":["Stop driving if steering control is affected","Read angle and torque live data","Check power supply and motor","Get safety-critical functions verified"]},"generic":{"name":"Vehicle system / module","causes":["Related circuit electrical fault","Mechanical or operating condition deviation","Sensor, wiring or controller fault"],"checks":["Record complete DTC and vehicle details","Read freeze-frame and related sensor values","Follow OEM electrical and mechanical test plan","Fix root cause and clear/test code after repair"]},"egr":{"name":"EGR / exhaust recirculation","causes":["Clogged EGR valve or passages","Actuator or feedback sensor issue","Airflow or exhaust issue"],"checks":["Compare commanded and actual EGR with air mass","Inspect valve, ducts and cooler","Test actuation and feedback","Repair the confirmed fault to OEM spec"]},"catalyst":{"name":"Catalyst / oxygen sensors","causes":["Exhaust leak","Air-fuel or ignition problem","Aging catalyst or oxygen sensor"],"checks":["Check mixture/misfire codes first","Test exhaust leaks and oxygen sensor readings","Verify catalyst data against OEM specification","Replace only confirmed faulty parts"]}}};
outlines.tr.egr={name:"EGR / egzoz gazı devridaimi",causes:["EGR valfi veya kanallarda kurum birikmesi","Valf aktüatörü veya konum sensörü arızası","EGR soğutucu, bağlantı ve hava kütle ölçümünde sapma"],checks:["EGR komut ve gerçek konum verilerini oku","Hava kütlesi değişimi, valf ve kanalları kontrol et","Aktüatör, kablo hattı ve soğutucuyu test et","Doğrulanmış valf/tesisat/kanal sorununu OEM şartlarıyla onar"]};
outlines.tr.catalyst={name:"Katalizör / lambda sensörü",causes:["Katalizör öncesinde egzoz kaçağı","Karışım, ateşleme veya lambda sensörü sorunu","Katalizör yaşlanması veya verim düşüklüğü"],checks:["Ateşleme ve yakıt karışımındaki diğer hataları önce kontrol et","Egzoz kaçak ve lambda sensörü verilerini karşılaştır","Katalizör verimini üretici test koşullarında değerlendir","Yalnızca ölçümle doğrulanan arızalı bileşeni onar"]};
const mapped=outlines.tr;
const groups={turbo:"luft",dpf:"abgas",adblue:"abgas",fuel:"kraftstoff",brake:"antrieb",network:"antrieb",transmission:"antrieb",cooling:"luft",oil:"luft",airbag:"antrieb",body:"antrieb",sensor:"luft",ignition:"luft",steering:"antrieb",generic:"all"};
const aliases={tr:["tr"],de:["de"],en:["en"]};
const state={data:[],all:[],query:"",brand:"ALL",brandOrigin:"all",family:"all",category:"all",limit:35,display:[],code:"",activeManufacturer:""};
let finishSearchReady;
const searchReady=new Promise(resolve=>{finishSearchReady=resolve;});
let curatedGuides = new Set();
const html=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const L=()=>langMap[currentLanguage]||langMap.tr;
let currentLanguage="tr";
function detectLanguage(){
 if(window.Locale6006)return window.Locale6006.getLanguage();
 const preferred=navigator.languages?.length?navigator.languages:[navigator.language||"de"];
 return preferred.map(x=>String(x).toLowerCase().split(/[-_]/)[0]).find(x=>["de","tr","en"].includes(x))||"de";
}
function normalize(s){return String(s||"").toLocaleLowerCase("tr").replace(/[ıİ]/g,"i").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[\s/_-]+/g," ");}
const entryText=r=>normalize(r[0]+" "+r[1]+" "+r[2]);
const vehicleWords={
 tr:{vehicle:"Seçili araç",missing:"Araç henüz seçilmedi",filter:"Kod tanımı filtresi",fallback:"Bu marka için ayrı üretici kaydı bulunmuyor. Yalnızca genel tanımlar gösteriliyor; bu aracın üretici onayı veya kesin parça teşhisi değildir.",different:"Kod tanımı filtresi seçili aracın markasından farklı. Araçla eşleştirmeden onarım sonucu çıkarma.",choose:"Araç seç veya değiştir",context:"Araç ve kod bağlamı"},
 de:{vehicle:"Ausgewähltes Fahrzeug",missing:"Noch kein Fahrzeug ausgewählt",filter:"Filter der Code-Definitionen",fallback:"Für diese Marke ist kein eigener Herstellerdatensatz vorhanden. Es werden nur allgemeine Definitionen angezeigt; keine OEM-Bestätigung für dieses Fahrzeug.",different:"Der Definitionsfilter weicht von der ausgewählten Fahrzeugmarke ab. Vor einer Reparatur zuerst die richtige Zuordnung prüfen.",choose:"Fahrzeug wählen oder ändern",context:"Fahrzeug und Code-Zuordnung"},
 en:{vehicle:"Selected vehicle",missing:"No vehicle selected yet",filter:"Code-definition filter",fallback:"No manufacturer-specific dataset is available for this make. Only generic definitions are shown; this is not OEM confirmation for this vehicle.",different:"The definition filter differs from the selected vehicle make. Verify the correct vehicle definition before drawing repair conclusions.",choose:"Choose or change vehicle",context:"Vehicle and code context"}
};
function vehicleProfile(){try{const v=JSON.parse(sessionStorage.getItem("6006-vehicle-choice")||"null");return v&&typeof v==="object"&&!Array.isArray(v)?v:null;}catch(_){return null;}}
function catalogManufacturer(value){
 const key=normalize(value).replace(/[^a-z0-9]/g,"");
 const alias={vw:"VOLKSWAGEN",volkswagen:"VOLKSWAGEN",mercedesbenz:"MERCEDES",mercedes:"MERCEDES",chevrolet:"CHEVY",chevy:"CHEVY",generalmotors:"GM"};
 const wanted=alias[key]||String(value||"").toUpperCase();
 return (state.data.manufacturers||[]).find(make=>make!=="OTHER"&&(make===wanted||normalize(make).replace(/[^a-z0-9]/g,"")===key))||null;
}
function definitionContext(){
 const words=vehicleWords[currentLanguage]||vehicleWords.de,v=vehicleProfile();
 const profileName=v&&v.brand?[v.brand,v.model,v.year,v.engine].filter(x=>typeof x==="string"||typeof x==="number").filter(Boolean).join(" · "):"";
 const vehicleMake=v?.brand?catalogManufacturer(v.brand):null;
 const filter=state.brand==="ALL"?L().allBrands:state.brand==="GENERIC"?L().generic:state.brand;
 const note=v?.brand&&!vehicleMake&&state.brand==="GENERIC"?words.fallback:v?.brand&&state.brand!=="ALL"&&state.brand!=="GENERIC"&&state.brand!==vehicleMake?words.different:"";
 return {profile:v,profileName,brand:state.brand,origin:state.brandOrigin,filter,note,vehicleLabel:words.vehicle,missing:words.missing,filterLabel:words.filter};
}
function contextReport(){const c=definitionContext();return [c.vehicleLabel+": "+(c.profileName||c.missing),c.filterLabel+": "+c.filter,c.note].filter(Boolean).join("\n");}
function contextMarkup(){const c=definitionContext(),words=vehicleWords[currentLanguage]||vehicleWords.de;return '<section class="dtc-report-vehicle"><h3>'+html(words.context)+'</h3><p><strong>'+html(c.vehicleLabel)+':</strong> '+html(c.profileName||c.missing)+'<br><strong>'+html(c.filterLabel)+':</strong> '+html(c.filter)+'</p>'+(c.note?'<p class="notice">'+html(c.note)+'</p>':'')+'<p><a href="/fahrzeug/#vehicle-selector-6006">'+html(words.choose)+' →</a></p></section>';}
function area(d,code){
 const x=d.toLowerCase();
 if(code.startsWith("U"))return "network";
 if(code.startsWith("B"))return /air.?bag|restraint|srs|seatbelt|seat belt|deployment|frontal stage|squib|pretensioner|crash sensor|inflator|occupant classification/.test(x)?"airbag":"body";
 if(code.startsWith("C"))return /steer|suspension|yaw|angle|chassis|rack|tie rod|damping/.test(x)?"steering":"brake";
 if(/turbo|supercharg|boost|wastegate|charge.air|charge pressure/.test(x))return"turbo";
 if(/particulate|soot|regeneration|\bdpf\b|diesel filter/.test(x))return"dpf";
 if(/exhaust gas recirculation|egr/.test(x))return"egr";
 if(/catalyst|catalytic converter|oxygen sensor|lambda sensor/.test(x))return"catalyst";
 if(/reductant|scr |nox|urea|adblue/.test(x))return"adblue";
 if(/oil pressure|oil level|lubrication/.test(x))return"oil";
 if(/coolant|thermostat|engine temperature|overheat|radiator/.test(x))return"cooling";
 if(/air.?bag|restraint|srs|seatbelt|seat belt|deployment|frontal stage|squib|pretensioner|crash sensor|inflator|occupant classification/.test(x))return"airbag";
 if(/brake|abs |wheel speed|traction control|stability/.test(x))return"brake";
 if(/^U/.test(code)||/lost communication|can bus|network|module communication/.test(x))return"network";
 if(/transmission|gear|shift|clutch|torque converter|tcm/.test(x))return"transmission";
 if(/steer|yaw rate|suspension|chassis/.test(x))return"steering";
 if(/fuel|inject|rail pressure|pump|diesel/.test(x))return"fuel";
 if(/misfire|ignition|spark|knock|cylinder/.test(x))return"ignition";
 if(/sensor|circuit|voltage|signal|reference/.test(x))return"sensor";
 if(/^B/.test(code))return"body";
 return"generic";
}
const forcedArea={P0299:"turbo",P2002:"dpf",P2452:"dpf",P2453:"dpf",P2463:"dpf",P20EE:"adblue",P204F:"adblue",P2201:"adblue",P0401:"egr",P0420:"catalyst",P0104:"sensor",U0100:"network",P0700:"transmission"};
function kind(row){return forcedArea[row[0]]||area(row[2],row[0]);}
const aliasPatterns={
dpf:/particulate|soot|regeneration|diesel filter|\bdpf\b/i,
turbo:/turbo|supercharg|boost|wastegate|charge.air/i,
adblue:/reductant|scr |nox|urea|adblue/i,
egr:/egr|exhaust gas recirculation/i,
fuel:/fuel|rail pressure|inject|pump|diesel/i,
brake:/brake|abs |wheel speed|traction control/i,
network:/communication|can bus|network|module/i,
transmission:/transmission|gear|shift|clutch/i,
airbag:/airbag|air bag|srs|restraint/i,
oil:/oil pressure|oil level|lubrication/i,
cooling:/coolant|radiator|thermostat|temperature/i,
catalyst:/catalyst|catalytic/i,body:/body|door|window|mirror|lamp|seat/i,sensor:/sensor|circuit|signal/i,ignition:/misfire|ignition|spark|coil/i
};
const aliasUser={
"yakıt":"fuel","yakit":"fuel","mazot":"fuel","benzin":"fuel",
"fren":"brake","abs":"brake","şanzıman":"transmission","sanziman":"transmission","vites":"transmission","direksiyon":"steering",
"akü":"battery","aku":"battery","egzoz":"dpf","partikül":"dpf","partikul":"dpf","hava yastığı":"airbag","hava yastigi":"airbag",
"turbo":"turbo","basınç":"turbo","basinc":"turbo","can":"network","haberleşme":"network","haberlesme":"network",
"motor arıza":"ignition","tekleme":"ignition","yağ":"oil","yag":"oil","soğutma":"cooling","sogutma":"cooling","kuhlung":"cooling","lenkung":"steering","kraftstoff":"fuel","getriebe":"transmission","bremse":"brake","zundung":"ignition","atesleme":"ignition","sensorler":"sensor","sensoren":"sensor","katalizor":"catalyst","katalysator":"catalyst","govde":"body","karosserie":"body",
"adblue":"adblue","scr":"adblue","nox":"adblue","dpf":"dpf","egr":"egr","agr":"egr"
};
function userPattern(q){
 const n=normalize(q);
 const translation=aliasUser[n]||n;
 if(aliasPatterns[translation])return aliasPatterns[translation];
 if(translation==="battery")return /battery|charge|voltage|generator|alternator/i;
 if(translation==="steering")return /steer|yaw|suspension/i;
 return null;
}
function isCodeish(q){return /^[PBCU][0-9A-Z-]{3,9}$/i.test(q)}
function brandPriority(row){return (row[1]===state.brand?0:(row[1]==="GENERIC"?1:2))}
function matchingRows(query=state.query){
 const q=String(query||"").trim().toUpperCase();
 const patt=q&&!/^[PBCU][0-9A-F]{4}$/i.test(q)?userPattern(q):null;
 let rows=state.all.filter(r=>{
  if(state.savedOnly&&!userSavedCodes.has(r[0]))return false;
  if(state.brand!=="ALL" && r[1]!=="GENERIC"&&r[1]!==state.brand)return false;
  if(state.family!=="all"&&r[0][0]!==state.family)return false;
  if(state.category!=="all"){
   const cat=kind(r);
   const expanded=state.category==="emissions"?["dpf","adblue","egr","catalyst"].includes(cat)||/exhaust|catalyst|oxygen sensor|egr/i.test(r[2]):state.category==="air"?["turbo","sensor"].includes(cat)&&/air|boost|turbo|intake|maf|manifold|air flow/i.test(r[2]):state.category==="fuel"?(cat==="fuel"||/fuel|inject|rail pressure|pump/i.test(r[2])):cat===state.category;
   if(!expanded)return false;
  }
  if(!q)return true;
  if(r[0].includes(q))return true;
  if(patt)return patt.test(r[2]);
  return entryText(r).includes(normalize(q));
 });
 if(q) rows.sort((a,b)=>(a[0]===q?0:1)-(b[0]===q?0:1)||brandPriority(a)-brandPriority(b)||a[0].localeCompare(b[0]));
 else rows.sort((a,b)=>brandPriority(a)-brandPriority(b)||a[0].localeCompare(b[0]));
 return rows;
}
function filterRows(){const rows=matchingRows();state.display=rows;return rows;}
// Autocomplete shares the catalog's actual filters, ranking and translated aliases.
window.DTCSearch6006=Object.freeze({ready:searchReady,findRows:matchingRows,filters:()=>({brand:state.brand,family:state.family,category:state.category,savedOnly:state.savedOnly}),context:definitionContext});
function updateURL(code){
 const u=new URL(location.href);
 u.searchParams.delete("q");u.searchParams.delete("code");
 if(code)u.searchParams.set("code",code);
 else if(state.query)u.searchParams.set("q",state.query);
 if(state.brand!=="ALL")u.searchParams.set("brand",state.brand);else u.searchParams.delete("brand");
 if(state.category!=="all")u.searchParams.set("category",state.category);else u.searchParams.delete("category");
 if(state.family!=="all")u.searchParams.set("family",state.family);else u.searchParams.delete("family");
 u.hash=code?"detay":"sonuclar";
 history.replaceState(null,"",u.toString());
}
const nearCodes=q=>{
 const u=q.toUpperCase().replace(/[^A-Z0-9]/g,"");
 const out=[];
 if(u.length>5)out.push(u.slice(0,5));
 if(u.length===5)out.push(u);
 if(u.length>5 && /[PBCU]/.test(u[0]))out.push(u[0]+u.slice(2,6));
 for(const r of state.all){if(out.length>8)break;if((r[0].slice(0,3)===u.slice(0,3) || r[0].slice(0,4)===u.slice(0,4))&&!out.includes(r[0]))out.push(r[0]);}
 return out.filter(v=>state.all.some(row=>row[0]===v)).slice(0,7);
};
function renderList(){
 const rows=filterRows();const q=state.query.trim();
 $("count").textContent=rows.length.toLocaleString()+" "+L().count;
 const frag=document.createDocumentFragment();
 if(!rows.length){
  const div=document.createElement("div");div.className="empty";
  const p=document.createElement("p");p.textContent=isCodeish(q)&&q.length!==5?L().invalid:L().none;div.appendChild(p);
  const s=nearCodes(q);if(s.length){
   const small=document.createElement("strong");small.textContent=L().suggest+": ";div.appendChild(small);
   const c=document.createElement("div");c.className="suggest";for(const suggestion of s){const b=document.createElement("button");b.type="button";b.textContent=suggestion;b.onclick=()=>{state.query=suggestion;$("q").value=suggestion;execute(false)};c.appendChild(b);}div.appendChild(c);
  }
  frag.appendChild(div);
 }else for(const row of rows.slice(0,state.limit)){
  const button=document.createElement("button");button.type="button";button.className="codeitem";
  if(state.code===row[0] && state.activeManufacturer===row[1])button.setAttribute("aria-current","true");
  const top=document.createElement("span");top.className="code-top";
  const b=document.createElement("b");b.textContent=row[0];top.appendChild(b);
  const man=document.createElement("em");man.textContent=row[1]==="GENERIC"?L().generic:row[1];top.appendChild(man);button.appendChild(top);
  const desc=document.createElement("span");desc.className="code-desc";desc.textContent=row[2];button.appendChild(desc);
  button.onclick=()=>selectCode(row,true);frag.appendChild(button);
 }
 $("items").replaceChildren(frag);
 $("more").hidden=rows.length<=state.limit;
 $("more").textContent=L().more+" ("+Math.min(rows.length-state.limit,35)+")";
}
function codeSignal(desc){
 const s=desc.toLowerCase();
 if(/circuit low|voltage low|low input|short to ground/i.test(s))return ["Sinyal düşük: kısa devre, referans gerilimi ve sensör beslemesini ölç.","Signal niedrig: Kurzschluss, Referenzspannung und Versorgung messen.","Low signal: check short to ground, reference voltage and sensor supply."];
 if(/circuit high|voltage high|high input|short to battery/i.test(s))return ["Sinyal yüksek: açık devre, besleme hattına kısa devre ve şase bağlantısını kontrol et.","Signal hoch: Leitungsunterbrechung, Kurzschluss gegen Plus und Masse prüfen.","High signal: inspect open circuit, short to supply and ground."];
 if(/intermittent|erratic|sporadic/i.test(s))return ["Aralıklı hata: titreşim altında kablo ve soket testleri ile arıza anı verilerini karşılaştır.","Sporadischer Fehler: Kabel/Wackelkontakt und gespeicherte Ereignisdaten prüfen.","Intermittent: wiggle-test connectors and compare event data."];
 if(/efficiency|performance|range/i.test(s))return ["Performans/aralık sorunu: ilgili sistemin hedef ve gerçek değerlerini OEM sınırlarıyla karşılaştır.","Leistungs-/Bereichsfehler: Soll-/Ist-Werte gegen OEM-Grenzen prüfen.","Performance/range: compare commanded and actual values with OEM thresholds."];
 if(/open circuit|open/i.test(s))return ["Açık devre: ilgili sensörün sürekliliğini ve kablo hattını kontrol et.","Leitungsunterbrechung: Durchgang und Steckkontakte prüfen.","Open circuit: inspect continuity and connector pins."];
 return null;
}
const overrides={
P0299:["Turbo basıncı istenen seviyeye ulaşmıyor olabilir.","Hortum/intercooler kaçak testi; hedef-gerçek basınç, aktüatör/vakum ve MAP verisi karşılaştırması."],
P0104:["Hava kütle ölçer (MAF) devre sinyali aralıklı kesiliyor.","MAF soketi ve 5V/12V beslemesi, kablo sallama testi, emiş kaçağı ve canlı hava kütle verisi."],
P2002:["DPF filtresinin verimlilik eşiği sağlanmıyor.","DPF diferansiyel basıncı, kurum/kül yükü, kaçak ve sıcaklık sensörlerini kontrol et."],
P0401:["EGR akışı beklenen seviyenin altında.","EGR valf komutu/gerçek durum, kurum, soğutucu ve MAF değişimi üzerinden test et."],
P0700:["Şanzıman kontrol ünitesi ayrı bir arıza bildirmiş.","Şanzıman ECU'sundan ayrıntılı kodları oku; bu kod tek başına hangi parçanın bozuk olduğunu söylemez."],
U0100:["Motor kontrol ünitesiyle haberleşme kesilmiş.","Akü/şase, ECU beslemesi, CAN hattı ve ağ geçidi modüllerini ölç."]};

const DIAGRAMS={"turbo":{"nodes":[["Hava filtresi","Luftfilter","Air filter","air filter|intake filter"],["Turbo","Turbolader","Turbocharger","turbo|boost|supercharger|wastegate|actuator"],["Intercooler","Ladeluftkühler","Intercooler","charge air|intercooler|boost leak"],["Basınç sensörü","Ladedrucksensor","Boost sensor","pressure sensor|map|boost sensor"],["Emme manifoldu","Ansaugkrümmer","Intake manifold","manifold|intake"]],"symptoms":[["Çekiş kaybı","Leistungsverlust","Loss of power"],["Hızlanmada gecikme","Verzögerte Beschleunigung","Slow acceleration"],["Motor uyarısı","Motorkontrollleuchte","Engine warning"]]},"dpf":{"nodes":[["Motor","Motor","Engine","engine"],["Egzoz sıcaklık sensörü","Abgastemperatursensor","Exhaust temperature sensor","temperature|egt"],["DPF filtresi","Partikelfilter","DPF filter","particulate|soot|ash|filter|efficiency"],["Fark basınç sensörü","Differenzdrucksensor","Differential pressure sensor","differential|pressure|sensor"],["Egzoz çıkışı","Abgasauslass","Exhaust outlet","exhaust|outlet"]],"symptoms":[["Rejenerasyon uyarısı","Regenerationswarnung","Regeneration warning"],["Artan karşı basınç","Erhöhter Abgasgegendruck","High exhaust backpressure"],["Motor arıza ışığı","Motorkontrollleuchte","Engine fault light"]]},"adblue":{"nodes":[["AdBlue deposu","AdBlue-Tank","AdBlue tank","tank|fluid|quality|level"],["Pompa / ısıtıcı","Pumpe / Heizung","Pump / heater","pump|heater|pressure|heating"],["Dozaj enjektörü","Dosierinjektor","Dosing injector","injector|dosing|delivery"],["SCR katalizör","SCR-Katalysator","SCR catalyst","catalyst|efficiency|scr"],["NOx sensörü","NOx-Sensor","NOx sensor","nox|sensor"]],"symptoms":[["SCR uyarısı","SCR-Warnung","SCR warning"],["Emisyon arıza kaydı","Emissionsfehler","Emissions fault"],["Bazı araçlarda geri sayım","Bei manchen Fahrzeugen Start-Countdown","Possible restart countdown"]]},"fuel":{"nodes":[["Yakıt deposu","Kraftstofftank","Fuel tank","tank|level"],["Besleme pompası","Vorförderpumpe","Lift pump","pump|delivery|low pressure"],["Yakıt filtresi","Kraftstofffilter","Fuel filter","filter"],["Yüksek basınç hattı","Hochdruckrail","High-pressure rail","rail|pressure|regulat"],["Enjektör","Einspritzdüse","Injector","injector|injection"]],"symptoms":[["Zor çalışma","Schwerer Start","Hard starting"],["Tekleme","Ruckeln","Hesitation"],["Güç kaybı","Leistungsverlust","Power loss"]]},"brake":{"nodes":[["Tekerlek","Rad","Wheel","wheel"],["Hız sensörü","Raddrehzahlsensor","Wheel speed sensor","speed sensor|sensor"],["ABS modülü","ABS-Steuergerät","ABS module","abs|ecu|module|controller"],["Hidrolik ünite","Hydraulikblock","Hydraulic unit","hydraulic|valve|pressure"],["Fren kaliperi","Bremssattel","Brake caliper","brake|caliper"]],"symptoms":[["ABS/ESP ışığı","ABS-/ESP-Leuchte","ABS/ESP light"],["Denge sistemi sınırlanabilir","Stabilitätssystem eingeschränkt","Stability control may be limited"],["Fren uyarısı olabilir","Mögliche Bremswarnung","Possible brake warning"]]},"network":{"nodes":[["Akü / besleme","Batterie / Versorgung","Battery / supply","battery|voltage|power"],["CAN ağ geçidi","CAN-Gateway","CAN gateway","gateway|bus|can"],["Motor ECU","Motorsteuergerät","Engine ECU","ecm|pcm|engine|motor"],["Şanzıman ECU","Getriebesteuergerät","Transmission ECU","transmission|tcm"],["Diğer modüller","Weitere Steuergeräte","Other modules","module|communication|lost"]],"symptoms":[["Bağlantı kopması","Kommunikationsausfall","Communication loss"],["Birden fazla uyarı","Mehrere Warnmeldungen","Multiple warnings"],["Bazı işlevlerin kapanması","Funktionsausfälle","Some functions unavailable"]]},"transmission":{"nodes":[["Vites seçici","Wählhebel","Gear selector","selector|shift"],["TCM kontrolü","Getriebesteuergerät","Transmission module","tcm|module|controller"],["Solenoidler","Magnetventile","Solenoids","solenoid|valve"],["Hidrolik basınç","Hydraulikdruck","Hydraulic pressure","pressure|hydraulic|fluid"],["Kavrama / çıkış","Kupplung / Abtrieb","Clutch / output","clutch|gear|converter"]],"symptoms":[["Sert vites geçişi","Harte Schaltvorgänge","Harsh shifting"],["Vites gecikmesi","Verzögerte Schaltung","Delayed engagement"],["Koruma modu","Notlauf","Limp mode"]]},"cooling":{"nodes":[["Su pompası","Wasserpumpe","Water pump","water pump|pump"],["Motor bloğu","Motorblock","Engine block","engine|coolant temperature"],["Termostat","Thermostat","Thermostat","thermostat"],["Radyatör","Kühler","Radiator","radiator"],["Fan / sensör","Lüfter / Sensor","Fan / sensor","fan|sensor|coolant"]],"symptoms":[["Hararet yükselmesi","Überhitzung","Overheating"],["Kalorifer sorunu","Heizungsprobleme","Cabin heat problems"],["Soğutma uyarısı","Kühlmittelwarnung","Coolant warning"]]},"oil":{"nodes":[["Yağ karteri","Ölwanne","Oil sump","sump|oil level"],["Yağ pompası","Ölpumpe","Oil pump","oil pump|pump"],["Yağ filtresi","Ölfilter","Oil filter","filter"],["Yağ basınç sensörü","Öldrucksensor","Oil pressure sensor","pressure|sensor"],["Yatak / motor","Lager / Motor","Bearings / engine","bearing|engine"]],"symptoms":[["Yağ basıncı uyarısı","Öldruckwarnung","Oil pressure warning"],["Anormal ses","Ungewöhnliche Geräusche","Unusual noise"],["Motor hasarı riski","Risiko für Motorschaden","Risk of engine damage"]]},"airbag":{"nodes":[["Darbe sensörü","Aufprallsensor","Crash sensor","crash|impact|sensor"],["SRS modülü","Airbag-Steuergerät","SRS control unit","module|srs|control"],["Sürücü airbag","Fahrerairbag","Driver airbag","driver|frontal|stage"],["Yan airbag","Seitenairbag","Side airbag","side|curtain"],["Emniyet kemeri","Sicherheitsgurt","Seat belt","belt|pretensioner"]],"symptoms":[["SRS uyarı lambası","Airbag-Kontrollleuchte","SRS warning light"],["Güvenlik sistemi arızası","Rückhaltesystemfehler","Restraint system fault"],["Çarpışma koruması etkilenebilir","Schutzwirkung kann eingeschränkt sein","Protection may be affected"]]},"body":{"nodes":[["Sigorta / güç","Sicherung / Strom","Fuse / power","fuse|voltage|power"],["BCM modülü","Karosseriesteuergerät","Body control module","bcm|module|control"],["Düğme / anahtar","Schalter","Switch","switch|button"],["Kapı / kilit","Tür / Schloss","Door / lock","door|lock"],["Aktüatör","Stellglied","Actuator","actuator|motor|relay"]],"symptoms":[["Elektrikli donanım aksayabilir","Komfortelektrik gestört","Electrical feature may fail"],["Aralıklı çalışma","Sporadischer Betrieb","Intermittent behavior"],["Gösterge uyarısı","Warnhinweis im Kombiinstrument","Dash warning"]]},"sensor":{"nodes":[["Referans voltajı","Referenzspannung","Reference voltage","reference|voltage"],["Sensör","Sensor","Sensor","sensor|signal|range|performance"],["Kablo / soket","Leitung / Stecker","Harness / connector","circuit|open|short|intermittent"],["ECU giriş","ECU-Eingang","ECU input","control|module|ecu"],["Canlı veri","Live-Daten","Live data","reading|correlation"]],"symptoms":[["Aralıklı hata kaydı","Sporadischer Fehlereintrag","Intermittent code"],["Değer sapması","Unplausible Messwerte","Incorrect reading"],["Sistem performansı etkilenebilir","Leistung kann beeinträchtigt sein","May affect system performance"]]},"ignition":{"nodes":[["Hava / yakıt","Luft / Kraftstoff","Air / fuel","mixture|lean|rich|fuel"],["Ateşleme bobini","Zündspule","Ignition coil","coil|ignition"],["Buji","Zündkerze","Spark plug","plug|spark"],["Silindir","Zylinder","Cylinder","cylinder|misfire|combustion"],["Egzoz sensörü","Abgassensor","Exhaust sensor","oxygen|sensor"]],"symptoms":[["Tekleme / sarsıntı","Zündaussetzer / Ruckeln","Misfire / vibration"],["Güç azalması","Leistungsverlust","Reduced power"],["Motor lambası","Motorkontrollleuchte","Engine light"]]},"steering":{"nodes":[["Direksiyon","Lenkrad","Steering wheel","steering|wheel"],["Açı sensörü","Lenkwinkelsensor","Steering angle sensor","angle|sensor"],["EPS kontrol","EPS-Steuergerät","EPS controller","eps|module|control"],["Direksiyon motoru","Lenkmotor","Steering motor","motor|torque|assist"],["Rot / teker","Spurstange / Rad","Tie rod / wheel","tie rod|wheel|suspension"]],"symptoms":[["Direksiyon uyarısı","Lenkungswarnung","Steering warning"],["Direksiyon ağırlaşabilir","Lenkung kann schwergängig sein","May lose assistance"],["ESP sistemi etkilenebilir","ESP kann betroffen sein","ESP may be affected"]]},"egr":{"nodes":[["Egzoz çıkışı","Abgasauslass","Exhaust port","exhaust"],["EGR soğutucusu","AGR-Kühler","EGR cooler","cooler|temperature"],["EGR valfi","AGR-Ventil","EGR valve","egr|valve|flow|recirculation"],["Emme hattı","Ansaugtrakt","Intake","intake|manifold"],["Hava kütle ölçer","Luftmassenmesser","MAF sensor","maf|sensor|airflow"]],"symptoms":[["Motor arıza ışığı","Motorkontrollleuchte","Engine warning"],["Düzensiz rölanti","Unruhiger Leerlauf","Rough idle"],["Çekişte düşüş olabilir","Leistungsverlust möglich","Possible power reduction"]]},"catalyst":{"nodes":[["Motor egzozu","Motorabgas","Engine exhaust","engine"],["Ön lambda","Vordere Lambdasonde","Upstream O2","upstream|bank 1 sensor 1|sensor 1"],["Katalizör","Katalysator","Catalyst","catalyst|efficiency|converter"],["Arka lambda","Hintere Lambdasonde","Downstream O2","downstream|sensor 2"],["Egzoz çıkışı","Endrohr","Tailpipe","exhaust"]],"symptoms":[["Emisyon arıza kodu","Emissionsfehler","Emissions fault"],["Yakıt tüketimi artabilir","Verbrauch kann steigen","Possible higher consumption"],["Motor ikazı","Motorkontrollleuchte","Check engine light"]]},"generic":{"nodes":[["Besleme","Stromversorgung","Power supply","power|battery|supply"],["Sensör","Sensor","Sensor","sensor|circuit|signal"],["Kontrol modülü","Steuergerät","Control module","control|ecu|module"],["Aktüatör","Stellglied","Actuator","actuator|valve|motor"],["İlgili sistem","Betroffenes System","Affected system","system|performance"]],"symptoms":[["İlgili işlevde aksama","Funktionsstörung","Affected function"],["Uyarı kaydı","Fehlerspeichereintrag","Stored DTC"],["Davranış araçtan araca değişir","Fahrzeugabhängige Symptome","Vehicle-dependent symptoms"]]}};
const VISUAL_WORDS={"tr":{"title":"İlgili sistem şeması","sub":"Şematik gösterim · gerçek araç üzerindeki yerleşim marka ve modele göre değişebilir","symptoms":"Olası belirtiler","affected":"İlgili bileşenler","focus":"İncelenecek bölge","safe":"Altın işaretli parça kesin arızalı parça değil, kontrol için başlangıç noktasıdır.","flow":"İşleyiş / sinyal yönü"},"de":{"title":"Systemübersicht","sub":"Schematische Darstellung · tatsächliche Anordnung ist fahrzeugabhängig","symptoms":"Mögliche Symptome","affected":"Beteiligte Bauteile","focus":"Prüfbereich","safe":"Gold markiert einen möglichen Prüfschwerpunkt, keinen nachgewiesenen Bauteilschaden.","flow":"Funktions- / Signalrichtung"},"en":{"title":"System diagram","sub":"Schematic illustration · actual placement varies by vehicle","symptoms":"Possible symptoms","affected":"Related components","focus":"Area to inspect","safe":"Gold highlights a diagnostic starting point, not a confirmed failed component.","flow":"Flow / signal direction"}};
function visualLabel(s){const obj=VISUAL_WORDS[currentLanguage]||VISUAL_WORDS.tr;return obj[s]||VISUAL_WORDS.tr[s];}
function localPart(part){const pos=currentLanguage==="de"?1:currentLanguage==="en"?2:0;return part[pos]||part[0];}
function selectFocus(nodes,desc){
 const text=String(desc).toLowerCase();
 let best=2,max=0;
 for(let i=0;i<nodes.length;i++){
  const ks=String(nodes[i][3]||"").split("|").filter(Boolean);
  for(const k of ks)if(text.includes(k.toLowerCase())){let weight=k.length + (i===2?0.1:0);if(weight>max){max=weight;best=i;}}
 }
 return best;
}
function schematicGlyph(part,i){
 const key=String(part[3]||"").toLowerCase();
 const line='stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"';
 if(/turbo|boost|supercharger/.test(key))return '<circle cx="0" cy="0" r="17" '+line+'/><path d="M-10 7 C-20 -5 0 -21 9 -8 C17 4 -5 15 -7 0" '+line+'/><path d="M17 -3 H26 L31 2" '+line+'/>';
 if(/wheel|bearing|steering|brake/.test(key))return '<circle r="18" '+line+'/><circle r="7" '+line+'/><path d="M0 -18 V-7 M0 7 V18 M-18 0 H-7 M7 0 H18" '+line+'/>';
 if(/filter|dpf|catalyst|intercooler|radiator/.test(key))return '<rect x="-24" y="-17" width="48" height="34" rx="6" '+line+'/><path d="M-16 -12 V12 M-8 -12 V12 M0 -12 V12 M8 -12 V12 M16 -12 V12" '+line+'/>';
 if(/ecu|module|bcm|controller|tcm|gateway|control/.test(key))return '<rect x="-18" y="-18" width="36" height="36" rx="4" '+line+'/><rect x="-8" y="-8" width="16" height="16" '+line+'/><path d="M-24 -10 H-18 M-24 0 H-18 M-24 10 H-18 M18 -10 H24 M18 0 H24 M18 10 H24" '+line+'/>';
 if(/sensor|voltage|maf|nox|oxygen|lambda/.test(key))return '<rect x="-19" y="-12" width="38" height="24" rx="5" '+line+'/><path d="M-13 0 H-8 L-3 -8 L4 7 L9 0 H14" '+line+'/>';
 if(/pump|pompa|inject/.test(key))return '<circle r="17" '+line+'/><path d="M-7 9 V-9 L8 0 Z" '+line+'/><path d="M17 0 H28" '+line+'/>';
 if(/valve|egr|solenoid/.test(key))return '<path d="M-23 -14 L0 0 L-23 14 Z M23 -14 L0 0 L23 14 Z M0 -20 V20" '+line+'/>';
 if(/tank|sump|battery|power|fuse|supply/.test(key))return '<rect x="-23" y="-15" width="46" height="30" rx="5" '+line+'/><path d="M-12 -20 H-4 M4 -20 H12 M-13 0 H-3 M10 -5 V5 M5 0 H15" '+line+'/>';
 return '<circle r="18" '+line+'/><path d="M-9 0 H9 M0 -9 V9" '+line+'/>';
}
function visualSchematic(row,type){
 const model=DIAGRAMS[type]||DIAGRAMS.generic;
 const nodes=model.nodes, focus=selectFocus(nodes,row[2]);
 const points=nodes.map((n,i)=>({x:75+i*109,y:115+(i%2?24:-4)}));
 const ns="http://www.w3.org/2000/svg";
 const segs=points.slice(0,-1).map((p,i)=>'<path class="diagram-pipe" d="M'+(p.x+29)+' '+p.y+' L'+(points[i+1].x-29)+' '+points[i+1].y+'" marker-end="url(#arr-'+row[0]+')" />').join("");
 const drawings=nodes.map((n,i)=>{
  const p=points[i],active=i===focus;
  return '<g class="diagram-node '+(active?'is-focus':'')+'" data-diagram-node="'+i+'" transform="translate('+p.x+' '+p.y+')">'+
   '<rect class="node-card" x="-43" y="-43" width="86" height="85" rx="12"/>'+
   '<g class="glyph" transform="translate(0,-9)">'+schematicGlyph(n,i)+'</g>'+
   '<text x="0" y="59" text-anchor="middle" class="node-number">'+String(i+1).padStart(2,'0')+'</text>'+
   (active?'<circle class="focus-ring" cx="32" cy="-32" r="6" />':'')+
   '</g>';
 }).join("");
 const svg='<svg class="diagnostic-diagram" viewBox="0 0 596 220" role="img" aria-label="'+html(visualLabel('title')+': '+nodes.map(localPart).join(', '))+'" preserveAspectRatio="xMidYMid meet">'+
  '<defs><pattern id="grid-'+row[0]+'" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0 H0 V20" stroke="#6c523d" stroke-width=".6" fill="none" opacity=".25"/></pattern>'+
  '<marker id="arr-'+row[0]+'" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 Z" fill="#b9915d"/></marker></defs>'+
  '<rect x="0" y="0" width="596" height="220" rx="10" fill="url(#grid-'+row[0]+')" />'+
  '<text x="20" y="24" class="schematic-code">'+html(row[0])+' / '+html(type.toUpperCase())+'</text>'+
  '<path class="diagram-track" d="M20 115 H576" />'+segs+drawings+'</svg>';
 const buttons=nodes.map((n,i)=>'<button type="button" data-part-index="'+i+'" class="diagram-part '+(i===focus?'is-active':'')+'" aria-pressed="'+(i===focus)+'">'+
  '<span class="diagram-part-index">'+String(i+1).padStart(2,"0")+'</span><span>'+html(localPart(n))+'</span></button>').join("");
 const symptoms=model.symptoms.map(x=>'<li>'+html(x[currentLanguage==='de'?1:currentLanguage==='en'?2:0])+'</li>').join('');
 return '<section class="diagram-panel" data-diagram-group="'+html(type)+'" data-dtc="'+html(row[0])+'">'+
 '<div class="diagram-heading"><h3>'+html(visualLabel('title'))+'</h3><span class="diagram-system">'+html(type.toUpperCase())+'</span></div>'+
 '<p class="diagram-subtitle">'+html(visualLabel('sub'))+'</p>'+
 svg+'<p class="diagram-direction">→ '+html(visualLabel('flow'))+'</p>'+
 '<h4>'+html(visualLabel('affected'))+'</h4><div class="diagram-parts">'+buttons+'</div>'+
 '<p class="diagram-current" role="status">'+html(visualLabel('focus'))+': <strong>'+html(localPart(nodes[focus]))+'</strong></p>'+
 '<p class="diagram-caution">'+html(visualLabel('safe'))+'</p>'+
 '<div class="diagram-symptoms"><h4>'+html(visualLabel('symptoms'))+'</h4><ul>'+symptoms+'</ul></div></section>';
}
function connectDiagram(){
 const root=$('detay').querySelector('.diagram-panel');
 if(!root)return;
 root.addEventListener('click',event=>{
  const b=event.target.closest('button[data-part-index]');
  if(!b)return;
  const n=Number(b.dataset.partIndex);
  root.querySelectorAll('.diagram-part').forEach(p=>{const active=p===b;p.classList.toggle('is-active',active);p.setAttribute('aria-pressed',String(active));});
  root.querySelectorAll('.diagram-node').forEach(x=>x.classList.toggle('is-focus',Number(x.dataset.diagramNode)===n));
  const focus=root.querySelector('.diagram-current strong');if(focus)focus.textContent=b.querySelector('span:last-child')?.textContent||'';
 });
}


const REFERENCE_IMAGES={"turbo":["Turbo / Hava","Turbo / Ladeluft","Turbo / Air"],"dpf":["DPF / Egzoz","Partikelfilter / Abgas","DPF / Exhaust"],"adblue":["AdBlue / SCR","AdBlue / SCR","AdBlue / SCR"],"egr":["EGR Sistemi","AGR System","EGR System"],"fuel":["Yakıt Sistemi","Kraftstoffsystem","Fuel System"],"transmission":["Şanzıman","Getriebe","Transmission"],"brake":["Fren / ABS","Bremse / ABS","Brakes / ABS"],"network":["CAN / ECU","CAN / Steuergeräte","CAN / ECU"],"airbag":["Hava Yastığı","Airbag","Airbag"],"cooling":["Soğutma Sistemi","Kühlung","Cooling System"],"oil":["Yağlama Sistemi","Schmiersystem","Lubrication"],"steering":["Direksiyon","Lenkung","Steering"],"ignition":["Ateşleme","Zündung","Ignition"],"sensor":["Sensörler","Sensoren","Sensors"],"catalyst":["Katalizör","Katalysator","Catalyst"],"body":["Gövde Elektroniği","Karosserieelektrik","Body Electronics"],"generic":["Diğer Sistemler","Weitere Systeme","Other Systems"]};
const PHOTO_LABELS=null;
function photoText(t){const i=currentLanguage==="de"?1:currentLanguage==="en"?2:0;return (REFERENCE_IMAGES[t]||REFERENCE_IMAGES.generic)[i]}
function categoryImage(type){return "../assets/realparts/"+(REFERENCE_IMAGES[type]?type:"generic")+".webp"}
function photoMain(row,type){
 const name=photoText(type),word=currentLanguage==="de"?"Realistische Bauteildarstellung":currentLanguage==="en"?"Realistic component illustration":"Gerçekçi parça görseli";
 const desc=currentLanguage==="de"?"Symbolische Darstellung – kein markenspezifischer OEM-Aufbau":currentLanguage==="en"?"Illustrative rendering – not a vehicle-specific OEM layout":"Temsili görsel · markaya ve motora göre parça değişebilir";
 return '<section class="real-photo" data-photo-group="'+html(type)+'"><div class="real-photo-image"><img loading="lazy" decoding="async" src="'+categoryImage(type)+'" alt="'+html(name)+'"/></div><div class="real-photo-label"><span>'+html(word)+'</span><h3>'+html(name)+'</h3><p>'+html(desc)+'</p><div class="real-photo-codetag">'+html(row[0])+'</div></div></section>';
}
function createImageGallery(){
 const searchArea=$("arama");if(!searchArea || document.getElementById("real-system-gallery"))return;
 const wrapper=document.createElement("section");wrapper.className="real-system-gallery";wrapper.id="real-system-gallery";
 const title=document.createElement("div");title.className="gallery-heading";
 const heading=document.createElement("h2");heading.textContent=currentLanguage==="de"?"Fahrzeugsysteme":currentLanguage==="en"?"Vehicle systems":"Araç sistemleri";
 const subtitle=document.createElement("span");subtitle.textContent=currentLanguage==="de"?"Bauteilbilder und Fehlersuche":currentLanguage==="en"?"Component visuals & fault guide":"Gerçekçi parçalar ve kod rehberi";
 title.append(heading,subtitle);wrapper.append(title);
 const rail=document.createElement("div");rail.className="real-categories";
 for(const type of Object.keys(REFERENCE_IMAGES)){
  const card=document.createElement("button");card.type="button";card.className="real-category";card.dataset.system=type;
  const im=document.createElement("img");im.src=categoryImage(type);im.alt="";im.loading="lazy";im.decoding="async";
  const span=document.createElement("span");span.textContent=photoText(type);card.append(im,span);
  rail.append(card);
 }
 wrapper.append(rail);searchArea.parentNode.insertBefore(wrapper,searchArea);
 rail.addEventListener("click",event=>{
  const card=event.target.closest("button[data-system]");if(!card)return;
  const type=card.dataset.system;
  rail.querySelectorAll("button").forEach(b=>b.classList.toggle("selected",b===card));
  state.query="";state.code="";$("q").value="";state.category=type;
  $("topics").querySelectorAll("button[data-tag]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tag===type)));
  execute(true);
 });
}
function updateVisualGallery(){
 const g=document.getElementById("real-system-gallery");if(!g)return;
 g.querySelector("h2").textContent=currentLanguage==="de"?"Fahrzeugsysteme":currentLanguage==="en"?"Vehicle systems":"Araç sistemleri";
 g.querySelector(".gallery-heading span").textContent=currentLanguage==="de"?"Bauteilbilder und Fehlersuche":currentLanguage==="en"?"Component visuals & fault guide":"Gerçekçi parçalar ve kod rehberi";
 for(const btn of g.querySelectorAll("button[data-system]"))btn.querySelector("span").textContent=photoText(btn.dataset.system);
}


const U6006_FAVORITE_KEY="6006.saved-codes.v1";
function readCodeStorage(key){try{const x=JSON.parse(localStorage.getItem(key)||"[]");return Array.isArray(x)?x:[]}catch(e){return[]}}
const userSavedCodes=new Set(readCodeStorage(U6006_FAVORITE_KEY).filter(x=>/^[PBCU][0-3][0-9A-F]{3}$/.test(x)));
state.savedOnly=false;
function shelfLanguage(k){const x={
tr:{title:"Kod kitaplığım",saved:"Yalnızca kaydedilenler",all:"Tüm kodlar",recent:"Son baktıklarım",star:"★ Kaydet",unstar:"★ Kaydedildi",copy:"Teşhis özetini kopyala",print:"Yazdır / PDF",ok:"Özet kopyalandı",error:"Kopyalama desteklenmiyor"},
de:{title:"Meine DTC-Sammlung",saved:"Nur gespeicherte",all:"Alle Codes",recent:"Zuletzt angesehen",star:"★ Speichern",unstar:"★ Gespeichert",copy:"Diagnoseübersicht kopieren",print:"Drucken / PDF",ok:"Zusammenfassung kopiert",error:"Kopieren nicht unterstützt"},
en:{title:"My code library",saved:"Saved only",all:"All codes",recent:"Recently viewed",star:"★ Save",unstar:"★ Saved",copy:"Copy diagnostic summary",print:"Print / PDF",ok:"Summary copied",error:"Copy unavailable"}};return(x[currentLanguage]||x.tr)[k]}
function renderCodeShelf(){
const shelf=document.getElementById("u6006-shelf");if(!shelf)return;
const count=userSavedCodes.size,savedBtn=shelf.querySelector("[data-saved-toggle]");
shelf.querySelector("strong").textContent=shelfLanguage("title")+" · "+count;
savedBtn.textContent=state.savedOnly?shelfLanguage("all"):shelfLanguage("saved");savedBtn.classList.toggle("active",state.savedOnly);
const recent=shelf.querySelector(".u6006-recent");recent.replaceChildren();
const entries=readCodeStorage("6006-recent-codes").slice(0,9);
if(entries.length){const tag=document.createElement("small");tag.textContent=shelfLanguage("recent")+": ";tag.style.color="#d6b78b";recent.append(tag)}
for(const r of entries){if(!/^[PBCU][0-3][0-9A-F]{3}$/.test(r.code||""))continue;const a=document.createElement("a");a.href="?code="+encodeURIComponent(r.code)+(r.manufacturer&&r.manufacturer!=="GENERIC"?"&brand="+encodeURIComponent(r.manufacturer):"");a.textContent=r.code;a.title=r.description||r.code;recent.append(a)}
}
function createCodeShelf(){
 if(document.getElementById("u6006-shelf"))return;
const shelf=document.createElement("section");shelf.id="u6006-shelf";
shelf.innerHTML='<div class="u6006-shelf-head"><strong></strong><button type="button" data-saved-toggle></button></div><div class="u6006-recent"></div>';
const section=document.getElementById("arama");section.insertAdjacentElement("afterend",shelf);
shelf.querySelector("button").onclick=()=>{state.savedOnly=!state.savedOnly;state.category="all";state.query="";document.getElementById("q").value="";document.querySelectorAll("#topics button").forEach(x=>x.setAttribute("aria-pressed",String(x.dataset.tag==="all")));renderList();document.getElementById("sonuclar").scrollIntoView({behavior:"smooth",block:"start"});};
renderCodeShelf();
}
function recordRecent(row){
const previous=readCodeStorage("6006-recent-codes").filter(x=>x.code!==row[0]);
const next=[{code:row[0],manufacturer:row[1],description:row[2]},...previous].slice(0,16);
try{localStorage.setItem("6006-recent-codes",JSON.stringify(next))}catch(e){}
renderCodeShelf();
}
function attachCodeTools(row,guide,steps){
const detail=document.getElementById("detay"),actions=document.createElement("div");actions.className="u6006-report-actions";
const make=(label,click)=>{const b=document.createElement("button");b.type="button";b.textContent=label;b.addEventListener("click",click);actions.append(b);return b};
const save=make(userSavedCodes.has(row[0])?shelfLanguage("unstar"):shelfLanguage("star"),()=>{
 if(userSavedCodes.has(row[0]))userSavedCodes.delete(row[0]);else userSavedCodes.add(row[0]);
 try{localStorage.setItem(U6006_FAVORITE_KEY,JSON.stringify([...userSavedCodes]))}catch(e){}
 save.textContent=userSavedCodes.has(row[0])?shelfLanguage("unstar"):shelfLanguage("star");renderCodeShelf();renderList();
});
const copyBtn=make(shelfLanguage("copy"),async()=>{
 const note=["6006 Performance",contextReport(),"",row[0]+" · "+row[1],row[2],guide.name,"",L().causes,...guide.causes.map((c,i)=>(i+1)+". "+c),"",L().checks,...steps.map((c,i)=>(i+1)+". "+c),"",window.DiagnosticPlaybooks6006?.report?.(row[0],currentLanguage)||"","",L().verify,location.href].join("\n");
 const feedback=actions.querySelector(".u6006-feedback");
 try{if(!navigator.clipboard||!navigator.clipboard.writeText)throw Error("Clipboard");await navigator.clipboard.writeText(note);feedback.textContent=shelfLanguage("ok")}catch(e){feedback.textContent=shelfLanguage("error");const ta=document.createElement("textarea");ta.value=note;ta.style.width="100%";ta.setAttribute("aria-label","Copy report");actions.append(ta);ta.focus();ta.select()}
});
make(currentLanguage==="tr"?"Teşhis raporunu indir":currentLanguage==="de"?"Diagnosebericht herunterladen":"Download diagnostic report",()=>{
const symptoms=guide.limited?[]:(DIAGRAMS[kind(row)]||DIAGRAMS.generic).symptoms.map(x=>x[{tr:0,de:1,en:2}[currentLanguage]||0]);
const note=["6006 Performance",new Date().toLocaleString(),contextReport(),"",row[0]+" · "+row[1],row[2],guide.name,"",visualLabel("symptoms"),...symptoms,"",L().causes,...guide.causes,"",L().checks,...steps,"",window.DiagnosticPlaybooks6006?.report?.(row[0],currentLanguage)||"","",L().verify,location.href].join("\n");
const link=document.createElement("a");link.href=URL.createObjectURL(new Blob(["\ufeff"+note],{type:"text/plain;charset=utf-8"}));link.download="6006-"+row[0]+"-"+currentLanguage+".txt";link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
});
make(shelfLanguage("print"),()=>window.print());
const feedback=document.createElement("span");feedback.className="u6006-feedback";feedback.setAttribute("role","status");actions.append(feedback);
detail.append(actions);
}

function selectCode(row,scroll){
 state.code=row[0];state.activeManufacturer=row[1];updateURL(row[0]);
 const type=kind(row);const chosen=currentLanguage==="tr"?mapped:(localeGuides[currentLanguage]||mapped);const d={...(chosen[type]||chosen.generic)};const description=row[2];
 const one=codeSignal(description);const localeNum={tr:0,de:1,en:2}[currentLanguage]||0;
 const steps=[...d.checks];if(one)steps.splice(1,0,one[localeNum]);
 if(overrides[row[0]]&&currentLanguage==="tr")steps.splice(1,0,overrides[row[0]][1]);
 const banner=row[1]==="GENERIC"?L().generic:L().manufacturer+" · "+row[1];
 const triage=window.DTCIntelligence6006?.explain(row[0],description,row[1],currentLanguage);
 if(triage?.limited){d.limited=true;d.name=triage.classification;d.causes=triage.causes;steps.splice(0,steps.length,...triage.checks);}
 const targeted=triage?'<section class="dtc-targeted"><h3>'+html(triage.label)+'</h3><p><strong>'+html(triage.classification)+'</strong> · '+html(triage.family)+'</p><p class="small">'+html(triage.note)+'</p><ol>'+triage.checks.map(x=>'<li>'+html(x)+'</li>').join("")+'</ol><p><strong>'+html(currentLanguage==="tr"?"Hata türüne göre değerlendirilebilecek nedenler":currentLanguage==="de"?"Je nach Fehlerart mögliche Ursachen":"Possible causes by fault type")+'</strong></p><ul>'+triage.causes.map(x=>'<li>'+html(x)+'</li>').join("")+'</ul><p class="notice">'+html(triage.safety)+'</p></section>':'';
 const curated=curatedGuides.has(row[0]),articleLink='/fehlercodes/'+row[0].toLowerCase()+'/';
 const knowledge=curated?'<p><a class="dtc-more-guide" href="'+articleLink+'">'+html(currentLanguage==="tr"?"Bu kodun ayrıntılı teşhis rehberini aç":currentLanguage==="de"?"Ausführliche Diagnose zu diesem Code lesen":"Read detailed diagnosis guide")+' →</a></p>':'<p class="small">'+html(currentLanguage==="tr"?"Bu kod için özel onarım rehberi henüz yayımlanmadı; yukarıdaki kontroller sistem bazlı başlangıçtır.":currentLanguage==="de"?"Für diesen Code gibt es noch keinen einzeln geprüften Reparaturartikel; die obigen Schritte dienen zur Eingrenzung.":"No individually reviewed repair article for this code yet; the checks above are preliminary.")+'</p>';
 const inquiry='https://wa.me/491788354756?text='+encodeURIComponent((currentLanguage==="tr"?"Merhaba 6006 Performance, "+row[0]+" arıza kodu için araç özelinde teşhis istiyorum.":currentLanguage==="de"?"Hallo 6006 Performance, ich möchte eine fahrzeugspezifische Diagnose für "+row[0]+" anfragen.":"Hello 6006 Performance, I would like vehicle-specific diagnosis for "+row[0]+".")+(currentLanguage==="de"?"\nMarke/Modell: \nMotor/Baujahr: \nSymptome: ":currentLanguage==="en"?"\nMake/Model: \nEngine/Year: \nSymptoms: ":"\nMarka/Model: \nMotor/Yıl: \nBelirtiler: "));
 const service='<p class="dtc-help"><a href="'+html(inquiry)+'" rel="noopener noreferrer" target="_blank">'+html(currentLanguage==="tr"?"Bu arıza için teknik değerlendirme iste":currentLanguage==="de"?"Technische Beurteilung anfragen":"Request technical diagnosis")+' →</a></p>';
 $("detay").innerHTML=
  '<div class="detail-head"><span class="code-big">'+html(row[0])+'</span><span class="pill">'+html(banner)+'</span></div>'+
  '<h2>'+html(currentLanguage==="tr"&&overrides[row[0]]?overrides[row[0]][0]:d.name)+'</h2>'+contextMarkup()+
  '<p class="small">'+html(L().english)+'</p><p>'+html(description)+'</p>'+
  (triage?.limited?'':photoMain(row,type)+visualSchematic(row,type))+
  '<div class="notice">'+html(L().verify)+'</div>'+targeted+knowledge+
  '<h3>'+html(L().causes)+'</h3><ol>'+d.causes.map(s=>'<li>'+html(s)+'</li>').join("")+'</ol>'+
  '<h3>'+html(L().checks)+'</h3><ol>'+steps.map(s=>'<li>'+html(s)+'</li>').join("")+'</ol>'+
  (["brake","oil","steering","airbag","cooling"].includes(type)?'<p class="notice">'+html(L().attention)+'</p>':'')+
  '<p class="small">'+html(L().origin)+'</p>'+service+
  '<div class="contact"><a id="copy-link" href="'+html(location.href)+'">'+html(L().copy)+'</a></div>';
 $("copy-link").addEventListener("click",ev=>{if(navigator.clipboard&&navigator.clipboard.writeText){ev.preventDefault();navigator.clipboard.writeText(location.href).then(()=>{$("copy-link").textContent="✓";}).catch(()=>{});}});
 recordRecent(row);
 attachCodeTools(row,d,steps);
 connectDiagram();
 document.dispatchEvent(new CustomEvent('6006:dtc-selected',{detail:{code:row[0],manufacturer:row[1],description:row[2],language:currentLanguage}}));
 renderList();
 if(scroll){$("detay").scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});$("detay").focus({preventScroll:true});}
}
function execute(scroll){
 state.limit=35;state.query=$("q").value.trim();
 const code=state.query.toUpperCase();
 const rows=filterRows();
 if(/^[PBCU][0-3][A-F0-9]{3}$/.test(code)&&rows.some(r=>r[0]===code)){selectCode(rows.find(r=>r[0]===code),false);}
 else if(!state.query&&rows.length&&state.code){const match=rows.find(r=>r[0]===state.code && r[1]===state.activeManufacturer);if(match)selectCode(match,false);else{state.code="";$("detay").innerHTML='<div class="empty">'+html(L().choose)+'</div>';renderList();updateURL("");}}
 else {$("detay").innerHTML='<div class="empty">'+html(rows.length?L().choose:L().none)+'</div>';state.code="";renderList();updateURL("");}
 if(scroll){
  (state.code?$("detay"):$("sonuclar")).scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  $("q").blur();
 }
}
function i18n(){
 const t=L();$("main-title").textContent=t.title;$("main-lead").textContent=t.lead;$("search-label").textContent=t.search;$("submit").textContent=t.submit;$("label-brand").textContent=t.brand;$("label-family").textContent=t.family;$("results-title").textContent=t.results;$("unique-label").textContent=t.unique;$("total-label").textContent=t.codes;$("brand-label").textContent=t.makers;$("search-hint").textContent=t.hint;
 $("q").placeholder=currentLanguage==="tr"?"Örn. P0299, P0104, DPF, turbo, AdBlue, ABS...":currentLanguage==="de"?"z. B. P0299, P0104, DPF, Turbo, ABS...":"e.g. P0299, P0104, DPF, turbo, ABS...";
 $("brand").options[0].textContent=t.allBrands;
 const genericOption=Array.from($("brand").options).find(o=>o.value==="GENERIC");if(genericOption)genericOption.textContent=t.generic;
 const familyLabels={tr:["Hepsi","P · Motor & şanzıman","B · Gövde / hava yastığı","C · Şasi / fren / direksiyon","U · Ağ / CAN iletişimi"],de:["Alle","P · Motor & Getriebe","B · Karosserie / Airbag","C · Fahrwerk / Bremse / Lenkung","U · Netzwerk / CAN"],en:["All","P · Engine & transmission","B · Body / airbag","C · Chassis / brakes / steering","U · Network / CAN"]};
const topicLabels={tr:{all:"Tümü",emissions:"Egzoz / EGR",air:"Hava / emiş",fuel:"Yakıt",brake:"Fren / ABS"},de:{all:"Alle",emissions:"Abgas / AGR",air:"Luft / Ansaugung",fuel:"Kraftstoff",brake:"Bremse / ABS"},en:{all:"All",emissions:"Exhaust / EGR",air:"Air / intake",fuel:"Fuel",brake:"Brakes / ABS"}};
$("topics").querySelectorAll("button").forEach(b=>{const text=topicLabels[currentLanguage][b.dataset.tag];if(text)b.textContent=text});
Array.from($("group").options).forEach((o,i)=>o.textContent=familyLabels[currentLanguage][i]);
document.documentElement.lang=currentLanguage;document.title="6006 Performance · DTC "+t.results;
}
async function init(){
 currentLanguage=detectLanguage();$("lang").value=currentLanguage;i18n();
 $("count").textContent=L().loading;$("items").textContent=L().loading;
 const res=await fetch("../assets/6006-dtc-catalog.json",{cache:"force-cache"});if(!res.ok)throw Error("HTTP "+res.status);
 const data=await res.json();state.data=data;state.all=data.defs.filter(r=>r.length===3);
 try {const guideRes=await fetch("../assets/6006-curated-guides.json",{cache:"force-cache"});if(guideRes.ok){const guideData=await guideRes.json();curatedGuides=new Set((guideData.codes||[]).filter(code=>/^[PBCU][0-9A-F]{4}$/.test(code)));}}catch(_){/* Catalogue remains usable when optional guide manifest cannot load. */}
 $("total-defs").textContent=state.all.length.toLocaleString();
 $("total-unique").textContent=new Set(state.all.map(r=>r[0])).size.toLocaleString();
 $("total-brands").textContent=data.manufacturers.filter(x=>x!=="GENERIC"&&x!=="OTHER").length;
 for(const b of data.manufacturers.filter(x=>x!=="GENERIC"&&x!=="OTHER")){const o=document.createElement("option");o.value=b;o.textContent=b;$("brand").append(o);}
 $("brand").add(new Option(L().generic,"GENERIC"),1);
 const url=new URL(location.href),params=url.searchParams;
 state.query=params.get("q")||params.get("code")||"";
 if(!state.query&&/^#[pbc u][0-9a-f]{4}$/i.test(url.hash))state.query=url.hash.slice(1).toUpperCase();
 const storedVehicle=vehicleProfile();
 if(params.has("brand")){state.brandOrigin="url";const requested=params.get("brand");state.brand=String(requested).toUpperCase()==="ALL"?"ALL":catalogManufacturer(requested)||"ALL";}
 else if(storedVehicle?.brand){state.brandOrigin="vehicle";state.brand=catalogManufacturer(storedVehicle.brand)||"GENERIC";}
 else{state.brandOrigin="all";state.brand="ALL";}
 state.family=(params.get("family")||"all").toUpperCase();
 if(!["P","B","C","U"].includes(state.family))state.family="all";
 const group={luft:"air",kraftstoff:"fuel",abgas:"emissions",antrieb:"transmission"};
 state.category=group[params.get("category")]||params.get("category")||"all";
 const validCategories=new Set([...Object.keys(mapped),...Object.keys(REFERENCE_IMAGES),"all","emissions","air"]);
 if(!validCategories.has(state.category))state.category="all";

 createImageGallery();
 createCodeShelf();
 $("q").value=state.query;$("brand").value=state.brand;$("group").value=state.family;
 document.querySelectorAll("#topics button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.tag===state.category)));
 $("submit").onclick=()=>execute(true);
 $("q").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();execute(true);}});
 $("brand").onchange=()=>{state.brand=$("brand").value;state.brandOrigin="manual";execute(true);document.dispatchEvent(new Event("6006:dtc-context"));};
 $("group").onchange=()=>{state.family=$("group").value;execute(true)};
 $("lang").onchange=()=>{currentLanguage=$("lang").value;window.Locale6006?.setLanguage(currentLanguage);updateVisualGallery();i18n();renderCodeShelf();if(state.code){const r=state.all.find(x=>x[0]===state.code&&x[1]===state.activeManufacturer);if(r)selectCode(r,false);}else renderList();};
 $("topics").addEventListener("click",e=>{const b=e.target.closest("button[data-tag]");if(!b)return;state.category=b.dataset.tag;document.querySelectorAll("#topics button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));execute(true)});
 $("more").onclick=()=>{state.limit+=35;renderList()};
 if(state.query)execute(true);else{state.query="";renderList();$("detay").innerHTML='<div class="empty">'+html(L().choose)+'</div>';}
 finishSearchReady(true);document.dispatchEvent(new Event("6006:dtc-context"));
}
addEventListener("pageshow",()=>{searchReady.then(ok=>{if(!ok)return;if(state.brandOrigin==="vehicle"||state.brandOrigin==="all"){const v=vehicleProfile();state.brand=v?.brand?catalogManufacturer(v.brand)||"GENERIC":"ALL";state.brandOrigin=v?.brand?"vehicle":"all";$("brand").value=state.brand;execute(false);}document.dispatchEvent(new Event("6006:dtc-context"));});});
init().catch(e=>{finishSearchReady(false);console.error("6006 DTC catalog",e);$("count").textContent=L().error;$("items").textContent=L().error;});
})();
