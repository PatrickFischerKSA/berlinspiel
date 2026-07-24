# Repositoryprüfung und Materialinventar

## 1. Prüfrahmen

Geprüft wurden am 24. Juli 2026:

- der Workspace `/Users/patrickfischer/Documents/New project`,
- die öffentlich zugängliche
  [Craft-Sammlung „Materialien Geschichte Berlin“](https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w),
- alle 15 dort verlinkten PDF-Dateien als Volltext,
- Seitenzahl, Extrahierbarkeit und stichprobenartig die gerenderte PDF-Darstellung.

Die Aussagen unten stammen aus den Transkripten. Wo Titel, Filmherkunft,
Zeitmarken oder Perspektivangaben fehlen, wird das ausdrücklich vermerkt.

## 2. Ergebnis der Repositoryprüfung

Der Workspace ist kein gemeinsames Git-Repository, sondern eine Sammlung vieler
voneinander unabhängiger Lernanwendungen. Ein Projekt `berlin-akte-2040` bestand
noch nicht. Es gibt daher keinen vorhandenen Stack, den dieses Projekt zwingend
fortsetzen müsste.

Zwei vorhandene Projekte sind als technische Referenzen relevant:

- `heidi-game-export`: Express-Prototyp mit Raumcode, asymmetrischen Rollen,
  Laptop-/Handyansichten, Demo- und Lehrpersonenmodus sowie in JSON getrennten
  Inhalten. Die README beschreibt zusätzlich einen Cloudflare-Worker mit Durable
  Objects für persistente synchrone Räume.
- `brand_bis_er_gesteht`: Express-Lernanwendung mit Quellenarbeit,
  Prozessansicht und Lehrpersonen-Dashboard.

Die technische Verbindungslogik soll später gezielt aus dem Heidi-Projekt geprüft
und nicht unbesehen kopiert werden. Für `Berlin-Akte 2040` ist ein eigener,
sauber versionierter Projektordner sinnvoll.

## 3. Gesamtbefund der Sammlung

- Zugänglich: 15 PDF-Transkripte, zusammen 131 Seiten.
- Nicht direkt zugänglich: die in mehreren PDFs genannten MP4-Dateien.
- Nachträglich ergänzt: sechs lokale Karten-/Plankarten-Dateien und fünf
  verlinkte interaktive Karten. Vollständige Metadaten, Rechteprüfung und
  Georeferenzierungen fehlen teilweise noch; siehe
  [Karteninventar und Zoomkonzept](04-karteninventar-und-zoomkonzept.md).
- Nicht vorhanden: verlässliche Film-URLs, Produzent/Veröffentlichungsdatum bei
  mehreren generisch benannten Dateien, durchgehende Zeitcodes.
- Mehrere Transkripte sind automatisch erzeugt und enthalten Erkennungsfehler
  (zum Beispiel fehlerhafte Namen, Wortwiederholungen und verschliffene Zahlen).
- Einige Materialien verbinden zeitgenössische Aufnahmen, spätere Kommentare,
  Interviews und Sprechertexte. Diese Ebenen sind für Perspektivenarbeit ergiebig,
  müssen im Spiel aber als unterschiedliche Quellengattungen markiert werden.

### Zuordnung nach Epochenraum

| Epochenraum | Primär geeignete Ressourcen | Ergänzend |
|---|---|---|
| 1 Kaiserreich/Grossstadt | `BerlinzurKaiserzeit_Transkript.pdf` | `Berlin_Transkript.pdf`; Vorgeschichte in `Berlin_KriminelleClans.pdf` |
| 2 Weimarer Republik | `Berlin_goldene20.pdf`; `Berlin_KriminelleClans.pdf`; `SündenpfuhlBerlin.pdf` | generisches Transkript zum Weg von 1914 bis 1933 |
| 3 NS/Krieg | `Berlin_einTag1943.pdf`; `Nazibauten.pdf`; generisches Transkript „Berlin 23. März 1933“; generisches Transkript „5. Kriegssommer“ | `Berlin_Transkript.pdf` |
| 4 Geteiltes Berlin | `Berlinkrise.pdf`; `17_juni.pdf`; `BerlinerMauer.pdf`; `BerlinBauten.pdf` | `SeitdemMauerfall.pdf` als erinnerungsgeschichtliche Rückschau |
| 5 Mauerfall/Gegenwart | `Mauerfall.pdf`; `SeitdemMauerfall.pdf` | `BerlinBauten.pdf`; `Berlin_Transkript.pdf` |

