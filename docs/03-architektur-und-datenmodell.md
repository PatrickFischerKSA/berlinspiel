# Architektur, Datenmodell und offene Fragen

## 1. Empfohlener schlanker Stack

Noch nicht implementieren, bis Filmzugänge und Kartenbasis geklärt sind.

Empfehlung für den vertikalen Prototyp:

- TypeScript für Client und Server,
- Vite mit leichtgewichtigen Web Components oder Preact für die Oberflächen,
- Cloudflare Worker als API,
- ein Durable Object pro Raum für autoritativen synchronen Zustand,
- WebSocket für Live-Ereignisse, HTTP-Endpunkte für Beitritt und Wiederaufnahme,
- D1 nur für längerfristige Spielstände, Inhaltsversionen und
  Lehrpersonen-Auswertungen,
- JSON/JSON-Schema oder validierte TypeScript-Datendateien für historische
  Inhalte,
- MapLibre GL JS oder Leaflet für georeferenzierte Raster-/GeoJSON-Ebenen,
- OpenSeadragon/IIIF-DZI für hochauflösende, noch nicht georeferenzierte
  historische Pläne,
- Vitest/Playwright für Logik, Rollenflüsse und barrierearme Kernpfade.

Diese Empfehlung übernimmt das bewährte Architekturprinzip aus
`heidi-game-export`, ohne dessen Inhalte oder konkrete Implementierung zu
vermischen.

## 2. Modulgrenzen

```text
clients/
  laptop/       gemeinsames Brett, Karte, Akte, Endurteil
  handset/      geheime Rolleninformation und Rollenaktionen
  teacher/      Prozessansicht und Eingriffe
  demo/         lokale Simulation aller Geräte
engine/
  session/      Raumcode, Beitritt, Reconnect, Rollenbelegung
  mission/      Phasen, Freischaltungen, Voraussetzungen
  evidence/     Belege, Übergaben, Anfechtungen
  scoring/      Rubriken und nachvollziehbare Rückmeldungen
  sync/         Ereignisse und autoritativer Raumzustand
content/
  resources/    Materialkatalog und Provenienz
  eras/         Akten/Missionen
  maps/         Ebenen, Orte, Georeferenzierung
```

Historische Inhalte dürfen keine Synchronisationslogik enthalten; die Engine
darf keine konkreten historischen Antworten fest einbauen.

## 3. Kern-Datenmodell

### Resource

```ts
type Resource = {
  id: string;
  title: string;
  kind: "video" | "transcript" | "map" | "image" | "audio";
  url: string;
  accessStatus: "verified" | "missing" | "restricted" | "unclear";
  creator?: string;
  publishedAt?: string;
  license?: string;
  transcriptResourceId?: string;
  provenanceNotes: string[];
};
```

### EvidenceExcerpt

```ts
type EvidenceExcerpt = {
  id: string;
  resourceId: string;
  locator:
    | { type: "time"; startSeconds: number; endSeconds: number }
    | { type: "pages"; from: number; to: number };
  paraphrase: string;
  quotation?: string;
  places: string[];
  actors: string[];
  perspective: string;
  reliabilityNotes: string[];
};
```

### EraRoom und Mission

```ts
type EraRoom = {
  id: string;
  order: number;
  title: string;
  period: { from?: number; to?: number };
  guidingProblem: string;
  recurringPlaceIds: string[];
  missionIds: string[];
};

type Mission = {
  id: string;
  eraRoomId: string;
  damagedClaim: string;
  phases: MissionPhase[];
  roleVariants: { teamSize: 2 | 3; roles: RoleAssignment[] }[];
  evidenceRequirements: EvidenceRequirement[];
  mapTaskId: string;
  judgmentTaskId: string;
  redHerrings: string[];
  assessmentRuleIds: string[];
};
```

### Rolle und Hinweis

```ts
type Role = {
  id: string;
  label: string;
  capabilities: string[];
};

type RoleAssignment = {
  roleId: string;
  privateBriefing: string;
  resourceIds: string[];
  hintIds: string[];
  requiredContributionTypes: string[];
};

type Hint = {
  id: string;
  audience: "role" | "team" | "teacher";
  reveal: { trigger: string; expiresAfterSeconds?: number };
  text: string;
  reliability: "verified" | "partial" | "contested";
};
```

### Karte und Ort

```ts
type Place = {
  id: string;
  canonicalName: string;
  alternateNames: { name: string; validFrom?: number; validTo?: number }[];
  geometry?: GeoJSON.Geometry;
  periods: { from?: number; to?: number; description: string }[];
  resourceIds: string[];
};

type MapLayer = {
  id: string;
  label: string;
  kind:
    | "base"
    | "raster-overlay"
    | "deep-zoom-raster"
    | "remote-leaflet"
    | "remote-umap"
    | "vector"
    | "annotation";
  sourceUrl?: string;
  sourcePageUrl?: string;
  localAssetPath?: string;
  viewer: "maplibre" | "leaflet" | "open-seadragon" | "iframe";
  year?: number;
  opacityDefault: number;
  zoom: {
    min: number;
    max: number;
    initial: number;
    fullscreen: boolean;
    keyboard: boolean;
    touch: boolean;
  };
  georeferencing?: {
    method: "geotiff" | "control-points" | "none";
    controlPoints?: unknown[];
  };
  license?: string;
  publicUse: boolean;
};

type MapTask = {
  id: string;
  availableLayerIds: string[];
  allowedOperations: ("place" | "connect" | "trace" | "compare" | "annotate")[];
  requiredRelations: string[];
  placeholderPolicy?: string;
};
```

