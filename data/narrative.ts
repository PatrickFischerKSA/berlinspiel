export type MissionNarrative = {
  chapter: string;
  opening: string[];
  perspective: {
    name: string;
    age: string;
    role: string;
    location: string;
    situation: string;
    dilemma: string;
    question: string;
  };
  stakes: string;
  transitions: {
    sources: string;
    map: string;
    verdict: string;
  };
  closing: string;
};

export const missionNarratives: Record<string, MissionNarrative> = {
  grossstadt: {
    chapter: "Eine Stadt zieht den Atem ein",
    opening: [
      "Berlin, kurz vor Schichtbeginn. Über den Dächern liegt Kohlenrauch, auf den Strassen drängen Pferdewagen, elektrische Bahnen und Menschen aus allen Teilen des Reiches. Die Metropole wächst schneller, als Wohnungen, Kanalisation und politische Rechte mithalten können.",
      "Die beschädigte Akte zeigt nur Fassaden, Licht und Geschwindigkeit. Euer Auftrag beginnt dort, wo die Festschrift abbricht: in den Hinterhöfen, an den Fabriktoren und bei Familien, die den Fortschritt herstellen, ohne gleichermassen von ihm zu profitieren.",
    ],
    perspective: {
      name: "Marta Lehmann",
      age: "16 Jahre",
      role: "Botin einer Konfektionswerkstatt",
      location: "Luisenstadt, 1908",
      situation: "Marta trägt Stoffpakete zwischen Werkstatt, Kontor und Heimarbeit. Sie kennt die neuen Warenhäuser ebenso wie die feuchten Hinterhöfe, in denen mehrere Familien Küche und Wasserstelle teilen.",
      dilemma: "Die Grossstadt gibt ihr Lohn, Bewegungsfreiheit und Hoffnung. Gleichzeitig frisst die Arbeit ihre Zeit, und die steigende Miete bedroht das Zimmer ihrer Familie.",
      question: "Ist eine Stadt modern, wenn ihre Maschinen schneller werden als das Leben ihrer Bewohnerinnen und Bewohner besser?",
    },
    stakes: "Wenn ihr die Prachtstrasse für ganz Berlin sprechen lasst, verschwinden diejenigen erneut aus dem Archiv, die die Metropole gebaut, beliefert und gereinigt haben.",
    transitions: {
      sources: "Folgt Martas Arbeitsweg in den Film. Sucht nicht nach allgemeiner «Armut», sondern nach sichtbaren Bedingungen: Raum, Arbeit, Zeit und körperliche Belastung.",
      map: "Der Film zeigt Erfahrungen; die Karte zeigt ihre Verteilung. Prüft nun, welche Orte Repräsentation, Verkehr und Arbeiteralltag sichtbar machen – und welche Räume der Plan verschweigt.",
      verdict: "Marta braucht weder eine Elendserzählung noch ein Fortschrittsmärchen. Repariert die Akte so, dass Möglichkeit und Ungleichheit gleichzeitig erkennbar bleiben.",
    },
    closing: "Eine glaubwürdige Grossstadtgeschichte misst Fortschritt nicht nur an Geschwindigkeit und Stein, sondern daran, wer Zeit, Sicherheit und Raum gewinnt.",
  },
  goldlack: {
    chapter: "Licht an, Rechnung offen",
    opening: [
      "Berlin nach Krieg, Revolution und Inflation. In Tanzsälen, Ateliers und Kinos scheint eine neue Zeit zu beginnen. Frauen erobern öffentliche Räume, Kunst provoziert, Radio und Film verändern den Alltag. Doch wenige Strassen weiter bestimmen Arbeitslosigkeit, Wohnungssuche und politische Gewalt das Leben.",
      "Die beschädigte Akte hat aus einem kurzen, widersprüchlichen Aufbruch eine goldene Dauerparty gemacht. Ihr müsst herausfinden, wer im Licht stand, wer die Rechnung bezahlte und warum ein schillerndes Etikett niemals eine ganze Gesellschaft beschreibt.",
    ],
    perspective: {
      name: "Ruth Cohn",
      age: "23 Jahre",
      role: "Schreibkraft und Amateurfotografin",
      location: "Schöneberg, 1928",
      situation: "Ruth verdient eigenes Geld, fährt abends allein durch die Stadt und fotografiert Reklame, Warteschlangen und politische Plakate. Ihr neues Leben wäre für ihre Mutter kaum vorstellbar gewesen.",
      dilemma: "Die Republik eröffnet Ruth Freiheiten. Ihr befristeter Lohn, die Sorge vor Entlassung und die Gewalt auf der Strasse zeigen ihr zugleich, wie zerbrechlich dieser Aufbruch ist.",
      question: "Wie viel «Gold» bleibt von einer Epoche, wenn man die Kamera vom Nachtlokal zur Wohnungssuche dreht?",
    },
    stakes: "Wer nur Glanz oder nur Krise erzählt, macht aus Menschen Kulissen. Eure Akte muss zeigen, dass kulturelle Freiheit und soziale Unsicherheit gleichzeitig wahr sein können.",
    transitions: {
      sources: "Beobachtet den Film wie Ruth durch einen Sucher: Wer darf handeln? Wer wartet? Welche Zeitgrenzen und sozialen Gruppen machen das Wort «golden» kleiner?",
      map: "Ordnet die Filmbeobachtungen konkreten Bezirken zu. Ein Nachtleben im Westen, ein Arbeiterkiez und ein Ort der Ausgrenzung besitzen unterschiedliche Reichweiten.",
      verdict: "Entscheidet, ob eure Ausgangshypothese trägt. Ein gutes Urteil erklärt nicht, ob die Zwanziger golden waren, sondern für wen, wann und unter welchen Bedingungen.",
    },
    closing: "Die Epoche gewinnt an Farbe, sobald Gold nicht mehr die einzige Farbe im Bild ist.",
  },
  "ende-weimar": {
    chapter: "Die Tür bleibt nicht von selbst offen",
    opening: [
      "Berlin zwischen Massenarbeitslosigkeit, Notverordnungen, Wahlkampf und Strassengewalt. Demokratische Institutionen bestehen noch, doch ihr Handlungsspielraum wird Schritt für Schritt enger. Keine einzelne Minute erklärt den Übergang zur Diktatur.",
      "Die beschädigte Akte behauptet einen plötzlichen Schalter: vorher Demokratie, danach Diktatur. Eure Rekonstruktion muss stattdessen Entscheidungen, Interessen, Gewalt und unterlassene Gegenwehr als Prozess sichtbar machen.",
    ],
    perspective: {
      name: "Ernst Nowak",
      age: "19 Jahre",
      role: "arbeitsloser Setzerlehrling",
      location: "Moabit, Januar 1933",
      situation: "Ernst liest Schlagzeilen, weil er einst lernen wollte, sie zu drucken. Nun steht er vor dem Arbeitsamt, hört Versprechen radikaler Parteien und erlebt, wie politische Gegner aus seinem Kiez verschwinden.",
      dilemma: "Er sehnt sich nach Arbeit und Ordnung, misstraut aber einer Bewegung, die einfache Feinde anbietet. In seinem Freundeskreis wird Schweigen zur Überlebensstrategie.",
      question: "Ab welchem Schritt wird eine bedrohte Demokratie zu einer Diktatur – und wer hätte noch handeln können?",
    },
    stakes: "Wenn die Machtübernahme als unvermeidliches Einzelereignis erscheint, verschwinden Verantwortung, Alternativen und die Warnzeichen demokratischen Abbaus.",
    transitions: {
      sources: "Sucht im Film eine Abfolge: Krise, politische Entscheidung, Einschränkung eines Rechts. Notiert, was jeweils noch nicht entschieden war.",
      map: "Reichstag, Regierungsviertel und Strassenpolitik erfüllen verschiedene Funktionen. Verbindet Ort und Handlung, damit «Berlin» nicht zu einer abstrakten Bühne wird.",
      verdict: "Schreibt kein Schicksalsurteil. Rekonstruiert, welche Schritte die Demokratie schwächten und an welchem Punkt aus politischer Krise organisierte Diktatur wurde.",
    },
    closing: "Demokratie verschwindet selten in einem einzigen Augenblick; sie verliert Raum, wenn Regeln, Institutionen und Menschen nacheinander preisgegeben werden.",
  },
  "unter-der-oberflaeche": {
    chapter: "Die Stadt als Kulisse",
    opening: [
      "Berlin 1936. Fahnenachsen, neue Bauten und sportliche Bilder präsentieren der Welt eine disziplinierte, moderne Hauptstadt. Hinter dieser Oberfläche werden jüdische Berlinerinnen und Berliner entrechtet, politische Gegner verfolgt und Gewalt für die Kameras zeitweise aus dem Blick geräumt.",
      "Die beschädigte Akte vertraut dem offiziellen Bild. Ihr arbeitet gegen eine Inszenierung, die nicht nur zeigt, sondern gezielt verbirgt. Entscheidend ist deshalb die Frage: Was fehlt im Bild – und wer profitiert von dieser Leerstelle?",
    ],
    perspective: {
      name: "Samira Rosenfeld",
      age: "14 Jahre",
      role: "Schülerin und begeisterte Läuferin",
      location: "Prenzlauer Berg, Sommer 1936",
      situation: "Samira hört den Jubel aus dem Radio und kennt die olympischen Plakate. Gleichzeitig darf ihr Vater seinen Beruf kaum noch ausüben, und Bekannte raten der Familie, in der Öffentlichkeit nicht aufzufallen.",
      dilemma: "Sie liebt den Sport, erkennt aber, dass die Spiele benutzt werden, um ein Regime freundlich erscheinen zu lassen, das ihre Familie aus der Gesellschaft drängt.",
      question: "Kann ein beeindruckendes Bild wahr sein und trotzdem eine Lüge erzählen?",
    },
    stakes: "Eine Rekonstruktion, die nur sichtbare Monumente beschreibt, wiederholt die Perspektive der Propaganda und löscht Verfolgte ein zweites Mal aus dem Stadtraum.",
    transitions: {
      sources: "Achtet auf Bildregie: Fahnen, Körper, Architektur, Jubel. Fragt bei jeder Einstellung, welche Gegenwart ausserhalb des Kamerarahmens liegt.",
      map: "Trennt gebaute Propagandaräume, Orte politischer Macht und biografische Orte der Verfolgung. Nähe auf der Karte bedeutet nicht Sichtbarkeit im offiziellen Bild.",
      verdict: "Euer Urteil muss erklären, wie Inszenierung funktioniert: durch Auswahl, Überwältigung und Auslassung – nicht nur durch offen falsche Aussagen.",
    },
    closing: "Quellenkritik beginnt dort, wo ein perfektes Bild den Verdacht weckt, dass jemand den Rand des Bildes kontrolliert.",
  },
  "kriegsende-besatzung": {
    chapter: "Nach dem letzten Schuss",
    opening: [
      "Berlin im Frühjahr 1945. Häuserfronten sind aufgerissen, Wege versperrt, Familien getrennt. Für Verfolgte und Zwangsarbeiter bedeutet das Ende des NS-Regimes Befreiung; für viele andere zugleich Niederlage, Angst, Hunger und die Konfrontation mit zerstörter Lebenswelt.",
      "Die beschädigte Akte nennt diesen Moment «Stunde Null». Doch Menschen, Schuld, Wissen, Beziehungen und Verwaltungen beginnen nicht bei null. Eure Aufgabe ist es, Bruch und Fortleben nebeneinander auszuhalten.",
    ],
    perspective: {
      name: "Helene Krause",
      age: "38 Jahre",
      role: "Straßenbahnschaffnerin und Mutter",
      location: "Tempelhof, Mai 1945",
      situation: "Helene sucht Trinkwasser, tauscht Kleidung gegen Kartoffeln und versucht herauszufinden, ob ihr Bruder zurückkehrt. Auf ihren Wegen begegnet sie befreiten Zwangsarbeitern und Soldaten verschiedener Besatzungsmächte.",
      dilemma: "Sie will nur, dass ihre Kinder überleben. Gleichzeitig muss sie sich fragen, was sie wusste, worüber sie schwieg und was ein Neubeginn ohne ehrliche Erinnerung wert wäre.",
      question: "Was endet 1945 tatsächlich – und was tragen die Menschen in die neue Ordnung hinein?",
    },
    stakes: "Wer nur Trümmer oder nur Befreiung zeigt, nimmt anderen Erfahrungen den Platz. Die Akte muss widersprüchliche Wahrnehmungen benennen, ohne Täter, Opfer und Zuschauer gleichzusetzen.",
    transitions: {
      sources: "Sucht eine konkrete Alltagsfolge und eine erkennbare neue Machtordnung. Verbindet Versorgung, Gewaltende und Besatzung, statt sie als getrennte Kapitel zu behandeln.",
      map: "Die vier Sektoren machen politische Zuständigkeit sichtbar. Prüft zugleich, warum Berlin trotz seiner Lage innerhalb der sowjetischen Zone einen besonderen Status erhält.",
      verdict: "Ersetzt «Stunde Null» durch eine präzise Formulierung: Was ist Bruch, was Kontinuität, und wessen Perspektive verändert diese Bewertung?",
    },
    closing: "Ein Neubeginn wird historisch glaubwürdig, wenn er nicht behauptet, dass die Vergangenheit verschwunden sei.",
  },
  "berlinkrise-17-juni": {
    chapter: "Versorgung wird Politik",
    opening: [
      "Berlin zwischen Blockade, Luftbrücke, Staatsgründungen und Arbeiterprotest. Mehl, Kohle und Arbeitsnormen werden zu politischen Fragen; Flugplätze und Baustellen zu Orten des Systemkonflikts.",
      "Die beschädigte Akte erzählt zwei getrennte Heldengeschichten: im Westen die Luftbrücke, im Osten den Aufstand. Eure Rekonstruktion untersucht stattdessen, wie Alltag, politische Ordnung und Erwartungen an ein besseres Leben miteinander verbunden sind.",
    ],
    perspective: {
      name: "Kurt Bielefeld",
      age: "31 Jahre",
      role: "Bauarbeiter an der Stalinallee",
      location: "Ost-Berlin, Juni 1953",
      situation: "Kurt ist stolz auf die neuen Wohnungen, doch die erhöhten Arbeitsnormen bedeuten weniger Lohn für mehr Leistung. Aus Gesprächen auf der Baustelle wird ein Marsch, aus einer wirtschaftlichen Forderung ein politischer Aufstand.",
      dilemma: "Er will keine abstrakte Systemschlacht. Er will, dass seine Arbeit zählt – und merkt, dass schon diese Forderung die Machtfrage berührt.",
      question: "Wann wird ein Protest um Lohn und Arbeit zu einem Protest um politische Freiheit?",
    },
    stakes: "Wenn Versorgung und Protest getrennt bleiben, verschwinden die Alltagserfahrungen, aus denen die grossen Systemerzählungen ihre Kraft beziehen.",
    transitions: {
      sources: "Achtet auf den Moment der Ausweitung: Welche Forderung geht über Arbeitsnormen hinaus, und wie reagieren Staat und Besatzungsmacht?",
      map: "Verbindet Tempelhof und Tegel als Versorgungsorte mit der Stalinallee als Protestort. Jeder Ort erhält eine andere Funktion in derselben Konfliktgeschichte.",
      verdict: "Erklärt, wie aus materieller Not politische Symbolik entsteht, ohne Luftbrücke und Aufstand zu einem einzigen Ereignis zu vermischen.",
    },
    closing: "Geschichte wird politisch, wenn Menschen entdecken, dass hinter einer alltäglichen Zumutung eine Frage nach Macht und Mitbestimmung steht.",
  },
  frontstadt: {
    chapter: "Eine Linie durch den Alltag",
    opening: [
      "Berlin nach dem 13. August 1961. Eine Grenze wird erst aus Stacheldraht, dann aus Beton, Kontrollstreifen, Wachtürmen und bürokratischen Regeln. Sie trennt nicht nur Staaten, sondern Wege zur Arbeit, Familien, Erinnerungen und Zukunftspläne.",
      "Die beschädigte Akte reduziert dieses System auf eine einzelne Mauerlinie. Ihr rekonstruiert die Grenze als wandelnde Infrastruktur und als Erfahrung, die je nach Wohnort, Generation und politischer Seite anders erzählt wird.",
    ],
    perspective: {
      name: "Peter Nguyen",
      age: "17 Jahre",
      role: "Elektrolehrling",
      location: "Wedding, 1962",
      situation: "Peter wohnt wenige Strassen von der Grenze entfernt. Seine Tante lebt im Osten, sein Ausbildungsbetrieb im Westen. Ein vertrauter Weg endet nun an Sperren, Beobachtung und Formularen.",
      dilemma: "Westliche Plakate sprechen von Freiheit, östliche vom Schutz des Friedens. Peter erlebt vor allem, dass beide Erzählungen seine Familie nicht wieder an einen Tisch bringen.",
      question: "Was macht eine politische Grenze mit Menschen, deren Alltag sich nicht an Systemgrenzen hält?",
    },
    stakes: "Wer nur Beton zählt, unterschätzt die Wirkung von Kontrolle, Angst, Anpassung und Erinnerung. Wer nur Opfergeschichten erzählt, verliert die Mechanik des Grenzsystems aus dem Blick.",
    transitions: {
      sources: "Sammelt mindestens drei Bestandteile der Grenzanlage und beobachtet, wie sie zusammenwirken. Die Betonwand allein erklärt weder Kontrolle noch Fluchtgefahr.",
      map: "Zoomt vom Grenzring zu Bornholmer, Bernauer und Checkpoint Charlie. Ordnet jedem Mikroort Alltag, Politik oder Erinnerung zu.",
      verdict: "Verbindet System und Biografie: Wie stabilisiert die Grenze politische Herrschaft, und wie verändert sie konkrete Lebenswege?",
    },
    closing: "Eine Grenze ist mehr als ihre sichtbare Linie; sie setzt sich in Wegen, Entscheidungen und Familiengeschichten fort.",
  },
  "nach-der-linie": {
    chapter: "Die Nacht, in der Regeln nachgaben",
    opening: [
      "Berlin am 9. November 1989. Eine missverständlich verkündete Reiseregelung trifft auf Medien, Erwartung, Mut und eine wachsende Menschenmenge. An den Übergängen müssen Grenzer entscheiden, während die politische Führung Kontrolle verliert.",
      "Die beschädigte Akte schreibt den Mauerfall einem einzigen Satz zu. Eure Rekonstruktion folgt der Ereigniskette bis zu den Menschen vor Ort – denn historische Wendepunkte geschehen nicht automatisch.",
    ],
    perspective: {
      name: "Derya Özkan",
      age: "20 Jahre",
      role: "Auszubildende beim Rundfunk",
      location: "West-Berlin, 9. November 1989",
      situation: "Derya hört die Pressekonferenz im Sender, sieht unklare Agenturmeldungen und fährt mit einer Freundin zur Bornholmer Strasse. Dort begegnet sie einer Menge, die aus einer Nachricht eine Forderung macht.",
      dilemma: "Sie weiss nicht, ob die Situation kippt. Trotzdem hält sie das Mikrofon hin und erkennt, dass Berichterstattung das Ereignis nicht nur dokumentiert, sondern beschleunigt.",
      question: "Wer öffnet eine Grenze: der Sprecher, die Medien, die Menge, die Grenzer – oder erst ihr Zusammenspiel?",
    },
    stakes: "Eine Ein-Satz-Legende ist eingängig, aber sie nimmt vielen Handelnden ihre historische Wirksamkeit und lässt die Risiken dieser Nacht verschwinden.",
    transitions: {
      sources: "Rekonstruiert eine Kette aus Aussage, Verbreitung, Erwartung, Menschenmenge und Entscheidung. Jede Verbindung braucht eine beobachtbare Handlung.",
      map: "Vergleicht Bornholmer Strasse als Ereignisort, Bernauer Strasse als Erinnerungsort und Brandenburger Tor als Symbolort. Diese Funktionen entstehen zu unterschiedlichen Zeiten.",
      verdict: "Entscheidet, welchen Anteil Kommunikation und Handeln jeweils haben. Vermeidet sowohl die Heldengeschichte eines Einzelnen als auch die Vorstellung eines führungslosen Zufalls.",
    },
    closing: "Wendepunkte entstehen, wenn Worte Erwartungen verändern und Menschen daraus Handlungen machen.",
  },
  "hauptstadt-gentrifizierung": {
    chapter: "Wem gehört die neue Mitte?",
    opening: [
      "Berlin nach der Wiedervereinigung. Parlament und Regierung ziehen um, Brachen werden Investitionsflächen, Häuser saniert, Quartiere international begehrt. Aufwertung schafft neue Möglichkeiten – und erhöht den Druck auf Menschen, deren Alltag den Kiez lange geprägt hat.",
      "Die beschädigte Akte feiert Hauptstadtglanz und steigende Immobilienwerte als Gewinn für alle. Eure letzte Ermittlung fragt, wer investieren kann, wer profitiert, wer bleiben darf und wie politische Entscheidungen räumliche Folgen erzeugen.",
    ],
    perspective: {
      name: "Aylin Demir",
      age: "34 Jahre",
      role: "Kioskbetreiberin und Mieterin",
      location: "Kreuzberg, 2018",
      situation: "Aylin hat den Laden ihrer Eltern übernommen. Neue Kundschaft bringt Umsatz, sanierte Häuser verändern die Strasse, doch Gewerbe- und Wohnungsmiete steigen schneller als ihr Einkommen.",
      dilemma: "Sie mag die neuen Cafés, Radwege und sicheren Höfe. Sie fürchtet zugleich, dass die Verbesserung des Viertels ihre eigene Familie aus diesem Viertel drängt.",
      question: "Wann wird Aufwertung zum Verlust – und wer darf entscheiden, was ein besserer Kiez ist?",
    },
    stakes: "Wenn Stadtentwicklung nur als Erfolg oder nur als Verdrängung erscheint, werden reale Zielkonflikte unsichtbar. Die Akte muss Gewinner, Belastete und politische Handlungsmöglichkeiten benennen.",
    transitions: {
      sources: "Sucht eine konkrete Ursache der Aufwertung und eine konkrete soziale Folge. Verbindet Investition, Sanierung, Mietpreis und Verdrängungsrisiko.",
      map: "Vergleicht Regierungsviertel, Prenzlauer Berg und Kreuzberg über mehrere Kartenjahre. Notiert pro Ort eine Veränderung und fragt, wer sie nutzen kann.",
      verdict: "Formuliert ein Hauptstadturteil, das bauliche Verbesserung anerkennt, ohne steigende Werte automatisch mit sozialem Fortschritt gleichzusetzen.",
    },
    closing: "Eine Stadt gehört nicht nur denen, die in sie investieren, sondern auch denen, die Beziehungen, Arbeit und Erinnerung in ihr aufgebaut haben.",
  },
};
