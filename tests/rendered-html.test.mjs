import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("rendert den Spielzugang statt des Starter-Screens", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    env,
    ctx,
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Berlin-Akte 2040/i);
  assert.match(html, /Die Geschichte ist beschädigt/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("liefert ohne konfigurierte D1-Bindung eine klare API-Antwort", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request("http://localhost/api/rooms", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "create", name: "Test", teamSize: 3 }),
    }),
    env,
    ctx,
  );
  assert.equal(response.status, 503);
  assert.match(await response.text(), /Raumdatenbank/);
});

test("enthält neun überschneidungsfreie Akten und alle Qualitätsdimensionen", async () => {
  const [gameData, gameUi] = await Promise.all([
    readFile(new URL("../data/game.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  const missionIds = ["grossstadt", "goldlack", "ende-weimar", "unter-der-oberflaeche", "kriegsende-besatzung", "berlinkrise-17-juni", "frontstadt", "nach-der-linie", "hauptstadt-gentrifizierung"];
  for (const id of missionIds) {
    assert.match(gameData, new RegExp(`id: "${id}"`));
  }
  assert.equal(missionIds.length, 9);
  for (const resourceId of ["m02", "m03", "m05", "m06", "m08", "m09", "m10", "m11", "m12", "m14", "m15", "m16"]) {
    assert.equal((gameData.match(new RegExp(`id: "${resourceId}"`, "g")) ?? []).length, 1, `${resourceId} darf nicht doppelt vorkommen`);
  }
  for (const label of ["Quellensicherheit", "Raumverständnis", "Perspektivenvielfalt", "Rekonstruktionsqualität"]) {
    assert.match(gameUi, new RegExp(label));
  }
});

test("bereitet neun eindeutige Blur-Hintergrundfilme vor", async () => {
  const gameData = await readFile(new URL("../data/game.ts", import.meta.url), "utf8");
  const clips = [...gameData.matchAll(/backgroundVideo: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(clips.length, 9);
  assert.equal(new Set(clips).size, 9);
  assert.ok(clips.every((clip) => clip.startsWith("/clips/") && clip.endsWith(".mp4")));
});

test("zeigt die neun Stationsfilme auch in den Akten des Startstapels", async () => {
  const [gameUi, styles] = await Promise.all([
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(gameUi, /className="case-card-film"/);
  assert.match(gameUi, /src=\{mission\.backgroundVideo\}/);
  assert.match(styles, /\.case-card-film/);
  assert.match(styles, /\.case-card:hover \.case-card-film/);
});

test("zeigt das offizielle Berliner Livebild geblurrt auf der Startseite", async () => {
  const [gameUi, styles] = await Promise.all([
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(gameUi, /berlin\.de\/webcams\/rathaus\/webcam\.jpg/);
  assert.match(gameUi, /window\.setInterval\(refresh, 30_000\)/);
  assert.match(gameUi, /Livebild Rotes Rathaus · Berlin\.de/);
  assert.match(styles, /\.welcome-live-image/);
  assert.match(styles, /filter: blur\(4px\)/);
  assert.match(styles, /pointer-events: none/);
});

test("bietet einen persistenten Einzelspieler-Modus mit allen Perspektiven", async () => {
  const gameUi = await readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8");
  assert.match(gameUi, /Einzelspiel neu starten/);
  assert.match(gameUi, /Einzelspiel bei Akte/);
  assert.match(gameUi, /Einzelspiel zurücksetzen/);
  assert.match(gameUi, /mode: "solo"/);
  assert.match(gameUi, /berlin-akte-solo/);
  assert.match(gameUi, /const freshRoom = makeSoloRoom\(\)/);
  assert.match(gameUi, /Quelle · Raum · Gegenprüfung/);
});

test("stellt Filme vor Fragen und verlangt konkrete Timecodes", async () => {
  const [gameData, tasks, gameUi] = await Promise.all([
    readFile(new URL("../data/game.ts", import.meta.url), "utf8"),
    readFile(new URL("../data/tasks.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(gameData, /youtube-nocookie\.com\/embed/);
  assert.match(gameData, /ngp\.zdf\.de\/miniplayer\/embed/);
  assert.match(gameUi, /Benötigte Filmstelle angesehen/);
  assert.match(tasks, /locatorLabel: "Timecode/);
  assert.doesNotMatch(gameUi, /PDF S\. 2–3|Transkriptbeleg/);
});

test("führt ohne Ratespiel über konkrete Filmfragen und Sofortfeedback", async () => {
  const [tasks, gameUi] = await Promise.all([
    readFile(new URL("../data/tasks.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(tasks, /question:/);
  assert.match(tasks, /signalWords:/);
  assert.match(tasks, /successFeedback:/);
  assert.match(gameUi, /FINDE HERAUS/);
  assert.match(gameUi, /Deine Methode/);
  assert.doesNotMatch(gameUi, /Welche Aussage bestätigt der Film|type="radio"/);
  assert.match(gameUi, /Sofortfeedback zur Filmantwort/);
  assert.match(gameUi, /Timecode erkannt/);
  assert.match(gameUi, /Ein Teil der gesuchten Information fehlt noch/);
  assert.doesNotMatch(gameUi, /Welche sichtbare Beobachtung belegt Modernität/);
});

test("enthält pro Station drei eigenständige Aufgaben mit konsistenter Dramaturgie", async () => {
  const [tasks, gameUi] = await Promise.all([
    readFile(new URL("../data/tasks.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.equal((tasks.match(/\n      act: "SPUR SICHERN"/g) ?? []).length, 9);
  assert.equal((tasks.match(/\n      act: "ZUSAMMENHANG REKONSTRUIEREN"/g) ?? []).length, 9);
  assert.equal((tasks.match(/\n      act: "ARCHIVFEHLER PRÜFEN"/g) ?? []).length, 9);
  assert.equal((tasks.match(/\n      id: "/g) ?? []).length, 27);
  for (const type of ["Bilddetektiv", "Ablaufprotokoll", "Ursache–Folge", "Kontrastpaar", "Begriffsprüfung", "Quellenkritik", "Perspektivwechsel", "Netzwerkrekonstruktion", "Behauptungscheck"]) {
    assert.match(tasks, new RegExp(`type: "${type}"`));
  }
  assert.match(gameUi, /missionTaskCount < 3/);
  assert.match(gameUi, /Spur → Zusammenhang → Prüfung/);
  assert.match(gameUi, /Nächster Ermittlungsschritt/);
});

test("führt eine Prüfhypothese durch Film, Karte und Urteil", async () => {
  const [gameUi, worker] = await Promise.all([
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
  ]);
  for (const marker of [
    "SCHADENSDIAGNOSE",
    "Prüfhypothese versiegeln",
    "AKTUELLE PRÜFHYPOTHESE",
    "HYPOTHESE PRÜFEN",
    "bestätigt",
    "eingeschränkt",
    "verworfen",
  ]) {
    assert.match(gameUi, new RegExp(marker));
  }
  assert.match(worker, /action === "theory"/);
  assert.match(worker, /investigation\.status/);
  assert.match(gameUi, /Der Ort …/);
  assert.match(gameUi, /stützt", "begrenzt", "widerlegt/);
  assert.match(worker, /mapPins\.filter/);
});

test("erzählt jede Akte mit eigener Perspektivfigur und vollständigem Spannungsbogen", async () => {
  const [gameUi, narrative, portraitPrompts] = await Promise.all([
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../data/narrative.ts", import.meta.url), "utf8"),
    readFile(new URL("../docs/05-canva-portraetprompts.md", import.meta.url), "utf8"),
  ]);
  const missionIds = ["grossstadt", "goldlack", "ende-weimar", "unter-der-oberflaeche", "kriegsende-besatzung", "berlinkrise-17-juni", "frontstadt", "nach-der-linie", "hauptstadt-gentrifizierung"];
  for (const id of missionIds) {
    assert.match(narrative, new RegExp(`(?:^|\\n)  ${id.includes("-") ? `"${id}"` : id}: \\{`));
  }
  for (const field of ["chapter", "opening", "perspective", "stakes", "transitions", "closing"]) {
    assert.equal((narrative.match(new RegExp(`${field}:`, "g")) ?? []).length >= 9, true, `${field} fehlt in mindestens einer Akte`);
  }
  for (const field of ["born", "family", "education", "work", "housing", "formativeExperience", "hopes", "traits", "portraitPrompt"]) {
    assert.equal((narrative.match(new RegExp(`${field}:`, "g")) ?? []).length, 10, `${field} fehlt in einem Steckbrief`);
  }
  for (const marker of ["PERSPEKTIVFIGUR", "fiktiv · quellenbasiert", "WAS AUF DEM SPIEL STEHT", "ÜBERGANG · FILMARCHIV", "AKTE REKONSTRUIERT"]) {
    assert.match(gameUi, new RegExp(marker));
  }
  assert.match(gameUi, /Steckbrief und Lebenslauf öffnen/);
  assert.equal((portraitPrompts.match(/^## \d{2} ·/gm) ?? []).length, 9);
  assert.ok(narrative.length > 14000, "Der narrative Textkorpus ist noch zu knapp.");
});

test("erklärt gesperrte Phasen dezent und benennt den nächsten Schritt", async () => {
  const gameUi = await readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8");
  assert.match(gameUi, /nach Spurensuche/);
  assert.match(gameUi, /nach Filmantwort/);
  assert.match(gameUi, /nach Kartenarbeit/);
  assert.match(gameUi, /Quellen öffnen/);
  assert.match(gameUi, /Schaltet den nächsten Arbeitsschritt frei/);
});

test("enthält eine filterbare Zeitleiste mit Quellen und Schlüsselereignissen", async () => {
  const [timelineData, gameUi] = await Promise.all([
    readFile(new URL("../data/timeline.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  for (const year of ["1237", "1871", "1920", "1933", "1945", "1948/49", "1961", "1989", "1990", "1991/99"]) {
    assert.match(timelineData, new RegExp(year.replace("/", "\\/")));
  }
  assert.match(timelineData, /zeitreisen-berlin\.de\/specials\/Zeitachse/);
  assert.match(timelineData, /de\.wikipedia\.org\/wiki\/Geschichte_Berlins/);
  assert.match(gameUi, /Vom Handelsort zur Hauptstadt/);
  assert.match(gameUi, /Zeitraum filtern/);
  assert.match(gameUi, />Zeit</);
});
