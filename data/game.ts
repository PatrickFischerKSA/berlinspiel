export type EvidenceRequirement = {
  type: "source" | "map" | "perspective" | "judgment";
  label: string;
};

export type Mission = {
  id: string;
  number: string;
  period: string;
  title: string;
  subtitle: string;
  backgroundVideo: string;
  problem: string;
  damagedClaim: string;
  disturbance: string;
  accent: string;
  roles: {
    source: string;
    space: string;
    critic: string;
  };
  resources: {
    id: string;
    title: string;
    kind: string;
    href: string;
    embedUrl?: string;
    duration: string;
    viewingFocus: string;
    taskSteps: string[];
    signalWords: string[];
    successFeedback: string;
    researchQuestion: string;
    evidencePrompt: string;
    excerpt: string;
    prompt: string;
  }[];
  map: {
    title: string;
    type: "image" | "embed";
    src: string;
    source: string;
    sourceHref?: string;
    alternatives?: {
      label: string;
      title: string;
      src: string;
      source: string;
      sourceHref: string;
    }[];
    places: { id: string; label: string; x: number; y: number; clue: string }[];
    task: string;
  };
  claims: string[];
  redHerrings: string[];
  requirements: EvidenceRequirement[];
  reflection: string;
};

export const roleLabels = {
  source: "Quellenagent/in",
  space: "Raumagent/in",
  critic: "Gegenprüfer/in",
};

const FILM_ARCHIVE_BASE = "https://raw.githubusercontent.com/PatrickFischerKSA/berlinspiel/66e1cbc41d66ff52b5e162ed09fdd044d87ec0f2/public";
const archiveFilm = (path: string) => `${FILM_ARCHIVE_BASE}${path}`;

function localFilmResource(id: string, title: string, href: string, viewingFocus: string): Mission["resources"][number] {
  return {
    id,
    title,
    kind: "Lokale MP4-Filmressource",
    href: href.startsWith("/films/") ? archiveFilm(href) : href,
    duration: "vollständige lokale Filmdatei",
    viewingFocus,
    taskSteps: ["Film im eingebauten Player öffnen.", "Gesuchte Stelle pausieren.", "Timecode und sicht- oder hörbares Detail sichern."],
    signalWords: [],
    successFeedback: "Die Filmstelle ist lokal gesichert und kann unabhängig von externen Plattformen geprüft werden.",
    researchQuestion: viewingFocus,
    evidencePrompt: "Bei 00:… sieht oder hört man … Daraus folgt …",
    excerpt: "Lokale Archivkopie aus dem bereitgestellten Materialbestand.",
    prompt: viewingFocus,
  };
}

export const supplementalFilms: Record<string, Mission["resources"]> = {
  grossstadt: [
    localFilmResource("m02b", "Arbeiter in der Kaiserzeit", "/films/01b-arbeiter-kaiserzeit.mp4", "Welche Arbeits- und Lebensbedingungen zeigt diese ergänzende Filmsequenz?"),
    localFilmResource("m02c", "Berliner Arbeiter – Kurzsequenz", "/clips/01-kaiserreich.mp4", "Welches Detail beschreibt den Alltag Berliner Arbeiterinnen und Arbeiter?"),
  ],
  goldlack: [
    localFilmResource("m04", "5 Fakten: Sündenpfuhl Berlin 1926", "/films/02b-suendenpfuhl-berlin.mp4", "Welche Information korrigiert ein Klischee über Berlin 1926?"),
    localFilmResource("m05b", "Goldene Zwanziger – ergänzende Sequenz", "/films/02d-goldene-zwanziger.mp4", "Welcher sichtbare Gegensatz prägt die Goldenen Zwanziger?"),
    localFilmResource("m05c", "Goldene Zwanziger – Kurzsequenz", "/clips/02-weimar-aufbruch.mp4", "Welche Information zeigt Aufbruch oder soziale Begrenzung?"),
  ],
  "ende-weimar": [
    localFilmResource("m06b", "Bevor Hitler kam – Teil 2", "/films/03b-bevor-hitler-kam-teil-2.m4v", "Welche weiteren Schritte führten von der Krise der Republik in die Diktatur?"),
    localFilmResource("m06c", "Machtergreifung der NSDAP", "/films/03c-machtergreifung-nsdap.mp4", "Welcher Schritt festigte die nationalsozialistische Herrschaft?"),
    localFilmResource("m06d", "Machtübernahme – Kurzsequenz", "/clips/03-ende-weimar-machtergreifung.mp4", "Welche Handlung zeigt den Übergang von Demokratie zu Diktatur?"),
  ],
  "unter-der-oberflaeche": [
    localFilmResource("m07", "Nazibauten gestern und heute", "/films/04a-nazibauten.m4v", "Welche bauliche Inszenierung von Herrschaft zeigt der Film?"),
    localFilmResource("m13", "Olympic Sports in Berlin 1936", "/films/04c-olympia-sportfilm.mp4", "Welche Mittel inszenieren die Spiele als modernes internationales Fest?"),
    localFilmResource("m13b", "Olympia 1936 – Kurzsequenz", "/clips/04-ns-verfolgung-krieg.mp4", "Welches Bild Berlins erzeugt die olympische Inszenierung?"),
  ],
  "kriegsende-besatzung": [
    localFilmResource("m09a2", "Frontstadt, Kapitulation, Neubeginn – Teil 2", "/films/05a-frontstadt-kapitulation-teil-2.m4v", "Welche weiteren Spuren von Kapitulation, Besatzung oder Neubeginn zeigt der zweite Filmteil?"),
    localFilmResource("m09b", "Berlin im Juli 1945", "/films/05b-berlin-july-1945.mp4", "Welche Spuren von Zerstörung und Neubeginn zeigt das Farbmaterial?"),
    localFilmResource("m09c", "Berlin bei Kriegsende – Kurzsequenz", "/clips/05-kriegsende-besatzung.mp4", "Welche Alltagssituation zeigt das Kriegsende?"),
  ],
  "berlinkrise-17-juni": [
    localFilmResource("m11b", "17. Juni – Kurzsequenz", "/clips/06-berlinkrise-17-juni.mp4", "Welche Forderung und welche Reaktion der Staatsmacht zeigt die Sequenz?"),
  ],
  frontstadt: [
    localFilmResource("m12b", "Mauerbau – Kurzsequenz", "/clips/07-mauer-geteilte-stadt.mp4", "Welche Veränderung des Stadtraums zeigt der Mauerbau?"),
  ],
  "nach-der-linie": [
    localFilmResource("m14b", "Mauerfall – Kurzsequenz", "/clips/08-mauerfall-wiedervereinigung.mp4", "Welche Handlung trägt zur Öffnung der Grenze bei?"),
  ],
  "hauptstadt-gentrifizierung": [
    localFilmResource("m16b", "Berlin wird Hauptstadt – Kurzsequenz", "/clips/09-hauptstadt-gentrifizierung.mp4", "Welche Veränderung verbindet Hauptstadtfunktion und Aufwertung?"),
  ],
};

