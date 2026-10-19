// Generates curated, indexable German troubleshooting articles from reviewed editorial rows.
// The large 18,805-entry DTC database remains available for code lookup; do not
// mass-publish near-duplicate pages or fabricate vehicle-specific OEM data.
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const playbookUI=require('../dist/assets/6006-diagnostic-playbooks.js');
const playbooks=JSON.parse(fs.readFileSync('dist/assets/6006-diagnostic-playbooks.json','utf8'));
const ROOT='dist';
const base='https://6006coding.de';
const rows=[
['P0299','Ladedruck zu niedrig','Turbolader / Ansaugluft','Das Motorsteuergerät erkennt unter den Prüfbedingungen weniger Ladedruck als angefordert. Ein defekter Turbolader ist nur eine von mehreren möglichen Ursachen.','Schwacher Durchzug, Notlauf bei Beschleunigung, gelegentlich Pfeifen oder Zischen','Undichte Ladeluftschläuche und Ladeluftkühler; Fehler in Unterdruckversorgung oder Ladedrucksteller; Messabweichung von MAP-Sensor und Luftmassenmesser','Soll- und Ist-Ladedruck samt Drehzahl und Last protokollieren; Ansaug- und Druckschläuche auf Ölnebel, Risse und lose Schellen prüfen; Stelleransteuerung und Unterdrucksystem entsprechend Motorbauart testen','Bei starkem Leistungsverlust, auffälligem Rauch oder ungewöhnlichen Turbogeräuschen nicht unter Volllast weiterfahren.','P0234,P2563'],
['P0234','Ladedruck zu hoch','Turbolader / Regelung','Das Steuergerät meldet einen Ladedruck oberhalb des zulässigen Regelbereichs. Der Fehler kann sporadisch bei hoher Last auftreten und einen Notlauf auslösen.','Plötzlicher Leistungsverlust bei Beschleunigung, Notlauf, Motorkontrollleuchte','Schwergängige variable Turbinengeometrie; fehlerhafte Wastegate- oder Unterdruckregelung; fehlerhafte Druckmessung','Freeze-Frame mit Drehzahl und Last sichern; Ladedruck Soll/Ist unter passenden Bedingungen vergleichen; Regelventil, Gestänge und Sensorplausibilität testen','Wiederholter Überdruck kann Motor und Aufladung belasten; starke Beschleunigung bis zur Klärung vermeiden.','P0299,P2563'],
['P2563','Turbolader-Stellungsgeber: Signal unplausibel','Turbolader / Aktuator','Die Rückmeldung des Turbolader-Stellglieds liegt außerhalb des erwarteten Bereichs. Mechanik, Aktuator und Leitung müssen getrennt geprüft werden.','Notlauf, verzögerter Ladedruckaufbau, sporadischer Fehler unter Last','Schwergängige VTG-Mechanik; Stellmotor oder Positionssensor; Korrosion und Leitungsfehler','Steuergerät-spezifische Messwerte zum Steller prüfen; Stellgliedtest mit Soll/Ist-Positionsvergleich durchführen; Steckverbindung, Versorgung und mechanische Beweglichkeit kontrollieren','Eine erzwungene Verstellung ohne Herstellervorgaben kann den Aktuator beschädigen.','P0299,P0234'],
['P0401','AGR-Durchfluss zu gering','Abgasrückführung','Das AGR-System erreicht den erwarteten Rückführungsstrom nicht. Ursache kann im Ventil, den Kanälen oder der Messung liegen.','Motorkontrollleuchte, unrunder Lauf, Emissionsmeldung, teils reduzierter Durchzug','Verrußtes oder klemmendes AGR-Ventil; blockierte AGR-Kanäle oder AGR-Kühler; fehlerhafte Luftmassenmessung','AGR-Soll- und Istwerte nach Herstellervorgaben prüfen; Luftmassenänderung im AGR-Stellgliedtest bewerten; Ansaugwege und Ventilfunktion auf Ablagerungen und Undichtigkeiten prüfen','AGR-Abschaltung ist keine reguläre Reparatur für Fahrzeuge im Straßenverkehr; Ursache beseitigen.','P0403,P0402'],
['P0402','AGR-Durchfluss zu hoch','Abgasrückführung','Das Steuergerät erkennt eine zu hohe Abgasrückführung oder eine dazu passende Messabweichung.','Rauer Leerlauf, Absterben bei niedriger Drehzahl, Rauchentwicklung','AGR-Ventil schließt nicht vollständig; Stellungsgeber fehlerhaft; Messfehler in Luftmassen- oder Drucksignalen','AGR-Ansteuerung und Istwerte prüfen; Ventilsitz und Betätigung kontrollieren; Luftmassen- und Drucksensorwerte auf Plausibilität vergleichen','Bei häufigem Absterben des Motors in Verkehrssituationen Fahrzeug sicher abstellen.','P0401,P0403'],
['P0403','AGR-Steuerkreis fehlerhaft','AGR / Elektrik','Der elektrische Steuerkreis der Abgasrückführung zeigt eine Auffälligkeit. Das ist nicht gleichbedeutend mit mechanisch verkoktem AGR.','Motorkontrollleuchte, fehlende AGR-Regelung, gelegentlich Notlauf','Unterbrechung oder Kurzschluss im Kabelbaum; fehlende Spannungsversorgung; Defekt im AGR-Stellglied','Versorgung, Masse und Steckverbindungen prüfen; Leitungen anhand fahrzeugbezogener Stromlaufpläne messen; AGR-Stellgliedtest und weitere Fehlercodes auswerten','Elektrische Komponenten nicht auf Verdacht überbrücken; korrekte Prüfvorgaben verwenden.','P0401,P0402'],
['P2002','Dieselpartikelfilter-Wirkungsgrad zu niedrig','DPF / Abgassystem','Das Überwachungssystem erkennt einen unzureichenden Partikelfilter-Wirkungsgrad oder eine Messlage, die dazu passt.','DPF- oder Motorkontrollleuchte, häufige Regeneration, gegebenenfalls Leistungsverlust','Beschädigter oder überlasteter Filter; fehlerhafte Differenzdruckmessung; Abgastemperatur- oder Regenerationsproblem','Differenzdruck im Leerlauf und unter definierter Last bewerten; berechnete Ruß- und Aschemasse mit Fahrprofil vergleichen; Sensorleitungen und Abgasanlage auf Lecks prüfen','Bei aktiver schwerer DPF-Störung nicht einfach eine erzwungene Regeneration beginnen; thermische Risiken prüfen.','P2452,P2463'],
['P2452','DPF-Differenzdrucksensor: Signalfehler','DPF / Sensorik','Das Messsignal des DPF-Differenzdrucksensors oder dessen Kreis ist fehlerhaft. Ein verstopfter Filter muss nicht die Ursache sein.','DPF-Warnung, falsche Rußlastanzeige, häufige Regenerationsabbrüche','Gerissene oder zugesetzte Druckschläuche; fehlerhafter Sensor; Leitungs- oder Steckverbindungsproblem','Differenzdruck bei stehendem Motor plausibilisieren; Schläuche auf Kondensat, Risse und Verstopfung prüfen; elektrische Versorgung und Sensormessung kontrollieren','Heißes Abgassystem vor Arbeiten abkühlen lassen.','P2002,P2463'],
['P2463','DPF-Rußbeladung zu hoch','DPF / Regeneration','Die erfasste oder berechnete Rußbeladung überschreitet einen Grenzwert. Die Ursache kann außerhalb des Filters liegen.','DPF-Warnung, erhöhter Verbrauch, Lüfterlauf, Leistungsbegrenzung','Regeneration durch Fahrprofil oder andere Fehler unterbrochen; Sensor- oder Thermostatprobleme; zu hohe Rußbildung durch Luft- und Kraftstofffehler','Rußmasse und Differenzdruck zusammen beurteilen; Sperrbedingungen für Regeneration und Fehlerhistorie auslesen; Thermostat, Temperaturfühler, Einspritzung und Ansaugung prüfen','Bei hohen Beladungswerten kann eine unkontrollierte Regeneration gefährlich sein; Herstellervorgaben beachten.','P2002,P2452'],
['P20EE','SCR-NOx-Katalysator: Wirkungsgrad zu niedrig','AdBlue / SCR / NOx','Die NOx-Reduktion über das SCR-System reicht unter den Diagnosebedingungen nicht aus. Ein einzelner Code beweist keinen defekten SCR-Katalysator.','AdBlue-Warnung, Motorkontrollleuchte, möglicher Start-Countdown','Falsche oder gealterte AdBlue-Qualität; Dosier- oder Pumpenproblem; NOx-Sensorfehler oder Abgasleck','NOx-Messwerte vor und nach SCR plausibilisieren; AdBlue-Qualität, Tanktemperatur und Drucksystem prüfen; Einspritzung und Softwarestand nach Herstellervorgaben bewerten','Bei angekündigter Startsperre nicht bis zum letzten Kilometer warten; SCR-System fachgerecht instand setzen.','P204F,P2201'],
['P204F','SCR-Reduktionsmittelsystem: Leistungsproblem','AdBlue / SCR','Das Reduktionsmittelsystem erfüllt Betriebs- oder Diagnosekriterien nicht. Die genaue Ursache hängt von den zusätzlichen Codes ab.','AdBlue-Fehler, Warnleuchte, gelegentlich Startverhinderungs-Countdown','Dosierpumpe oder Druckaufbau fehlerhaft; Leitungsheizung oder Kristallbildung; Füllstands- oder Qualitätsmessung unplausibel','Alle SCR-Untercodes sichern; Pumpendruck und Dosiertest gemäß Systemvariante durchführen; Leitungen, Heizung und Tankmodule prüfen','Das bloße Löschen des Fehlers setzt eine beginnende Startsperre oft nicht dauerhaft zurück.','P20EE,P2201'],
['P2201','NOx-Sensor: Bereich oder Leistung','NOx / Sensor','Das NOx-Signal passt unter den Prüfbedingungen nicht zum erwarteten Wertebereich.','Motorkontrollleuchte, SCR-Fehler, unter Umständen erhöhte AdBlue-Warnungen','NOx-Sensoreinheit oder Heizung defekt; Kabelbaum und Abgasleck; Folgestörung durch Verbrennungs- oder SCR-Probleme','Temperatur und Aufheizstatus prüfen; NOx-Werte bei definierten Betriebsbedingungen plausibilisieren; Stecker, Versorgung und zeitlich zugehörige SCR-Codes prüfen','Sensor nicht aufgrund eines einzelnen Eintrags ersetzen; Begleitfehler auswerten.','P20EE,P204F'],
['P0101','Luftmassenmesser: Bereich / Leistung','Ansaugluft / Sensor','Gemessene Luftmasse und vom Steuergerät erwartete Luftmasse stimmen nicht ausreichend überein.','Ruckeln, träges Ansprechverhalten, Motorkontrollleuchte','Falschluft oder undichter Ansaugtrakt; verschmutzter Luftfilter oder Luftmassenmesser; AGR- und Ladedruckfehler','Luftmasse Soll/Ist bei Leerlauf und Last vergleichen; Ansaugschlauch und Luftfilter prüfen; Begleitcodes für AGR und Ladedruck einbeziehen','Sensorreiniger oder Ersatz allein löst eine mechanische Falschluftquelle nicht.','P0299,P0401'],
['P0087','Kraftstoff-Raildruck zu niedrig','Kraftstoff / Einspritzung','Der gemessene Kraftstoffdruck liegt unterhalb der geforderten Werte.','Startprobleme, Aussetzer unter Last, Notlauf','Kraftstofffilter oder Vorförderung eingeschränkt; Hochdruckregelung oder Pumpe; Leckage auf der Einspritzseite','Kraftstoffdruck Soll/Ist und Vorförderdruck prüfen; Filterhistorie und Kraftstoffversorgung bewerten; Rücklaufmengen nur nach Herstellervorgaben testen','Common-Rail-Systeme stehen unter sehr hohem Druck. Leitungen niemals bei laufendem Motor lösen.','P0191,P0299'],
['P0191','Raildrucksensor: Bereich / Leistung','Kraftstoff / Sensor','Das Signal des Kraftstoff-Raildrucksensors ist unter den Prüfbedingungen unplausibel.','Startprobleme, Ruckeln, unruhiger Lauf, Leistungsbegrenzung','Sensor oder Steckverbindung; Spannungsversorgung oder Masse; tatsächliche Druckregelungsprobleme','Druckverlauf Soll/Ist mit Start- und Lastzuständen vergleichen; elektrische Versorgung und Anschlüsse prüfen; andere Raildruckcodes auswerten','An Hochdruckleitungen nur nach sicheren Herstelleranweisungen arbeiten.','P0087,P0101'],
['P0171','Gemisch zu mager (Bank 1)','Benzin / Gemischbildung','Die Kraftstoffkorrektur des Motorsteuergeräts deutet auf ein zu mageres Gemisch hin.','Unrunder Leerlauf, verzögerte Gasannahme, Motorkontrollleuchte','Ansaugfalschluft oder defekte Kurbelgehäuseentlüftung; Kraftstoffdruck zu niedrig; Luftmassen- oder Lambdasignal fehlerhaft','Kurz- und Langzeit-Kraftstofftrims getrennt betrachten; Ansaugsystem auf Lecks testen; Kraftstoffdruck und Lambdasignal bei Betriebswärme prüfen','Bei starken Aussetzern nicht weiter stark beschleunigen; Katalysatorschäden sind möglich.','P0300,P0101'],
['P0300','Zufällige oder mehrere Zündaussetzer','Benzin / Verbrennung','Der Motor erkennt wiederholte Verbrennungsaussetzer ohne sichere Zuordnung zu einem einzelnen Zylinder.','Ruckeln, unruhiger Leerlauf, blinkende Motorkontrollleuchte','Zündkerzen oder Zündspulen; Einspritzung und Gemisch; mechanische Kompression und Falschluft','Aussetzerzähler je Zylinder lesen; Zündsystem und Kraftstofftrims prüfen; bei anhaltendem Fehler Kompression und Einspritzung prüfen','Blinkt die Motorkontrollleuchte bei starken Aussetzern, Motorlast sofort reduzieren und sicher anhalten.','P0171,P0101'],
['P0420','Katalysator-Wirkungsgrad unter Schwelle (Bank 1)','Abgas / Katalysator','Die Überwachung der Katalysatorleistung meldet eine unzureichende Wirkung. Andere Fehler können die Diagnose verfälschen.','Motorkontrollleuchte, teils erhöhter Verbrauch, häufig keine eindeutigen Fahrsymptome','Abgasleck vor dem Katalysator; Gemisch- oder Zündaussetzer; gealterter Katalysator oder Lambdasonde','Zuerst aktive Gemisch- und Misfire-Codes beheben; Abgasdichtheit prüfen; Lambdasignale unter passenden Betriebsbedingungen bewerten','Katalysator nicht ohne Überprüfung von Gemischbildung und Leckagen ersetzen.','P0171,P0300'],
['P0016','Kurbelwellen- / Nockenwellen-Korrelation','Motorsteuerung / Steuerzeiten','Die Positionssignale von Kurbelwelle und Nockenwelle weichen stärker voneinander ab als vorgesehen.','Schlechtes Startverhalten, unrunder Lauf, Leistungsverlust','Gelängte Kette oder falsche Steuerzeiten; Signalgeber oder Zahnkranzproblem; Öldruck- und Nockenwellenversteller-Störung','Mechanische Steuerzeiten mit motorbezogenen Werkzeugen kontrollieren; Synchronisationswerte und Sensorleitungen prüfen; Öldruck und Steuerkettenhistorie bewerten','Bei auffälligen Geräuschen und Verdacht auf verschobene Steuerzeiten Motor nicht weiter starten.','P0340,P0300'],
['P0340','Nockenwellensensor: elektrischer Kreis','Motorsteuerung / Sensor','Das Nockenwellensensorsignal fehlt oder ist elektrisch unplausibel.','Langer Startvorgang, Absterben, unrunder Lauf','Sensor- oder Kabelbaumfehler; Steckverbinder oder Versorgung; mechanische Synchronisationsstörung','Stecker und Leitungen kontrollieren; Signal mit geeigneter Messtechnik prüfen; Fehler P0016 und mechanische Steuerzeiten mitbewerten','Bei Startproblemen nicht ununterbrochen orgeln; Batterie und Anlasser schützen.','P0016,P0300'],
['P0700','Getriebesteuerung meldet Störung','Getriebe / TCM','Der Motorsteuergerät-Eintrag weist auf einen im Getriebesteuergerät gespeicherten Fehler hin. Die eigentliche Ursache steht im TCM-Fehlerspeicher.','Getriebewarnung, eingeschränkte Schaltfunktion, Notlauf','Weitere TCM-Codes oder Spannungsausfall; Sensorik und Hydraulik; Kommunikation zum Getriebesteuergerät','Getriebesteuergerät separat auslesen; Batteriespannung und Versorgung prüfen; Temperatur, Drehzahlsensoren und Hydraulikwerte je nach Untercode prüfen','Nicht aufgrund von P0700 allein das Getriebe tauschen oder spülen.','U0100,P0087'],
['U0100','Kommunikation mit Motorsteuergerät verloren','CAN / Elektrik','Ein oder mehrere Steuergeräte haben die Kommunikation mit dem Motorsteuergerät zeitweise verloren.','Mehrere Warnlampen, Startprobleme, sporadische Ausfälle','Batterieunterspannung oder Massefehler; Sicherung und Stromversorgung; CAN-Leitung oder Steckkontakt','Zeitstempel und Netzwerkkontext aller Steuergeräte vergleichen; Batteriespannung und Massepunkte prüfen; CAN-Leitungen anhand fahrzeugspezifischer Schaltpläne testen','Bei Ausfall zentraler Fahrzeugfunktionen nicht weiterfahren.','U0121,P0700'],
['U0121','Kommunikation mit ABS-Steuergerät verloren','CAN / ABS','Das Fahrzeugnetzwerk erhält vom ABS-/ESP-Steuergerät keine erwarteten Nachrichten.','ABS- und ESP-Leuchte, Assistenzsystem-Ausfall, mehrere Fehler zugleich','Unterspannung und Sicherungen; Versorgung oder Masse des ABS-Steuergeräts; Netzwerkverkabelung oder Stecker','ABS-Steuergerät direkt ansprechen; Spannungsversorgung unter Last prüfen; CAN-Bus und Begleitcodes kontrollieren','Bei ABS-/ESP-Ausfall längeren Bremsweg und fehlende Stabilisierung berücksichtigen und Fahrzeug überprüfen lassen.','U0100,C0035'],
['C0035','Raddrehzahlsensor vorne links: Signalproblem','ABS / Fahrwerk','Der Diagnosecode wird häufig dem vorderen linken Raddrehzahlsensor zugeordnet; markenspezifische Untercodes müssen geprüft werden.','ABS-/ESP-Leuchte, ausgefallene Traktionsregelung, unplausible Geschwindigkeit','Beschädigtes Sensorkabel oder Stecker; Sensorfehler; beschädigter Magnetencoder am Radlager','Live-Raddrehzahlen aller vier Räder vergleichen; Sensorleitung und mechanischen Einbau prüfen; Radlager-Encoder auf Beschädigung kontrollieren','Bremsreparaturen und Arbeiten an ABS-Sensorik erfordern geeignete Sicherung und Fachkenntnis.','U0121,P0700']
];

