"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */

import { useCallback, useEffect, useRef, useState } from "react";
import { finalPrompt, missions, roleLabels, type Mission } from "../data/game";
import { missionNarratives } from "../data/narrative";
import { stationTasks, type InvestigationTask } from "../data/tasks";
import { timelineEras, timelineEvents, timelineSources, type TimelineEra } from "../data/timeline";

type Role = keyof typeof roleLabels;
type Member = { id: string; name: string; role: Role; lastSeenAt?: number };
type Evidence = {
  id: string;
  actor: string;
  role: Role;
  resourceId: string;
  taskId?: string;
  locator: string;
  note: string;
  category: string;
  at: number;
};
type Pin = { id: string; actor: string; placeId: string; stance?: "stützt" | "begrenzt" | "widerlegt"; note: string; at: number };
type Investigation = {
  hypothesis: string;
  manipulation: string;
  status: "offen" | "bestätigt" | "eingeschränkt" | "verworfen";
};
type Room = {
  code: string;
  teamSize: 2 | 3;
  mode: "multi" | "desktop" | "demo" | "solo";
  missionIndex: number;
  phase: number;
  members: Member[];
  viewer?: Member | null;
  evidence: Evidence[];
  mapPins: Pin[];
  investigation?: Investigation;
  verdict: string;
  verdictSubmitted: boolean;
  scores: Record<string, number>;
  events: { id: string; at: number; actor: string; type: string; detail: string }[];
  completedMissions: string[];
  finalMuseum?: {
    places: string[];
    text: string;
    omission: string;
  };
  updatedAt?: number;
};

const phases = ["Störung", "Spurensuche", "Quellen", "Karte", "Urteil"];
const phaseIcons = ["!", "⌁", "◫", "⌖", "✓"];
const phaseUnlockHints = ["", "nach Aktenstart", "nach Spurensuche", "nach Filmantwort", "nach Kartenarbeit"];

function makeDemoRoom(teamSize: 2 | 3 = 3): Room {
  const names = teamSize === 3 ? ["Mira", "Yusuf", "Leonie"] : ["Mira", "Yusuf"];
  return {
    code: "DEMO40",
    teamSize,
    mode: "demo",
    missionIndex: 1,
    phase: 0,
    members: names.map((name, index) => ({
      id: `demo-${index}`,
      name,
      role: (["source", "space", "critic"] as Role[])[index],
    })),
    viewer: { id: "demo-0", name: names[0], role: "source" },
    evidence: [],
    mapPins: [],
    investigation: undefined,
    verdict: "",
    verdictSubmitted: false,
    scores: { source: 0, space: 0, perspective: 0, reconstruction: 0 },
    events: [
      {
        id: "demo-event",
        at: Date.now(),
        actor: "Archivsystem",
        type: "room-created",
        detail: "Demoraum bereit",
      },
    ],
    completedMissions: [],
  };
}

function makeSoloRoom(): Room {
  const soloMember = { id: "solo-player", name: "Ermittler/in", role: "source" as Role };
  return {
    ...makeDemoRoom(3),
    code: "SOLO40",
    mode: "solo",
    missionIndex: 0,
    members: [soloMember],
    viewer: soloMember,
    events: [{
      id: "solo-event",
      at: Date.now(),
      actor: "Archivsystem",
      type: "solo-created",
      detail: "Einzelermittlung begonnen",
    }],
  };
}

function roleForTeam(role: Role, teamSize: 2 | 3) {
  if (teamSize === 2) {
    return role === "source" ? "Spurenleser/in" : "Kartograf/in";
  }
  return roleLabels[role];
}

function usePersistentSession() {
  const [session, setSession] = useState<{ code: string; token: string; teacher?: boolean } | null>(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("berlin-akte-session");
      if (raw) setSession(JSON.parse(raw));
    } catch {
      // Device-local convenience only.
    }
  }, []);
  const save = useCallback((next: typeof session) => {
    setSession(next);
    if (next) localStorage.setItem("berlin-akte-session", JSON.stringify(next));
    else localStorage.removeItem("berlin-akte-session");
  }, []);
  return [session, save] as const;
}

async function api(payload: Record<string, unknown>, method: "GET" | "POST" = "POST") {
  const url =
    method === "GET"
      ? `/api/rooms?${new URLSearchParams(payload as Record<string, string>).toString()}`
      : "/api/rooms";
  const response = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: method === "POST" ? JSON.stringify(payload) : undefined,
  });
  const data = (await response.json()) as { room?: Room; token?: string; teacherToken?: string; error?: string };
  if (!response.ok) throw new Error(data.error || "Verbindung fehlgeschlagen.");
  return data;
}