export const missions: Mission[] = [
  {
    id: "grossstadt",
    number: "AKTE 01",
    period: "1871–1918",
    title: "Metropole unter Hochdruck",
    subtitle: "Kaiserreich und Grossstadtwerdung",
    backgroundVideo: "/clips/01-kaiserreich.mp4",
    problem: "Finde heraus: Wie lebten viele Arbeiterfamilien im schnell wachsenden Berlin?",
    damagedClaim:
      "Berlin wächst dank Technik und Kaiserreich zu einer modernen Weltstadt. Der Fortschritt verbessert das Leben der gesamten Bevölkerung.",
    disturbance:
      "Die Archiv-KI hat den Prachtboulevard zur Gesamtstadt erklärt und Wohnungsnot, Arbeitswelt und Stadtrand aus der Akte gelöscht.",
    accent: "#dbaf6b",
    roles: {
      source:
        "Finde heraus, welche Wohn- und Arbeitsbedingungen der Film für Arbeiterfamilien zeigt, und sichere eine Filmstelle.",
      space:
        "Vergleiche die Pläne 1871, 1877 und 1912. Verfolge Tiergarten, Potsdamer Platz und das Wachstum jenseits des alten Zentrums.",
      critic:
        "Prüfe die Wörter «Fortschritt» und «gesamte Bevölkerung». Suche eine Auslassung, die das Urteil verändert.",
    },
    resources: [
      {
        id: "m02",
        title: "Berliner Arbeiter",
        kind: "Lokale Filmsequenz",
        href: archiveFilm("/films/01a-berlin-kaiserzeit.m4v"),
        duration: "lokale Filmsequenz",
        viewingFocus: "Suche im Film eine Szene mit technischem oder städtischem Fortschritt und eine zweite Szene mit Armut oder harter Arbeit.",
        taskSteps: [
          "Stoppe bei einer Szene mit Verkehr, neuen Bauten, Maschinen oder einer belebten Geschäftsstrasse.",
          "Notiere den Timecode und beschreibe genau zwei sichtbare Einzelheiten – ohne sie schon zu bewerten.",
          "Suche danach eine Szene mit Hinterhof, Mietskaserne, Fabrikarbeit oder Obdachlosigkeit und sichere auch diesen Timecode.",
        ],
        signalWords: ["strasse", "verkehr", "bahn", "auto", "haus", "bauten", "maschine", "arbeit", "fabrik", "hinterhof", "mietskaserne", "armut", "obdach"],
        successFeedback: "Guter Filmbeleg: Ort, sichtbares Detail und Timecode sind überprüfbar. Sichere jetzt noch die kontrastierende Szene, damit Fortschritt und soziale Schattenseite direkt vergleichbar werden.",
        researchQuestion: "Welche zwei konkreten Lebensbedingungen vieler Arbeiterfamilien zeigt der Film trotz des technischen Fortschritts?",
        evidencePrompt: "Der Film zeigt als erste Lebensbedingung … und als zweite … Bei 04:32 sieht oder hört man dazu …",
        excerpt:
          "Breite Strassen, imposante Häuser und eine unablässig treibende Menge stehen Mietskasernen, harter Arbeit und sozialer Trennung gegenüber.",
        prompt:
          "Vergleiche eine sichtbare Fortschrittsszene mit einer sichtbaren Szene von Armut oder harter Arbeit.",
      },
    ],
    map: {
      title: "Berlin wächst",
      type: "image",
      src: "/maps/berlin-1912.jpg",
      source: "Pharus-Plan Berlin 1912",
      places: [
        { id: "tiergarten", label: "Tiergarten", x: 42, y: 48, clue: "Repräsentation und Erholung" },
        { id: "potsdamer", label: "Potsdamer Platz", x: 49, y: 61, clue: "Verkehr und Verdichtung" },
        { id: "friedrichshain", label: "Friedrichshain", x: 69, y: 48, clue: "Arbeit und Wohnen" },
      ],
      task:
        "Markiere einen repräsentativen, einen verkehrlichen und einen sozialen Raum. Begründe, warum ein einzelner Kartenausschnitt nicht die ganze Metropole erklärt.",
    },
    claims: [
      "Modernisierung verändert Verkehr, Bebauung und Wahrnehmung der Stadt.",
      "Der Nutzen des Wachstums ist sozial ungleich verteilt.",
      "Repräsentative Räume dürfen nicht für ganz Berlin sprechen.",
    ],
    redHerrings: ["Viele Neubauten bedeuten automatisch bessere Lebensverhältnisse.", "Eine Karte bildet gesellschaftliche Erfahrung neutral ab."],
    requirements: [
      { type: "source", label: "Beleg aus Film/Transkript" },
      { type: "map", label: "drei verschiedenartige Stadträume" },
      { type: "perspective", label: "Reichweite der Fortschrittserzählung" },
      { type: "judgment", label: "differenziertes Modernisierungsurteil" },
    ],
    reflection: "Wer bleibt unsichtbar, wenn wir Berlin nur von Unter den Linden aus erzählen?",
  },
  {
    id: "goldlack",
    number: "AKTE 02",
    period: "1918–1933",
    title: "Goldlack",
    subtitle: "Weimarer Republik",
    backgroundVideo: "/clips/02-weimar-aufbruch.mp4",
    problem: "Finde heraus: Warum waren die «Goldenen Zwanziger» weder lang noch für alle golden?",
    damagedClaim:
      "Berlin 1926: Eine wohlhabende Vergnügungsmetropole wird von kriminellen Vereinigungen bedroht. Die moderne Polizei stellt die Ordnung wieder her.",
    disturbance:
      "Drei Etiketten – GOLD, SÜNDE, ORDNUNG – wurden zu einer einfachen Erfolgsgeschichte verklebt.",
    accent: "#e56b50",
    roles: {
      source:
        "Finde im Film einen konkreten Grund, warum die «Goldenen Zwanziger» zeitlich oder sozial begrenzt waren.",
      space:
        "Prüfe Wedding, Friedrichshain und westliche Bezirke im Pharus-Plan 1928. Markiere nur so genau, wie die Quelle es erlaubt.",
      critic:
        "Untersuche «Sündenpfuhl», «Spree-Chicago» und «Clans» als Deutungsrahmen. Trenne Beschreibung von Dramatisierung.",
    },
    resources: [
      {
        id: "m05",
        title: "Goldene Zwanziger",
        kind: "Lokale Filmsequenz",
        href: archiveFilm("/films/02c-waren-die-zwanziger-golden.m4v"),
        duration: "lokale Filmsequenz",
        viewingFocus: "Vergleiche eine Szene des Aufbruchs mit einer Szene, in der Armut, Krise oder Ausgrenzung sichtbar beziehungsweise genannt wird.",
        taskSteps: [
          "Wähle im Film das Kapitel „Strahlende Aufbruchsstimmung“ oder „Goldene Freiheiten“.",
          "Stoppe bei einem konkreten Beispiel für Freizeit, Arbeit, Konsum oder neue Rechte und notiere den Timecode.",
          "Wechsle zu „Schillernde Fassaden“ oder „Das dunkle Ende“ und sichere eine zweite Stelle, die das Wort „golden“ einschränkt.",
        ],
        signalWords: ["arbeit", "lohn", "freizeit", "kino", "theater", "frauen", "wahl", "armut", "elend", "mietskaserne", "krise", "arbeitslos", "inflation"],
        successFeedback: "Dein Beleg unterscheidet Aufbruch und Begrenzung. Damit lässt sich konkret sagen, für welche Menschen und für welchen Zeitraum die Zwanziger „golden“ erscheinen.",
        researchQuestion: "Welchen konkreten Grund nennt oder zeigt der Film dafür, dass die Zwanziger nicht für alle Menschen «golden» waren?",
        evidencePrompt: "Der konkrete Grund lautet … Bei 06:15 zeigt oder erklärt der Film dazu …",
        excerpt:
          "Stabilisierung, Innovation und kulturelle Dynamik sind real, aber kurz, sozial ungleich und von Krisen gerahmt.",
        prompt: "Nenne je einen Timecode für Aufbruch und Begrenzung. Für welche Zeit und welche Gruppen trägt die Metapher «golden»?",
      },
      {
        id: "m03",
        title: "Kriminelle Clans im Berlin der 20er",
        kind: "Terra X History · Film",
        href: archiveFilm("/films/02a-kriminelle-clans.mp4"),
        duration: "lokale Filmsequenz",
        viewingFocus: "Suche die Filmstelle, an der erklärt wird, warum ehemalige Gefangene ohne Arbeit und Wohnung blieben.",
        taskSteps: [
          "Stoppe dort, wo der Kreislauf aus Gefängnis, fehlender Arbeit und fehlender Wohnung erklärt wird.",
          "Notiere den Timecode und einen Satz dazu, warum Betroffene kaum aus diesem Kreislauf herauskamen.",
          "Suche anschließend die Stelle zur ursprünglichen Selbsthilfe der Ringvereine und vergleiche sie mit dem Filmtitel „Clans“.",
        ],
        signalWords: ["gefängnis", "zuchthaus", "arbeit", "wohnung", "ausweisung", "selbsthilfe", "ringverein", "strafe", "armut"],
        successFeedback: "Du hast den Entstehungskontext der Ringvereine belegt. Dadurch wird sichtbar, dass der reisserische Titel nur einen Teil ihrer Geschichte erzählt.",
        researchQuestion: "Welche zwei Probleme hatten ehemalige Strafgefangene – und warum entstanden deshalb Ringvereine?",
        evidencePrompt: "Die zwei Probleme waren … und … Deshalb entstanden Ringvereine als … Bei 03:20 erklärt der Film …",
        excerpt:
          "Ringvereine beginnen als Selbsthilfe ehemaliger Strafgefangener gegen den Kreislauf aus Haft, Arbeits- und Wohnungslosigkeit.",
        prompt: "Welche Filmstelle zeigt, was das Etikett «kriminelle Clans» über Ursprung oder Funktion der Ringvereine unterschlägt?",
      },
    ],
    map: {
      title: "Pharus-Plan 1928",
      type: "image",
      src: "/maps/berlin-1928.jpg",
      source: "Pharus-Plan Berlin, Grosse Ausgabe 1928",
      places: [
        { id: "wedding", label: "Wedding", x: 46, y: 30, clue: "Arbeiterbezirk" },
        { id: "friedrichshain", label: "Friedrichshain", x: 69, y: 48, clue: "Arbeiterbezirk" },
        { id: "westen", label: "Westliche Bezirke", x: 27, y: 56, clue: "andere Deliktstruktur" },
      ],
      task:
        "Zoome zu den drei Räumen. Ordne Aussagen als bezirksgenau, stadtweit oder nicht lokalisierbar ein.",
    },
    claims: [
      "«Golden» bezeichnet eine reale, aber kurze und ungleich verteilte Dynamik.",
      "Soziale Ausgrenzung gehört zur Entstehungsgeschichte der Ringvereine.",
      "«Sündenpfuhl» ist ein Deutungsrahmen, keine neutrale Ortsbeschreibung.",
    ],
    redHerrings: ["Hohe Kriminalität widerlegt jede kulturelle Blüte.", "Nachtleben beschreibt den Alltag der Mehrheit."],
    requirements: [
      { type: "source", label: "mindestens zwei Quellenbelege" },
      { type: "map", label: "räumliche Reichweite markiert" },
      { type: "perspective", label: "reisserischen Rahmen geprüft" },
      { type: "judgment", label: "«golden» eingeschränkt beurteilt" },
    ],
    reflection: "Welche Gruppen verschwinden, wenn eine Epoche nach ihren spektakulärsten Bildern benannt wird?",
  },
  {
    id: "ende-weimar",
    number: "AKTE 03",
    period: "1929–1933",
    title: "Demokratie unter Druck",
    subtitle: "Ende der Weimarer Republik und Machtübernahme",
    backgroundVideo: "/clips/03-ende-weimar-machtergreifung.mp4",
    problem: "Finde heraus: Warum verlor die Demokratie in Berlin zwischen 1929 und 1933 ihren Halt?",
    damagedClaim: "Die Weimarer Republik endete plötzlich, weil Hitler am 30. Januar 1933 die Macht übernahm.",
    disturbance: "Wirtschaftskrise, politische Gewalt, Wahlerfolge und die schrittweise Zerstörung demokratischer Rechte fehlen.",
    accent: "#cf765c",
    roles: {
      source: "Bestimme im Film einen konkreten Schritt, mit dem demokratische Handlungsmöglichkeiten eingeschränkt wurden.",
      space: "Ordne Reichstag, Regierungsviertel und politische Straßenräume als Orte von Entscheidung, Propaganda und Gewalt.",
      critic: "Unterscheide Ernennung, Machtübernahme und Diktaturaufbau. Vermeide die Erklärung durch ein einzelnes Datum.",
    },
    resources: [{
      id: "m06",
      title: "Berlin 1929–1933: Demokratie unter Druck",
      kind: "Eigene Filmsequenz · wird ergänzt",
      href: archiveFilm("/films/03a-bevor-hitler-kam-teil-1.m4v"),
      duration: "kurze Filmsequenz",
      viewingFocus: "Achte auf Wirtschaftskrise, politische Gewalt und den Abbau demokratischer Rechte.",
      taskSteps: ["Film ansehen.", "Einen Schritt des Demokratieabbaus benennen.", "Timecode sichern."],
      signalWords: ["arbeitslos", "krise", "gewalt", "wahl", "reichstag", "notverordnung", "hitler", "partei", "verbot", "demokratie"],
      successFeedback: "Du hast einen konkreten Schritt im Prozess vom Krisenjahr zur Diktatur benannt.",
      researchQuestion: "Welchen konkreten Schritt zeigt der Film, durch den aus der Demokratie eine Diktatur wurde?",
      evidencePrompt: "Der konkrete Schritt war … Bei 00:… zeigt oder erklärt der Film …",
      excerpt: "Die Demokratie zerfällt nicht an einem Tag: Krise, Gewalt, Wahlerfolge und politische Entscheidungen greifen ineinander.",
      prompt: "Welcher Schritt schwächte oder beseitigte eine demokratische Regel?",
    }],
    map: {
      title: "Politisches Berlin am Ende der Republik",
      type: "image",
      src: "/maps/berlin-1928.jpg",
      source: "Pharus-Plan Berlin 1928",
      places: [
        { id: "reichstag", label: "Reichstag", x: 48, y: 49, clue: "Parlament und Reichstagsbrand" },
        { id: "wilhelmstrasse", label: "Wilhelmstrasse", x: 51, y: 55, clue: "Regierung und Ernennung" },
        { id: "bueloewplatz", label: "Bülowplatz", x: 63, y: 47, clue: "Parteien und Straßenpolitik" },
      ],
      task: "Ordne jedem Ort genau eine Funktion zu: parlamentarische Entscheidung, Regierungsmacht oder politische Mobilisierung.",
    },
    claims: ["Krise und Demokratieabbau bilden einen Prozess.", "Ernennung ist nicht dasselbe wie vollständige Diktatur.", "Politische Gewalt verändert demokratische Handlungsspielräume."],
    redHerrings: ["Die Diktatur war mit einem einzigen Ereignis vollständig hergestellt.", "Wirtschaftskrise erklärt jede politische Entscheidung automatisch."],
    requirements: [
      { type: "source", label: "ein Schritt des Demokratieabbaus" },
      { type: "map", label: "drei politische Räume unterschieden" },
      { type: "perspective", label: "Prozess statt Einzeldatum" },
      { type: "judgment", label: "Übergang zur Diktatur erklärt" },
    ],
    reflection: "Ab welchem Schritt kann eine Demokratie ihre eigenen Regeln nicht mehr schützen?",
  },
  {
    id: "unter-der-oberflaeche",
    number: "AKTE 04",
    period: "1933–1945",
    title: "Unter der Oberfläche",
    subtitle: "Nationalsozialismus und Krieg",
    backgroundVideo: "/clips/04-ns-verfolgung-krieg.mp4",
    problem: "Finde heraus: Wie nutzte das NS-Regime die Olympischen Spiele 1936, um Berlin als friedliche und moderne Weltstadt zu inszenieren?",
    damagedClaim:
      "Die Olympischen Spiele 1936 waren ein unpolitisches Sportfest und bewiesen, dass Berlin eine offene, friedliche Weltstadt war.",
    disturbance:
      "Die Archiv-KI behandelt inszenierte Propagandabilder als neutrale Wirklichkeit und löscht Ausgrenzung und Verfolgung aus dem Bild.",
    accent: "#ae7de8",
    roles: {
      source:
        "Finde im Film zwei sichtbare Mittel, mit denen Berlin modern, geordnet und friedlich präsentiert wurde.",
      space:
        "Verknüpfe Herrschaftsarchitektur mit mindestens einem Alltags- oder Verfolgungsraum. Suche auch ein nie verwirklichtes Projekt.",
      critic:
        "Prüfe, was monumentale Ruinen zeigen – und was sie über Verfolgung gerade nicht zeigen können.",
    },
    resources: [
      {
        id: "m08",
        title: "Ein Tag in Berlin 1943 – Der Passfälscher",
        kind: "Lokale MP4-Filmressource",
        href: archiveFilm("/films/04b-passfaelscher.m4v"),
        duration: "vollständige lokale Webkopie",
        viewingFocus: "Verfolge einen konkreten Weg Cioma Schönhaus' durch Berlin: Unterkunft, Kontrolle, Werkstatt oder Treffen mit Helfenden.",
        taskSteps: [
          "Stoppe bei einer Szene, in der Cioma eine Kontrolle vermeiden, seine Identität verbergen oder die Unterkunft wechseln muss.",
          "Notiere Timecode, Ort und die konkrete Gefahr in dieser Szene.",
          "Suche eine zweite Szene mit Werkstatt, gefälschten Papieren oder Helfern und beschreibe, wie dieser Ort Schutz ermöglicht.",
        ],
        signalWords: ["kontrolle", "polizei", "gestapo", "ausweis", "kennkarte", "wohnung", "unterkunft", "werkstatt", "helfer", "flucht", "versteck"],
        successFeedback: "Du hast Verfolgung als räumlichen Alltag belegt: Kontrolle und Hilfe entstehen an konkreten Orten.",
        researchQuestion: "Welches konkrete Mittel half Cioma Schönhaus, eine Kontrolle oder Verhaftung zu vermeiden?",
        evidencePrompt: "Cioma nutzt … Bei 12:40 sieht oder hört man … Das schützt ihn, weil …",
        excerpt:
          "Cioma Schönhaus bewegt sich mit falschen Papieren durch ein Netz aus Kontrolle, Verstecken, Hilfe und Widerstand.",
        prompt: "Welche zwei Filmstellen zeigen das Netz aus Kontrolle, Verstecken und Hilfe?",
      },
    ],
    map: {
      title: "Pharus-Plan 1940",
      type: "embed",
      src: "https://www.berliner-stadtplansammlung.de/index.php/karten/1940-pharus-plan-berlin",
      source: "Berliner Stadtplansammlung · Pharus-Plan 1940",
      sourceHref: "https://www.berliner-stadtplansammlung.de/index.php/karten/1940-pharus-plan-berlin",
      places: [
        { id: "tiergarten", label: "Tiergarten / Germania", x: 45, y: 48, clue: "Planung und Abriss" },
        { id: "olympia", label: "Olympiastadion", x: 20, y: 47, clue: "Propaganda und Nachnutzung" },
        { id: "versteck", label: "Verfolgungsnetz", x: 56, y: 56, clue: "nicht als einzelner Punkt reduzierbar" },
      ],
      task:
        "Unterscheide gebauten Ort, geplanten Ort und biografischen Bewegungsraum. Prüfe eine Auslassung des Plans.",
    },
    claims: [
      "Herrschaft prägt gebaute und geplante Räume.",
      "Verfolgung erzeugt unsichtbare Bewegungs- und Kontrollräume.",
      "Propagandaaufnahme, Erinnerung und spätere Dokumentation haben verschiedene Aussagewerte.",
    ],
    redHerrings: ["Nur verwirklichte Bauten gehören zur Stadtgeschichte.", "Wochenschauaufnahmen zeigen Alltag unvermittelt."],
    requirements: [
      { type: "source", label: "kontrastierendes Quellenpaar" },
      { type: "map", label: "gebaut/geplant/biografisch getrennt" },
      { type: "perspective", label: "Propagandazweck geprüft" },
      { type: "judgment", label: "Raum und Verfolgung verbunden" },
    ],
    reflection: "Welche Geschichte geht verloren, wenn Diktatur nur anhand ihrer Steinreste erzählt wird?",
  },
  {
    id: "kriegsende-besatzung",
    number: "AKTE 05",
    period: "1945–1948",
    title: "Stadt in Trümmern",
    subtitle: "Kriegsende und Besatzung",
    backgroundVideo: "/clips/05-kriegsende-besatzung.mp4",
    problem: "Finde heraus: Wie wurde aus der zerstörten Reichshauptstadt eine Viersektorenstadt?",
    damagedClaim: "Mit der Kapitulation endete der Krieg; Berlin begann sofort gemeinsam und unbelastet neu.",
    disturbance: "Zerstörung, Versorgungskrise, Entnazifizierung, Flucht und die Aufteilung unter vier Siegermächten fehlen.",
    accent: "#b08f76",
    roles: {
      source: "Finde im Film eine konkrete Folge des Kriegsendes für den Berliner Alltag.",
      space: "Ordne die vier Besatzungssektoren und erkläre, warum Berlin trotz seiner Lage in der sowjetischen Zone einen Sonderstatus hatte.",
      critic: "Prüfe die Formel «Stunde Null»: Welche Belastungen und Kontinuitäten blieben bestehen?",
    },
    resources: [{
      id: "m09",
      title: "Berlin 1945: Kriegsende und Besatzung",
      kind: "Eigene Filmsequenz · wird ergänzt",
      href: archiveFilm("/films/05a-frontstadt-kapitulation-teil-1.m4v"),
      duration: "kurze Filmsequenz",
      viewingFocus: "Achte auf Zerstörung, Versorgung und die Anwesenheit der vier Besatzungsmächte.",
      taskSteps: ["Film ansehen.", "Eine Alltagsfolge benennen.", "Timecode sichern."],
      signalWords: ["trümmer", "zerstörung", "hunger", "versorgung", "besatzung", "sektor", "sowjet", "amerikan", "brit", "franz"],
      successFeedback: "Du hast eine konkrete Alltagsfolge des Kriegsendes mit der neuen politischen Ordnung verbunden.",
      researchQuestion: "Welche konkrete Alltagsfolge des Kriegsendes zeigt der Film – und welche Besatzungsmacht ist dabei zu erkennen?",
      evidencePrompt: "Die Alltagsfolge war … Zu erkennen ist der … Sektor beziehungsweise die … Besatzungsmacht. Bei 00:… sieht man …",
      excerpt: "Kriegsende bedeutet zugleich Befreiung, Niederlage, Zerstörung, Besatzung und einen schwierigen Neubeginn.",
      prompt: "Welche Folge des Kriegsendes wird im Film sichtbar?",
    }],
    map: {
      title: "Berlin in vier Besatzungssektoren",
      type: "image",
      src: "/maps/besatzungssektoren.svg",
      source: "Schematische Lernkarte nach der Viersektoreneinteilung",
      places: [
        { id: "tegel", label: "Französischer Sektor", x: 28, y: 26, clue: "Nordwesten" },
        { id: "tempelhof", label: "Amerikanischer Sektor", x: 51, y: 74, clue: "Südwesten" },
        { id: "mitte", label: "Sowjetischer Sektor", x: 74, y: 47, clue: "Osten einschließlich Mitte" },
      ],
      task: "Ordne drei Orte ihren Sektoren zu und erkläre den Sonderstatus Berlins innerhalb der sowjetischen Besatzungszone.",
    },
    claims: ["Berlin wird von vier Mächten verwaltet.", "Kriegsende verändert Alltag und politische Ordnung gleichzeitig.", "Die Formel «Stunde Null» verdeckt Kontinuitäten."],
    redHerrings: ["Ganz Berlin gehörte zur sowjetischen Besatzungszone.", "Mit der Kapitulation waren Versorgung und Verwaltung sofort gesichert."],
    requirements: [
      { type: "source", label: "eine Alltagsfolge des Kriegsendes" },
      { type: "map", label: "vier Sektoren unterschieden" },
      { type: "perspective", label: "Befreiung und Niederlage eingeordnet" },
      { type: "judgment", label: "«Stunde Null» geprüft" },
    ],
    reflection: "Was beginnt 1945 neu – und was wirkt aus der NS-Zeit fort?",
  },
  {
    id: "berlinkrise-17-juni",
    number: "AKTE 06",
    period: "1948–1953",
    title: "Blockade und Aufstand",
    subtitle: "Berlinkrise, Luftbrücke und 17. Juni",
    backgroundVideo: "/clips/06-berlinkrise-17-juni.mp4",
    problem: "Finde heraus: Wie wurden aus der Besatzungsstadt zwei gegensätzliche politische Stadthälften?",
    damagedClaim: "Die Luftbrücke löste die Berlinfrage; danach blieb die Lage bis zum Mauerbau ruhig.",
    disturbance: "Währungsstreit, Blockade, Staatsgründungen und der Aufstand vom 17. Juni 1953 wurden voneinander getrennt.",
    accent: "#6fa6c4",
    roles: {
      source: "Untersuche Versorgung während der Blockade oder eine Forderung der Protestierenden vom 17. Juni.",
      space: "Verbinde Luftkorridore, Flughäfen und die Stalinallee als politische Räume.",
      critic: "Trenne westalliierte Luftbrückenerzählung und ostdeutsche Deutung des Aufstands.",
    },
    resources: [
      {
        id: "m10",
        title: "Berlin-Blockade und Luftbrücke",
        kind: "Lokale MP4-Filmressource",
        href: "/films/06b-berlin-blockade-rosinenbomber.mp4",
        duration: "vollständige lokale Filmdatei",
        viewingFocus: "Suche eine Einstellung, die zeigt, wie Waren nach West-Berlin gelangen, und achte auf die Sprache der Wochenschau.",
        taskSteps: ["Stoppe bei Flugzeug, Flugplatz oder Ladung.", "Notiere, was transportiert wird.", "Sichere den Timecode."],
        signalWords: ["flugzeug", "flugplatz", "ladung", "kohle", "lebensmittel", "versorgung", "blockade", "luftbrücke", "west"],
        successFeedback: "Du hast die Versorgung West-Berlins während der Blockade konkret erklärt.",
        researchQuestion: "Welche zwei Güter wurden mit der Luftbrücke nach West-Berlin gebracht, und wie gelangten sie in die Stadt?",
        evidencePrompt: "Transportiert wurden … und … Sie gelangten mit … nach West-Berlin. Bei 01:10 zeigt oder sagt der Film …",
        excerpt: "Blockade und Luftbrücke machen Versorgung, Korridore und politische Risiken räumlich sichtbar.",
        prompt: "Wie funktionierte die Versorgung aus der Luft?",
      },
      {
        id: "m11",
        title: "Berlin 1953: Der 17. Juni",
        kind: "Eigene Filmsequenz · wird ergänzt",
        href: archiveFilm("/films/06a-steine-gegen-panzer.mp4"),
        duration: "kurze Filmsequenz",
        viewingFocus: "Achte auf den Ausgangspunkt der Proteste und die Forderungen der Demonstrierenden.",
        taskSteps: ["Film ansehen.", "Eine Forderung benennen.", "Timecode sichern."],
        signalWords: ["norm", "arbeiter", "streik", "demonstration", "regierung", "wahl", "freiheit", "sowjet", "panzer", "stalin"],
        successFeedback: "Du hast eine konkrete Forderung des Aufstands vom 17. Juni identifiziert.",
        researchQuestion: "Mit welcher konkreten Forderung weitete sich der Arbeiterprotest am 17. Juni 1953 zum politischen Aufstand aus?",
        evidencePrompt: "Die konkrete Forderung lautete … Bei 00:… zeigt oder erklärt der Film …",
        excerpt: "Aus Protesten gegen höhere Arbeitsnormen entsteht ein Aufstand mit politischen Forderungen.",
        prompt: "Welche Forderung ging über die Arbeitsnormen hinaus?",
      },
    ],
    map: {
      title: "Versorgung und Protest im geteilten Berlin",
      type: "image",
      src: "/maps/besatzungssektoren.svg",
      source: "Schematische Lernkarte der Sektoren",
      places: [
        { id: "tempelhof", label: "Flughafen Tempelhof", x: 51, y: 72, clue: "Luftbrücke" },
        { id: "tegel", label: "Flughafen Tegel", x: 28, y: 27, clue: "Luftbrücke" },
        { id: "stalinallee", label: "Stalinallee", x: 72, y: 48, clue: "Ausgangspunkt des Arbeiterprotests" },
      ],
      task: "Verbinde zwei Versorgungsorte mit einem Protestort. Jeder Ort erhält genau eine Funktion.",
    },
    claims: ["Blockade macht Versorgung zum politischen Konflikt.", "Der 17. Juni beginnt als Arbeitsprotest und wird politisch.", "Die Teilung verfestigt sich zwischen 1948 und 1953."],
    redHerrings: ["Die Luftbrücke versorgte ganz Berlin.", "Der 17. Juni richtete sich ausschließlich gegen Arbeitsnormen."],
    requirements: [
      { type: "source", label: "Versorgung oder politische Forderung" },
      { type: "map", label: "Luftkorridore und Protestort" },
      { type: "perspective", label: "Ost-/Westerzählung getrennt" },
      { type: "judgment", label: "Krise und Aufstand verbunden" },
    ],
    reflection: "Wann wird ein Versorgungsproblem politisch – und wann wird ein Arbeitsprotest zum Aufstand?",
  },
  {
    id: "frontstadt",
    number: "AKTE 07",
    period: "1961–1989",
    title: "Frontstadt",
    subtitle: "Mauer und Alltag in der geteilten Stadt",
    backgroundVideo: "/clips/07-mauer-geteilte-stadt.mp4",
    problem: "Finde heraus: Aus welchen Teilen bestand die Berliner Grenzanlage?",
    damagedClaim:
      "Die Mauer war eine Linie zwischen Ost und West. Sie teilte Berlin von 1961 bis 1989 und wurde am 9. November geöffnet.",
    disturbance:
      "Das Archiv hat gestaffelte Grenzanlagen, Flucht, Kontrolle und Alltag auf eine einzelne Betonlinie reduziert.",
    accent: "#58b8d8",
    roles: {
      source:
        "Finde im kurzen Film drei konkrete Bestandteile der Grenzanlage und notiere sie mit einem Timecode.",
      space:
        "Arbeite mit Grenzring, Übergängen und wiederkehrenden Orten. Erkläre, warum die Mauer keine einfache Linie war.",
      critic:
        "Prüfe Ost-/West-Erzählungen über Schutz und Freiheit. Welche Alltagsperspektive fehlt?",
    },
    resources: [
      {
        id: "m12",
        title: "Die Berliner Mauer",
        kind: "Terra X OER · Film",
        href: archiveFilm("/films/07a-bau-der-mauer.mp4"),
        duration: "lokale Filmsequenz",
        viewingFocus: "Zähle im kurzen Film mindestens drei verschiedene Teile der Grenzanlage.",
        taskSteps: [
          "Pausiere die Animation der Grenzanlage.",
          "Notiere den Timecode und mindestens drei sichtbare oder genannte Bestandteile.",
          "Erkläre in einem Satz, warum die Bezeichnung „eine Mauer“ dadurch ungenau ist.",
        ],
        signalWords: ["stacheldraht", "stolperdraht", "wachturm", "hund", "todesstreifen", "beton", "grenze", "mauer", "hochsicherheitszone", "schuss"],
        successFeedback: "Du hast mehrere Bestandteile des Grenzsystems erkannt. Damit kannst du die vereinfachte Vorstellung einer einzelnen Betonlinie konkret widerlegen.",
        researchQuestion: "Welche drei Bestandteile der Grenzanlage nennt oder zeigt der kurze Film zusätzlich zur Betonmauer?",
        evidencePrompt: "Die drei Bestandteile sind …, … und … Bei 00:45 zeigt oder nennt der Film …",
        excerpt:
          "Die Mauer ist ein gestaffeltes Grenzsystem, das Abwanderung stoppen und die DDR stabilisieren soll.",
        prompt: "Welche mindestens drei Bestandteile im Film widerlegen die Vorstellung einer einzelnen Mauerlinie?",
      },
    ],
    map: {
      title: "Mauer, Grenze und Orte",
      type: "image",
      src: "/maps/berlin-wall-1961-1989.jpg",
      source: "berlinwallmap.info · moderne Übersicht",
      sourceHref: "https://berlinwallmap.info/free-map",
      places: [
        { id: "bornholmer", label: "Bornholmer Strasse", x: 55, y: 43, clue: "Grenzübergang" },
        { id: "bernauer", label: "Bernauer Strasse", x: 51, y: 48, clue: "Alltag, Flucht, Erinnerung" },
        { id: "charlie", label: "Checkpoint Charlie", x: 54, y: 57, clue: "Systemkonfrontation" },
      ],
      task:
        "Zoome vom Grenzring zu drei Mikroorten. Verknüpfe jeden mit einer anderen Dimension: Alltag, Politik, Erinnerung.",
    },
    claims: [
      "Teilung besteht aus baulichen, politischen und biografischen Räumen.",
      "Grenzanlagen verändern sich über die Zeit und wirken bis in den Alltag.",
      "Architektur wird in Ost und West zum Zukunftsversprechen.",
    ],
    redHerrings: ["Die Mauer verlief nur durch das Zentrum.", "Jede Ost-/West-Architektur lässt sich eindeutig als Propaganda lesen."],
    requirements: [
      { type: "source", label: "drei Bestandteile der Grenzanlage" },
      { type: "map", label: "Grenzring und drei Mikroorte" },
      { type: "perspective", label: "Systemerzählung gegengeprüft" },
      { type: "judgment", label: "Teilung mehrdimensional erklärt" },
    ],
    reflection: "Wie verändert sich Teilung, wenn wir sie vom Grenzstreifen in Wohnungen und Familien verfolgen?",
  },
  {
    id: "nach-der-linie",
    number: "AKTE 08",
    period: "1989–1990",
    title: "Nach der Linie",
    subtitle: "Mauerfall und Wiedervereinigung",
    backgroundVideo: "/clips/08-mauerfall-wiedervereinigung.mp4",
    problem: "Finde heraus: Was geschah an der Bornholmer Strasse, bevor der Übergang geöffnet wurde?",
    damagedClaim:
      "Ein Fehler Günter Schabowskis öffnete am 9. November 1989 die Mauer. Seitdem ist Berlin wiedervereinigt.",
    disturbance:
      "Ein komplexes Informations- und Handlungsnetz wurde auf einen Mann reduziert; Erinnerung, Ungleichheit und Nachwenderäume fehlen.",
    accent: "#7fce8a",
    roles: {
      source:
        "Finde im Film eine Handlung der wartenden Menge und die direkte Reaktion der Grenzer darauf.",
      space:
        "Verfolge Bornholmer Strasse, Brandenburger Tor und Regierungsviertel zwischen Grenzöffnung und Einheit.",
      critic:
        "Prüfe die Formel «Fehler eines Mannes» und die Behauptung, Teilung sei 1989 beendet. Sichere eine generationelle Gegenperspektive.",
    },
    resources: [
      {
        id: "m14",
        title: "Mauerfall",
        kind: "Lokale Filmsequenz",
        href: archiveFilm("/films/08a-deutsche-wiedervereinigung.mp4"),
        duration: "lokale Filmsequenz",
        viewingFocus: "Beobachte genau, was Menschenmenge und Grenzer an der Bornholmer Strasse tatsächlich tun.",
        taskSteps: [
          "Stoppe bei einer Szene, in der die Menge ruft, wartet, diskutiert oder Druck aufbaut.",
          "Notiere Timecode, einen hörbaren Ruf und eine sichtbare Handlung.",
          "Suche den Moment, in dem Grenzer reagieren oder den Übergang öffnen, und beschreibe die Veränderung.",
        ],
        signalWords: ["tor", "aufmachen", "menge", "menschen", "grenz", "schlagbaum", "rufen", "warten", "diskutieren", "öffnen", "bornholmer"],
        successFeedback: "Dein Beleg zeigt handelnde Menschen und reagierende Grenzer. Der Mauerfall erscheint damit als Prozess vor Ort – nicht als automatische Folge eines einzigen Satzes.",
        researchQuestion: "Was tat die Menschenmenge an der Bornholmer Strasse – und wie reagierten die Grenzer unmittelbar darauf?",
        evidencePrompt: "Die Menge … Darauf reagierten die Grenzer mit … Bei 18:30 ist zu sehen oder zu hören …",
        excerpt:
          "Staatskrise, Reiseregelung, Pressekonferenz, Medien, Menschenmenge und Entscheidungen der Grenzer bilden eine Ereigniskette.",
        prompt: "Welche beobachtbaren Handlungen der Menge und der Grenzer widerlegen die Behauptung, ein einzelner Satz habe die Mauer automatisch geöffnet?",
      },
    ],
    map: {
      title: "Berlin im Übergang 1990",
      type: "embed",
      src: "https://www.berliner-stadtplansammlung.de/index.php/karten/1990-berlin-mit-umgebungskarte",
      source: "Berliner Stadtplansammlung · 1990",
      sourceHref: "https://www.berliner-stadtplansammlung.de/index.php/karten/1990-berlin-mit-umgebungskarte",
      places: [
        { id: "bornholmer", label: "Bornholmer Strasse", x: 51, y: 36, clue: "Ereignisort" },
        { id: "bernauer", label: "Bernauer Strasse", x: 46, y: 45, clue: "Erinnerungs- und Alltagsort" },
        { id: "brandenburg", label: "Brandenburger Tor", x: 49, y: 57, clue: "nationales Symbol" },
      ],
      task:
        "Vergleiche Ereignisort, Erinnerungsort und Symbolort. Lege offen, was eine Gegenwartskarte nicht über 1989 zeigt.",
    },
    claims: [
      "Der Mauerfall entsteht aus einer Kette von Krise, Kommunikation und Handlungen.",
      "Politische Einheit beendet biografische und soziale Teilung nicht sofort.",
      "Erinnerungsorte verbinden historische Spur, Nutzung und Auslassung.",
    ],
    redHerrings: ["Schabowski allein verursachte den Mauerfall.", "Eine verschwundene Grenze beendet jede Teilung."],
    requirements: [
      { type: "source", label: "mehrgliedrige Ereigniskette" },
      { type: "map", label: "Ereignis-/Erinnerungs-/Symbolort" },
      { type: "perspective", label: "Generationenperspektive" },
      { type: "judgment", label: "Ende der Teilung differenziert" },
    ],
    reflection: "Welche Teilungen bleiben sichtbar, obwohl die Grenzanlage verschwunden ist?",
  },
  {
    id: "hauptstadt-gentrifizierung",
    number: "AKTE 09",
    period: "1991–2040",
    title: "Hauptstadt im Wandel",
    subtitle: "Regierungsumzug, Wachstum und Gentrifizierung",
    backgroundVideo: "/clips/09-hauptstadt-gentrifizierung.mp4",
    problem: "Finde heraus: Wer gewinnt und wer verliert, wenn Berlin Hauptstadt und Investitionsort wird?",
    damagedClaim: "Mit dem Hauptstadtbeschluss beginnt Berlins Erfolgsgeschichte: neue Arbeitsplätze, sanierte Viertel und steigende Attraktivität nützen allen.",
    disturbance: "Verdrängung, steigende Mieten, ungleiche Teilhabe und migrantische Nachwendeerfahrungen wurden aus der Wachstumsakte entfernt.",
    accent: "#d092a8",
    roles: {
      source: "Finde im Film eine konkrete Folge des Hauptstadt- oder Aufwertungsprozesses für eine Person oder Gruppe.",
      space: "Vergleiche Regierungsviertel, innerstädtisches Sanierungsgebiet und einen Verdrängungsraum zwischen 1992 und Gegenwart.",
      critic: "Prüfe die Wörter «Aufwertung» und «Erfolg». Benenne Gewinner, Verlierer und eine fehlende Perspektive.",
    },
    resources: [
      {
        id: "m15",
        title: "Die Wendezeit aus Sicht vietnamesischer Gastarbeiter",
        kind: "Panorama 3 · NDR · lokale Webkopie",
        href: "/films/09b-wendezeit-vietnamesische-gastarbeiter.m4v",
        duration: "vollständige lokale Webkopie",
        viewingFocus: "Achte auf Erfahrungen vietnamesischer Vertragsarbeiterinnen und Vertragsarbeiter nach 1989.",
        taskSteps: ["Film ansehen.", "Eine konkrete Unsicherheit benennen.", "Timecode sichern."],
        signalWords: ["hoffnung", "einheit", "unsicherheit", "angst", "rassismus", "ausgrenzung", "vietnames", "bleiben", "arbeit", "alltag"],
        successFeedback: "Du hast eine konkrete Nachwendeerfahrung sichtbar gemacht, die in einer reinen Hauptstadt-Erfolgsgeschichte fehlt.",
        researchQuestion: "Welche konkrete Unsicherheit erlebten vietnamesische Vertragsarbeiterinnen und Vertragsarbeiter nach 1989?",
        evidencePrompt: "Nach 1989 bestand die Unsicherheit darin, dass … Bei 09:25 erzählt oder zeigt der Film …",
        excerpt: "Politische Einheit garantiert nicht automatisch soziale Sicherheit und Zugehörigkeit.",
        prompt: "Welche konkrete Unsicherheit wird im Film beschrieben?",
      },
      {
        id: "m16",
        title: "Berlin wird Hauptstadt – und teurer",
        kind: "Eigene Filmsequenz · wird ergänzt",
        href: archiveFilm("/films/09a-berlin-wird-hauptstadt.mp4"),
        duration: "kurze Filmsequenz",
        viewingFocus: "Achte auf Regierungsumzug, Investitionen, Sanierung, Mietsteigerung und Verdrängung.",
        taskSteps: ["Film ansehen.", "Eine Ursache und eine Folge der Gentrifizierung benennen.", "Timecode sichern."],
        signalWords: ["hauptstadt", "regierung", "bundestag", "sanierung", "miete", "verdrängung", "investition", "aufwertung", "wohnung", "kiez"],
        successFeedback: "Du hast Hauptstadtfunktion und Gentrifizierung über eine konkrete Ursache-Folge-Beziehung verbunden.",
        researchQuestion: "Welche konkrete Veränderung machte einen Berliner Kiez attraktiver – und welche Folge hatte das für bisherige Bewohnerinnen und Bewohner?",
        evidencePrompt: "Attraktiver wurde der Kiez durch … Für bisherige Bewohnerinnen und Bewohner führte das zu … Bei 00:… zeigt der Film …",
        excerpt: "Hauptstadtfunktion, Investitionen und Sanierung verändern Räume; steigende Boden- und Mietpreise verteilen die Vorteile ungleich.",
        prompt: "Welche Ursache und welche soziale Folge der Aufwertung nennt der Film?",
      },
    ],
    map: {
      title: "Berlin als Hauptstadt und Investitionsraum",
      type: "embed",
      src: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
      source: "uMap / OpenStreetMap · Berlin 2026",
      sourceHref: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
      alternatives: [
        {
          label: "1992",
          title: "Grosser Stadtplan Berlin 1992",
          src: "https://www.berliner-stadtplansammlung.de/index.php/karten/1992-grosser-stadtplan-berlin",
          source: "Berliner Stadtplansammlung · 1992",
          sourceHref: "https://www.berliner-stadtplansammlung.de/index.php/karten/1992-grosser-stadtplan-berlin",
        },
        {
          label: "1995",
          title: "Übersichtskarte Berlin 1995",
          src: "https://www.berliner-stadtplansammlung.de/index.php/karten/1995-uebersichtskarte-berlin",
          source: "Berliner Stadtplansammlung · 1995",
          sourceHref: "https://www.berliner-stadtplansammlung.de/index.php/karten/1995-uebersichtskarte-berlin",
        },
        {
          label: "2026",
          title: "Berlin 2026",
          src: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
          source: "uMap / OpenStreetMap · 2026",
          sourceHref: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
        },
      ],
      places: [
        { id: "regierungsviertel", label: "Regierungsviertel", x: 48, y: 53, clue: "Hauptstadtfunktion" },
        { id: "prenzlauerberg", label: "Prenzlauer Berg", x: 57, y: 38, clue: "Sanierung und Verdrängung" },
        { id: "kreuzberg", label: "Kreuzberg", x: 55, y: 63, clue: "Aufwertung und Protest" },
      ],
      task: "Vergleiche einen politischen Investitionsort mit zwei Wohnquartieren. Notiere pro Ort genau eine Veränderung.",
    },
    claims: ["Der Hauptstadtbeschluss verändert Investitionen und Stadträume.", "Gentrifizierung verbindet Aufwertung mit Verdrängungsrisiken.", "Politische Einheit und soziale Zugehörigkeit entwickeln sich ungleich."],
    redHerrings: ["Steigende Immobilienwerte nützen automatisch allen Bewohnerinnen und Bewohnern.", "Gentrifizierung bedeutet nur schönere Häuser."],
    requirements: [
      { type: "source", label: "eine Ursache-Folge-Beziehung" },
      { type: "map", label: "Regierungs- und Wohnräume verglichen" },
      { type: "perspective", label: "Gewinner und Verlierer benannt" },
      { type: "judgment", label: "Aufwertung differenziert beurteilt" },
    ],
    reflection: "Wann wird die Aufwertung eines Viertels für seine Bewohnerinnen und Bewohner zum Verlust?",
  },
];

export const finalPrompt =
  "Welche drei Orte erzählen die Geschichte Berlins besonders gut – und welche Geschichte würde verloren gehen, wenn man Berlin nur anhand dieser drei Orte darstellt?";