// Additional individually reviewed first-pass troubleshooting profiles.
// Do not infer exact OEM repair approval, replacement necessity or tuning results from these entries.
rows.push(...[
  [
    "P0100",
    "Luftmassenmesser: Signal-/Stromkreisfehler",
    "Ansaugluft / MAF",
    "Das Luftmassenmessersignal fehlt oder liegt außerhalb des plausiblen elektrischen Bereichs.",
    "Leistungsverlust, unrunder Leerlauf, Motorkontrollleuchte",
    "Beschädigter Sensorstecker oder Kabel; Stromversorgung oder Massefehler; defekter MAF-Sensor",
    "Fehlerspeicher und Freeze-Frame auslesen; Versorgung, Masse und Signalleitung prüfen; Luftmassenwerte im Vergleich zu Last und Drehzahl beurteilen",
    "Ein elektrischer Fehler verlangt eine andere Prüfung als ein verschmutzter Sensor.",
    "P0101,P0102"
  ],
  [
    "P0102",
    "Luftmassenmesser: Signal zu niedrig",
    "Ansaugluft / MAF",
    "Das Steuergerät erfasst ein zu kleines Luftmassenmesser-Signal.",
    "Schlechter Durchzug, rauer Leerlauf, teils erhöhter Verbrauch",
    "Signalunterbrechung oder Masseproblem; Luftfilter-/Ansaugproblem; Sensorfehler",
    "Stecker und Kabelstrang auf Scheuerstellen prüfen; Messwert bei Motorlauf und Lastwechsel verfolgen; Ansaugtrakt auf Undichtigkeiten kontrollieren",
    "Sensorersatz erst nach elektrischer und mechanischer Kontrolle.",
    "P0100,P0101"
  ],
  [
    "P0103",
    "Luftmassenmesser: Signal zu hoch",
    "Ansaugluft / MAF",
    "Das Eingangssignal des MAF liegt oberhalb des erwarteten elektrischen Bereichs.",
    "Motorkontrollleuchte, schlechter Motorlauf, Notlauf",
    "Kurzschluss gegen Versorgung; fehlerhafte Sensorversorgung; defekter MAF",
    "MAF-Signal und Referenzspannung prüfen; Steckerkorrosion suchen; Signal während Kabelbewegung beobachten",
    "Stecker nie mit ungeeigneter Prüfspannung beaufschlagen.",
    "P0100,P0101"
  ],
  [
    "P0113",
    "Ansauglufttemperatursensor: Signal hoch",
    "Ansaugluft / Temperatur",
    "Ein hohes Eingangssignal weist bei vielen NTC-Sensoren auf eine Unterbrechung oder extrem niedrige gemeldete Temperatur hin.",
    "Kaltstartabweichungen, Motorkontrollleuchte, unplausible Temperatur",
    "Leitungsunterbrechung; loser Stecker; Defekt im kombinierten MAF-/Temperatursensor",
    "Ansauglufttemperatur bei kaltem Motor mit Umgebung vergleichen; Versorgung und Sensorkreis prüfen; Steckerbelegung nach Motorcode abgleichen",
    "Ein hoher Spannungswert bedeutet nicht automatisch eine tatsächlich heiße Ansaugluft.",
    "P0100,P0118"
  ],
  [
    "P0118",
    "Kühlmitteltemperaturgeber: Signal hoch",
    "Motorkühlung / Sensor",
    "Der Kühlmitteltemperatur-Signalkreis meldet einen unzulässig hohen elektrischen Wert.",
    "Schwieriger Start, auffälliger Lüfterlauf, Motorkontrollleuchte",
    "Offener Sensorkreis; Kontaktproblem; defekter Kühlmitteltemperaturgeber",
    "Kühlmitteltemperatur nach Standzeit mit Umgebung vergleichen; Leitung und Stecker prüfen; Temperaturverlauf beim Warmlauf prüfen",
    "Bei Überhitzungsanzeige nicht nur auf den Fehlerspeicher vertrauen; Kühlmittelstand und reale Temperatur sicher prüfen.",
    "P0128,P0113"
  ],
  [
    "P0128",
    "Kühlmittelthermostat: Temperatur zu niedrig",
    "Motorkühlung / Thermostat",
    "Der Motor erreicht innerhalb der erwarteten Zeit nicht die vorgesehene Kühlmitteltemperatur.",
    "Heizung bleibt schwach, langsamer Warmlauf, erhöhter Verbrauch",
    "Thermostat hängt offen; Kühlmitteltemperaturgeber misst falsch; Kühlkreislaufregelung gestört",
    "Warmlaufkurve bei Außentemperatur protokollieren; Kühlerschläuche und Thermostatregelung beurteilen; Solltemperatur motorabhängig abgleichen",
    "Kühlkreislauf nur am abgekühlten Motor öffnen.",
    "P0118,P0597"
  ],
  [
    "P0121",
    "Drosselklappen-Stellung: Bereich/Leistung",
    "Drosselklappe / Elektronik",
    "Die Rückmeldung der Drosselklappenstellung passt nicht zu den erwarteten Signalen.",
    "Verzögerte Gasannahme, Motorlaufprobleme, Notlauf",
    "Drosselklappengehäuse verschmutzt; Positionsgeber-/Antriebsschaden; Steck- oder Kabelproblem",
    "Pedal- und Drosselklappen-Soll/Istwerte vergleichen; Stecker und Spannungsversorgung prüfen; Anlernung nur nach Herstellervorgabe durchführen",
    "Bei unkontrollierbarer Gasannahme Fahrzeug sicher abstellen.",
    "P0221,P0507"
  ],
  [
    "P0130",
    "Lambdasonde Bank 1 Sensor 1: Stromkreis",
    "Abgas / Lambdaregelung",
    "Die elektrische Überwachung der vorderen Lambdasonde meldet einen Stromkreisfehler.",
    "Motorkontrollleuchte, Mehrverbrauch, unruhiger Motorlauf",
    "Sondenkabel thermisch beschädigt; Steck- oder Massefehler; Sensordefekt",
    "Heizung und Signalkreis getrennt prüfen; Leitung im Abgasbereich kontrollieren; Gemischfehler als Folgecodes bewerten",
    "Ein Lambdasondenfehler kann die Folge von Gemischproblemen sein.",
    "P0133,P0171"
  ],
  [
    "P0133",
    "Vordere Lambdasonde: langsame Reaktion",
    "Abgas / Lambdaregelung",
    "Das Lambda-Regelsignal reagiert langsamer als im Diagnosefenster erwartet.",
    "Motorkontrollleuchte, gelegentlich Mehrverbrauch, kaum Fahrsymptome",
    "Gealterte Lambdasonde; Abgasleck; Gemisch- und Kraftstoffdruckabweichung",
    "Lambdaregelung bei betriebswarmem Motor prüfen; Abgasdichtheit vor Sonde beurteilen; Kraftstoffkorrekturwerte mitlesen",
    "Sonden nicht ohne vorgelagerte Abgas- und Gemischkontrolle wechseln.",
    "P0130,P0171"
  ],
  [
    "P0135",
    "Lambdasondenheizung Bank 1 Sensor 1",
    "Abgas / Sondenheizung",
    "Der Heizkreis der vorderen Lambdasonde arbeitet nicht innerhalb der erwarteten elektrischen Grenzen.",
    "Motorkontrollleuchte, verzögerte Regelbereitschaft nach Kaltstart",
    "Heizung der Sonde defekt; Sicherung oder Spannungsversorgung; beschädigter Stecker",
    "Heizungsversorgung und elektrische Leitung prüfen; Freigabebedingungen für Sondenheizung auslesen; Heizkreis nach Schaltplan testen",
    "Messungen am heißen Abgasstrang nur mit geeigneter Ausrüstung.",
    "P0130,P0141"
  ],
  [
    "P0141",
    "Lambdasondenheizung Bank 1 Sensor 2",
    "Abgas / Sondenheizung",
    "Die Heizung der nachgeschalteten Lambdasonde zeigt einen elektrischen Fehler.",
    "Motorkontrollleuchte, meist kein deutlicher Leistungsverlust",
    "Leitung im Abgasbereich beschädigt; Heizungsversorgung fehlerhaft; defekte Nachkatsonde",
    "Vor- und Nachkatsonde eindeutig identifizieren; Sicherung und Steckverbindung kontrollieren; Heizkreis gemäß Schaltplan messen",
    "Vordere und hintere Sonde nicht verwechseln.",
    "P0135,P0420"
  ],
  [
    "P0174",
    "Gemisch zu mager (Bank 2)",
    "Benzin / Gemischbildung",
    "Die Kraftstoffanpassung der zweiten Zylinderbank deutet auf ein dauerhaft zu mageres Gemisch hin.",
    "Unruhiger Leerlauf, schwache Gasannahme, Motorkontrollleuchte",
    "Falschluft an Bank 2; Kraftstoffdruck- oder MAF-Abweichung; undichter Ansaugkrümmer",
    "Kurz- und Langzeittrims beider Bänke gegenüberstellen; Rauchtest des Ansaugsystems; Kraftstoffdruck und Lambdaregelung prüfen",
    "Bei starkem Ruckeln hohe Motorlast vermeiden.",
    "P0171,P0300"
  ],
  [
    "P0201",
    "Einspritzventil Zylinder 1: Stromkreis",
    "Einspritzung / Elektrik",
    "Das Motorsteuergerät erkennt eine Auffälligkeit bei der elektrischen Ansteuerung des Injektors von Zylinder 1.",
    "Ruckeln, fehlende Leistung, Aussetzer unter Last",
    "Unterbrechung oder Kurzschluss im Injektorkreis; Steckkontakt; defekter Injektor",
    "Zylinderzuordnung anhand Motorplan bestätigen; Leitung und Stecker prüfen; elektrischen Injektortest nach Herstellervorgabe durchführen",
    "Hochdruck-Kraftstoffleitungen nicht bei laufendem Motor lösen.",
    "P0301,P0087"
  ],
  [
    "P0301",
    "Verbrennungsaussetzer Zylinder 1",
    "Motor / Verbrennung",
    "Das Steuergerät erkennt Verbrennungsaussetzer am ersten Zylinder.",
    "Starkes Ruckeln, Motorkontrollleuchte, schlechter Leerlauf",
    "Zündkerze oder Zündspule bei Ottomotoren; Einspritzung; Kompression oder Ventilproblem",
    "Aussetzerzähler und Zylinderzuordnung prüfen; Zünd-/Einspritzkomponenten systematisch testen; bei Bedarf Kompression prüfen",
    "Bei blinkender Motorkontrollleuchte Motorlast reduzieren und sicher anhalten.",
    "P0300,P0201"
  ],
  [
    "P0302",
    "Verbrennungsaussetzer Zylinder 2",
    "Motor / Verbrennung",
    "Das Steuergerät erkennt wiederholte Aussetzer an Zylinder 2.",
    "Ruckeln, Startprobleme, teils blinkende Motorleuchte",
    "Zündung bei Ottomotor; Einspritzfehler; mechanische Zylinderabweichung",
    "Freeze-Frame sichern; zylinderbezogene Zünd- und Einspritzwerte kontrollieren; Kompression bei anhaltendem Aussetzer testen",
    "Anhaltende Aussetzer können den Katalysator beschädigen.",
    "P0300,P0301"
  ],
  [
    "P0303",
    "Verbrennungsaussetzer Zylinder 3",
    "Motor / Verbrennung",
    "Die Verbrennungsüberwachung erkennt Aussetzer am dritten Zylinder.",
    "Unrunder Lauf, Leistungseinbruch, erhöhter Kraftstoffverbrauch",
    "Zünd- oder Einspritzproblem; Falschluft am betreffenden Ansaugkanal; Kompressionsverlust",
    "Zylinderzuordnung verifizieren; Aussetzerwerte nach Lastzustand vergleichen; Einspritzung, Zündung und Mechanik getrennt testen",
    "Bei starken Zündaussetzern nicht weiter stark beschleunigen.",
    "P0300,P0302"
  ],
  [
    "P0325",
    "Klopfsensor 1: Stromkreisfehler",
    "Motor / Klopfregelung",
    "Die elektrische Überwachung des Klopfsensors oder seines Signalwegs meldet einen Fehler.",
    "Verringerte Leistung, Zündwinkelrücknahme, Motorkontrollleuchte",
    "Sensorkabel abgeschirmt beschädigt; Befestigungsmoment falsch; Sensor defekt",
    "Sensorkreis und Steckverbindung prüfen; korrekte Befestigung nach Motorvorgabe kontrollieren; Klopfregelwerte und Begleitcodes auswerten",
    "Sensorbefestigung nicht ohne vorgegebenes Drehmoment verändern.",
    "P0300,P0335"
  ],
  [
    "P0335",
    "Kurbelwellenpositionssensor: Stromkreis",
    "Motordrehzahl / Sensor",
    "Das Kurbelwellensignal fehlt oder wird elektrisch unplausibel erkannt.",
    "Motor startet nicht, stirbt warm ab, Drehzahlanzeige fällt aus",
    "Wärmeabhängiger Sensorsignalfehler; Kabel oder Stecker; beschädigter Geberkranz",
    "Beim Starten Drehzahlsignal beobachten; Sensorversorgung und Signalform prüfen; Leitung und Geberrad kontrollieren",
    "Bei spontanem Motorstillstand während der Fahrt sicher anhalten.",
    "P0340,P0016"
  ],
  [
    "P0351",
    "Zündspule A: Primär-/Sekundärkreis",
    "Zündung / Elektrik",
    "Das Steuergerät meldet eine elektrische Störung im zugeordneten Zündspulenkreis.",
    "Deutliches Ruckeln, Aussetzer, Motorwarnleuchte",
    "Spule oder integrierter Treiber; Anschluss oder Leitung; fehlerhafte Versorgung",
    "Spulenbezeichnung A mit Motorplan abgleichen; Steueransteuerung und Spannungsversorgung kontrollieren; Fehlzündungszähler prüfen",
    "Hochspannungsteile nicht bei laufendem Motor berühren.",
    "P0301,P0300"
  ],
  [
    "P0440",
    "Tankentlüftungssystem: allgemeine Störung",
    "Kraftstoffdämpfe / EVAP",
    "Die Dichtheits- oder Funktionsüberwachung des Tankentlüftungssystems ist fehlgeschlagen.",
    "Motorkontrollleuchte, gelegentlich Kraftstoffgeruch",
    "Tankdeckeldichtung; poröse Tankentlüftungsleitung; Ventil- oder Aktivkohlefilterproblem",
    "Tankverschluss und Leitungen prüfen; EVAP-Stellglied- und Dichtheitstests gemäß Fahrzeugtyp ausführen; Begleitcodes auswerten",
    "Bei starkem Kraftstoffgeruch Zündquellen vermeiden und Leck fachlich klären.",
    "P0442,P0455"
  ],
  [
    "P0441",
    "Tankentlüftung: Durchfluss unplausibel",
    "Kraftstoffdämpfe / EVAP",
    "Der gemessene beziehungsweise abgeleitete Gasdurchfluss bei der Tankentlüftung passt nicht zum Soll.",
    "Unruhiger Leerlauf nach Tanken, Motorwarnleuchte",
    "Tankentlüftungsventil klemmt; Schläuche falsch verlegt; Druck-/Purge-Steuerung gestört",
    "Tankentlüftungsventil gezielt ansteuern; Schlauchführung kontrollieren; Kraftstofftrims unter Ventilbetätigung beobachten",
    "Nicht von EVAP-Fehler auf einen defekten Tank schließen.",
    "P0440,P0442"
  ],
  [
    "P0442",
    "Kleines Leck im Tankentlüftungssystem",
    "Kraftstoffdämpfe / EVAP",
    "Das Diagnosesystem meldet eine kleine Undichtigkeit im Verdunstungsemissionssystem.",
    "Häufig nur Motorkontrollleuchte, gelegentlich Kraftstoffgeruch",
    "Tankdeckel oder Dichtung; Haarriss im Entlüftungsschlauch; Tankventil schließt nicht",
    "Tankverschluss und Dichtungen prüfen; EVAP-Dichtheit mit geeigneter Prüftechnik kontrollieren; Ventile auf korrekte Funktion prüfen",
    "Keine unzulässige Druckluft oder brennbare Prüfmittel in das EVAP-System geben.",
    "P0440,P0456"
  ],
  [
    "P0455",
    "Großes Leck im Tankentlüftungssystem",
    "Kraftstoffdämpfe / EVAP",
    "Das Steuergerät erkennt eine erhebliche Undichtigkeit im EVAP-System.",
    "Motorkontrollleuchte, möglicherweise Kraftstoffgeruch",
    "Lockerer Tankdeckel; abgerissener Schlauch; offenes Tankentlüftungsventil",
    "Tankdeckel und sichtbare Leitungen zuerst prüfen; Dichtheitstest mit geeigneter Anlage durchführen; Aktivkohlefiltergehäuse begutachten",
    "Bei Kraftstoffgeruch oder sichtbarem Leck Fahrzeug sicher abstellen.",
    "P0440,P0442"
  ],
  [
    "P0456",
    "Sehr kleines EVAP-Leck",
    "Kraftstoffdämpfe / EVAP",
    "Ein besonders kleines Leck wurde bei der Selbstprüfung erkannt; die Grenzwerte sind herstellerabhängig.",
    "Oft keine Fahrsymptome außer Warnleuchte",
    "Tankverschlussdichtung; mikroskopischer Leitungsriss; Prüfventil undicht",
    "Tankverschlussoberfläche reinigen und prüfen; Leitungsverbinder inspizieren; empfindlichen Dichtheitstest gemäß Herstellervorgabe durchführen",
    "Fehlerspeicher löschen ohne Lecksuche behebt die Ursache nicht.",
    "P0442,P0455"
  ],
  [
    "P0500",
    "Fahrgeschwindigkeitssensor: Stromkreis",
    "Geschwindigkeit / Getriebe",
    "Ein erwartetes Fahrzeuggeschwindigkeitssignal fehlt oder ist fehlerhaft.",
    "Geschwindigkeitsanzeige unzuverlässig, Automatik schaltet auffällig, ABS-Meldung",
    "Raddrehzahlsensor- oder Getriebesignal; Kabelbaum; Kommunikationsproblem",
    "Geschwindigkeitssignale im Motor-, ABS- und Getriebesteuergerät vergleichen; Sensorquelle fahrzeugabhängig ermitteln; Sicherungen und Leitungen prüfen",
    "Defekte Geschwindigkeitsanzeige und Assistenzsysteme können sicherheitsrelevant sein.",
    "U0121,C0035"
  ],
  [
    "P0507",
    "Leerlaufregelung: Drehzahl höher als erwartet",
    "Leerlauf / Drosselklappe",
    "Die Motordrehzahl im Leerlauf liegt über der vom Steuergerät vorgesehenen Sollvorgabe.",
    "Zu hoher Leerlauf, unruhige Drehzahl, teils erhöhte Kriechneigung",
    "Falschluft; Drosselklappenverschmutzung und Adaptionsabweichung; Kurbelgehäuseentlüftung undicht",
    "Leerlauf Soll/Ist prüfen; Ansaugtrakt auf Lecks testen; Drosselklappenadaption nur bei geeignetem Modell vornehmen",
    "Bei erhöhter Kriechneigung Fahrzeug sicher abstellen.",
    "P0121,P0171"
  ],
  [
    "P0562",
    "Bordnetzspannung zu niedrig",
    "Elektrische Versorgung",
    "Die überwachte Bordnetzspannung fällt unter den zulässigen Bereich.",
    "Mehrere Warnlampen, Startprobleme, zeitweilige Steuergeräteausfälle",
    "Schwache Batterie; Lichtmaschine oder Regler; Übergangswiderstand an Masse",
    "Batterieruhespannung und Spannung unter Startlast messen; Ladespannung prüfen; Masse- und Plusverbindungen unter Last prüfen",
    "Unterspannung kann zahlreiche Folgefehler in anderen Steuergeräten auslösen.",
    "U0100,U0121"
  ],
  [
    "P0606",
    "Motorsteuergerät: Prozessorüberwachung",
    "ECU / Elektronik",
    "Die interne Selbstüberwachung des Motorsteuergeräts meldet eine Prozessor- oder Steuergerätefunktionsabweichung.",
    "Startprobleme, sporadischer Notlauf, Motorwarnleuchte",
    "Spannungs- und Masseversorgung unzureichend; Software-/Kommunikationsstörung; interner ECU-Defekt",
    "Batterie- und ECU-Versorgung unter Last prüfen; relevante Softwareversion und bekannte Servicehinweise prüfen; Fehler nach stabiler Versorgung erneut bewerten",
    "Steuergerätetausch nicht ohne Versorgungstest und Herstellervorgaben beginnen.",
    "P0562,U0100"
  ],
  [
    "P0627",
    "Kraftstoffpumpe A: Steuerkreis unterbrochen",
    "Kraftstoff / Pumpensteuerung",
    "Die elektrische Ansteuerung des Kraftstoffpumpenkreises weist eine Unterbrechung oder Funktionsabweichung auf.",
    "Motor startet schlecht oder gar nicht, Leistungsausfall",
    "Relais oder Sicherung; Pumpensteuergerät; Leitungsunterbrechung oder Pumpendefekt",
    "Beim Start Pumpenansteuerung und Versorgung prüfen; Sicherungen und Relais kontrollieren; Pumpenstrom nur mit geeigneter Messtechnik prüfen",
    "Arbeiten an Kraftstoffleitungen erfordern Brandschutz und geeignete Ausrüstung.",
    "P0087,P0191"
  ],
  [
    "P0670",
    "Vorglüh-Steuergerät: Stromkreisfehler",
    "Diesel / Vorglühen",
    "Das Steuergerät erkennt eine Störung im zentralen Stromkreis des Vorglühsystems.",
    "Schlechtes Kaltstartverhalten, Vorglühlampe, Motorwarnleuchte",
    "Vorglühmodul; Sicherung oder Masse; Leitungskontakt",
    "Vorglühsteuergerät und einzelne Glühkerzencodes getrennt auslesen; Versorgung prüfen; Ansteuerung nach Temperaturbedingungen testen",
    "Glühkerzen können fest sitzen; Ausbau nur mit angemessener Fachkenntnis.",
    "P0671,P0118"
  ],
  [
    "P0671",
    "Glühkerze Zylinder 1: Stromkreisfehler",
    "Diesel / Vorglühen",
    "Der elektrische Glühkreis für den ersten Zylinder hat einen Fehler.",
    "Schlechter Kaltstart, rauer Lauf unmittelbar nach Start",
    "Glühkerze elektrisch defekt; Steck- oder Kabelproblem; Vorglühsteuergerät",
    "Zylinderreihenfolge motorabhängig bestätigen; Glühkreis elektrisch mit geeigneter Prüfmethode messen; Steuergerätansteuerung kontrollieren",
    "Festgefressene Glühkerzen nicht mit Gewalt lösen.",
    "P0670,P0118"
  ],
  [
    "P0715",
    "Getriebeeingangsdrehzahlsensor: Stromkreis",
    "Automatikgetriebe / Drehzahlsensor",
    "Das Getriebesteuergerät erhält ein unzulässiges Eingangsdrehzahlsignal.",
    "Ruckende Schaltvorgänge, Notlauf, Gangwahlprobleme",
    "Drehzahlsensor oder interne Leitung; Stecker / Getriebeöl im Stecker; Versorgung",
    "TCM mitlesen; Eingangsdrehzahl mit Motordrehzahl und Ausgangsdrehzahl vergleichen; elektrische Stecker kontrollieren",
    "Bei rutschender Kupplung oder starken Getriebeschlägen Belastung reduzieren.",
    "P0700,P0720"
  ],
  [
    "P0720",
    "Getriebeausgangsdrehzahlsensor: Stromkreis",
    "Automatikgetriebe / Drehzahlsensor",
    "Das Ausgangsdrehzahlsignal des Getriebes wird nicht korrekt erkannt.",
    "Schaltfehler, Notlauf, fehlerhafte Geschwindigkeitsanzeige",
    "Sensor oder interner Kabelbaum; Steckproblem; beschädigter Signalgeber",
    "Drehzahlen beim langsamen Rollen vergleichen; TCM-Zusatzcodes auslesen; Sensorkreis nach Getriebetyp prüfen",
    "Keine Probefahrt mit unsicherer Schaltfunktion durchführen.",
    "P0715,P0700"
  ],
  [
    "P0730",
    "Falsches Übersetzungsverhältnis im Getriebe",
    "Automatikgetriebe / Übersetzung",
    "Das Verhältnis zwischen Eingangs- und Ausgangsdrehzahl entspricht keinem erwarteten Gang.",
    "Schlupf, harte Schaltvorgänge, Getriebe-Notlauf",
    "Kupplungsrutschen; Hydraulik- oder Öldruckproblem; Drehzahlsensorabweichung",
    "Getriebeölstand und -spezifikation fachgerecht prüfen; Sollgang und Drehzahldifferenzen loggen; weitere TCM-Codes auswerten",
    "Bei massivem Schlupf droht Getriebeschaden; Fahrzeug nicht belasten.",
    "P0715,P0720"
  ],
  [
    "P0741",
    "Wandlerüberbrückungskupplung: Leistung / klemmt offen",
    "Automatikgetriebe / Wandler",
    "Die Überbrückungskupplung des Drehmomentwandlers erreicht den erwarteten Schlupfbereich nicht.",
    "Erhöhte Drehzahl bei Fahrt, schlechter Wirkungsgrad, Getriebewarnung",
    "Kupplungsverschleiß; Hydrauliksteuerung und Magnetventil; unpassende Getriebeölbedingungen",
    "TCM-Wandlerschlupf während zulässiger Fahrbedingungen protokollieren; Getriebetemperatur und Ölzustand prüfen; Magnetventilsteuerung bewerten",
    "Kupplungs- und Hydraulikfehler nur getriebetypbezogen reparieren.",
    "P0700,P0730"
  ],
  [
    "P0750",
    "Schaltmagnetventil A: Fehler",
    "Automatikgetriebe / Magnetventil",
    "Die Steuerung eines als A bezeichneten Schaltmagnetventils ist elektrisch oder funktional auffällig.",
    "Harte Schaltungen, Gang wird nicht eingelegt, Notlauf",
    "Magnetventil defekt; interne Leitungsplatte; Druck-/Hydraulikproblem",
    "Ventilzuordnung per Getriebecode prüfen; TCM-Stellglied- und Leitungsprüfung durchführen; Ölstand und Druckbedingungen bewerten",
    "Magnetventile nicht allein anhand der Buchstabenkennung lokalisieren.",
    "P0700,P0730"
  ],
  [
    "P0841",
    "Getriebeöldrucksensor A: Bereich/Leistung",
    "Automatikgetriebe / Öldruck",
    "Das Öl-/Hydraulikdrucksignal im Getriebe liegt außerhalb des plausiblen Bereichs.",
    "Schaltverzögerung, Ruckeln, Getriebewarnung",
    "Hydraulikdruck tatsächlich falsch; Sensor-/Leitungsproblem; Ölstand oder Ölzustand ungeeignet",
    "Getriebedruck Soll/Ist in relevanten Schaltphasen prüfen; Getriebeölstand nach Temperaturroutine kontrollieren; elektrische Signale testen",
    "Falsche Ölfüllung kann weitere Schäden verursachen.",
    "P0700,P0730"
  ],
  [
    "P2004",
    "Saugrohrklappe Bank 1: klemmt offen",
    "Ansaugkrümmer / Saugrohrklappen",
    "Die Stellklappe des Ansaugkrümmers erreicht ihre Sollposition nicht und wird als offen erkannt.",
    "Schwache Gasannahme, Ruckeln bei niedriger Last, Motorwarnleuchte",
    "Klemmende Saugrohrklappe; Stellmotor oder Unterdruckbetätigung; ausgeschlagene Gestänge",
    "Saugrohrklappen-Soll/Istwert prüfen; Gestänge mechanisch begutachten; Stellgliedtest und Unterdruckleitungen kontrollieren",
    "Lose Bauteile im Ansaugtrakt können Folgeschäden verursachen.",
    "P2015,P0101"
  ],
  [
    "P2015",
    "Saugrohrklappen-Positionsgeber: Bereich/Leistung",
    "Ansaugkrümmer / Stellungsgeber",
    "Das Positionssignal der Saugrohrklappenregelung liegt außerhalb des erwarteten Bereichs.",
    "Motorwarnleuchte, Leistungsverlust, sporadischer Notlauf",
    "Ausgeschlagenes Gestänge oder Endanschlag; Sensor/Antriebseinheit; Steckkontakt",
    "Saugrohrklappen-Soll/Istwerte und Stellwege vergleichen; Unterdruck und Gestänge motorabhängig prüfen; Fehlerhistorie beachten",
    "Reparatur muss zum jeweiligen Ansaugkrümmer und Stellmotor passen.",
    "P2004,P0101"
  ],
  [
    "P2279",
    "Undichtigkeit im Ansaugluftsystem",
    "Ansaugluft / Falschluft",
    "Das Steuergerät erkennt eine nicht plausible zusätzliche Luftmenge im Ansaugsystem.",
    "Unruhiger Leerlauf, Leistungsmangel, Fehler in Gemischregelung",
    "Defekter Ansaugschlauch; Kurbelgehäuseentlüftung undicht; Drosselklappendichtung",
    "Rauchtest des Ansaugsystems fachgerecht durchführen; Luftmassen- und Druckwerte vergleichen; Dichtungen und Unterdruckanschlüsse prüfen",
    "Bei großen Lecks kann der Motorlauf instabil werden.",
    "P0171,P0101"
  ],
  [
    "P0010",
    "Nockenwellensteller A Bank 1: Steuerkreis",
    "Ventilsteuerung / Elektrik",
    "Der Stromkreis der Einlassnockenwellenverstellung ist gestört.",
    "Unruhiger Motorlauf, Leistungsverlust, Motorwarnleuchte",
    "Stellmagnet elektrisch gestört; Kabel oder Sicherung; Steuergerät-Ausgang",
    "Ölstand und Qualität prüfen; Stecker, Versorgung und Magnetkreis messen; Stellgliedtest nach Motorvorgabe durchführen",
    "Elektrischer Stellkreis ist nicht gleichbedeutend mit gedehnter Steuerkette.",
    "P0011,P0016"
  ],
  [
    "P0011",
    "Nockenwellenverstellung A Bank 1: zu weit vor",
    "Ventilsteuerung / Steuerzeiten",
    "Die tatsächliche Einlassnockenwellenposition ist stärker vorgestellt als angefordert.",
    "Unrunder Leerlauf, Leistungseinbruch, Startprobleme",
    "Ölqualität oder Öldruck mangelhaft; Magnetventil klemmt; mechanische Steuerzeiten fehlerhaft",
    "Ölstand und Herstellerölspezifikation kontrollieren; Soll/Ist-Nockenwellenwinkel auswerten; Magnetventil und mechanische Steuerzeiten prüfen",
    "Bei auffälligem Kettenrasseln Motor nicht weiter belasten.",
    "P0010,P0016"
  ],
  [
    "P0014",
    "Nockenwellenverstellung B Bank 1: zu weit vor",
    "Ventilsteuerung / Steuerzeiten",
    "Die Auslassnockenwelle weicht in Richtung Frühstellung von der Sollposition ab.",
    "Unruhiger Motor, Aussetzer, Motorwarnleuchte",
    "Öldruck oder Verschmutzung im Versteller; Magnetventil; falsche Steuerzeiten",
    "Ölversorgung prüfen; Auslassnockenwellen-Soll/Istwerte vergleichen; Stellglied und mechanische Synchronisation prüfen",
    "Bei mechanischen Steuerzeitenfehlern können Motorschäden entstehen.",
    "P0016,P0011"
  ],
  [
    "P0017",
    "Kurbel-/Nockenwellen-Korrelation Bank 1 Sensor B",
    "Motorsteuerung / Synchronisation",
    "Die Synchronisation zwischen Kurbelwelle und Auslassnockenwelle weicht zu stark ab.",
    "Schlechter Start, unruhiger Motorlauf, mögliche Geräusche",
    "Steuerkette/Riemen versetzt; Verstellerproblem; Signalgeber- oder Geberradabweichung",
    "Synchronisationsdaten auslesen; Öldruck und Stellerwerte prüfen; Steuerzeiten nach Herstellervorgaben kontrollieren",
    "Bei metallischen Motorgeräuschen und Steuerzeitenverdacht Motor abstellen.",
    "P0016,P0340"
  ],
  [
    "P0520",
    "Motoröldrucksensor: Stromkreis",
    "Schmierung / Sensor",
    "Der elektrische Kreis des Öldrucksensors oder Schalters meldet eine Störung.",
    "Öldruckwarnung, Motorwarnleuchte, möglicherweise keine weiteren Symptome",
    "Sensor-/Schalterfehler; Kabelunterbrechung; tatsächlicher niedriger Öldruck",
    "Bei Öldruckwarnung Motor stoppen; Ölstand sicher prüfen; mechanischen Öldruck mit geeignetem Messgerät nach Herstellervorgabe verifizieren",
    "Motor bei anhaltender Öldruckwarnung nicht weiterlaufen lassen.",
    "P0521,P0011"
  ],
  [
    "P0521",
    "Öldrucksensor: Bereich/Leistung",
    "Schmierung / Öldruck",
    "Der gemeldete Öldruckverlauf liegt außerhalb der erwarteten Plausibilität.",
    "Öldruckwarnung, Motorgeräusch, Motorwarnleuchte",
    "Zu wenig Öl oder falsche Viskosität; Sensorabweichung; reales Öldruckproblem",
    "Motor sicher abstellen und Ölstand prüfen; mechanische Druckmessung durchführen; Ölfilter- und Pumpenfunktion fachgerecht prüfen",
    "Fehlender Öldruck kann binnen kurzer Zeit schwere Motorschäden verursachen.",
    "P0520,P0011"
  ],
  [
    "P0597",
    "Kühlmittelthermostat-Heizung: Steuerkreis offen",
    "Motorkühlung / Elektrik",
    "Die Ansteuerung eines elektrisch beheizten Kennfeldthermostats meldet einen offenen Stromkreis.",
    "Temperaturmanagement unplausibel, Kühlmittelwarnleuchte, Motorwarnleuchte",
    "Stecker- oder Leitungsunterbrechung; Thermostat-Heizung defekt; Sicherungsproblem",
    "Fahrzeugausführung mit Kennfeldthermostat bestätigen; Versorgung und Heizungswiderstand kontrollieren; Temperaturwerte vergleichen",
    "Bei Überhitzung anhalten und Kühlmittelkreislauf abkühlen lassen.",
    "P0128,P0118"
  ],
  [
    "U0101",
    "Kommunikation mit Getriebesteuergerät unterbrochen",
    "CAN / Getriebe",
    "Andere Steuergeräte melden fehlende Kommunikation mit der Getriebesteuerung.",
    "Getriebewarnung, Notlauf, keine Gangwahl",
    "TCM-Versorgung oder Masse ausgefallen; Netzwerkleitung; Unterspannung",
    "Alle Steuergeräte zeitgleich auslesen; Getriebesteuergerät direkt prüfen; Versorgung und CAN-Leitungen anhand Schaltplan messen",
    "Bei unsicherer Gangwahl Fahrzeug nicht weiterfahren.",
    "P0700,U0100"
  ],
  [
    "U0140",
    "Kommunikation mit Karosseriesteuergerät verloren",
    "CAN / Karosserie",
    "Die Netzwerkkommunikation zum Body Control Module ist ausgefallen oder unterbrochen.",
    "Ausfall von Licht, Zentralverriegelung oder Komfortfunktionen; mehrere Warnleuchten",
    "Bordnetzunterspannung; BCM-Sicherung oder Masse; CAN-/LIN-Verbindungsfehler",
    "Bordnetz unter Last prüfen; Erreichbarkeit BCM und weitere Netzwerkknoten prüfen; Stecker und Sicherungen beurteilen",
    "Licht- oder Verriegelungsausfall kann sicherheitsrelevant sein.",
    "U0100,P0562"
  ],
  [
    "U0155",
    "Kommunikation mit Kombiinstrument verloren",
    "CAN / Cockpit",
    "Ein Steuergerät empfängt erwartete Nachrichten vom Instrumentencluster nicht.",
    "Ausfall einzelner Anzeigen, Warnlampen, Startfreigabeproblem",
    "Unterspannung; Kombiinstrumentversorgung; CAN-Kontaktstörung",
    "Instrumentencluster separat ansprechen; Spannung und Masse prüfen; Netzwerk-Topologie und weitere U-Codes vergleichen",
    "Fehlende Geschwindigkeits- oder Warnanzeigen erfordern zeitnahe Reparatur.",
    "U0100,U0140"
  ],
  [
    "U0073",
    "Steuergeräte-Kommunikationsbus A ausgefallen",
    "CAN / Datenbus",
    "Eine überwachte Datenbusverbindung kann nicht ordnungsgemäß kommunizieren.",
    "Mehrere gleichzeitige Warnmeldungen, Ausfall von Assistenzsystemen, Startprobleme",
    "Kurzschluss oder offene Busleitung; Steuergerät zieht Bus herunter; schlechte Spannungsversorgung",
    "Zeitpunkt aller U-Codes vergleichen; Stromversorgung und Masse prüfen; Netzwerk messen und Knoten einzeln nach Herstellerverfahren eingrenzen",
    "Netzwerkeingriffe ohne Schaltplan können zusätzliche Steuergeräteprobleme auslösen.",
    "U0100,U0121"
  ],
  [
    "U0415",
    "Ungültige Daten vom ABS-Steuergerät",
    "CAN / ABS-ESP",
    "Die empfangenen Daten des ABS-/ESP-Steuergeräts werden von anderen Modulen als ungültig bewertet.",
    "ABS/ESP-Warnung, Assistenzsysteme zeitweise nicht verfügbar",
    "Raddrehzahlsignal fehlerhaft; ABS-interner Fehler; Spannungs- oder Kommunikationsstörung",
    "ABS-spezifische Fehlercodes auslesen; Raddrehzahlen vergleichen; Netzwerksignal und Versorgung kontrollieren",
    "Defekte Brems- und Stabilitätssysteme müssen vor normalem Straßenbetrieb bewertet werden.",
    "U0121,C0035"
  ]
]);