## 4. Einzelinventar

### M01 – Berlin_Transkript.pdf

- Dateityp/Umfang: PDF-Transkript, 15 Seiten; zugrunde liegende Datei laut
  Transkript `Berlin_reduziert.mp4`.
- Zeiträume: Stadtgründung bis Gegenwart, mit Schwerpunkten auf Wandel,
  Zerstörung, Teilung und Wiederaufbau.
- Orte: Nikolaiviertel, Spree, Kreuzberg, Neukölln, Brandenburger Tor,
  Alexanderplatz, Tempelhof und Palast-der-Republik-/Schlossareal.
- Akteure/Perspektiven: Moderator Mirko Drotschmann sowie Berlinerinnen und
  Berliner mit biografischen Ortsbezügen, darunter Martina Sprockhoff.
- Kernaussage: Berlin wird als mehrfach umgeformte Heimat und als verdichtetes,
  widersprüchliches Abbild deutscher Geschichte erzählt.
- Geeignete Passage: Seiten 1–3 zur Rahmenthese „Veränderung als Tradition“
  und zum Nikolaiviertel; spätere Ortskapitel für epochenübergreifende
  Kontinuitätskarten.
- Perspektivprüfung: gegenwartsbezogene Terra-X-Erzählung; persönliche
  Erinnerung und historische Rekonstruktion sind nicht dasselbe.
- Spieleignung: sehr gut als Klammer und Finale, weniger als alleiniger Beleg
  für eine eng gefasste Akte.
- Unsicherheit: Film selbst und Film-URL fehlen.

### M02 – BerlinzurKaiserzeit_Transkript.pdf

- Dateityp/Umfang: PDF-Transkript, 17 Seiten; laut Kopf
  `Berlin zur Kaiserzeit – Glanz und Schatten einer Epoche (13) Film mit KI restauriert 2.mp4`.
- Zeitraum: Kaiserreich, Industrialisierung und Erster Weltkrieg.
- Orte: Unter den Linden, Brandenburger Tor, Reichstag, Leipziger und Potsdamer
  Platz, Tiergarten, Friedrichshain, Kreuzberg und Tempelhof.
- Akteure/Perspektiven: Kaiser Wilhelm II., politische und militärische Eliten,
  Arbeiterinnen und Arbeiter, Grossstadtbeobachter; historische Aufnahmen mit
  nachträglicher Kommentierung.
- Kernaussage: technischer Glanz, Bevölkerungswachstum und moderne Mobilität
  stehen Wohnungsnot, Klassenunterschieden, harter Arbeit und Krieg gegenüber.
- Geeignete Passagen: Seiten 1–5 zu Stadteindruck, Verkehr und Wachstum;
  mittlere Seiten zu Mietskasernen und Arbeitswelt; Schlussabschnitt zu Krieg
  und Versorgung.
- Möglicher Widerspruch: repräsentative Boulevards erzeugen ein anderes Berlinbild
  als Arbeiterquartiere und soziale Not.
- Spieleignung: sehr gut für eine Akte mit zwei konkurrierenden Kartenlegenden
  „Weltstadt“ und „sozial gespaltene Stadt“.
- Unsicherheit: „KI restauriert“ verlangt Provenienzprüfung; Film fehlt.

### M03 – Berlin_KriminelleClans.pdf

- Dateityp/Umfang: PDF-Transkript, 5 Seiten; Filmname
  `Kriminelle Clans im Berlin der 20er Jahre Terra X-1 1.mp4`.
