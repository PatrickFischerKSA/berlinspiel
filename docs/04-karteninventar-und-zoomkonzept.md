# Karteninventar und verbindliches Zoomkonzept

Stand: 24. Juli 2026.

## Leitentscheidung

**Jede Karte wird innerhalb der Anwendung zoombar angeboten.** Eine statische
Vorschau mit einem externen Link erfüllt die Anforderung nicht. Externe Karten
bekommen zusätzlich einen klaren Link „Originalquelle öffnen“, bleiben aber auch
im Spiel bedienbar.

Die Metadaten stehen maschinenlesbar in
[`assets/maps/maps.json`](../assets/maps/maps.json). Die sechs übergebenen
Originaldateien wurden unverändert unter `assets/maps/original/` gesichert.

## 1. Lokale Karten

| ID | Karte | Format/Auflösung | Epochenraum | Status |
|---|---|---:|---|---|
| K01 | Sineck, Grundriss von Berlin 1871 | JPEG, 1229×1024 | Kaiserreich | technisch nutzbar; Rechte/Herkunft ergänzen |
| K02 | Baedeker Stadtplan Berlin 1877 | JPEG, 4461×3174 | Kaiserreich | sehr gut für Deep Zoom; Rechte/Herkunft ergänzen |
| K03 | Pharus-Plan Berlin 1912 | JPEG, 14592×10924 | Kaiserreich | ausgezeichnet für Deep Zoom; 52,7 MB, deshalb Kacheln nötig |
| K04 | Pharus-Plan Berlin, Grosse Ausgabe 1928 | JPEG, 7024×6274 | Weimar | Leitkarte des vertikalen Prototyps; Rechte/Herkunft ergänzen |
| K05 | Berlin: Zones of Occupation | JPEG, 2116×1598 | Kalter Krieg | sichtbares Alamy-Wasserzeichen; nicht öffentlich freigegeben |
| K06 | Die Berliner Mauer 1961–1989 | einseitiges A3-PDF | Kalter Krieg/Gegenwart | Quelle `berlinwallmap.info`; Nutzungshinweis für privat/schulisch sichtbar, Webrechte noch prüfen |

### Didaktische Eignung

- K01–K03 zeigen Stadtwachstum, Verdichtung, Verkehrsachsen und sich
  verändernde Stadtränder. Sie dürfen nicht einfach als austauschbare
  Hintergrundbilder erscheinen, sondern werden über eine Vergleichslupe und
  wiederkehrende Orte verbunden.
- K04 macht die Weimar-Kartenhandlung real: Spielende müssen Aussagen zu
  Wedding, Friedrichshain, westlichen Bezirken und Vergnügungsräumen in einem
  Plan von 1928 prüfen. Wo das Quellenmaterial keine genaue Ortsangabe liefert,
  muss die Oberfläche „nicht lokalisierbar“ als fachlich gültige Antwort anbieten.
- K05 wäre für Sektoren, Blockadewege und spätere Grenzbildung geeignet, darf
  wegen Wasserzeichen/Rechtestatus vorerst nur als interner Platzhalter gelten.
- K06 zeigt Mauerverlauf und 24 markierte Orte, unter anderem Bornholmer
  Strasse, Gedenkstätte Berliner Mauer, Checkpoint Charlie, East Side Gallery
  und Topographie des Terrors. Der Plan ist eine moderne Übersichtskarte und
  keine zeitgenössische Karte von 1961.

## 2. Verlinkte zoombare Karten

### K07 – Pharus-Plan Berlin 1940

