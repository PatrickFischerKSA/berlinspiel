export type TimelineEra = "Anfänge" | "Residenz & Industrie" | "Demokratie & Diktatur" | "Geteilte Stadt" | "Vereinte Hauptstadt";

export type TimelineEvent = {
  year: string;
  sortYear: number;
  title: string;
  text: string;
  era: TimelineEra;
  missionId?: string;
  source: "Zeitreisen Berlin" | "Wikipedia";
};

export const timelineEras: TimelineEra[] = [
  "Anfänge",
  "Residenz & Industrie",
  "Demokratie & Diktatur",
  "Geteilte Stadt",
  "Vereinte Hauptstadt",
];

export const timelineEvents: TimelineEvent[] = [
  { year: "1237", sortYear: 1237, title: "Cölln erstmals erwähnt", text: "Eine Urkunde nennt Cölln; dieses Datum gilt traditionell als Ausgangspunkt der Berliner Stadtgeschichte.", era: "Anfänge", source: "Zeitreisen Berlin" },
  { year: "1244", sortYear: 1244, title: "Berlin erstmals erwähnt", text: "Sieben Jahre nach Cölln erscheint auch Berlin erstmals in einer erhaltenen Urkunde.", era: "Anfänge", source: "Zeitreisen Berlin" },
  { year: "1309", sortYear: 1309, title: "Städteunion Berlin–Cölln", text: "Die beiden Handelsstädte schließen sich politisch enger zusammen.", era: "Anfänge", source: "Wikipedia" },
  { year: "1432", sortYear: 1432, title: "Doppelstadt Berlin-Cölln", text: "Berlin und Cölln vereinigen ihre Verwaltungen zur Doppelstadt.", era: "Anfänge", source: "Wikipedia" },
  { year: "1486", sortYear: 1486, title: "Kurfürstliche Residenz", text: "Berlin-Cölln wird dauerhafte Residenz der brandenburgischen Kurfürsten.", era: "Anfänge", source: "Wikipedia" },
  { year: "1701", sortYear: 1701, title: "Königliche Residenzstadt", text: "Mit der Königskrönung Friedrichs I. wächst Berlins politische und repräsentative Bedeutung.", era: "Residenz & Industrie", source: "Zeitreisen Berlin" },
  { year: "1806", sortYear: 1806, title: "Französische Besetzung", text: "Napoleon zieht in Berlin ein; die Stadt bleibt bis 1808 französisch besetzt.", era: "Residenz & Industrie", source: "Wikipedia" },
  { year: "1848", sortYear: 1848, title: "Märzrevolution", text: "Barrikadenkämpfe und politische Forderungen machen Berlin zu einem Zentrum der Revolution.", era: "Residenz & Industrie", source: "Wikipedia" },
  { year: "1871", sortYear: 1871, title: "Reichshauptstadt", text: "Berlin wird Hauptstadt des Deutschen Kaiserreichs und wächst zur Industrie- und Verkehrsmetropole.", era: "Residenz & Industrie", missionId: "grossstadt", source: "Zeitreisen Berlin" },
  { year: "1918/19", sortYear: 1918, title: "Revolution und Republik", text: "Monarchie und Kaiserreich enden; Berlin wird Hauptstadt der Weimarer Republik.", era: "Demokratie & Diktatur", missionId: "goldlack", source: "Wikipedia" },
  { year: "1920", sortYear: 1920, title: "Groß-Berlin entsteht", text: "Das Groß-Berlin-Gesetz vereint Berlin mit umliegenden Städten, Gemeinden und Gutsbezirken.", era: "Demokratie & Diktatur", missionId: "goldlack", source: "Zeitreisen Berlin" },
  { year: "1933", sortYear: 1933, title: "NS-Diktatur", text: "Mit der nationalsozialistischen Machtübernahme beginnen Gleichschaltung, Verfolgung und Terror.", era: "Demokratie & Diktatur", missionId: "ende-weimar", source: "Zeitreisen Berlin" },
  { year: "1945", sortYear: 1945, title: "Kriegsende und Viermächte-Status", text: "Berlin ist schwer zerstört und wird in vier Besatzungssektoren aufgeteilt.", era: "Demokratie & Diktatur", missionId: "kriegsende-besatzung", source: "Wikipedia" },
  { year: "1948/49", sortYear: 1948, title: "Blockade und Luftbrücke", text: "Die Westsektoren werden blockiert und fast ein Jahr lang aus der Luft versorgt.", era: "Geteilte Stadt", missionId: "berlinkrise-17-juni", source: "Zeitreisen Berlin" },
  { year: "1953", sortYear: 1953, title: "Aufstand vom 17. Juni", text: "Proteste gegen Normerhöhungen weiten sich in Ost-Berlin und der DDR zum Aufstand aus.", era: "Geteilte Stadt", missionId: "berlinkrise-17-juni", source: "Zeitreisen Berlin" },
  { year: "1961", sortYear: 1961, title: "Bau der Berliner Mauer", text: "Am 13. August schließt die DDR die Grenze; Familien, Straßen und Verkehrswege werden getrennt.", era: "Geteilte Stadt", missionId: "frontstadt", source: "Zeitreisen Berlin" },
  { year: "1989", sortYear: 1989, title: "Mauerfall", text: "Am 9. November öffnen sich die Berliner Grenzübergänge unter dem Druck der Ereignisse und der wartenden Menschen.", era: "Geteilte Stadt", missionId: "nach-der-linie", source: "Zeitreisen Berlin" },
  { year: "1990", sortYear: 1990, title: "Wiedervereinigte Stadt", text: "Mit der deutschen Einheit wachsen Ost- und West-Berlin politisch wieder zusammen.", era: "Vereinte Hauptstadt", missionId: "nach-der-linie", source: "Wikipedia" },
  { year: "1991/99", sortYear: 1991, title: "Parlament und Regierung ziehen nach Berlin", text: "Der Bundestag beschließt 1991 den Umzug; seit 1999 arbeiten Parlament und Bundesregierung in Berlin.", era: "Vereinte Hauptstadt", missionId: "hauptstadt-gentrifizierung", source: "Wikipedia" },
];

export const timelineSources = {
  "Zeitreisen Berlin": "https://zeitreisen-berlin.de/specials/Zeitachse/index.html",
  Wikipedia: "https://de.wikipedia.org/wiki/Geschichte_Berlins",
} as const;