- Zeitraum: Ursprünge im Kaiserreich, Schwerpunkt frühe 1920er Jahre.
- Orte: Berlin allgemein, reiche westliche Bezirke, Friedrichshain, Wedding,
  Tiergarten und überregionale Netzwerke.
- Akteure/Perspektiven: ehemalige Strafgefangene, Ringvereine, Polizei,
  historische Fachkommentare.
- Kernaussage: Ringvereine entstehen zunächst als Selbsthilfe gegen soziale
  Ausgrenzung und entwickeln sich unter Not und Illegalisierung zu Strukturen
  organisierter Kriminalität.
- Geeignete Passagen: Seiten 1–2 zur Entstehung und zum Teufelskreis aus Haft,
  Arbeits- und Wohnungslosigkeit; Seiten 2–4 zur räumlich unterschiedlichen
  Kriminalität und Organisation der Vereine.
- Widerspruch: „kriminelle Clans“ im Titel verkürzt die im Text deutlich
  ambivalentere Entstehungs- und Funktionsgeschichte.
- Spieleignung: zentral für Quellenkritik an einer manipulierten Archivbeschriftung.
- Unsicherheit: einzelne automatisch transkribierte Zahlen müssen am Film geprüft
  werden; Film-URL fehlt.

### M04 – SündenpfuhlBerlin.pdf

- Dateityp/Umfang: PDF-Transkript, 2 Seiten; Filmname
  `5 Fakten Sündenpfuhl Berlin Ein Tag in Berlin 1926 Terra X-1.mp4`.
- Zeitraum: Berlin 1926.
- Orte: Berlin allgemein; keine ausreichend präzisen Einzelorte im Transkript.
- Akteure/Perspektiven: Kriminalrat Ernst Gennat (im Transkript mehrfach falsch
  als „Gennert/Gennad“ erkannt), Polizei, Ringvereine.
- Kernaussage: Nachtleben und moralische Entgrenzung stehen Armut und hoher
  Kriminalität gegenüber; moderne Mordinspektion, Spurensicherung und Zentralkartei
  entstehen, während Polizei und Unterwelt punktuell kooperieren.
- Geeignete Passage: gesamte kurze Quelle, besonders der Wechsel von
  „hemmungslos und wild“ zu Armut sowie der Sieben-Punkte-Plan.
- Perspektivprüfung: zugespitztes „5 Fakten“-Format; Begriffe wie „Sündenpfuhl“
  und „Spree-Chicago“ sind Deutungsrahmen, keine neutralen Beobachtungen.
- Spieleignung: sehr gut als absichtlich reisserische Archivkarte, die gegen
  differenziertere Quellen geprüft wird.
- Unsicherheit: keine Zeitcodes und keine Film-URL.

### M05 – Berlin_goldene20.pdf

- Dateityp/Umfang: PDF-Transkript, 5 Seiten; Filmname
  `Waren die 20er Jahre in Deutschland wirklich golden Terra X-2.mp4`.
- Zeitraum: 1918 bis Weltwirtschaftskrise, Schwerpunkt 1924–1929.
- Orte: Berlin als Kultur- und Vergnügungsmetropole; wenige belastbare
  Mikro-Ortsangaben.
- Akteure/Perspektiven: Sprechererzählung zu Politik, Wirtschaft, Kultur und
  Alltag; breite gesellschaftliche Gruppen.
- Kernaussage: Stabilisierung, Innovation und kulturelle Dynamik sind real, aber
  zeitlich kurz, sozial ungleich verteilt und von den Krisen der Republik gerahmt.
- Geeignete Passagen: Seite 1 mit Leitfrage; mittlere Seiten zur Stabilisierung
  und Konsum-/Kulturentwicklung; Schluss zur sozialen Selektivität und Krise.
- Widerspruch: korrigiert die nostalgische Totalerzählung „golden“; ergänzt M03
  und M04 um eine makrohistorische Ebene.