export function GameApp() {
  const [room, setRoom] = useState<Room | null>(null);
  const [session, saveSession] = usePersistentSession();
  const [screen, setScreen] = useState<"welcome" | "join" | "create" | "game" | "teacher">("welcome");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [soloProgress, setSoloProgress] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("berlin-akte-solo");
      if (saved) setSoloProgress(Math.max(0, Math.min(8, Number(JSON.parse(saved).missionIndex) || 0)));
    } catch {
      localStorage.removeItem("berlin-akte-solo");
    }
  }, []);

  const syncRoom = useCallback(async () => {
    if (!session || room?.mode === "demo" || room?.mode === "desktop" || room?.mode === "solo") return;
    try {
      const data = await api({ code: session.code, token: session.token }, "GET");
      if (data.room) setRoom(data.room);
    } catch {
      setMessage("Verbindung unterbrochen – Entwürfe bleiben auf diesem Gerät erhalten.");
    }
  }, [room?.mode, session]);

  useEffect(() => {
    if (!session || screen === "welcome") return;
    const timer = window.setInterval(syncRoom, 3000);
    return () => window.clearInterval(timer);
  }, [screen, session, syncRoom]);

  useEffect(() => {
    if (room?.mode === "solo") {
      localStorage.setItem("berlin-akte-solo", JSON.stringify(room));
      setSoloProgress(room.missionIndex);
    }
  }, [room]);

  const remoteAction = useCallback(
    async (action: string, payload: Record<string, unknown> = {}) => {
      if (!room) return;
      if (room.mode === "demo" || room.mode === "desktop" || room.mode === "solo") {
        setRoom((current) => (current ? reduceLocal(current, action, payload) : current));
        return;
      }
      if (!session) return;
      setBusy(true);
      try {
        const data = await api({ action, code: session.code, token: session.token, ...payload });
        if (data.room) setRoom(data.room);
        setMessage("");
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Aktion fehlgeschlagen.");
      } finally {
        setBusy(false);
      }
    },
    [room, session],
  );

  async function createRoom(name: string, teamSize: 2 | 3, mode: "multi" | "desktop") {
    setBusy(true);
    try {
      if (mode === "desktop") {
        const next = makeDemoRoom(teamSize);
        next.mode = "desktop";
        next.code = "DESK40";
        next.missionIndex = 0;
        setRoom(next);
        setScreen("game");
        return;
      }
      const data = await api({ action: "create", name, teamSize, mode });
      if (data.room && data.token) {
        setRoom(data.room);
        saveSession({ code: data.room.code, token: data.token });
        if (data.teacherToken) localStorage.setItem(`berlin-teacher-${data.room.code}`, data.teacherToken);
        setScreen("game");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Raum konnte nicht erstellt werden.");
    } finally {
      setBusy(false);
    }
  }

  async function joinRoom(code: string, name: string, asTeacher = false) {
    setBusy(true);
    try {
      if (asTeacher) {
        const token = localStorage.getItem(`berlin-teacher-${code.toUpperCase()}`) || "";
        if (!token) throw new Error("Auf diesem Gerät ist kein Spielleitungszugang für den Raum gespeichert.");
        const data = await api({ code: code.toUpperCase(), token }, "GET");
        if (data.room) {
          setRoom(data.room);
          saveSession({ code: code.toUpperCase(), token, teacher: true });
          setScreen("teacher");
        }
      } else {
        const data = await api({ action: "join", code: code.toUpperCase(), name });
        if (data.room && data.token) {
          setRoom(data.room);
          saveSession({ code: code.toUpperCase(), token: data.token });
          setScreen("game");
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Beitritt fehlgeschlagen.");
    } finally {
      setBusy(false);
    }
  }

  async function resume() {
    if (!session) return;
    setBusy(true);
    try {
      const data = await api({ code: session.code, token: session.token }, "GET");
      if (data.room) {
        setRoom(data.room);
        setScreen(session.teacher ? "teacher" : "game");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Wiedereinstieg nicht möglich.");
      saveSession(null);
    } finally {
      setBusy(false);
    }
  }

  if (screen === "welcome") {
    return (
      <Welcome
        hasSession={Boolean(session)}
        soloProgress={soloProgress}
        busy={busy}
        message={message}
        onResume={resume}
        onCreate={() => setScreen("create")}
        onJoin={() => setScreen("join")}
        onSolo={() => {
          const freshRoom = makeSoloRoom();
          localStorage.setItem("berlin-akte-solo", JSON.stringify(freshRoom));
          setSoloProgress(0);
          setRoom(freshRoom);
          setScreen("game");
        }}
        onResumeSolo={() => {
          try {
            const saved = localStorage.getItem("berlin-akte-solo");
            setRoom(saved ? JSON.parse(saved) : makeSoloRoom());
          } catch {
            setRoom(makeSoloRoom());
          }
          setScreen("game");
        }}
        onDemo={(teamSize) => {
          setRoom(makeDemoRoom(teamSize));
          setScreen("game");
        }}
      />
    );
  }

  if (screen === "create") {
    return <CreateRoom busy={busy} message={message} onBack={() => setScreen("welcome")} onCreate={createRoom} />;
  }

  if (screen === "join") {
    return <JoinRoom busy={busy} message={message} onBack={() => setScreen("welcome")} onJoin={joinRoom} />;
  }

  if (!room) return null;

  if (screen === "teacher") {
    return (
      <TeacherView
        room={room}
        onBack={() => setScreen("welcome")}
        onOpenGame={() => setScreen("game")}
        onAction={remoteAction}
      />
    );
  }

  return (
    <GameShell
      room={room}
      busy={busy}
      message={message}
      onAction={remoteAction}
      onTeacher={() => setScreen("teacher")}
      onReset={() => {
        if (!window.confirm("Einzelspiel wirklich zurücksetzen? Alle lokalen Antworten und Fortschritte werden gelöscht.")) return;
        const freshRoom = makeSoloRoom();
        localStorage.setItem("berlin-akte-solo", JSON.stringify(freshRoom));
        setSoloProgress(0);
        setRoom(freshRoom);
      }}
      onExit={() => {
        setScreen("welcome");
        setRoom(null);
      }}
    />
  );
}

function reduceLocal(room: Room, action: string, payload: Record<string, unknown>): Room {
  const next = structuredClone(room);
  const actor = next.viewer?.name || "Team";
  const event = (type: string, detail: string) =>
    next.events.push({ id: crypto.randomUUID(), at: Date.now(), actor, type, detail });
  if (action === "advance") {
    next.phase = Math.min(4, next.phase + 1);
    event("phase", `Phase ${next.phase + 1} freigeschaltet`);
  }
  if (action === "set-mission") {
    next.missionIndex = Number(payload.missionIndex) || 0;
    next.phase = 0;
    next.evidence = [];
    next.mapPins = [];
    next.investigation = undefined;
    next.verdict = "";
    next.verdictSubmitted = false;
    next.members = next.members.map((member, index) => ({
      ...member,
      role: (["source", "space", "critic"] as Role[])[(index + next.missionIndex) % next.teamSize],
    }));
    event("mission", `Akte ${next.missionIndex + 1} geöffnet`);
  }
  if (action === "evidence") {
    next.evidence.push({
      id: crypto.randomUUID(),
      actor,
      role: (payload.role as Role) || next.viewer?.role || "source",
      resourceId: String(payload.resourceId),
      taskId: String(payload.taskId || ""),
      locator: String(payload.locator),
      note: String(payload.note),
      category: String(payload.category),
      at: Date.now(),
    });
    event("evidence", "Beleg gesichert");
  }
  if (action === "pin") {
    const pin: Pin = {
      id: crypto.randomUUID(),
      actor,
      placeId: String(payload.placeId),
      stance: payload.stance as Pin["stance"],
      note: String(payload.note),
      at: Date.now(),
    };
    next.mapPins = [...next.mapPins.filter((item) => item.placeId !== pin.placeId), pin];
    event("map", `Ort ${String(payload.placeId)} verknüpft`);
  }
  if (action === "theory") {
    next.investigation = {
      hypothesis: String(payload.hypothesis),
      manipulation: String(payload.manipulation),
      status: "offen",
    };
    event("theory", "Prüfhypothese festgelegt");
  }
  if (action === "verdict") {
    next.verdict = String(payload.verdict);
    if (next.investigation && payload.theoryStatus) {
      next.investigation.status = payload.theoryStatus as Investigation["status"];
    }
    next.verdictSubmitted = Boolean(payload.submit);
    if (payload.submit) {
      if (!next.completedMissions.includes(String(next.missionIndex))) next.completedMissions.push(String(next.missionIndex));
      next.scores = {
        source: Math.min(3, next.evidence.length),
        space: Math.min(3, next.mapPins.length),
        perspective: Math.min(3, next.investigation?.status === "eingeschränkt" || next.investigation?.status === "verworfen" ? 3 : next.evidence.length >= 2 ? 2 : next.evidence.length),
        reconstruction: Math.min(3, next.verdict.length > 300 ? 3 : next.verdict.length > 120 ? 2 : 1),
      };
      event("verdict", "Urteil eingereicht");
    }
  }
  if (action === "final-museum") {
    next.finalMuseum = payload.finalMuseum as Room["finalMuseum"];
    event("museum", "Museumsraum gespeichert");
  }
  return next;
}

function Brand() {
  return (
    <div className="brand" aria-label="Berlin-Akte 2040">
      <span className="brand-mark" aria-hidden="true">B</span>
      <span><b>BERLIN-AKTE</b><small>2040 · DIGITALES STADTARCHIV</small></span>
    </div>
  );
}

function Welcome({
  hasSession,
  soloProgress,
  busy,
  message,
  onResume,
  onCreate,
  onJoin,
  onSolo,
  onResumeSolo,
  onDemo,
}: {
  hasSession: boolean;
  soloProgress: number | null;
  busy: boolean;
  message: string;
  onResume(): void;
  onCreate(): void;
  onJoin(): void;
  onSolo(): void;
  onResumeSolo(): void;
  onDemo(size: 2 | 3): void;
}) {
  return (
    <main className="welcome">
      <WelcomeLiveBackground />
      <div className="noise" />
      <header className="welcome-nav">
        <Brand />
        <a className="status-pill live-source-link" href="https://www.berlin.de/webcams/4350944-4350835-webcam-am-rotes-rathaus.html" target="_blank" rel="noreferrer">
          <i /> Livebild Rotes Rathaus · Berlin.de ↗
        </a>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">BERLIN · JAHR 2040</p>
          <h1>Die Geschichte<br />ist <em>beschädigt.</em></h1>
          <p className="lead">
            Neun Berlin-Akten wurden falsch datiert, verkürzt und manipuliert.
            Bildet ein Rekonstruktionsteam. Untersucht Quellen, verfolgt Orte und
            repariert das digitale Museum.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onCreate}>Raum eröffnen <span>→</span></button>
            <button className="secondary" onClick={onJoin}>Mit Raumcode beitreten</button>
            <button className="secondary solo-button" onClick={onSolo}>Einzelspiel neu starten</button>
          </div>
          {soloProgress !== null && <button className="resume-link solo-resume" onClick={onResumeSolo}>↻ Einzelspiel bei Akte {String(soloProgress + 1).padStart(2, "0")} fortsetzen</button>}
          {hasSession && <button className="resume-link" disabled={busy} onClick={onResume}>↻ Letzte Sitzung wiederaufnehmen</button>}
          {message && <p className="alert">{message}</p>}
        </div>
        <div className="case-stack" aria-label="Neun beschädigte Berlin-Akten">
          {missions.map((mission, index) => (
            <article key={mission.id} className="case-card" style={{ "--i": index, "--accent": mission.accent } as React.CSSProperties}>
              <video
                className="case-card-film"
                src={mission.backgroundVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
              <span>{mission.number}</span>
              <strong>{mission.title}</strong>
              <small>{mission.period}</small>
            </article>
          ))}
          <div className="scan-line" />
        </div>
      </section>
      <section className="mode-strip">
        <div><span>01</span><b>Asymmetrische Rollen</b><small>Niemand besitzt alle Informationen.</small></div>
        <div><span>02</span><b>Quellen als Beweise</b><small>Ohne Materialprüfung keine Lösung.</small></div>
        <div><span>03</span><b>Zoombare Zeitkarten</b><small>Räume werden Teil des Arguments.</small></div>
        <div className="demo-choices">
          <b>Team-Demo</b>
          <button onClick={() => onDemo(2)}>2 Rollen</button>
          <button onClick={() => onDemo(3)}>3 Rollen</button>
        </div>
      </section>
    </main>
  );
}

function WelcomeLiveBackground() {
  const [cacheKey, setCacheKey] = useState(0);
  useEffect(() => {
    const refresh = () => setCacheKey(Date.now());
    refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="welcome-live-bg" aria-hidden="true">
      <div
        className="welcome-live-image"
        style={{ backgroundImage: `url("https://www.berlin.de/webcams/rathaus/webcam.jpg?v=${cacheKey}")` }}
      />
    </div>
  );
}

function CreateRoom({
  busy,
  message,
  onBack,
  onCreate,
}: {
  busy: boolean;
  message: string;
  onBack(): void;
  onCreate(name: string, size: 2 | 3, mode: "multi" | "desktop"): void;
}) {
  const [name, setName] = useState("");
  const [size, setSize] = useState<2 | 3>(3);
  const [mode, setMode] = useState<"multi" | "desktop">("multi");
  return (
    <SetupFrame title="Rekonstruktionsteam einrichten" subtitle="Ein Laptop eröffnet den Raum. Handys treten danach mit dem Code bei." onBack={onBack}>
      <label className="field">Name auf diesem Gerät<input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Mira" maxLength={40} /></label>
      <fieldset className="choice-group"><legend>Teamgrösse</legend>
        {[2, 3].map((value) => <button key={value} className={size === value ? "selected" : ""} onClick={() => setSize(value as 2 | 3)}><b>{value} Personen</b><small>{value === 2 ? "Spurenlesen · Kartografie" : "Quelle · Raum · Gegenprüfung"}</small></button>)}
      </fieldset>
      <fieldset className="choice-group"><legend>Spielmodus</legend>
        <button className={mode === "multi" ? "selected" : ""} onClick={() => setMode("multi")}><b>Mehrgeräte</b><small>Laptop + persönliche Handys</small></button>
        <button className={mode === "desktop" ? "selected" : ""} onClick={() => setMode("desktop")}><b>Nur Desktop</b><small>Rollenansichten wechseln lokal</small></button>
      </fieldset>
      {message && <p className="alert">{message}</p>}
      <button className="primary wide" disabled={busy || !name.trim()} onClick={() => onCreate(name.trim(), size, mode)}>{busy ? "Raum wird vorbereitet …" : "Archivraum erzeugen →"}</button>
    </SetupFrame>
  );
}

function JoinRoom({
  busy,
  message,
  onBack,
  onJoin,
}: {
  busy: boolean;
  message: string;
  onBack(): void;
  onJoin(code: string, name: string, teacher?: boolean): void;
}) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  return (
    <SetupFrame title="Dem Team beitreten" subtitle="Den sechsstelligen Code findest du auf dem gemeinsamen Laptop." onBack={onBack}>
      <label className="field">Raumcode<input className="code-input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} placeholder="BER204" /></label>
      <label className="field">Dein Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Yusuf" maxLength={40} /></label>
      {message && <p className="alert">{message}</p>}
      <button className="primary wide" disabled={busy || code.length !== 6 || !name.trim()} onClick={() => onJoin(code, name)}>{busy ? "Verbindung wird geprüft …" : "Rolle empfangen →"}</button>
      <button className="text-button" disabled={code.length !== 6} onClick={() => onJoin(code, "Spielleitung", true)}>Spielleitungsansicht öffnen</button>
    </SetupFrame>
  );
}

function SetupFrame({ title, subtitle, onBack, children }: { title: string; subtitle: string; onBack(): void; children: React.ReactNode }) {
  return (
    <main className="setup-page">
      <header><Brand /><button className="text-button" onClick={onBack}>← Zurück</button></header>
      <section className="setup-card">
        <p className="eyebrow">ARCHIVZUGANG</p><h1>{title}</h1><p>{subtitle}</p>
        <div className="setup-form">{children}</div>
      </section>
    </main>
  );
}

function GameShell({
  room,
  busy,
  message,
  onAction,
  onTeacher,
  onReset,
  onExit,
}: {
  room: Room;
  busy: boolean;
  message: string;
  onAction(action: string, payload?: Record<string, unknown>): void;
  onTeacher(): void;
  onReset(): void;
  onExit(): void;
}) {
  const mission = missions[room.missionIndex];
  const [tab, setTab] = useState<"case" | "sources" | "map" | "timeline" | "evidence" | "verdict" | "final">("case");
  const [role, setRole] = useState<Role>(room.viewer?.role || "source");
  const effectiveRole = room.mode === "desktop" || room.mode === "demo" || room.mode === "solo" ? role : room.viewer?.role || "source";
  useEffect(() => {
    const phaseTabs = ["case", "case", "sources", "map", "verdict"] as const;
    setTab(phaseTabs[room.phase]);
  }, [room.phase, room.missionIndex]);

  const canFinal = room.completedMissions.length >= 9 || room.mode === "demo";
  return (
    <main className="game" style={{ "--mission": mission.accent } as React.CSSProperties}>
      <header className="game-header">
        <Brand />
        <div className="room-code"><span>{room.mode === "solo" ? "EINZELSPIEL" : "RAUM"}</span><b>{room.code}</b><small>{room.mode === "solo" ? "Fortschritt lokal gespeichert" : `${room.members.length}/${room.teamSize} verbunden`}</small></div>
        <div className="header-actions">
          {room.mode !== "solo" && <button onClick={onTeacher} title="Spielleitungsansicht">▦</button>}
          {room.mode === "solo" && <button className="reset-action" onClick={onReset} title="Einzelspiel zurücksetzen"><span>RESET</span>↺</button>}
          <button onClick={onExit} title="Spiel verlassen">↗</button>
        </div>
      </header>
      <aside className="mission-rail">
        <p>BERLIN-AKTEN</p>
        {missions.map((item, index) => (
          <button
            key={item.id}
            className={index === room.missionIndex ? "active" : ""}
            onClick={() => onAction("set-mission", { missionIndex: index })}
            title={`${item.number}: ${item.title}`}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i style={{ background: item.accent }} />
            {room.completedMissions.includes(String(index)) && <b>✓</b>}
          </button>
        ))}
        <div className="rail-line" />
        <button className={tab === "final" ? "active final-button" : "final-button"} disabled={!canFinal} onClick={() => setTab("final")} title="Finale">∴</button>
      </aside>
      <nav className="phase-nav" aria-label="Phasen">
        {phases.map((phase, index) => (
          <button
            key={phase}
            className={index === room.phase ? "current" : index < room.phase ? "done" : ""}
            disabled={index > room.phase}
            title={index > room.phase ? `${phase}: ${phaseUnlockHints[index]}` : phase}
            onClick={() => {
            const tabs = ["case", "case", "sources", "map", "verdict"] as const;
            setTab(tabs[index]);
          }}>
            <span>{index > room.phase ? "⌑" : phaseIcons[index]}</span>
            <span className="phase-copy"><b>{phase}</b>{index > room.phase && <small>{phaseUnlockHints[index]}</small>}</span>
          </button>
        ))}
      </nav>
      <section className="workspace">
        {message && <div className="connection-note">{message}</div>}
        {(room.mode === "desktop" || room.mode === "demo" || room.mode === "solo") && (
          <div className="role-switcher">
            <span>{room.mode === "solo" ? "Perspektive übernehmen:" : "Ansicht simulieren:"}</span>
            {(room.teamSize === 2 ? (["source", "space"] as Role[]) : (["source", "space", "critic"] as Role[])).map((item) => (
              <button key={item} className={role === item ? "active" : ""} onClick={() => setRole(item)}>{roleForTeam(item, room.teamSize)}</button>
            ))}
          </div>
        )}
        {room.investigation && tab !== "case" && (
          <div className="investigation-thread">
            <span>AKTUELLE PRÜFHYPOTHESE</span>
            <p>{room.investigation.hypothesis}</p>
            <b data-status={room.investigation.status}>{room.investigation.status}</b>
          </div>
        )}
        {tab === "case" && <CaseView mission={mission} room={room} role={effectiveRole} onTheory={(payload) => onAction("theory", payload)} onAdvance={() => onAction("advance")} busy={busy} />}
        {tab === "sources" && <SourcesView mission={mission} room={room} role={effectiveRole} onEvidence={(payload) => onAction("evidence", { ...payload, role: effectiveRole })} onAdvance={() => onAction("advance")} />}
        {tab === "map" && <MapView mission={mission} room={room} onPin={(payload) => onAction("pin", payload)} onAdvance={() => onAction("advance")} />}
        {tab === "timeline" && <TimelineView mission={mission} />}
        {tab === "evidence" && <EvidenceBoard mission={mission} room={room} />}
        {tab === "verdict" && <VerdictView mission={mission} room={room} onSave={(verdict, submit, theoryStatus) => onAction("verdict", { verdict, submit, theoryStatus })} />}
        {tab === "final" && <Finale room={room} onSave={(finalMuseum) => onAction("final-museum", { finalMuseum })} />}
      </section>
      <nav className="utility-nav">
        <button className={tab === "case" ? "active" : ""} onClick={() => setTab("case")}>▤<span>Akte</span></button>
        <button className={tab === "sources" ? "active" : ""} onClick={() => setTab("sources")}>◫<span>Quellen</span></button>
        <button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>⌖<span>Karte</span></button>
        <button className={tab === "timeline" ? "active" : ""} onClick={() => setTab("timeline")}>↔<span>Zeit</span></button>
        <button className={tab === "evidence" ? "active" : ""} onClick={() => setTab("evidence")}>⌁<span>Belege <i>{room.evidence.length}</i></span></button>
        <button className={tab === "verdict" ? "active" : ""} onClick={() => setTab("verdict")}>✓<span>Urteil</span></button>
      </nav>
    </main>
  );
}

function CaseView({
  mission,
  room,
  role,
  onTheory,
  onAdvance,
  busy,
}: {
  mission: Mission;
  room: Room;
  role: Role;
  onTheory(payload: Record<string, unknown>): void;
  onAdvance(): void;
  busy: boolean;
}) {
  const narrative = missionNarratives[mission.id];
  const [hypothesis, setHypothesis] = useState(room.investigation?.hypothesis || "");
  const [manipulation, setManipulation] = useState(room.investigation?.manipulation || "");
  useEffect(() => {
    setHypothesis(room.investigation?.hypothesis || "");
    setManipulation(room.investigation?.manipulation || "");
  }, [mission, room.investigation?.hypothesis, room.investigation?.manipulation]);
  const theoryReady = Boolean(hypothesis && manipulation);
  return (
    <div className="case-view">
      <div className="case-film-bg" aria-hidden="true">
        <video key={mission.backgroundVideo} src={mission.backgroundVideo} autoPlay muted loop playsInline onError={(event) => { event.currentTarget.style.display = "none"; }} />
      </div>
      <div className="case-heading">
        <div><p className="eyebrow">{mission.number} · {mission.period}</p><h1>{mission.title}</h1><p>{mission.subtitle}</p></div>
        <div className="case-status">
          <span className="classification">BESCHÄDIGT</span>
          <span className="film-running"><i /> FILMARCHIV LÄUFT</span>
        </div>
      </div>
      <section className="narrative-prologue">
        <div><span>{mission.number} · KAPITEL</span><h2>{narrative.chapter}</h2></div>
        <div>{narrative.opening.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <aside><span>WAS AUF DEM SPIEL STEHT</span><p>{narrative.stakes}</p></aside>
      </section>
      <div className="case-grid">
        <article className="damaged-document">
          <span className="doc-label">FEHLERHAFTE ARCHIVFASSUNG</span>
          <blockquote>„{mission.damagedClaim}“</blockquote>
          <div className="redaction" /><div className="redaction short" />
          <p className="stamp">KONTEXT FEHLT</p>
        </article>
        <div className="briefing">
          <p className="eyebrow">STÖRUNG</p><h2>{mission.problem}</h2><p>{mission.disturbance}</p>
          <PerspectiveCard mission={mission} />
          <div className="role-card">
            <span>DEIN AUFTRAG</span><b>{roleForTeam(role, room.teamSize)}</b><p>{mission.roles[role]}</p>
          </div>
          {room.phase === 0 ? (
            <>
              <button className="primary" disabled={busy} onClick={onAdvance}>Spurensuche starten →</button>
              <small className="advance-hint">Schaltet den nächsten Arbeitsschritt frei: die Schadensdiagnose dieser Akte.</small>
            </>
          ) : (
            <div className="theory-lab">
              <p className="eyebrow">SCHADENSDIAGNOSE</p>
              <h3>Lege fest, was du überprüfen willst</h3>
              <label>
                Verdächtige Verkürzung
                <select value={manipulation} onChange={(event) => setManipulation(event.target.value)}>
                  <option value="">Manipulation auswählen …</option>
                  {mission.redHerrings.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                Vorläufige Prüfhypothese
                <select value={hypothesis} onChange={(event) => setHypothesis(event.target.value)}>
                  <option value="">Hypothese auswählen …</option>
                  {mission.claims.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <p className="theory-rule"><b>Spielregel:</b> Film und Karte müssen diese Hypothese nun stützen, einschränken oder widerlegen. Ein Kurswechsel im Urteil bringt mehr Qualität als blindes Festhalten.</p>
              {!room.investigation && <button className="secondary wide" disabled={!theoryReady} onClick={() => onTheory({ hypothesis, manipulation })}>Prüfhypothese versiegeln</button>}
              {room.investigation && <div className="theory-sealed"><span>✓</span><p><b>Hypothese versiegelt</b><small>Jetzt beginnt die Beweisprüfung.</small></p></div>}
              <button className="primary wide" disabled={busy || !room.investigation} onClick={onAdvance}>Quellen öffnen →</button>
            </div>
          )}
        </div>
      </div>
      <TeamStrip room={room} />
    </div>
  );
}

function PerspectiveCard({ mission }: { mission: Mission }) {
  const figure = missionNarratives[mission.id].perspective;
  const [portraitOpen, setPortraitOpen] = useState(false);

  useEffect(() => {
    if (!portraitOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPortraitOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [portraitOpen]);

  return (
    <article className="perspective-card">
      <header><span>PERSPEKTIVFIGUR</span><small>fiktiv · quellenbasiert</small></header>
      <div className="perspective-identity">
        <button className="portrait-trigger" type="button" onClick={() => setPortraitOpen(true)} aria-label={`Porträt von ${figure.name} vergrößern`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={figure.portrait} alt={`Porträt der fiktiven Perspektivfigur ${figure.name}`} />
          <span aria-hidden="true">⌕</span>
        </button>
        <p><b>{figure.name}, {figure.age}</b><small>{figure.role}<br />{figure.location}</small></p>
      </div>
      <p>{figure.situation}</p>
      <details className="perspective-dossier">
        <summary>Steckbrief und Lebenslauf öffnen <span>＋</span></summary>
        <dl>
          <div><dt>Geboren und Herkunft</dt><dd>{figure.born}</dd></div>
          <div><dt>Familie</dt><dd>{figure.family}</dd></div>
          <div><dt>Bildung</dt><dd>{figure.education}</dd></div>
          <div><dt>Arbeit</dt><dd>{figure.work}</dd></div>
          <div><dt>Wohnen</dt><dd>{figure.housing}</dd></div>
          <div><dt>Prägende Erfahrung</dt><dd>{figure.formativeExperience}</dd></div>
          <div><dt>Hoffnungen</dt><dd>{figure.hopes}</dd></div>
          <div><dt>Charakterzüge</dt><dd className="trait-list">{figure.traits.map((trait) => <span key={trait}>{trait}</span>)}</dd></div>
        </dl>
      </details>
      <div><span>IHR KONFLIKT</span><p>{figure.dilemma}</p></div>
      <blockquote>„{figure.question}“</blockquote>
      {portraitOpen && (
        <section className="portrait-lightbox" role="dialog" aria-modal="true" aria-label={`Großansicht: ${figure.name}`} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setPortraitOpen(false);
        }}>
          <figure>
            <button type="button" autoFocus onClick={() => setPortraitOpen(false)} aria-label="Großansicht schließen">×</button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figure.portrait} alt={`Großansicht der fiktiven Perspektivfigur ${figure.name}`} />
            <figcaption><b>{figure.name}</b><span>{figure.role} · {figure.location}</span></figcaption>
          </figure>
        </section>
      )}
    </article>
  );
}

function TeamStrip({ room }: { room: Room }) {
  if (room.mode === "solo") {
    return (
      <div className="team-strip solo-strip">
        <span>EINZELERMITTLUNG</span>
        <div><i>1</i><p><b>Du übernimmst alle Perspektiven</b><small>Quelle · Raum · Gegenprüfung</small></p><em /></div>
      </div>
    );
  }
  return (
    <div className="team-strip">
      <span>REKONSTRUKTIONSTEAM</span>
      {room.members.map((member) => (
        <div key={member.id}><i>{member.name.slice(0, 1).toUpperCase()}</i><p><b>{member.name}</b><small>{roleForTeam(member.role, room.teamSize)}</small></p><em /></div>
      ))}
      {Array.from({ length: Math.max(0, room.teamSize - room.members.length) }, (_, index) => <div className="waiting" key={index}><i>+</i><p><b>Warte auf Beitritt</b><small>Code {room.code}</small></p></div>)}
    </div>
  );
}

function SourcesView({
  mission,
  room,
  role,
  onEvidence,
  onAdvance,
}: {
  mission: Mission;
  room: Room;
  role: Role;
  onEvidence(payload: Record<string, unknown>): void;
  onAdvance(): void;
}) {
  const narrative = missionNarratives[mission.id];
  const tasks = stationTasks[mission.id];
  const [taskIndex, setTaskIndex] = useState(0);
  const task = tasks[taskIndex];
  const selected = mission.resources.find((resource) => resource.id === task.resourceId) || mission.resources[0];
  const [locator, setLocator] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Sichtbare Beobachtung");
  const [watched, setWatched] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  useEffect(() => {
    setTaskIndex(0);
  }, [mission]);
  useEffect(() => {
    setLocator("");
    setNote("");
    setFeedback(null);
    setCategory(taskCategoryOptions(task)[0]);
  }, [task]);
  const timecodes = locator.match(/\b\d{1,2}:\d{2}\b/g) || [];
  const timecodeOk = timecodes.length >= task.locatorCount;
  const detailOk = note.trim().length >= 40;
  const normalize = (value: string) => value.toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll("ß", "ss");
  const normalizedNote = normalize(note);
  const matchedSignals = task.signalWords.filter((word) => normalizedNote.includes(normalize(word)));
  const signalOk = matchedSignals.length >= task.minSignals;
  const completedTaskIds = new Set(room.evidence.map((item) => item.taskId).filter(Boolean));
  const missionTaskCount = tasks.filter((item) => completedTaskIds.has(item.id)).length;
  const taskCompleted = completedTaskIds.has(task.id);
  const categoryOptions = taskCategoryOptions(task);
  return (
    <div className="source-view">
      <div className="section-title"><div><p className="eyebrow">QUELLENUNTERSUCHUNG · DREI ERMITTLUNGSSCHRITTE</p><h1>Material als Beweis</h1></div><p>Rolle: <b>{roleForTeam(role, room.teamSize)}</b></p></div>
      <div className="story-bridge"><span>ÜBERGANG · FILMARCHIV</span><p>{narrative.transitions.sources}</p><small>{narrative.perspective.name} wartet auf eine Antwort, die mehr trägt als eine Vermutung.</small></div>
      <div className="source-layout">
        <aside className="resource-list">
          <div className="task-progress"><span>{missionTaskCount}/3</span><p><b>Aufgaben gesichert</b><small>Spur → Zusammenhang → Prüfung</small></p></div>
          {tasks.map((item, index) => (
            <button key={item.id} className={`${task.id === item.id ? "active" : ""} ${completedTaskIds.has(item.id) ? "completed" : ""}`} onClick={() => setTaskIndex(index)}>
              <span>{completedTaskIds.has(item.id) ? "✓" : String(index + 1).padStart(2, "0")}</span><p><b>{item.title}</b><small>{item.type}</small></p>
            </button>
          ))}
        </aside>
        <article className="source-reader">
          <header><span>AUFGABE {taskIndex + 1}/3 · FILM {selected.id.toUpperCase()}</span><a href={selected.href} target="_blank" rel="noreferrer">Film separat öffnen ↗</a></header>
          <h2>{selected.title}</h2><p className="source-kind">{selected.kind} · {selected.duration}</p>
          {selected.href.startsWith("/clips/") ? (
            <div className="film-frame local-film"><video src={selected.href} controls playsInline preload="metadata" /></div>
          ) : selected.embedUrl ? (
            <div className="film-frame"><iframe src={selected.embedUrl} title={`Film: ${selected.title}`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
          ) : (
            <div className="film-launch">
              <span aria-hidden="true">▶</span>
              <div><b>Film in der Mediathek ansehen</b><p>Der Anbieter erlaubt keinen sicheren Player im Spiel. Der Film öffnet in einem neuen Tab; kehre danach hierher zurück.</p></div>
              <a href={selected.href} target="_blank" rel="noreferrer">Film starten ↗</a>
            </div>
          )}
          <div className="task-act"><span>{task.act}</span><b>{task.type}</b></div>
          <div className="viewing-focus"><span>FINDE HERAUS</span><p><b>{task.title}</b>{task.question}</p></div>
          <div className="guided-task"><b>Deine Methode</b><p>{task.method} Der Timecode zeigt, <strong>woher deine Antwort stammt.</strong></p></div>
          <label className="watched-check"><input type="checkbox" checked={Boolean(watched[task.id])} onChange={(event) => setWatched((current) => ({ ...current, [task.id]: event.target.checked }))} /><span><b>Benötigte Filmstelle angesehen</b>Ich kann meine Antwort auf Bild oder Ton und einen überprüfbaren Timecode beziehen.</span></label>
        </article>
        <form className="evidence-form" onSubmit={(event) => {
          event.preventDefault();
          if (!watched[task.id]) {
            setFeedback({ type: "error", text: "Bestätige zuerst, dass du die Filmstelle angesehen hast." });
            return;
          }
          if (!timecodeOk) {
            setFeedback({ type: "error", text: task.locatorCount === 2 ? "Diese Aufgabe verlangt zwei Fundstellen. Nutze zum Beispiel 04:32 und 07:10." : "Der Timecode fehlt oder ist nicht lesbar. Nutze zum Beispiel 04:32." });
            return;
          }
          if (!detailOk) {
            setFeedback({ type: "error", text: `Deine Antwort ist noch zu kurz. Arbeite nach der Methode: ${task.method}` });
            return;
          }
          if (!signalOk) {
            setFeedback({ type: "error", text: `Ein Teil der gesuchten Information fehlt noch. Achte im Film zum Beispiel auf: ${task.signalWords.slice(0, 5).join(", ")}.` });
            return;
          }
          onEvidence({ resourceId: selected.id, taskId: task.id, locator, note, category });
          setFeedback({ type: "success", text: task.successFeedback });
        }}>
          <p className="eyebrow">{task.act}</p>
          <label>Aufgabentyp<select disabled={!watched[task.id]} value={category} onChange={(e) => setCategory(e.target.value)}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label>{task.locatorLabel}<input disabled={!watched[task.id]} value={locator} onChange={(e) => { setLocator(e.target.value); setFeedback(null); }} placeholder={task.locatorCount === 2 ? "z. B. 04:32 und 07:10" : "z. B. 04:32"} /></label>
          <label>Deine Ermittlung aus dem Film<textarea disabled={!watched[task.id]} value={note} onChange={(e) => { setNote(e.target.value); setFeedback(null); }} placeholder={task.evidencePrompt} /></label>
          <ul className="live-checks" aria-label="Sofortfeedback zur Filmantwort">
            <li className={timecodeOk ? "passed" : ""}><span>{timecodeOk ? "✓" : "○"}</span> {task.locatorCount === 2 ? "Zwei Timecodes erkannt" : "Timecode erkannt"}</li>
            <li className={detailOk ? "passed" : ""}><span>{detailOk ? "✓" : "○"}</span> Aufgabe konkret bearbeitet</li>
            <li className={signalOk ? "passed" : ""}><span>{signalOk ? "✓" : "○"}</span> {Math.min(matchedSignals.length, task.minSignals)}/{task.minSignals} benötigte Aspekte erkannt</li>
          </ul>
          <button className="primary" type="submit" disabled={!watched[task.id] || feedback?.type === "success" || taskCompleted}>{feedback?.type === "success" || taskCompleted ? "Aufgabe gesichert ✓" : "Ermittlung an Belegwand übergeben"}</button>
          {feedback && <div className={`instant-feedback ${feedback.type}`} role="status"><b>{feedback.type === "success" ? "Antwort gesichert" : "Noch nicht gesichert"}</b><p>{feedback.text}</p></div>}
          {(feedback?.type === "success" || taskCompleted) && taskIndex < 2 && <button className="secondary wide" type="button" onClick={() => setTaskIndex((current) => current + 1)}>Nächster Ermittlungsschritt →</button>}
          {!watched[task.id] && <p className="form-lock">Sieh zuerst die für diese Aufgabe benötigte Filmstelle an.</p>}
          <small>{missionTaskCount}/3 Aufgaben dieser Akte gesichert</small>
        </form>
      </div>
      <div className="next-bar"><span>Erst Spur, Zusammenhang und Archivfehler sichern – dann öffnet sich der Kartenraum.</span><button onClick={onAdvance} disabled={missionTaskCount < 3}>Kartenraum öffnen →</button></div>
    </div>
  );
}

function taskCategoryOptions(task: InvestigationTask) {
  if (task.type === "Bilddetektiv") return ["Sichtbare Beobachtung", "Aussage im Ton"];
  if (task.type === "Ablaufprotokoll") return ["Ereignisfolge", "Wendepunkt"];
  if (task.type === "Ursache–Folge") return ["Ursache–Folge", "Folgewirkung"];
  if (task.type === "Kontrastpaar") return ["Vergleich", "Gegensatz"];
  if (task.type === "Perspektivwechsel") return ["Perspektive", "Auslassung"];
  if (task.type === "Netzwerkrekonstruktion") return ["Beziehungsnetz", "Handlungskette"];
  if (task.type === "Begriffsprüfung") return ["Begriffsprüfung", "Deutungsrahmen"];
  if (task.type === "Quellenkritik") return ["Aussagegrenze", "Auslassung"];
  return ["Behauptungscheck", "Gegenbeleg"];
}

function TimelineView({ mission }: { mission: Mission }) {
  const [era, setEra] = useState<"Alle" | TimelineEra>("Alle");
  const visibleEvents = era === "Alle" ? timelineEvents : timelineEvents.filter((event) => event.era === era);
  return (
    <div className="timeline-view">
      <div className="section-title">
        <div><p className="eyebrow">BERLIN IN DER ZEIT</p><h1>Vom Handelsort zur Hauptstadt</h1></div>
        <p>{timelineEvents[0].year}–{timelineEvents[timelineEvents.length - 1].year}</p>
      </div>
      <div className="timeline-intro">
        <p>Die Zeitleiste ordnet die neun Akten in die längere Stadtgeschichte ein. Farbig markierte Ereignisse gehören zur aktuellen Akte <b>{mission.number}</b>.</p>
        <div>
          <a href={timelineSources["Zeitreisen Berlin"]} target="_blank" rel="noreferrer">Zeitreisen Berlin ↗</a>
          <a href={timelineSources.Wikipedia} target="_blank" rel="noreferrer">Geschichte Berlins ↗</a>
        </div>
      </div>
      <nav className="era-filter" aria-label="Zeitraum filtern">
        {(["Alle", ...timelineEras] as const).map((item) => <button key={item} className={era === item ? "active" : ""} onClick={() => setEra(item)}>{item}</button>)}
      </nav>
      <div className="timeline-track" aria-label="Chronologie wichtiger Ereignisse">
        {visibleEvents.map((event) => {
          const active = event.missionId === mission.id;
          return (
            <article key={`${event.year}-${event.title}`} className={active ? "active" : ""}>
              <time>{event.year}</time>
              <i aria-hidden="true" />
              <div><span>{event.era}</span><h2>{event.title}</h2><p>{event.text}</p><a href={timelineSources[event.source]} target="_blank" rel="noreferrer">{event.source} ↗</a></div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function MapView({ mission, room, onPin, onAdvance }: { mission: Mission; room: Room; onPin(payload: Record<string, unknown>): void; onAdvance(): void }) {
  const narrative = missionNarratives[mission.id];
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activePlace, setActivePlace] = useState(mission.map.places[0]);
  const [note, setNote] = useState("");
  const [stance, setStance] = useState<Pin["stance"]>();
  const [mapIndex, setMapIndex] = useState(mission.map.alternatives ? mission.map.alternatives.length - 1 : 0);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const selectedMap = mission.map.alternatives?.[mapIndex];
  const mapSrc = selectedMap?.src || mission.map.src;
  const mapTitle = selectedMap?.title || mission.map.title;
  const mapSource = selectedMap?.source || mission.map.source;
  const mapSourceHref = selectedMap?.sourceHref || mission.map.sourceHref;
  const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); };
  useEffect(() => {
    reset();
    setMapIndex(mission.map.alternatives ? mission.map.alternatives.length - 1 : 0);
  }, [mission]);
  return (
    <div className="map-view">
      <div className="section-title"><div><p className="eyebrow">KARTENEINGRIFF</p><h1>{mapTitle}</h1></div><p>{mapSource}</p></div>
      <div className="story-bridge map-bridge"><span>ÜBERGANG · STADTRAUM</span><p>{narrative.transitions.map}</p><small>Perspektivfrage: {narrative.perspective.question}</small></div>
      {mission.map.alternatives && (
        <nav className="map-switcher" aria-label="Kartenjahr wählen">
          <span>Zeitschnitt</span>
          {mission.map.alternatives.map((map, index) => (
            <button key={map.label} className={index === mapIndex ? "active" : ""} onClick={() => setMapIndex(index)}>{map.label}</button>
          ))}
          <small>Direkt eingebettet und zoombar</small>
        </nav>
      )}
      <div className="map-layout">
        <div
          className="map-canvas"
          tabIndex={0}
          onWheel={(e) => {
            e.preventDefault();
            setZoom((value) => Math.min(4, Math.max(1, value + (e.deltaY < 0 ? 0.2 : -0.2))));
          }}
          onPointerDown={(e) => {
            if (mission.map.type === "embed") return;
            drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            setOffset({ x: drag.current.ox + e.clientX - drag.current.x, y: drag.current.oy + e.clientY - drag.current.y });
          }}
          onPointerUp={() => { drag.current = null; }}
          onKeyDown={(e) => {
            if (e.key === "+" || e.key === "=") setZoom((v) => Math.min(4, v + 0.2));
            if (e.key === "-") setZoom((v) => Math.max(1, v - 0.2));
            if (e.key === "Home") reset();
            if (e.key === "ArrowLeft") setOffset((v) => ({ ...v, x: v.x + 30 }));
            if (e.key === "ArrowRight") setOffset((v) => ({ ...v, x: v.x - 30 }));
            if (e.key === "ArrowUp") setOffset((v) => ({ ...v, y: v.y + 30 }));
            if (e.key === "ArrowDown") setOffset((v) => ({ ...v, y: v.y - 30 }));
          }}
          aria-label={`Zoombare Karte: ${mapTitle}`}
        >
          {mission.map.type === "embed" ? (
            <iframe key={mapSrc} src={mapSrc} title={mapTitle} loading="lazy" />
          ) : (
            <div className="image-stage" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mapSrc} alt={`${mapTitle}, historische Karte`} draggable={false} />
              {mission.map.places.map((place) => (
                <button key={place.id} className={`map-marker ${activePlace.id === place.id ? "active" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} onClick={(e) => { e.stopPropagation(); setActivePlace(place); }} title={place.label}><span>{mission.map.places.indexOf(place) + 1}</span></button>
              ))}
            </div>
          )}
          <div className="map-controls">
            <button onClick={() => setZoom((v) => Math.min(4, v + 0.25))} aria-label="Karte vergrössern">+</button>
            <button onClick={() => setZoom((v) => Math.max(1, v - 0.25))} aria-label="Karte verkleinern">−</button>
            <button onClick={reset} aria-label="Kartenansicht zurücksetzen">⌂</button>
          </div>
          <span className="zoom-readout">{Math.round(zoom * 100)}%</span>
        </div>
        <aside className="map-task">
          <p className="eyebrow">RAUMAUFTRAG · HYPOTHESE PRÜFEN</p><h2>Orte als Argument</h2><p>{mission.map.task}</p>
          {room.investigation && <blockquote className="map-hypothesis">„{room.investigation.hypothesis}“</blockquote>}
          <div className="place-list">
            {mission.map.places.map((place, index) => {
              const pinned = room.mapPins.some((pin) => pin.placeId === place.id);
              return <button key={place.id} className={activePlace.id === place.id ? "active" : ""} onClick={() => setActivePlace(place)}><span>{index + 1}</span><p><b>{place.label}</b><small>{place.clue}</small></p>{pinned && <i>✓</i>}</button>;
            })}
          </div>
          <label>Räumliche Gegenprüfung<textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Wie stützt, begrenzt oder widerlegt ${activePlace.label} eure Hypothese?`} /></label>
          <div className="stance-picker" aria-label="Wirkung des Ortes auf die Hypothese">
            <span>Der Ort …</span>
            {(["stützt", "begrenzt", "widerlegt"] as const).map((item) => <button key={item} className={stance === item ? "active" : ""} onClick={() => setStance(item)}>{item}</button>)}
          </div>
          <small className="map-depth-check">{note.trim().length}/35 Zeichen · {stance ? `Einordnung: ${stance}` : "Einordnung fehlt"}</small>
          <button className="primary wide" disabled={note.trim().length < 35 || !stance} onClick={() => { onPin({ placeId: activePlace.id, stance, note }); setNote(""); setStance(undefined); }}>Ort mit Hypothese verknüpfen</button>
          {mapSourceHref && <a className="source-link" href={mapSourceHref} target="_blank" rel="noreferrer">Originalquelle öffnen ↗</a>}
        </aside>
      </div>
      <div className="next-bar"><span>{room.mapPins.length}/{Math.min(3, mission.map.places.length)} Orte verknüpft</span><button onClick={onAdvance} disabled={room.mapPins.length < Math.min(2, mission.map.places.length)}>Urteil formulieren →</button></div>
    </div>
  );
}

function EvidenceBoard({ mission, room }: { mission: Mission; room: Room }) {
  return (
    <div className="evidence-board">
      <div className="section-title"><div><p className="eyebrow">GEMEINSAME BELEGSAMMLUNG</p><h1>Was trägt die Rekonstruktion?</h1></div><p>{room.evidence.length} Quellenbelege · {room.mapPins.length} Kartenbezüge</p></div>
      <div className="evidence-columns">
        {["Sichtbare Beobachtung", "Aussage im Ton", "Deutung des Films", "Auslassung"].map((category) => (
          <section key={category}><header><b>{category}</b><span>{room.evidence.filter((item) => item.category === category).length}</span></header>
            {room.evidence.filter((item) => item.category === category).map((item) => <article key={item.id}><span>{item.resourceId.toUpperCase()} · {item.locator}</span><p>{item.note}</p><footer>{item.actor} · {roleForTeam(item.role, room.teamSize)}</footer></article>)}
            {!room.evidence.some((item) => item.category === category) && <p className="empty">Noch kein Beleg</p>}
          </section>
        ))}
      </div>
      <div className="requirements">
        {mission.requirements.map((requirement) => <div key={requirement.label}><span>{room.evidence.length + room.mapPins.length > 0 ? "✓" : "○"}</span><p><b>{requirement.type.toUpperCase()}</b>{requirement.label}</p></div>)}
      </div>
    </div>
  );
}

function VerdictView({ mission, room, onSave }: { mission: Mission; room: Room; onSave(verdict: string, submit: boolean, theoryStatus: Investigation["status"]): void }) {
  const narrative = missionNarratives[mission.id];
  const [verdict, setVerdict] = useState(room.verdict);
  const [theoryStatus, setTheoryStatus] = useState<Investigation["status"]>(room.investigation?.status || "offen");
  useEffect(() => setVerdict(room.verdict), [room.verdict, mission]);
  useEffect(() => setTheoryStatus(room.investigation?.status || "offen"), [room.investigation?.status, mission]);
  const ready = room.evidence.length >= 3 && room.mapPins.length >= 2 && verdict.trim().length >= 180 && theoryStatus !== "offen";
  return (
    <div className="verdict-view">
      <div className="section-title"><div><p className="eyebrow">HISTORISCHES URTEIL</p><h1>Akte reparieren</h1></div><span className={ready ? "ready-badge" : "pending-badge"}>{ready ? "PRÜFBEREIT" : "BELEGE FEHLEN"}</span></div>
      <div className="story-bridge verdict-bridge"><span>LETZTE ARCHIVMELDUNG</span><p>{narrative.transitions.verdict}</p><small>Ihr entscheidet jetzt, welche Geschichte im digitalen Museum bleibt.</small></div>
      <div className="verdict-layout">
        <article className="verdict-editor">
          <p className="guiding-question">{mission.problem}</p>
          {room.investigation && (
            <div className="hypothesis-decision">
              <span>ENTSCHEIDUNG ZUR PRÜFHYPOTHESE</span>
              <blockquote>„{room.investigation.hypothesis}“</blockquote>
              <div>
                {(["bestätigt", "eingeschränkt", "verworfen"] as const).map((status) => (
                  <button key={status} className={theoryStatus === status ? "active" : ""} onClick={() => setTheoryStatus(status)}>{status}</button>
                ))}
              </div>
              <small>Wähle nach der Beweislage – nicht nach der Ausgangsvermutung.</small>
            </div>
          )}
          <textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="Repariert die Archivfassung: Entscheidung zur Hypothese, drei konkrete Filmbelege, mindestens zwei räumliche Zuordnungen und die Grenze eurer Aussage." />
          <div className="editor-footer"><span>{verdict.length}/180 Zeichen</span><button onClick={() => onSave(verdict, false, theoryStatus)}>Entwurf sichern</button><button className="primary" disabled={!ready} onClick={() => onSave(verdict, true, theoryStatus)}>Akte abschliessen ✓</button></div>
        </article>
        <aside className="verdict-check">
          <p className="eyebrow">QUALITÄTSPRÜFUNG</p>
          {mission.requirements.map((item, index) => {
            const values = [room.evidence.length >= 3, room.mapPins.length >= 2, theoryStatus !== "offen", verdict.length >= 180];
            return <div key={item.label} className={values[index] ? "passed" : ""}><span>{values[index] ? "✓" : index + 1}</span><p><b>{item.label}</b><small>{item.type}</small></p></div>;
          })}
          <blockquote>„{mission.reflection}“</blockquote>
        </aside>
      </div>
      {room.verdictSubmitted && <><div className="narrative-resolution"><span>AKTE REKONSTRUIERT</span><p>{narrative.closing}</p><small>{narrative.perspective.name} ist nicht «die Stimme» der Epoche. Die Figur erinnert daran, dass historische Urteile immer konkrete Leben berühren.</small></div><ScorePanel room={room} /></>}
    </div>
  );
}

function ScorePanel({ room }: { room: Room }) {
  const dimensions = [
    ["source", "Quellensicherheit"],
    ["space", "Raumverständnis"],
    ["perspective", "Perspektivenvielfalt"],
    ["reconstruction", "Rekonstruktionsqualität"],
  ];
  return <div className="score-panel">{dimensions.map(([key, label]) => <div key={key}><span>{label}</span><i><b style={{ width: `${((room.scores[key] || 0) / 3) * 100}%` }} /></i><strong>{room.scores[key] || 0}/3</strong></div>)}</div>;
}

function Finale({ room, onSave }: { room: Room; onSave(value: NonNullable<Room["finalMuseum"]>): void }) {
  const allPlaces = missions.flatMap((mission) => mission.map.places.map((place) => `${place.label} (${mission.period})`));
  const [places, setPlaces] = useState<string[]>(room.finalMuseum?.places || []);
  const [text, setText] = useState(room.finalMuseum?.text || "");
  const [omission, setOmission] = useState(room.finalMuseum?.omission || "");
  return (
    <div className="finale">
      <p className="eyebrow">SCHLUSSAKTE · DIGITALER MUSEUMSRAUM</p><h1>Drei Orte. Neun Stationen.<br />Eine unvermeidliche Lücke.</h1><p className="final-prompt">{finalPrompt}</p>
      <div className="museum-grid">
        {[0, 1, 2].map((index) => <label key={index}><span>ORT {index + 1}</span><select value={places[index] || ""} onChange={(e) => { const next = [...places]; next[index] = e.target.value; setPlaces(next); }}><option value="">Ort auswählen …</option>{allPlaces.map((place) => <option key={`${index}-${place}`}>{place}</option>)}</select><div className="museum-plinth">{places[index] ? <><b>{places[index]}</b><small>Quelle und Kartenansicht aus der Belegsammlung</small></> : <span>+</span>}</div></label>)}
      </div>
      <div className="final-writing"><label>Ausstellungstext<textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Welche Geschichte erzählen diese drei Orte gemeinsam?" /></label><label className="omission">Auslassungsreflexion<textarea value={omission} onChange={(e) => setOmission(e.target.value)} placeholder="Welche Geschichte Berlins würde durch diese Auswahl verloren gehen?" /></label></div>
      <button className="primary final-save" disabled={places.filter(Boolean).length !== 3 || text.length < 100 || omission.length < 80} onClick={() => onSave({ places, text, omission })}>Museumsraum sichern →</button>
    </div>
  );
}

function TeacherView({ room, onBack, onOpenGame, onAction }: { room: Room; onBack(): void; onOpenGame(): void; onAction(action: string, payload?: Record<string, unknown>): void }) {
  const mission = missions[room.missionIndex];
  return (
    <main className="teacher">
      <header><Brand /><div><span>SPIELLEITUNG</span><b>Raum {room.code}</b></div><button onClick={onOpenGame}>Spielansicht</button><button onClick={onBack}>Schliessen</button></header>
      <section className="teacher-hero"><div><p className="eyebrow">LIVE-PROZESS</p><h1>{mission.number}: {mission.title}</h1><p>{phases[room.phase]} · zuletzt aktualisiert {new Date(room.updatedAt || Date.now()).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}</p></div><div className="teacher-actions"><button onClick={() => onAction("advance")}>Nächste Phase freigeben</button>{room.missionIndex < 4 && <button className="primary" onClick={() => onAction("set-mission", { missionIndex: room.missionIndex + 1 })}>Nächste Akte →</button>}</div></section>
      <div className="teacher-grid">
        <section><h2>Teambeiträge</h2>{room.members.map((member) => { const count = room.evidence.filter((e) => e.actor === member.name).length + room.mapPins.filter((p) => p.actor === member.name).length; return <div className="member-row" key={member.id}><i>{member.name[0]}</i><p><b>{member.name}</b><small>{roleForTeam(member.role, room.teamSize)}</small></p><span>{count} Beiträge</span><em className="online">im Raum</em></div>; })}</section>
        <section><h2>Prozessindikatoren</h2><div className="metrics"><div><span>{room.evidence.length}</span><b>Belege</b></div><div><span>{room.mapPins.length}</span><b>Kartenbezüge</b></div><div><span>{room.completedMissions.length}/9</span><b>Akten</b></div><div><span>{room.verdict.length}</span><b>Urteilszeichen</b></div></div><ScorePanel room={room} /></section>
        <section className="event-log"><h2>Aktivitätsverlauf</h2>{[...room.events].reverse().slice(0, 12).map((event) => <div key={event.id}><time>{new Date(event.at).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}</time><p><b>{event.actor}</b>{event.detail}</p><span>{event.type}</span></div>)}</section>
        <section className="teacher-evidence"><h2>Letzte Belege</h2>{room.evidence.slice(-6).reverse().map((item) => <article key={item.id}><span>{item.category} · {item.resourceId.toUpperCase()}</span><p>{item.note}</p><small>{item.actor} · {item.locator}</small></article>)}{room.evidence.length === 0 && <p className="empty">Noch keine Belege eingereicht.</p>}</section>
      </div>
    </main>
  );
}