[Originalquelle](https://www.berliner-stadtplansammlung.de/index.php/karten/1940-pharus-plan-berlin)

- Leaflet-Kachelviewer mit Zoom und Vollbild bestätigt.
- Massstab 1:25.000, Farblithographie, Blatt 92×61 cm.
- Die Quellenseite weist ausdrücklich darauf hin, dass Industriegebiete und
  Versorgungsstrukturen vermutlich aufgrund der Freigabebedingungen nicht
  dargestellt wurden.
- Didaktisch besonders wertvoll: Kartenlücken werden selbst zum Quellenproblem.

### K08 – Falk Plan Berlin mit Umgebungskarte 1990

[Originalquelle](https://www.berliner-stadtplansammlung.de/index.php/karten/1990-berlin-mit-umgebungskarte)

- Leaflet-Kachelviewer mit Zoom und Vollbild bestätigt.
- Gleitender Massstab ungefähr 1:25.000 bis 1:35.000; die Aussenbereiche sind
  kleiner dargestellt als die Blattmitte.
- Diese Verzerrung muss im Spiel erklärt werden, damit Distanzen nicht
  unkritisch aus dem Plan abgelesen werden.

### K09 – Grosser Stadtplan Berlin 1992/93

[Originalquelle](https://www.berliner-stadtplansammlung.de/index.php/karten/1992-grosser-stadtplan-berlin)

- Leaflet-Kachelviewer mit Zoom und Vollbild bestätigt.
- Massstab 1:30.000.
- Neubearbeitung eines Gesamtberlin-Plans; grafische Kontinuitäten zur
  DDR-Kartografie von 1988 werden auf der Quellenseite beschrieben.
- Eignet sich zum Prüfen, ob politische Vereinigung sofort eine vollständig
  neue kartografische Darstellung hervorbringt.

### K10 – Übersichtskarte Berlin 1995

[Originalquelle](https://www.berliner-stadtplansammlung.de/index.php/karten/1995-uebersichtskarte-berlin)

- Leaflet-Kachelviewer mit Zoom und Vollbild bestätigt.
- Massstab 1:50.000; Herausgeber laut Quellenseite: Senator für Bau- und
  Wohnungswesen.
- Eignet sich für Veränderungen und Grossprojekte der Nachwendezeit.

### K11 – Berlin 2026 (uMap)

[Interaktive Karte](https://umap.openstreetmap.fr/en/map/berlin-2026_1394963#14/52.496551/13.377571)

- Leaflet/uMap mit Zoom, Vollbild, Ebenen, Suche und OpenStreetMap-Hintergrund
  bestätigt.
- Sichtbare Ebenen umfassen derzeit französisch benannte Tages-/Planungsebenen
  und Orte. Es handelt sich daher eher um eine gegenwärtige Arbeits-/Reisekarte
  als um eine neutrale Berlin-Grundkarte.
- Einbettung nur schreibgeschützt; ein anonymer Bearbeitungsmodus oder geheimer
  Editierlink darf nicht an Lernende ausgeliefert werden.
- OpenStreetMap-Attribution muss sichtbar bleiben.

## 3. Einbauprinzip

### Lokale, nicht georeferenzierte historische Pläne

OpenSeadragon oder eine gleichwertige Deep-Zoom-Komponente zeigt eine
Bildpyramide:

1. Original unverändert archivieren.
2. Derivat als DZI/IIIF- oder XYZ-Bildpyramide erzeugen.
3. Nur benötigte Kacheln laden, nicht das 52-MB-Original auf jedes Handy.
4. Pan, Mausrad-/Pinch-Zoom, Plus/Minus, Vollbild und „Ansicht zurücksetzen“.
5. Spielerische Marker und Verbindungen in einer separaten Vektorebene
   speichern, nie ins Kartenbild einbrennen.

### Georeferenzierte Ebenen

Nach Festlegung von Kontrollpunkten werden historische Raster in Web Mercator
oder als IIIF-Georeferenzierung bereitgestellt. MapLibre/Leaflet kann dann:

- historische Karte über einer modernen Grundkarte zeigen,
- Deckkraft per Tastatur und Schieberegler ändern,
- zwei Jahrgänge per Swipe-Lupe vergleichen,
- Orte und Bewegungen als GeoJSON darüberlegen.

Die Originalkarte bleibt zusätzlich in unverzerrter Deep-Zoom-Ansicht verfügbar,
weil Georeferenzierung historische Pläne verformen kann.

### Karten der Berliner Stadtplansammlung

Die Seiten verwenden bereits ein Leaflet-Kachelschema. Für die Anwendung gibt
es zwei zulässige Integrationswege:

1. vom Betreiber freigegebene direkte Kacheleinbindung in unseren Viewer,
2. eine vom Betreiber freigegebene eingebettete Viewer-URL.

Bis diese Erlaubnis und eine stabile Schnittstelle bestätigt sind, wird die
Quellseite in einem klar abgegrenzten, zoombaren Kartenfenster beziehungsweise
als sicherer externer Fallback geöffnet. Kachel-URLs werden nicht ungefragt
gespiegelt oder dauerhaft gespeichert.

### uMap

Verwendet wird die offizielle schreibgeschützte Einbettung aus „Share and
download“, nicht der Bearbeitungslink. Falls die Einbettung durch
Content-Security-Policy ausfällt, öffnet derselbe Kartenstand in einem neuen Tab;
der Spielfortschritt bleibt davon unabhängig.

## 4. Einheitliche Kartensteuerung

Jeder Kartenviewer bietet:

- Plus/Minus, Mausrad und Pinch-Zoom,
- Drag/Pan und Pfeiltasten,
- Vollbild,
- Reset auf Aufgabenansicht,
- Ebenenliste mit sichtbarem Jahr und Quelle,
- Deckkraftregler für überlagerte historische Karten,
- „Originalquelle öffnen“,
- Textalternative mit den für die Aufgabe relevanten Orten und Beziehungen,
- klaren Hinweis „historische Karte“, „moderne Rekonstruktion“ oder
  „Gegenwartskarte“.

Auf Handys wird versehentliches Seiten-Scrollen verhindert, sobald die Karte
gezielt aktiviert ist; ein gut sichtbarer Button gibt die Gesten wieder an die
Seite zurück.

## 5. Karten als Beweismittel

Eine Kartenaktion wird nur gespeichert, wenn sie enthält:

```text
Karte/Jahr
gewählte Ebene
Ort oder gezeichnete Beziehung
Begründung
verknüpfte Text-/Filmstelle
Unsicherheit oder Darstellungsgrenze
```

Damit ist Zoomen kein dekorativer Komfort: Aufgaben verlangen das Auffinden
kleiner Strassen, das Vergleichen von Jahrgängen oder das Erkennen bewusster
Auslassungen.

## 6. Offene Freigaben

Vor öffentlichem Deployment fehlen noch:

1. Herkunft und Lizenz von K01–K05,
2. öffentliche Webnutzung von K06,
3. Einbettungs-/Kachelerlaubnis der Berliner Stadtplansammlung,
4. schreibgeschützte offizielle uMap-Embed-URL und Freigabestatus der Karte,
5. Georeferenzierungs-Kontrollpunkte für K01–K04.