- Spieleignung: zentrale Gegenquelle für ein differenziertes historisches Urteil.
- Unsicherheit: Film-URL fehlt.

### M06 – Generisches Transkript „Berlin, 23. März 1933“

- Dateityp/Umfang: PDF-Transkript, 16 Seiten; generischer Dateiname
  `KI-Multimedia-Tool_...24-07-2026.pdf`.
- Zeitraum: 1914 bis 1933, vom Ersten Weltkrieg über Weimar bis zum
  Ermächtigungsgesetz.
- Orte: Reichstag, Berliner Strassen und Ku’damm; daneben viele ausserberliner
  Schauplätze.
- Akteure/Perspektiven: Wilhelm II., Lenin, Woodrow Wilson, Friedrich Ebert,
  Philipp Scheidemann, Paul von Hindenburg, Gustav Noske, Hitler und zahlreiche
  politische Gruppen.
- Kernaussage: Kriegserfahrung, Versailles, politische Gewalt, wirtschaftliche
  Krisen und Elitenentscheidungen werden als Weg zur Selbstentmachtung des
  Parlaments erzählt; ausdrücklich wird betont, Hitler habe nie eine
  Wählermehrheit erhalten.
- Geeignete Passagen: Beginn zum Ermächtigungsgesetz; Abschnitte zu Berliner
  Strassenkämpfen, Kapp-Putsch und Dolchstosslegende.
- Perspektivprüfung: stark kausal verdichtete Überblickserzählung; Berliner
  Stadtgeschichte ist nur ein Teil.
- Spieleignung: Ergänzungs- und Gegenprüfung, nicht Leitquelle eines
  berlinräumlichen Auftrags.
- Unsicherheit: Originaltitel, Produzent, Filmdatei und URL nicht nachweisbar.

### M07 – Nazibauten.pdf

- Dateityp/Umfang: PDF-Transkript, 8 Seiten; Filmname
  `Nazibauten gestern und heute (1) Von Berlin nach Germania und zurück SPIEGEL TV (2002).mp4`.
- Zeitraum: NS-Zeit, Aufnahmejahr 2002 und Nachnutzungen bis zur Vorbereitung
  der Fussball-WM 2006.
- Orte: Germania-Planungsräume, Tiergarten, Olympiastadion/Reichssportfeld,
  Olympisches Dorf Döberitz, Tempelhof, Unter den Linden und Reichstag.
- Akteure/Perspektiven: Hitler, Albert Speer, Leni-Riefenstahl-Gesellschaft,
  Architekt Werner March, Jesse Owens, Denkmalpflege und zeitgenössische
  Propagandastimmen.
- Kernaussage: NS-Architektur materialisiert Herrschaft und Propaganda; Abriss,
  Erhaltung und alltägliche Nachnutzung erzeugen bis heute Deutungskonflikte.
- Geeignete Passagen: Seiten 1–3 zu Germania und Olympiastadion; weitere
  Ortskapitel für eine Karte „Herrschaft – Relikt – Nachnutzung“.
- Widerspruch: Propagandakommentar von 1936 und rückblickender Bericht von 2002
  bewerten dieselben Räume gegensätzlich.
- Spieleignung: sehr gut für Perspektivmarkierung und Schichtenkarte.
- Unsicherheit: direkte Film-URL fehlt.

### M08 – Berlin_einTag1943.pdf

- Dateityp/Umfang: PDF-Transkript, 9 Seiten; Filmname
  `Ein Tag in Berlin 1943 – Der Passfälscher Terra X.mp4`.
- Zeitraum: ein Tag 1943 mit biografischen Rück- und Ausblicken.
- Orte: Berliner Verstecke, Strassen und Treffpunkte, unter anderem der
  Ku’damm; genaue Wegpunkte müssen aus dem Volltext in einer Ortsliste
  normalisiert werden.
- Akteure/Perspektiven: der jüdische Überlebende und Passfälscher Cioma
  Schönhaus, Verfolgte, Helfende, Gestapo und NS-Behörden.
