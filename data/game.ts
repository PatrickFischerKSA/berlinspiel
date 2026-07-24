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
    excerpt: string;
    prompt: string;
  }[];
  map: {
    title: string;
    type: "image" | "embed";
    src: string;
    source: string;
    sourceHref?: string;
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

export const missions: Mission[] = [
  {
    id: "grossstadt",
    number: "AKTE 01",
    period: "1871–1918",
    title: "Metropole unter Hochdruck",
    subtitle: "Kaiserreich und Grossstadtwerdung",
    problem: "Wie wird Berlin zu einer modernen, aber sozial gespaltenen Metropole?",
    damagedClaim:
      "Berlin wächst dank Technik und Kaiserreich zu einer modernen Weltstadt. Der Fortschritt verbessert das Leben der gesamten Bevölkerung.",
    disturbance:
      "Die Archiv-KI hat den Prachtboulevard zur Gesamtstadt erklärt und Wohnungsnot, Arbeitswelt und Stadtrand aus der Akte gelöscht.",
    accent: "#dbaf6b",
    roles: {
      source:
        "Sichere zwei Belege, die Glanz und soziale Schattenseiten auseinanderhalten. Notiere, ob du Bildbeschreibung, Sprechertext oder Rückblick verwendest.",
      space:
        "Vergleiche die Pläne 1871, 1877 und 1912. Verfolge Tiergarten, Potsdamer Platz und das Wachstum jenseits des alten Zentrums.",
      critic:
        "Prüfe die Wörter «Fortschritt» und «gesamte Bevölkerung». Suche eine Auslassung, die das Urteil verändert.",
    },
    resources: [
      {
        id: "m02",
        title: "Berlin zur Kaiserzeit – Glanz und Schatten",
        kind: "Transkript · 17 Seiten",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Breite Strassen, imposante Häuser und eine unablässig treibende Menge stehen Mietskasernen, harter Arbeit und sozialer Trennung gegenüber.",
        prompt:
          "Welche Beobachtung belegt Modernität – und welche begrenzt ihre soziale Reichweite?",
      },
      {
        id: "m03-origin",
        title: "Ursprünge der Ringvereine",
        kind: "Transkriptpassage",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Industrialisierung und Zuzug lassen Berlin wachsen; viele Neuankömmlinge landen im Elend hastig errichteter Mietskasernen.",
        prompt: "Welche Kausalkette verbindet Wachstum, Ausgrenzung und Stadtstruktur?",
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
    problem: "War das Berlin der Zwanzigerjahre tatsächlich «golden»?",
    damagedClaim:
      "Berlin 1926: Eine wohlhabende Vergnügungsmetropole wird von kriminellen Vereinigungen bedroht. Die moderne Polizei stellt die Ordnung wieder her.",
    disturbance:
      "Drei Etiketten – GOLD, SÜNDE, ORDNUNG – wurden zu einer einfachen Erfolgsgeschichte verklebt.",
    accent: "#e56b50",
    roles: {
      source:
        "Bestimme Beginn, Dauer und soziale Reichweite der «goldenen» Phase. Sichere je einen Beleg für Dynamik und Begrenzung.",
      space:
        "Prüfe Wedding, Friedrichshain und westliche Bezirke im Pharus-Plan 1928. Markiere nur so genau, wie die Quelle es erlaubt.",
      critic:
        "Untersuche «Sündenpfuhl», «Spree-Chicago» und «Clans» als Deutungsrahmen. Trenne Beschreibung von Dramatisierung.",
    },
    resources: [
      {
        id: "m05",
        title: "Waren die 20er wirklich golden?",
        kind: "Terra X · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Stabilisierung, Innovation und kulturelle Dynamik sind real, aber kurz, sozial ungleich und von Krisen gerahmt.",
        prompt: "Für welche Zeit und welche Gruppen trägt die Metapher «golden»?",
      },
      {
        id: "m03",
        title: "Kriminelle Clans im Berlin der 20er",
        kind: "Terra X · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Ringvereine beginnen als Selbsthilfe ehemaliger Strafgefangener gegen den Kreislauf aus Haft, Arbeits- und Wohnungslosigkeit.",
        prompt: "Was unterschlägt das Etikett «kriminelle Clans»?",
      },
      {
        id: "m04",
        title: "5 Fakten: Sündenpfuhl Berlin",
        kind: "Kurzformat · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Nachtleben und moralische Entgrenzung stehen Armut gegenüber; Mordinspektion und Zentralkartei modernisieren die Polizei.",
        prompt: "Welche Aussage ist Beobachtung, welche reisserischer Rahmen?",
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
    id: "unter-der-oberflaeche",
    number: "AKTE 03",
    period: "1933–1945",
    title: "Unter der Oberfläche",
    subtitle: "Nationalsozialismus und Krieg",
    problem: "Wie schreiben sich Diktatur, Verfolgung und Krieg in eine Stadt ein?",
    damagedClaim:
      "Die NS-Herrschaft veränderte Berlin vor allem durch monumentale Bauten und die Zerstörung im Bombenkrieg.",
    disturbance:
      "Menschen, Zwang und Verfolgungswege wurden aus der Architekturakte entfernt; Propagandabilder erscheinen als neutrale Dokumentation.",
    accent: "#ae7de8",
    roles: {
      source:
        "Vergleiche eine Propagandastimme mit einer biografischen oder privaten Erfahrung. Kennzeichne Zeitpunkt und Zweck.",
      space:
        "Verknüpfe Herrschaftsarchitektur mit mindestens einem Alltags- oder Verfolgungsraum. Suche auch ein nie verwirklichtes Projekt.",
      critic:
        "Prüfe, was monumentale Ruinen zeigen – und was sie über Verfolgung gerade nicht zeigen können.",
    },
    resources: [
      {
        id: "m07",
        title: "Von Berlin nach Germania und zurück",
        kind: "SPIEGEL TV 2002 · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "NS-Architektur materialisiert Herrschaft und Propaganda; Erhaltung und Nachnutzung erzeugen Deutungskonflikte.",
        prompt: "Wie verändert die spätere Nachnutzung die Bedeutung eines Ortes?",
      },
      {
        id: "m08",
        title: "Ein Tag in Berlin 1943 – Der Passfälscher",
        kind: "Biografische Rekonstruktion · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Cioma Schönhaus bewegt sich mit falschen Papieren durch ein Netz aus Kontrolle, Verstecken, Hilfe und Widerstand.",
        prompt: "Welche Räume entstehen durch Verfolgung, obwohl sie auf einem Stadtplan unsichtbar bleiben?",
      },
      {
        id: "m09",
        title: "Berlin im fünften Kriegssommer",
        kind: "Wochenschau + Erinnerung · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Inszenierte Normalität und Durchhaltepropaganda stehen Bombenkrieg, Zwang, Erschöpfung und Gewalt gegenüber.",
        prompt: "Ordne zwei Aussagen nach Urheber, Zeitpunkt und Zweck.",
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
    id: "frontstadt",
    number: "AKTE 04",
    period: "1945–1989",
    title: "Frontstadt",
    subtitle: "Geteiltes Berlin und Kalter Krieg",
    problem: "Wie verändern Systemkonkurrenz, Grenze und Mauer Alltag und Stadtraum?",
    damagedClaim:
      "Die Mauer war eine Linie zwischen Ost und West. Sie teilte Berlin von 1961 bis 1989 und wurde am 9. November geöffnet.",
    disturbance:
      "Das Archiv hat Blockade, Aufstand, gestaffelte Grenzanlagen, Architekturkampf und Alltag auf eine rote Linie reduziert.",
    accent: "#58b8d8",
    roles: {
      source:
        "Sichere eine Ursache, eine Alltagserfahrung und eine Veränderung der Grenzanlage. Trenne Überblick und Zeitzeugnis.",
      space:
        "Arbeite mit Sektoren, Luftkorridoren, Grenzring und wiederkehrenden Orten. Erkläre, warum die Mauer keine einfache Linie war.",
      critic:
        "Prüfe Ost-/West-Erfolgserzählungen. Welche Perspektive fehlt bei Luftbrücke, Stalinallee oder Fernsehturm?",
    },
    resources: [
      {
        id: "m10",
        title: "Berlin-Blockade und Luftbrücke",
        kind: "Erklärvideo · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Blockade und Luftbrücke machen Korridore, Flugplätze, Versorgung und politische Risiken räumlich sichtbar.",
        prompt: "Warum ist die Karte für die Erklärung der Luftbrücke unverzichtbar?",
      },
      {
        id: "m11",
        title: "Der 17. Juni 1953",
        kind: "Erklärvideo · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Normerhöhungen, Versorgung und Repression führen vom Arbeitsprotest zu politischen Forderungen; sowjetische Gewalt beendet ihn.",
        prompt: "Wie wird aus einem Ort des Arbeitens ein Protest- und Erinnerungsraum?",
      },
      {
        id: "m12",
        title: "Die Berliner Mauer",
        kind: "Erklärvideo · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Die Mauer ist ein gestaffeltes Grenzsystem, das Abwanderung stoppen und die DDR stabilisieren soll.",
        prompt: "Welche Bestandteile widerlegen die Vorstellung einer einzelnen Mauerlinie?",
      },
      {
        id: "m13",
        title: "Krieg der Bauten",
        kind: "Dokumentation · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Fernsehturm, Stalinallee, Hansaviertel und Palast sind Wohnraum, Versprechen und Systemzeichen zugleich.",
        prompt: "Wo wird Architektur zum politischen Argument?",
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
      "Teilung besteht aus politischen, logistischen, baulichen und biografischen Räumen.",
      "Grenzanlagen verändern sich über die Zeit und wirken bis in den Alltag.",
      "Architektur wird in Ost und West zum Zukunftsversprechen.",
    ],
    redHerrings: ["Die Mauer verlief nur durch das Zentrum.", "Jede Ost-/West-Architektur lässt sich eindeutig als Propaganda lesen."],
    requirements: [
      { type: "source", label: "Ursache + Alltag + Veränderung" },
      { type: "map", label: "Grenzring und drei Mikroorte" },
      { type: "perspective", label: "Systemerzählung gegengeprüft" },
      { type: "judgment", label: "Teilung mehrdimensional erklärt" },
    ],
    reflection: "Wie verändert sich Teilung, wenn wir sie vom Grenzstreifen in Wohnungen und Familien verfolgen?",
  },
  {
    id: "nach-der-linie",
    number: "AKTE 05",
    period: "1989–2040",
    title: "Nach der Linie",
    subtitle: "Mauerfall, Wiedervereinigung und Gegenwart",
    problem: "Wann endet die Teilung einer Stadt wirklich?",
    damagedClaim:
      "Ein Fehler Günter Schabowskis öffnete am 9. November 1989 die Mauer. Seitdem ist Berlin wiedervereinigt.",
    disturbance:
      "Ein komplexes Informations- und Handlungsnetz wurde auf einen Mann reduziert; Erinnerung, Ungleichheit und Nachwenderäume fehlen.",
    accent: "#7fce8a",
    roles: {
      source:
        "Rekonstruiere die Ereigniskette des 9. November. Unterscheide Kontext, Kommunikation, Medien und Entscheidungen vor Ort.",
      space:
        "Vergleiche 1990, 1992/93, 1995 und die Gegenwart. Verfolge Bernauer Strasse und Bornholmer Strasse.",
      critic:
        "Prüfe die Formel «Fehler eines Mannes» und die Behauptung, Teilung sei 1989 beendet. Sichere eine generationelle Gegenperspektive.",
    },
    resources: [
      {
        id: "m14",
        title: "Mauerfall in 24 Stunden",
        kind: "Erklärvideo · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Staatskrise, Reiseregelung, Pressekonferenz, Medien, Menschenmenge und Entscheidungen der Grenzer bilden eine Ereigniskette.",
        prompt: "Welche Knoten des Netzes fehlen in der Ein-Mann-Erzählung?",
      },
      {
        id: "m15",
        title: "Seit dem Mauerfall",
        kind: "Generationen-Dokumentation · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "An der Bernauer Strasse liegen Familiengeschichte, Gedenkort, Tourismus und normaler Alltag übereinander.",
        prompt: "Wann ist ein historischer Ort zugleich Erinnerung und gewöhnlicher Lebensraum?",
      },
      {
        id: "m01",
        title: "Zeitreise Heimat Berlin",
        kind: "Terra X · Transkript",
        href: "https://planes-sit-wl6.craft.me/Xp6zj0gEIJRZ1w",
        excerpt:
          "Berlin erfindet sich wiederholt neu; Veränderung wird selbst zur Tradition und Heimat bleibt widersprüchlich.",
        prompt: "Welche Kontinuität verbindet die fünf Akten?",
      },
    ],
    map: {
      title: "Berlin 1990–2026",
      type: "embed",
      src: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
      source: "uMap / OpenStreetMap · Berlin 2026",
      sourceHref: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
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
];

export const finalPrompt =
  "Welche drei Orte erzählen die Geschichte Berlins besonders gut – und welche Geschichte würde verloren gehen, wenn man Berlin nur anhand dieser drei Orte darstellt?";
