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
    embedUrl?: string;
    duration: string;
    viewingFocus: string;
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
        kind: "Dokumentarfilm · Berlin Channel",
        href: "https://www.youtube.com/watch?v=QhPR6fa68EY",
        embedUrl: "https://www.youtube-nocookie.com/embed/QhPR6fa68EY",
        duration: "83 Min. · im Spiel mindestens zwei kontrastierende Stellen auswählen",
        viewingFocus: "Achte zuerst nur auf sichtbare Räume, Verkehr, Kleidung und Arbeit. Höre danach auf die Einordnung des Kommentars.",
        excerpt:
          "Breite Strassen, imposante Häuser und eine unablässig treibende Menge stehen Mietskasernen, harter Arbeit und sozialer Trennung gegenüber.",
        prompt:
          "Sichere zwei Filmstellen: Welche sichtbare Beobachtung belegt Modernität – und welche zweite Stelle begrenzt deren soziale Reichweite?",
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
        kind: "Terra X · Film",
        href: "https://www.youtube.com/watch?v=04dyomiLGQ0",
        embedUrl: "https://www.youtube-nocookie.com/embed/04dyomiLGQ0",
        duration: "ca. 20 Min. · Kapitelmarken im Film",
        viewingFocus: "Vergleiche die Abschnitte „Strahlende Aufbruchsstimmung“, „Goldene Freiheiten“ und „Das dunkle Ende“.",
        excerpt:
          "Stabilisierung, Innovation und kulturelle Dynamik sind real, aber kurz, sozial ungleich und von Krisen gerahmt.",
        prompt: "Nenne je einen Timecode für Aufbruch und Begrenzung. Für welche Zeit und welche Gruppen trägt die Metapher «golden»?",
      },
      {
        id: "m03",
        title: "Kriminelle Clans im Berlin der 20er",
        kind: "Terra X History · Film",
        href: "https://www.youtube.com/watch?v=BcXI3nXqSmY",
        embedUrl: "https://www.youtube-nocookie.com/embed/BcXI3nXqSmY",
        duration: "ca. 14 Min.",
        viewingFocus: "Notiere, wie der Film Entstehung, Selbsthilfe und spätere Kriminalisierung der Ringvereine miteinander verbindet.",
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
        id: "m08",
        title: "Ein Tag in Berlin 1943 – Der Passfälscher",
        kind: "Terra X History · ZDF-Film",
        href: "https://www.zdf.de/play/dokus/ein-tag-in-alle-folgen-100/ein-tag-in-berlin-1943-der-passfaelscher-cioma-schoenhaus-doku-100",
        duration: "45 Min. · Untertitel verfügbar",
        viewingFocus: "Verfolge Wohnorte, Kontrollen, Werkstatt, Helfernetzwerk und Identitätswechsel Cioma Schönhaus'.",
        excerpt:
          "Cioma Schönhaus bewegt sich mit falschen Papieren durch ein Netz aus Kontrolle, Verstecken, Hilfe und Widerstand.",
        prompt: "Welche zwei Filmstellen zeigen, dass Verfolgung ein Netz aus Kontrolle, Verstecken und Hilfe erzeugt, das auf einem normalen Stadtplan unsichtbar bleibt?",
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
        kind: "Historischer Film · LeMO",
        href: "https://www.hdg.de/lemo/bestand/medien/video-berlin-blockade-und-luftbruecke.html",
        duration: "Wochenschauausschnitte 1948/49",
        viewingFocus: "Achte auf Verkehrsmittel, Versorgungswege, wartende Menschen und die Perspektive der britisch-amerikanischen Wochenschau.",
        excerpt:
          "Blockade und Luftbrücke machen Korridore, Flugplätze, Versorgung und politische Risiken räumlich sichtbar.",
        prompt: "Welche sichtbaren Hinweise erklären Versorgung aus der Luft – und woran erkennst du die westalliierte Perspektive des Films?",
      },
      {
        id: "m12",
        title: "Die Berliner Mauer",
        kind: "Terra X OER · Film",
        href: "https://schule.zdf.de/video/die-berliner-mauer-creative-commons-100",
        embedUrl: "https://ngp.zdf.de/miniplayer/embed/?mediaID=SCMS_d17fd36e-df06-4928-bb31-fa5ff180f3e9",
        duration: "2 Min. · CC BY 4.0",
        viewingFocus: "Zähle die im Film gezeigten beziehungsweise genannten Bestandteile der ausgebauten Grenzanlage.",
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
        title: "Der 9. November 1989: Die Maueröffner",
        kind: "SPIEGEL-TV-Drehmaterial · bpb",
        href: "https://www.bpb.de/mediathek/video/297768/der-9-november-1989-die-maueroeffner/",
        duration: "29 Min. · unkommentiertes Drehmaterial",
        viewingFocus: "Beobachte Menschenmenge, Rufe, Verhandlungen und Handlungen der Grenzer an der Bornholmer Strasse.",
        excerpt:
          "Staatskrise, Reiseregelung, Pressekonferenz, Medien, Menschenmenge und Entscheidungen der Grenzer bilden eine Ereigniskette.",
        prompt: "Welche beobachtbaren Handlungen der Menge und der Grenzer widerlegen die Behauptung, ein einzelner Satz habe die Mauer automatisch geöffnet?",
      },
      {
        id: "m15",
        title: "Wir bleiben hier",
        kind: "Dokumentarfilm · bpb",
        href: "https://www.bpb.de/mediathek/video/310871/wir-bleiben-hier/",
        duration: "32 Min. · Nachwendezeit",
        viewingFocus: "Achte auf Hoffnungen nach 1989 und auf Erfahrungen, die in einer reinen Erfolgsgeschichte der Einheit fehlen.",
        excerpt:
          "An der Bernauer Strasse liegen Familiengeschichte, Gedenkort, Tourismus und normaler Alltag übereinander.",
        prompt: "Welche konkrete Filmszene zeigt, dass der Mauerfall nicht für alle Menschen sofort Zugehörigkeit und Sicherheit bedeutete?",
      },
    ],
    map: {
      title: "Berlin 1990–2026",
      type: "embed",
      src: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
      source: "uMap / OpenStreetMap · Berlin 2026",
      sourceHref: "https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571",
      alternatives: [
        {
          label: "1990",
          title: "Berlin mit Umgebungskarte 1990",
          src: "https://www.berliner-stadtplansammlung.de/index.php/karten/1990-berlin-mit-umgebungskarte",
          source: "Berliner Stadtplansammlung · 1990",
          sourceHref: "https://www.berliner-stadtplansammlung.de/index.php/karten/1990-berlin-mit-umgebungskarte",
        },
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