- Kernaussage: Verfolgung erscheint als räumliches Netz aus Kontrolle,
  Identitätspapieren, Verstecken, Hilfe und eigenständigem Widerstand.
- Geeignete Passage: Seite 1 mit Schönhaus’ Entschluss zu überleben; Passagen
  zur Herstellung/Nutzung falscher Papiere und zu Bewegungen durch die Stadt.
- Perspektivprüfung: szenische Rekonstruktion einer biografischen Geschichte;
  belegte Erinnerung, Inszenierung und Sprechertext müssen getrennt werden.
- Spieleignung: hervorragend für ein Bewegungs- und Zuverlässigkeitsdiagramm,
  aber ethisch nicht als Codeschloss oder Verfolgungsspiel inszenieren.
- Unsicherheit: Zeitcodes und Film-URL fehlen.

### M09 – Generisches Transkript „5. Kriegssommer“

- Dateityp/Umfang: PDF-Transkript, 15 Seiten; generischer Dateiname mit Zusatz
  `(1)`.
- Zeitraum: 1944 bis Kriegsende 1945.
- Orte: Zoo, Dietrich-Eckart-Bühne, Wannsee, Reichssportfeld, Kranzler,
  Stadtviertel, Reichskanzlei und Kampfgebiete bis zur Stadtmitte.
- Akteure/Perspektiven: Goebbels, Hitler, Volkssturm, Hitlerjugend,
  Rüstungsarbeiterinnen, Fremdarbeiterinnen, KZ-Häftlinge, sowjetische Armee,
  Zivilbevölkerung und Tagebuch-/Erinnerungsstimmen.
- Kernaussage: Durchhaltepropaganda und inszenierte Normalität stehen
  Bombenkrieg, Zwang, Erschöpfung, Gewalt und dem militärischen Untergang
  diametral gegenüber.
- Geeignete Passagen: Seiten 1–4 zum Kontrast von Wochenschau und Alltag;
  Seiten 5–10 zu totalem Krieg/Volkssturm; Schluss zur Schlacht um Berlin.
- Widerspruch: besonders starke interne Kontrastquelle zwischen
  Propagandastimme und privaten/retrospektiven Aussagen.
- Spieleignung: geeignet für eine Quellenmontage, bei der jede Aussage nach
  Urheber, Zeitpunkt und Zweck klassifiziert werden muss.
- Unsicherheit: Originaltitel, Produzent, Filmdatei und URL fehlen.

### M10 – Berlinkrise.pdf

- Dateityp/Umfang: PDF-Transkript, 5 Seiten; automatisch generischer Kopf.
- Zeitraum: Blockade und Luftbrücke 1948/49.
- Orte: Westsektoren, Flughäfen Tempelhof, Gatow und Tegel; Land- und
  Luftkorridore.
- Akteure/Perspektiven: Sowjetunion/Stalin, westliche Alliierten,
  Lucius D. Clay, Pilotinnen und Piloten sowie Berliner Bevölkerung.
- Kernaussage: Die Blockade wird durch eine logistisch und politisch riskante
  Luftbrücke beantwortet und verschärft die Systemkonkurrenz.
- Geeignete Passagen: Anfang als räumliches Gedankenexperiment; Abschnitte
  zu Korridoren, Flugplätzen und Versorgung.
- Perspektivprüfung: westlich gerahmte Erfolgserzählung; sowjetische Motive und
  Berliner Alltag müssen als getrennte Analyseebenen behandelt werden.
- Spieleignung: sehr gut für eine unverzichtbare Versorgungs- und Korridorkarte.
- Unsicherheit: Originaltitel und Film-URL fehlen.

### M11 – 17_juni.pdf

- Dateityp/Umfang: PDF-Transkript, 5 Seiten; automatisch generischer Kopf.
- Zeitraum: DDR-Gründung bis Volksaufstand 17. Juni 1953.
- Orte: Stalinallee/Karl-Marx-Allee, Berlin, Brandenburger Tor sowie Niesky und
  weitere DDR-Orte.