// Focused, source-backed workflows add missing codes and enrich existing guides.
for(const [code,entry] of Object.entries(playbooks.codes)){
 if(rows.some(row=>row[0]===code))continue;
 const family=playbooks.families[entry.family];
 rows.push([code,entry.title.de,family.title.de,entry.meaning.de,family.symptoms.de.join(';'),family.branches.de.map(branch=>branch.finding).join(';'),family.steps.de.join(';'),family.stop.de,entry.related.join(',')]);
}
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const split=s=>s.split(';').map(x=>x.trim()).filter(Boolean);
function focusedArticle(code){
 const entry=playbooks.codes[code],family=playbooks.families[entry.family];
 const url=base+'/fehlercodes/'+code.toLowerCase()+'/';
 const subset={version:playbooks.version,sources:playbooks.sources.filter(source=>family.sourceIds.includes(source.id)),families:{[entry.family]:family},codes:{[code]:entry}};
 const ld={'@context':'https://schema.org','@type':'TechArticle',headline:code+' – '+entry.title.de,description:entry.meaning.de,url,inLanguage:'de',publisher:{'@type':'Organization',name:'6006 Performance',url:base+'/'},citation:subset.sources.map(source=>source.url)};
 return '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<script src="/assets/6006-locale.js?v=20261013-auto"></script><title>'+esc(code+': '+entry.title.de)+' | 6006 Performance</title>'
 +'<meta name="description" content="'+esc(entry.meaning.de)+'"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="'+url+'">'
 +'<link rel="icon" href="/assets/6006-favicon.svg" type="image/svg+xml"><meta name="theme-color" content="#171513">'
 +'<link rel="stylesheet" href="/assets/6006-seo.css"><link rel="stylesheet" href="/assets/6006-diagnostic-playbooks.css?v=20261013-guides">'
 +'<script type="application/ld+json">'+JSON.stringify(ld).replaceAll('<','\\u003c')+'</script></head><body>'
 +'<header class="bar"><a class="brand" href="/"><img src="/assets/6006-primary-white.png" alt="6006 Performance"></a><nav><a href="/fehlercodes/" data-guide-label="all">Alle Fehlercodes</a><a href="/fehlercodes/loesungen/" data-guide-label="guides">Diagnoseanleitungen</a><a href="/fahrzeug/" data-guide-label="stage">Fahrzeugkatalog</a></nav></header>'
 +'<main class="main"><nav class="crumb"><a href="/">6006 Performance</a> / <a href="/fehlercodes/" data-guide-label="all">Alle Fehlercodes</a> / '+esc(code)+'</nav>'
 +'<div data-diagnostic-article="'+esc(code)+'">'+playbookUI.render(playbooks,code,'de',true)+'</div>'
 +'<div class="bottomnav"><a href="/fehlercodes/?code='+encodeURIComponent(code)+'" data-guide-label="all">Alle Fehlercodes</a><a href="/fahrzeug/" data-guide-label="choose">Fahrzeug auswählen</a></div></main>'
 +'<footer data-guide-label="footer">6006 Performance · Fahrzeugdiagnose und Reparaturwissen</footer>'
 +'<script type="application/json" id="6006-playbook-data">'+JSON.stringify(subset).replaceAll('<','\\u003c')+'</script>'
 +'<script defer src="/assets/6006-diagnostic-playbooks.js?v=20261019-services"></script></body></html>\n';
}
function article(r){
 const [code,title,system,meaning,symptoms,causes,checks,warning,related]=r;
 if(playbooks.codes[code])return focusedArticle(code);
 const slug=code.toLowerCase(),url=base+'/fehlercodes/'+slug+'/';
 const name=code+' – '+title;
 const description=code+' Fehlercode: Bedeutung, Symptome, mögliche Ursachen und Diagnose-Schritte. '+system+' bei 6006 Performance verständlich erklärt.';
 const rel=related.split(',').map(k=>'<a href="../'+k.toLowerCase()+'/">'+esc(k)+' Fehlercode</a>').join(' · ');
 const list=(a,ordered=false)=>'<'+(ordered?'ol':'ul')+'>'+split(a).map(x=>'<li>'+esc(x)+'.</li>').join('')+'</'+(ordered?'ol':'ul')+'>';
 const ld={'@context':'https://schema.org','@type':'TechArticle',headline:name,description,url,inLanguage:'de',publisher:{'@type':'Organization',name:'6006 Performance',url:base+'/'}};
 return '<!doctype html>\n<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
 +'<title>'+esc(code)+' Fehler: '+esc(title)+' – Ursachen und Lösung | 6006 Performance</title>'
 +'<meta name="description" content="'+esc(description)+'"><meta name="robots" content="index,follow,max-image-preview:large">'
 +'<link rel="canonical" href="'+url+'"><meta property="og:type" content="article"><meta property="og:title" content="'+esc(name)+'"><meta property="og:description" content="'+esc(description)+'">'
 +'<meta property="og:url" content="'+url+'"><meta name="theme-color" content="#1a1714"><link rel="icon" type="image/svg+xml" href="/assets/6006-favicon.svg">'
 +'<link rel="stylesheet" href="/assets/6006-seo.css"><script type="application/ld+json">'+JSON.stringify(ld)+'</script></head>'
 +'<body><header class="bar"><a class="brand" href="/"><img src="/assets/6006-primary-white.png" alt="6006 Performance"></a><nav><a href="/fehlercodes/">Alle Fehlercodes</a><a href="/fehlercodes/loesungen/">Fehlerlösungen</a><a href="/#aracin">Fahrzeugsoftware</a><a href="/reparatur-wartung/">Reparatur</a></nav></header>'
 +'<main class="main"><nav aria-label="Brotkrumen" class="crumb"><a href="/">6006 Performance</a> / <a href="/fehlercodes/">Fehlercodes</a> / '+code+'</nav>'
 +'<article><span class="kicker">FEHLERCODE · '+esc(system)+'</span><h1>'+esc(code)+': '+esc(title)+' – was tun?</h1>'
 +'<p class="lead">'+esc(meaning)+'</p>'
 +'<div class="overview"><div><span>OBD-Code</span><strong>'+esc(code)+'</strong></div><div><span>System</span><strong>'+esc(system)+'</strong></div><div><span>Erstdiagnose</span><strong>Vor Teiletausch messen</strong></div></div>'
 +'<section><h2>Welche Symptome können auftreten?</h2><p>Das tatsächliche Fehlerbild hängt von Fahrzeug, Motor, Baujahr und ergänzenden Fehlercodes ab. Häufig berichtete Anzeichen in diesem Fehlerbereich:</p>'+list(symptoms)+'</section>'
 +'<section><h2>Mögliche Ursachen bei '+code+'</h2><p>Eine Fehlernummer ist noch kein Nachweis für ein defektes Bauteil. Diese Fehlerquellen werden bei der Diagnose einzeln ausgeschlossen:</p>'+list(causes)+'</section>'
 +'<section><h2>So lässt sich '+code+' systematisch prüfen</h2><p>Zuerst die vollständige Fehlermeldung mit Zusatzcode, Freeze-Frame und Bedingungen speichern. Danach folgen die fahrzeugspezifischen Kontrollen in sinnvoller Reihenfolge:</p>'+list(checks,true)+'</section>'
 +'<section class="notice"><h2>Wichtig für die Sicherheit</h2><p>'+esc(warning)+'</p><p>Vor einem Teiletausch sollten Motorcode, tatsächliche Messwerte und Herstellerinformationen abgeglichen werden. Bei Arbeiten an Bremse, Airbag, Hochvolttechnik oder Kraftstoff-Hochdrucksystemen gelten besondere Sicherheitsvorgaben.</p></section>'
 +'<section><h2>Was kostet die Reparatur?</h2><p>Ein seriöser Preis ist erst möglich, wenn klar ist, ob Sensorik, Leitungen, mechanische Bauteile oder nur Betriebsbedingungen den Code ausgelöst haben. Derselbe Fehlercode kann deshalb je nach Marke und Motor völlig unterschiedliche Reparaturen erfordern. Entscheidend sind Prüfzeit, das tatsächlich betroffene Bauteil und erforderliche Anpassungen.</p></section>'
 +'<section><h2>Für welche Fahrzeuge gilt die Information?</h2><p>'+code+' beschreibt eine Diagnosegruppe, nicht ein bestimmtes Fahrzeugmodell. Volkswagen, Audi, BMW, Mercedes-Benz, Opel, Ford und andere Marken können abweichende Hersteller-Untercodes oder Prüfbedingungen verwenden. Mit Marke, Modell, Motor, Baujahr und Getriebe lässt sich die Prüfung eingrenzen.</p><p><a class="btn" href="/#aracin">Mein Fahrzeug auswählen →</a> <a class="btn outline" href="/fehlercodes/?code='+code+'">Herstellerdefinitionen vergleichen →</a></p></section>'
 +'<section><h2>Verwandte Fehlercodes</h2><p class="related">'+rel+'</p></section>'
 +'<section class="notice"><h2>Fazit: '+code+' richtig eingrenzen</h2><p>'+esc(meaning)+' Die tatsächliche Ursache ergibt sich aus dem Zusammenspiel von Symptomen, Messdaten und weiteren Steuergeräte-Einträgen. Fehlercodes ohne Diagnose nur zu löschen oder Teile auf Verdacht zu wechseln, kann zu unnötigen Kosten führen.</p></section>'
 +'</article><nav class="bottomnav"><a href="/fehlercodes/loesungen/">← Alle Fehlerlösungen</a><a href="/fehlercodes/">18.805 DTC-Definitionen durchsuchen →</a></nav></main><footer>© 2026 6006 Performance · Diagnose- und Reparaturwissen. Keine Fahrzeugfreigabe oder verbindliche OEM-Reparaturanweisung.</footer>'
 +'</body></html>\n';
}
function write(file,content){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content,'utf8');}
write(path.join(ROOT,'assets','6006-curated-guides.json'),JSON.stringify({codes:rows.map(r=>r[0]),count:rows.length},null,2));
for(const row of rows)write(path.join(ROOT,'fehlercodes',row[0].toLowerCase(),'index.html'),article(row));
const sections=[
 '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
 '<title>Fehlercodes: Ursachen, Symptome und Reparatur | 6006 Performance</title>',
 '<meta name="description" content="Häufige OBD-Fehlercodes von P0299 bis U0100 verständlich erklärt: Symptome, Ursachen und praktische Prüfreihenfolge für die Fahrzeugdiagnose.">',
 '<meta name="robots" content="index,follow"><link rel="canonical" href="'+base+'/fehlercodes/loesungen/">',
 '<link rel="stylesheet" href="/assets/6006-seo.css"><link rel="icon" href="/assets/6006-favicon.svg" type="image/svg+xml"></head><body>',
 '<header class="bar"><a class="brand" href="/"><img src="/assets/6006-primary-white.png" alt="6006 Performance"></a><nav><a href="/">Start</a><a href="/fehlercodes/">Alle DTC</a><a href="/#aracin">Fahrzeugsoftware</a></nav></header>',
 '<main class="main"><nav class="crumb"><a href="/">6006 Performance</a> / Fehlerlösungen</nav><span class="kicker">DIAGNOSE · OBD · KONTROLLSCHRITTE</span><h1>Fehlercodes verstehen. Ursachen prüfen. Defekte gezielt beheben.</h1>',
 '<p class="lead">Von Motorkontrollleuchte über Turbo- und DPF-Probleme bis zu ABS- und CAN-Fehlern: Wählen Sie einen Code für Bedeutung, typische Symptome und die sichere Prüfreihenfolge. Die Hinweise ersetzen keine Prüfung der konkreten Fahrzeugvariante.</p>',
 '<div class="codegrid">'+rows.map(r=>'<a href="/fehlercodes/'+r[0].toLowerCase()+'/"><strong>'+esc(r[0])+'</strong><span>'+esc(r[1])+'</span><small>'+esc(r[2])+'</small></a>').join('')+'</div>',
 '<section><h2>Ihr Fehlercode fehlt?</h2><p>Der vollständige Fehlercode-Katalog enthält 18.805 Hersteller- und Standarddefinitionen. Verwenden Sie die Suche und prüfen Sie die Fahrzeugmarke sowie den vollständigen Zusatzcode.</p><a class="btn" href="/fehlercodes/">Alle Fehlercodes durchsuchen →</a></section></main>',
 '<footer>© 2026 6006 Performance · Fahrzeugdiagnose und technische Hinweise.</footer></body></html>'
].join('\n');
write(path.join(ROOT,'fehlercodes','loesungen','index.html'),sections);
const css=':root{color-scheme:dark;--bg:#171513;--ink:#f0e8dd;--muted:#c4b4a2;--gold:#c49a67;--panel:#27211c}*{box-sizing:border-box}body{margin:0;color:var(--ink);background:var(--bg);font:16px/1.72 system-ui,-apple-system,Segoe UI,sans-serif}a{color:#e4b980}a:hover{color:#fff}.bar{display:flex;align-items:center;justify-content:space-between;gap:1.5rem;border-bottom:1px solid #483727;padding:1rem max(1rem,calc((100vw - 1080px)/2));background:#1e1915}.brand img{width:145px;max-width:35vw}.bar nav{display:flex;flex-wrap:wrap;gap:1rem;font-size:.84rem}.bar nav a{text-decoration:none}.main{max-width:900px;margin:0 auto;padding:2.3rem 1.3rem 5rem}.crumb{font-size:.77rem;color:var(--muted);margin-bottom:3rem}.kicker{color:var(--gold);font-size:.73rem;font-weight:800;letter-spacing:.12em}h1{font:500 clamp(2.3rem,5.6vw,4rem)/1.12 Georgia,serif;margin:.5rem 0 1.2rem;letter-spacing:-.025em}h2{font:500 clamp(1.55rem,3vw,2.1rem)/1.2 Georgia,serif;margin:0 0 .7rem}p{margin:.7rem 0 1.2rem}p.lead{font-size:1.2rem;color:#ddd2c5;line-height:1.7}.overview{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:2rem 0}.overview>div{background:#29221d;border:1px solid #66503a;padding:1.2rem}.overview span{display:block;font-size:.7rem;color:#cdb99f;text-transform:uppercase}.overview strong{display:block;margin:.3rem 0;font-size:.95rem}section{padding:2rem 0;border-top:1px solid #48382c}li{padding:.35rem .1rem .4rem 0}li::marker{color:var(--gold)}.notice{padding:1.4rem;margin:1.8rem 0;border:1px solid #89673f;background:#282017}.btn{display:inline-block;background:var(--gold);color:#1f1913;text-decoration:none;border:1px solid var(--gold);padding:.65rem 1rem;border-radius:3px;font-weight:700;margin:.25rem .3rem .25rem 0;font-size:.9rem}.btn.outline{color:var(--gold);background:transparent}.related a{margin-right:.7rem}.bottomnav{display:flex;justify-content:space-between;gap:1rem;border-top:1px solid #654c34;padding:1.5rem 0;flex-wrap:wrap}.codegrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:2rem 0}.codegrid a{display:flex;flex-direction:column;gap:.35rem;border:1px solid #63503b;padding:1.2rem;text-decoration:none;background:var(--panel)}.codegrid strong{font:700 1.25rem monospace;color:#edbd80}.codegrid span{font-size:1.03rem;color:var(--ink)}.codegrid small{color:var(--muted)}footer{padding:2rem;text-align:center;border-top:1px solid #433424;color:var(--muted);font-size:.78rem}@media(max-width:610px){.bar{flex-direction:column;align-items:flex-start}.overview,.codegrid{grid-template-columns:1fr}.main{padding:1.5rem 1rem 4rem}.crumb{margin-bottom:1.6rem}.lead{font-size:1.07rem!important}}';
write(path.join(ROOT,'assets','6006-seo.css'),css+'\n.main{overflow-wrap:anywhere}.overview>div,.codegrid>*{min-width:0}a:focus-visible,summary:focus-visible{outline:3px solid #edbd80;outline-offset:4px}.definition-list{padding-left:1.3rem}.definition-list>li{padding:1rem .3rem;border-bottom:1px solid #48382c}details{margin:.7rem 0}summary{cursor:pointer;min-height:44px;padding:.6rem 0;color:#edbd80}.bar nav a{display:inline-flex;align-items:center;min-height:44px}.btn{max-width:100%;white-space:normal}@media(max-width:610px){.bar nav{gap:.3rem 1rem}.bottomnav a{min-height:44px;display:inline-flex;align-items:center}}');
const fixed=['/','/fehlercodes/','/fahrzeug/','/technik/','/reparatur-wartung/','/fehlercodes/loesungen/'];
const urls=[...fixed,...rows.map(r=>'/fehlercodes/'+r[0].toLowerCase()+'/')];
const date=new Date().toISOString().slice(0,10);
write(path.join(ROOT,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'  <url><loc>'+base+u+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log('Generated '+rows.length+' curated DTC pages, one index, sitemap '+urls.length+' URLs');