### Aufgabe, Lösung und Bewertung

```ts
type Task = {
  id: string;
  kind: "evidence" | "perspective" | "map" | "causal-network" | "judgment";
  prompt: string;
  roleGate?: string[];
  completionRuleId: string;
};

type SolutionModel = {
  id: string;
  acceptableClaimPatterns: string[];
  requiredEvidenceExcerptIds: string[];
  requiredMapRelations: string[];
  requiredPerspectiveChecks: string[];
  forbiddenOverclaims: string[];
};

type AssessmentRule = {
  id: string;
  dimension:
    | "source-security"
    | "spatial-understanding"
    | "perspective-diversity"
    | "reconstruction-quality";
  levels: { level: 0 | 1 | 2 | 3; descriptor: string }[];
  evidenceFromEvents: string[];
};
```

### Teamfortschritt und Ereignisprotokoll

```ts
type TeamProgress = {
  roomCode: string;
  contentVersion: string;
  mode: "multi-device" | "desktop" | "demo";
  teamSize: 2 | 3;
  members: TeamMember[];
  currentEraRoomId: string;
  currentPhase: string;
  evidenceBoard: EvidenceCard[];
  mapState: unknown;
  draftJudgments: Revision[];
  dimensionLevels: Record<string, number>;
  lastEventSequence: number;
};

type GameEvent = {
  id: string;
  roomCode: string;
  sequence: number;
  actorId: string;
  deviceId: string;
  type: string;
  payload: unknown;
  occurredAt: string;
  contentVersion: string;
};
```

Der Raumzustand wird aus einem autoritativen Snapshot plus geordneten Ereignissen
wiederhergestellt. Ein Wiedereinstieg verwendet ein zufälliges, widerrufbares
Reconnect-Token pro Gerät, nicht bloss den leicht erratbaren Raumcode.

## 4. Synchronisationsvertrag

- Laptop erzeugt einen sechsstelligen, gut ablesbaren Raumcode.
- Handys treten mit Code und lokalem Anzeigenamen bei.
- Der Server vergibt Rolle und Capability-Token.
- Jede Änderung besitzt Ereignis-ID und erwartete Sequenznummer.
- Doppelte Ereignisse sind idempotent; Konflikte werden serverseitig geordnet.
- Bei Verbindungsabbruch puffert der Client nur sichere lokale Entwürfe.
- Nach Reconnect liefert der Server Snapshot plus Ereignisse seit der letzten
  bestätigten Sequenz.
- Geheime Hinweise werden nur an berechtigte Rollen gesendet und nie in den
  gemeinsamen Laptopzustand eingebettet.

## 5. Barrierearmut und Datenschutz als Architektur

- vollständige Tastaturbedienung und sichtbarer Fokus,
- keine Information nur über Farbe, Position, Ton oder Zeitdruck,
- Untertitel/Transkript immer parallel zum Film,
- reduzierte Bewegung und hohe Kontraste,
- zeitlich begrenzte Hinweise mit verlängerbarer/abschaltbarer Frist,
- Rollenwechsel ohne Verlust persönlicher Bedienungseinstellungen,
- Pseudonyme und minimale Protokollierung,
- Lehrpersonenexport mit Löschfrist und ohne unnötige Gerätekennungen.

## 6. Wirklich architekturrelevante offene Fragen

Diese Fragen sollten vor Etappe 3 beantwortet werden:

1. **Filmzugang und Rechte:** Wo liegen die 15 zugehörigen MP4-Dateien, dürfen
   sie gestreamt/geschnitten werden, und gibt es stabile URLs? Ohne Antwort
   bleibt die zentrale Quellenmechanik auf Transkripte beschränkt.
2. **Kartenrechte und Einbettung:** Die lokalen Dateien und fünf Webkarten sind
   technisch inventarisiert. Vor öffentlicher Nutzung fehlen jedoch
   Herkunft/Lizenzen, die Freigabe direkter Stadtplansammlungs-Kacheln und die
   offizielle schreibgeschützte uMap-Embed-URL.
3. **Betriebsmodell:** Darf Cloudflare Workers/Durable Objects/D1 genutzt
   werden, und in welcher Region müssen schulische Prozessdaten liegen?
4. **Identität:** Reichen Pseudonyme und Raumcode oder ist eine schulische
   Anmeldung erforderlich? Das verändert Datenschutz und Wiederaufnahme.
5. **Lehrpersoneneingriffe:** Darf die Lehrperson Hinweise freischalten,
   Gruppen pausieren und Bewertungen ändern, oder soll die Ansicht strikt
   beobachtend bleiben?

## 7. Dokumentierte Annahmen

- Zielgerät ist ein moderner Browser; keine native App.
- Drei Rollen sind der Referenzfall, zwei Rollen eine vollwertige Variante.
- Inhaltsdaten werden versioniert; laufende Räume wechseln ihre Version nicht.
- Automatische Bewertung prüft Struktur und Beleggebrauch, nicht die alleinige
  „Wahrheit“ freier historischer Urteile.
- Karten ohne gesicherte historische Grundlage werden als Platzhalter sichtbar,
  nie als authentische historische Karten ausgegeben.
- Der Prototyp beginnt erst nach Quellenfreigabe mit der Weimar-Akte.