- Akteure/Perspektiven: Bauarbeiter, Demonstrierende, Walter Ulbricht, SED,
  Stasi und sowjetische Streitkräfte.
- Kernaussage: Normerhöhungen, Versorgung, politische Repression und
  Unzufriedenheit führen von einem Arbeitsprotest zu breiten politischen
  Forderungen; sowjetische Gewalt beendet den Aufstand.
- Geeignete Passagen: Seite 1 zum nicht nur Berliner Charakter; mittlere
  Abschnitte zu Ursachen; Schluss zu Demonstrationswegen und Niederschlagung.
- Widerspruch: eine Berliner Kameraerzählung darf die DDR-weite Ausdehnung
  nicht unsichtbar machen.
- Spieleignung: gut für Ursachen-/Folgennetz und Protestkartierung.
- Unsicherheit: Originaltitel und Film-URL fehlen.

### M12 – BerlinerMauer.pdf

- Dateityp/Umfang: PDF-Transkript, 3 Seiten; automatisch generischer Kopf.
- Zeitraum: Mauerbau 1961 bis Ausbau der Grenzanlagen.
- Orte: Grenze um West-Berlin, Ost- und Westseite, Grenzübergänge; im
  Transkript kaum präzise Mikroorte.
- Akteure/Perspektiven: Walter Ulbricht, SED-/DDR-Führung, Grenzsoldaten,
  Flüchtende, Westalliierten.
- Kernaussage: Die Mauer ist kein einzelnes Bauwerk, sondern ein gestaffeltes
  Grenzsystem, das Abwanderung stoppen und die DDR stabilisieren soll.
- Geeignete Passage: Seite 1 zu Ulbrichts Pressekonferenz und Bau; Seiten 1–3
  zum schrittweisen Ausbau und zu Fluchten.
- Perspektivprüfung: erklärendes Überblicksvideo; für individuelles Erleben
  zwingend mit M15 verbinden.
- Spieleignung: Basis für einen Querschnitt der Grenzanlagen; als alleinige
  Ortsquelle zu unspezifisch.
- Unsicherheit: Originaltitel und Film-URL fehlen.

### M13 – BerlinBauten.pdf

- Dateityp/Umfang: PDF-Transkript, 12 Seiten; automatisch generischer Kopf.
- Zeitraum: Wiederaufbau und Kalter Krieg bis Nachnutzung nach 1989.
- Orte: Müggelberge, Alexanderplatz/Fernsehturm, Stalinallee/Karl-Marx-Allee,
  Weberwiese, Hansaviertel, Checkpoint Charlie, Leipziger Strasse,
  Palast der Republik und Tempelhof.
- Akteure/Perspektiven: Studentinnen Anna und Claire, Bewohner Otto Stark und
  Hans-Jürgen Beselin, Architekt Hermann Henselmann sowie Ost-/West-Planer.
- Kernaussage: Architektur ist in der geteilten Stadt Wohnraum, Propaganda,
  Modernisierungsversprechen und Systemkonkurrenz zugleich.
- Geeignete Passagen: Seiten 1–4 zu Fernsehturm/Stalinallee/Weberwiese;
  anschliessende Ost-West-Gegenbauten und Nachnutzungsdebatten.
- Widerspruch: monumentale „Wohnpaläste“ und reale Wohnungsnot; Prestigeobjekt
  und Alltag; Ost- und Westmoderne beanspruchen jeweils Zukunft.
- Spieleignung: Schlüsselquelle für eine zwingende Vergleichskarte.
- Unsicherheit: Originaltitel und Film-URL fehlen.

### M14 – Mauerfall.pdf

- Dateityp/Umfang: PDF-Transkript, 3 Seiten; automatisch generischer Kopf.
- Zeitraum: 9. November 1989 innerhalb von ungefähr 24 Stunden.
- Orte: DDR-Innenministerium, internationales Pressezentrum, Grenzübergänge;
  der konkrete gezeigte Übergang muss am Film verifiziert werden.
