# Berlin-Akte 2040

Ein kooperatives historisches Ermittlungs- und Kartenspiel für 2–3 Lernende ab der Sekundarstufe II. Die Gruppe untersucht Berlin in neun Stationen, prüft widersprüchliche Quellen und baut ein gemeinsames digitales Museum.

## Was spielbar ist

- neun Missionen vom Kaiserreich bis zu Hauptstadtwerdung und Gentrifizierung
- Rollen **Quelle**, **Raum** und bei drei Personen **Kritik**
- Einzelspieler-, Einzelgerät-, Demo- und Mehrgeräte-Modus
- Einzelspieler-Fortschritt wird automatisch im Browser gespeichert
- gemeinsame Räume mit kurzem Raumcode
- Beweisboard, Urteile, Punkte und Rollenrotation
- Lehrpersonenansicht mit Beitrags- und Prozessübersicht
- zoombare lokale Karten sowie eingebettete interaktive Karten
- Filmstationen mit eingebetteten oder verlinkten Originalfilmen
- Fragen werden erst nach bestätigter Filmsichtung freigegeben; Belege benötigen Timecodes
- Abschlussraum „Museum der Lücken“
- responsive, tastaturbedienbare Oberfläche

## Lokal starten

Voraussetzungen: Node.js 22.13 oder neuer.

```bash
npm install
npm run dev
```

Die Anwendung läuft anschließend unter `http://localhost:3000`.

## Prüfen

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

## Kostenloses Hosting

Die Anwendung ist für **Cloudflare Workers + D1** vorbereitet. Damit laufen sowohl die Website als auch die Mehrspieler-Räume ohne eigenen Server. Für kleine Lerngruppen reicht der kostenlose Tarif typischerweise aus:

- Workers Free: 100.000 Requests pro Tag
- D1 Free: 5 Millionen gelesene und 100.000 geschriebene Zeilen pro Tag
- D1 Free: bis 5 GB Gesamtspeicher
- statische Dateien: bis 25 MiB pro Datei

Konfiguration:

- `.openai/hosting.json` bindet die D1-Datenbank als `DB`.
- `db/schema.ts` enthält das Datenbankschema.
- `worker/index.ts` stellt die Raum-API bereit.

Die Räume verfallen nach zwölf Stunden. Die Clients fragen den Raumzustand alle drei Sekunden ab; reine Statusabfragen schreiben nicht in D1.

Dokumentation:

- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/d1/platform/pricing/
- https://developers.cloudflare.com/d1/platform/limits/

## Karten und Quellen

Die mitgelieferten historischen Karten dienen als Quellenmaterial im Unterricht. Herkunft, Lizenzhinweise und Einsatz sind in `data/maps.json` und `docs/` dokumentiert. Die verlinkten Karten der Berliner Stadtplansammlung sowie die aktuelle uMap werden im Spiel interaktiv eingebettet; falls ein Anbieter die Einbettung technisch sperrt, öffnet ein Link die Originalkarte.

Für eine Veröffentlichung außerhalb des Unterrichtskontexts müssen die jeweiligen Rechte- und Quellenangaben der Kartenanbieter erneut geprüft werden.
