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

test("enthält fünf Akten und alle Qualitätsdimensionen", async () => {
  const [gameData, gameUi] = await Promise.all([
    readFile(new URL("../data/game.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  for (const id of ["grossstadt", "goldlack", "unter-der-oberflaeche", "frontstadt", "nach-der-linie"]) {
    assert.match(gameData, new RegExp(`id: "${id}"`));
  }
  for (const label of ["Quellensicherheit", "Raumverständnis", "Perspektivenvielfalt", "Rekonstruktionsqualität"]) {
    assert.match(gameUi, new RegExp(label));
  }
});

test("bietet einen persistenten Einzelspieler-Modus mit allen Perspektiven", async () => {
  const gameUi = await readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8");
  assert.match(gameUi, /Allein ermitteln/);
  assert.match(gameUi, /mode: "solo"/);
  assert.match(gameUi, /berlin-akte-solo/);
  assert.match(gameUi, /Quelle · Raum · Gegenprüfung/);
});

test("stellt Filme vor Fragen und verlangt konkrete Timecodes", async () => {
  const [gameData, gameUi] = await Promise.all([
    readFile(new URL("../data/game.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(gameData, /youtube-nocookie\.com\/embed/);
  assert.match(gameData, /ngp\.zdf\.de\/miniplayer\/embed/);
  assert.match(gameUi, /Filmstelle angesehen/);
  assert.match(gameUi, /Timecode im Film/);
  assert.doesNotMatch(gameUi, /PDF S\. 2–3|Transkriptbeleg/);
});

test("führt ohne Ratespiel über konkrete Filmfragen und Sofortfeedback", async () => {
  const [gameData, gameUi] = await Promise.all([
    readFile(new URL("../data/game.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/GameApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(gameData, /researchQuestion:/);
  assert.match(gameData, /signalWords:/);
  assert.match(gameData, /successFeedback:/);
  assert.match(gameUi, /Deine konkrete Filmfrage/);
  assert.match(gameUi, /Suche die Information im Film/);
  assert.doesNotMatch(gameUi, /Welche Aussage bestätigt der Film|type="radio"/);
  assert.match(gameUi, /Sofortfeedback zur Filmantwort/);
  assert.match(gameUi, /Timecode erkannt/);
  assert.match(gameUi, /Die gesuchte Information fehlt noch/);
  assert.doesNotMatch(gameUi, /Welche sichtbare Beobachtung belegt Modernität/);
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