- Akteure/Perspektiven: Egon Krenz, Günter Schabowski, Journalist Riccardo
  Ehrman, Grenzbeamte, DDR-Bürgerinnen und -Bürger, dpa/Tagesschau.
- Kernaussage: Krise und Protest bilden den Kontext; missverständlich
  kommunizierte Reiseregeln, Medienverbreitung, Menschenmenge und Entscheidungen
  vor Ort öffnen die Grenze.
- Geeignete Passage: gesamte Quelle als Ereigniskette 9:00–Nacht, besonders
  17:30, Pressekonferenz 18:53 und Reaktionen an den Übergängen.
- Perspektivprüfung: die Formel vom „Fehler eines einzigen Mannes“ ist als
  dramaturgische Verkürzung zu prüfen.
- Spieleignung: sehr gut für ein nichtlineares Akteurs- und Informationsnetz.
- Unsicherheit: Originaltitel, genauer Aufnahmeort und Film-URL fehlen.

### M15 – SeitdemMauerfall.pdf

- Dateityp/Umfang: PDF-Transkript, 11 Seiten; automatisch generischer Kopf.
- Zeitraum: Erinnerungen seit 1953/1961, Schwerpunkt Leben nach 1989.
- Orte: Bernauer Strasse, Gedenkstätte Berliner Mauer, Bornholmer Strasse und
  Brandenburger Tor.
- Akteure/Perspektiven: Antonia und Franz Hildebrandt, ihr Grossvater Jörg,
  Regine Hildebrandt, Ost- und Westberliner Familien sowie jüngere Generationen.
- Kernaussage: Die physische Mauer verschwindet, biografische Erfahrungen,
  Ungleichheiten, Erinnerung und alltägliche Nachnutzung bleiben.
- Geeignete Passagen: Seiten 1–3 zur Bernauer Strasse über drei Generationen;
  weitere Abschnitte zu Regine Hildebrandt und dem Zusammenwachsen von Ost
  und West.
- Widerspruch: touristischer Erinnerungsort, Familiengeschichte und normaler
  Alltagsraum liegen am selben Ort übereinander.
- Spieleignung: zentrale Quelle für die Leitfrage „Wann endet Teilung wirklich?“
  und für das Finale mit Auslassungsreflexion.
- Unsicherheit: Originaltitel, Produzent und Film-URL fehlen.

## 5. Nachweisbare Materialspannungen

Diese Spannungen sind keine Fehler, sondern produktive Ausgangspunkte:

1. „Goldene Zwanziger“ (M05) versus Armut, Kriminalität und Ausgrenzung
   (M03/M04).
2. repräsentative Kaiserreichsmetropole versus Mietskasernen und soziale
   Segregation (M02).
3. NS-Wochenschau/Propaganda versus private Alltagserfahrung und spätere
   Rekonstruktion (M09).
4. Architektur als Fortschritt/Wohnraum versus Architektur als Herrschafts- und
   Systemzeichen (M07/M13).
5. Mauerfall als Schabowski-Fehler versus längerfristige Protest-, Flucht- und
   Staatskrise (M14).
6. „Mauer weg“ versus fortdauernde biografische und soziale Teilungen (M15).

## 6. Vor dem Coding zu erledigende Quellenpflege

1. Für jedes PDF die zugehörige Filmdatei oder eine stabile, rechtlich nutzbare
   Streaming-URL bereitstellen.
2. Generische Dateinamen M06, M09–M15 auf Originaltitel und Produzent
   zurückführen.
3. Zeitcodes aus den Filmen ergänzen; PDF-Seiten sind nur eine vorläufige
   Referenz.
4. Transkriptfehler nicht still korrigieren, sondern Originalton prüfen und eine
   redigierte Fassung mit Provenienz anlegen.
5. Rechte- und Datenschutzstatus für schulische Nutzung dokumentieren.
6. Herkunft, Massstab und Lizenzstatus der ergänzten Karten vervollständigen
   sowie Kontrollpunkte für die Georeferenzierung festlegen.
