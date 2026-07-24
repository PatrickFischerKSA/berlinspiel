"use client";
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/purity */

import { useCallback, useEffect, useRef, useState } from "react";
import { finalPrompt, missions, roleLabels, type Mission } from "../data/game";

type Role = keyof typeof roleLabels;
type Member = { id: string; name: string; role: Role; lastSeenAt?: number };
type Evidence = {
  id: string;
  actor: string;
  role: Role;
  resourceId: string;
  locator: string;
  note: string;
  category: string;
  at: number;
};
type Pin = { id: string; actor: string; placeId: string; note: string; at: number };
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
        busy={busy}
        message={message}
        onResume={resume}
        onCreate={() => setScreen("create")}
        onJoin={() => setScreen("join")}
        onSolo={() => {
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
      locator: String(payload.locator),
      note: String(payload.note),
      category: String(payload.category),
      at: Date.now(),
    });
    event("evidence", "Beleg gesichert");
  }
  if (action === "pin") {
    next.mapPins.push({
      id: crypto.randomUUID(),
      actor,
      placeId: String(payload.placeId),
      note: String(payload.note),
      at: Date.now(),
    });
    event("map", `Ort ${String(payload.placeId)} verknüpft`);
  }
  if (action === "verdict") {
    next.verdict = String(payload.verdict);
    next.verdictSubmitted = Boolean(payload.submit);
    if (payload.submit) {
      if (!next.completedMissions.includes(String(next.missionIndex))) next.completedMissions.push(String(next.missionIndex));
      next.scores = {
        source: Math.min(3, next.evidence.length),
        space: Math.min(3, next.mapPins.length),
        perspective: Math.min(3, next.evidence.length >= 2 ? 2 : next.evidence.length),
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
  busy,
  message,
  onResume,
  onCreate,
  onJoin,
  onSolo,
  onDemo,
}: {
  hasSession: boolean;
  busy: boolean;
  message: string;
  onResume(): void;
  onCreate(): void;
  onJoin(): void;
  onSolo(): void;
  onDemo(size: 2 | 3): void;
}) {
  return (
    <main className="welcome">
      <div className="noise" />
      <header className="welcome-nav"><Brand /><span className="status-pill"><i /> Archivnetz online</span></header>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">BERLIN · JAHR 2040</p>
          <h1>Die Geschichte<br />ist <em>beschädigt.</em></h1>
          <p className="lead">
            Fünf Berlin-Akten wurden falsch datiert, verkürzt und manipuliert.
            Bildet ein Rekonstruktionsteam. Untersucht Quellen, verfolgt Orte und
            repariert das digitale Museum.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={onCreate}>Raum eröffnen <span>→</span></button>
            <button className="secondary" onClick={onJoin}>Mit Raumcode beitreten</button>
            <button className="secondary solo-button" onClick={onSolo}>Allein ermitteln</button>
          </div>
          {hasSession && <button className="resume-link" disabled={busy} onClick={onResume}>↻ Letzte Sitzung wiederaufnehmen</button>}
          {message && <p className="alert">{message}</p>}
        </div>
        <div className="case-stack" aria-label="Fünf beschädigte Berlin-Akten">
          {missions.map((mission, index) => (
            <article key={mission.id} className="case-card" style={{ "--i": index, "--accent": mission.accent } as React.CSSProperties}>
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
  onExit,
}: {
  room: Room;
  busy: boolean;
  message: string;
  onAction(action: string, payload?: Record<string, unknown>): void;
  onTeacher(): void;
  onExit(): void;
}) {
  const mission = missions[room.missionIndex];
  const [tab, setTab] = useState<"case" | "sources" | "map" | "evidence" | "verdict" | "final">("case");
  const [role, setRole] = useState<Role>(room.viewer?.role || "source");
  const effectiveRole = room.mode === "desktop" || room.mode === "demo" || room.mode === "solo" ? role : room.viewer?.role || "source";
  useEffect(() => {
    const phaseTabs = ["case", "case", "sources", "map", "verdict"] as const;
    setTab(phaseTabs[room.phase]);
  }, [room.phase, room.missionIndex]);

  const canFinal = room.completedMissions.length >= 5 || room.mode === "demo";
  return (
    <main className="game" style={{ "--mission": mission.accent } as React.CSSProperties}>
      <header className="game-header">
        <Brand />
        <div className="room-code"><span>{room.mode === "solo" ? "EINZELSPIEL" : "RAUM"}</span><b>{room.code}</b><small>{room.mode === "solo" ? "Fortschritt lokal gespeichert" : `${room.members.length}/${room.teamSize} verbunden`}</small></div>
        <div className="header-actions">
          {room.mode !== "solo" && <button onClick={onTeacher} title="Spielleitungsansicht">▦</button>}
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
          <button key={phase} className={index === room.phase ? "current" : index < room.phase ? "done" : ""} disabled={index > room.phase} onClick={() => {
            const tabs = ["case", "case", "sources", "map", "verdict"] as const;
            setTab(tabs[index]);
          }}>
            <span>{phaseIcons[index]}</span><b>{phase}</b>
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
        {tab === "case" && <CaseView mission={mission} room={room} role={effectiveRole} onAdvance={() => onAction("advance")} busy={busy} />}
        {tab === "sources" && <SourcesView mission={mission} room={room} role={effectiveRole} onEvidence={(payload) => onAction("evidence", { ...payload, role: effectiveRole })} onAdvance={() => onAction("advance")} />}
        {tab === "map" && <MapView mission={mission} room={room} onPin={(payload) => onAction("pin", payload)} onAdvance={() => onAction("advance")} />}
        {tab === "evidence" && <EvidenceBoard mission={mission} room={room} />}
        {tab === "verdict" && <VerdictView mission={mission} room={room} onSave={(verdict, submit) => onAction("verdict", { verdict, submit })} />}
        {tab === "final" && <Finale room={room} onSave={(finalMuseum) => onAction("final-museum", { finalMuseum })} />}
      </section>
      <nav className="utility-nav">
        <button className={tab === "case" ? "active" : ""} onClick={() => setTab("case")}>▤<span>Akte</span></button>
        <button className={tab === "sources" ? "active" : ""} onClick={() => setTab("sources")}>◫<span>Quellen</span></button>
        <button className={tab === "map" ? "active" : ""} onClick={() => setTab("map")}>⌖<span>Karte</span></button>
        <button className={tab === "evidence" ? "active" : ""} onClick={() => setTab("evidence")}>⌁<span>Belege <i>{room.evidence.length}</i></span></button>
        <button className={tab === "verdict" ? "active" : ""} onClick={() => setTab("verdict")}>✓<span>Urteil</span></button>
      </nav>
    </main>
  );
}

function CaseView({ mission, room, role, onAdvance, busy }: { mission: Mission; room: Room; role: Role; onAdvance(): void; busy: boolean }) {
  return (
    <div className="case-view">
      <div className="case-heading">
        <div><p className="eyebrow">{mission.number} · {mission.period}</p><h1>{mission.title}</h1><p>{mission.subtitle}</p></div>
        <span className="classification">BESCHÄDIGT</span>
      </div>
      <div className="case-grid">
        <article className="damaged-document">
          <span className="doc-label">FEHLERHAFTE ARCHIVFASSUNG</span>
          <blockquote>„{mission.damagedClaim}“</blockquote>
          <div className="redaction" /><div className="redaction short" />
          <p className="stamp">KONTEXT FEHLT</p>
        </article>
        <div className="briefing">
          <p className="eyebrow">STÖRUNG</p><h2>{mission.problem}</h2><p>{mission.disturbance}</p>
          <div className="role-card">
            <span>DEIN AUFTRAG</span><b>{roleForTeam(role, room.teamSize)}</b><p>{mission.roles[role]}</p>
          </div>
          <button className="primary" disabled={busy} onClick={onAdvance}>Spurensuche starten →</button>
        </div>
      </div>
      <TeamStrip room={room} />
    </div>
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
  const [selected, setSelected] = useState(mission.resources[0]);
  const [locator, setLocator] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("Beobachtung");
  const [watched, setWatched] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setSelected(mission.resources[0]);
    setLocator("");
    setNote("");
  }, [mission]);
  const roleIndex = role === "source" ? 0 : role === "space" ? 1 : 2;
  return (
    <div className="source-view">
      <div className="section-title"><div><p className="eyebrow">QUELLENUNTERSUCHUNG</p><h1>Material als Beweis</h1></div><p>Rolle: <b>{roleForTeam(role, room.teamSize)}</b></p></div>
      <div className="source-layout">
        <aside className="resource-list">
          {mission.resources.map((resource, index) => (
            <button key={resource.id} className={selected.id === resource.id ? "active" : ""} onClick={() => setSelected(resource)}>
              <span>{String(index + 1).padStart(2, "0")}</span><p><b>{resource.title}</b><small>{resource.kind}</small></p>
            </button>
          ))}
        </aside>
        <article className="source-reader">
          <header><span>FILM {selected.id.toUpperCase()}</span><a href={selected.href} target="_blank" rel="noreferrer">Film separat öffnen ↗</a></header>
          <h2>{selected.title}</h2><p className="source-kind">{selected.kind} · {selected.duration}</p>
          {selected.embedUrl ? (
            <div className="film-frame"><iframe src={selected.embedUrl} title={`Film: ${selected.title}`} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div>
          ) : (
            <div className="film-launch">
              <span aria-hidden="true">▶</span>
              <div><b>Film in der Mediathek ansehen</b><p>Der Anbieter erlaubt keinen sicheren Player im Spiel. Der Film öffnet in einem neuen Tab; kehre danach hierher zurück.</p></div>
              <a href={selected.href} target="_blank" rel="noreferrer">Film starten ↗</a>
            </div>
          )}
          <div className="viewing-focus"><span>VOR DEM START</span><p><b>Beobachtungsfokus</b>{selected.viewingFocus}</p></div>
          <label className="watched-check"><input type="checkbox" checked={Boolean(watched[selected.id])} onChange={(event) => setWatched((current) => ({ ...current, [selected.id]: event.target.checked }))} /><span><b>Filmstelle angesehen</b>Ich kann im Film einen Timecode nennen und meine Antwort auf Bild oder Ton beziehen.</span></label>
          <div className={`observation-prompt ${watched[selected.id] ? "" : "locked"}`}><span>{roleIndex + 1}</span><p><b>Auftrag nach dem Film</b>{watched[selected.id] ? selected.prompt : "Die Auswertungsfrage wird freigegeben, sobald du die Filmstelle angesehen hast."}</p></div>
        </article>
        <form className="evidence-form" onSubmit={(event) => {
          event.preventDefault();
          if (!watched[selected.id] || !note.trim() || !locator.trim()) return;
          onEvidence({ resourceId: selected.id, locator, note, category });
          setNote(""); setLocator("");
        }}>
          <p className="eyebrow">FILMBELEG SICHERN</p>
          <label>Art<select disabled={!watched[selected.id]} value={category} onChange={(e) => setCategory(e.target.value)}><option>Sichtbare Beobachtung</option><option>Aussage im Ton</option><option>Deutung des Films</option><option>Auslassung</option></select></label>
          <label>Timecode im Film<input disabled={!watched[selected.id]} value={locator} onChange={(e) => setLocator(e.target.value)} placeholder="z. B. 04:32–05:10" /></label>
          <label>Beobachtung und Relevanz<textarea disabled={!watched[selected.id]} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Was ist im Film konkret zu sehen oder zu hören – und was belegt es?" /></label>
          <button className="primary" type="submit" disabled={!watched[selected.id]}>Filmbeleg an Belegwand übergeben</button>
          {!watched[selected.id] && <p className="form-lock">Sieh zuerst den Film beziehungsweise die benötigte Filmstelle an.</p>}
          <small>{room.evidence.length} Belege im Team gesichert</small>
        </form>
      </div>
      <div className="next-bar"><span>Mindestens zwei konkrete Filmstellen mit Timecode sichern.</span><button onClick={onAdvance} disabled={room.evidence.length < 2}>Kartenraum öffnen →</button></div>
    </div>
  );
}

function MapView({ mission, room, onPin, onAdvance }: { mission: Mission; room: Room; onPin(payload: Record<string, unknown>): void; onAdvance(): void }) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activePlace, setActivePlace] = useState(mission.map.places[0]);
  const [note, setNote] = useState("");
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
          <p className="eyebrow">RAUMAUFTRAG</p><h2>Orte als Argument</h2><p>{mission.map.task}</p>
          <div className="place-list">
            {mission.map.places.map((place, index) => {
              const pinned = room.mapPins.some((pin) => pin.placeId === place.id);
              return <button key={place.id} className={activePlace.id === place.id ? "active" : ""} onClick={() => setActivePlace(place)}><span>{index + 1}</span><p><b>{place.label}</b><small>{place.clue}</small></p>{pinned && <i>✓</i>}</button>;
            })}
          </div>
          <label>Begründung<textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={`Warum ist ${activePlace.label} für die Akte wichtig?`} /></label>
          <button className="primary wide" disabled={!note.trim()} onClick={() => { onPin({ placeId: activePlace.id, note }); setNote(""); }}>Ort mit Beleg verknüpfen</button>
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
        {["Beobachtung", "Deutung", "Gegenbeleg", "Auslassung"].map((category) => (
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

function VerdictView({ mission, room, onSave }: { mission: Mission; room: Room; onSave(verdict: string, submit: boolean): void }) {
  const [verdict, setVerdict] = useState(room.verdict);
  useEffect(() => setVerdict(room.verdict), [room.verdict, mission]);
  const ready = room.evidence.length >= 2 && room.mapPins.length >= 2 && verdict.trim().length >= 120;
  return (
    <div className="verdict-view">
      <div className="section-title"><div><p className="eyebrow">HISTORISCHES URTEIL</p><h1>Akte reparieren</h1></div><span className={ready ? "ready-badge" : "pending-badge"}>{ready ? "PRÜFBEREIT" : "BELEGE FEHLEN"}</span></div>
      <div className="verdict-layout">
        <article className="verdict-editor">
          <p className="guiding-question">{mission.problem}</p>
          <textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="Formuliert eine neue Archivfassung. Nennt konkrete Belege, räumliche Zuordnungen, Perspektivgrenzen und ein nachvollziehbares Urteil." />
          <div className="editor-footer"><span>{verdict.length} Zeichen</span><button onClick={() => onSave(verdict, false)}>Entwurf sichern</button><button className="primary" disabled={!ready} onClick={() => onSave(verdict, true)}>Akte abschliessen ✓</button></div>
        </article>
        <aside className="verdict-check">
          <p className="eyebrow">QUALITÄTSPRÜFUNG</p>
          {mission.requirements.map((item, index) => {
            const values = [room.evidence.length >= 2, room.mapPins.length >= 2, room.evidence.some((e) => e.category === "Gegenbeleg" || e.category === "Auslassung"), verdict.length >= 120];
            return <div key={item.label} className={values[index] ? "passed" : ""}><span>{values[index] ? "✓" : index + 1}</span><p><b>{item.label}</b><small>{item.type}</small></p></div>;
          })}
          <blockquote>„{mission.reflection}“</blockquote>
        </aside>
      </div>
      {room.verdictSubmitted && <ScorePanel room={room} />}
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
      <p className="eyebrow">SCHLUSSAKTE · DIGITALER MUSEUMSRAUM</p><h1>Drei Orte. Fünf Epochen.<br />Eine unvermeidliche Lücke.</h1><p className="final-prompt">{finalPrompt}</p>
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
        <section><h2>Prozessindikatoren</h2><div className="metrics"><div><span>{room.evidence.length}</span><b>Belege</b></div><div><span>{room.mapPins.length}</span><b>Kartenbezüge</b></div><div><span>{room.completedMissions.length}/5</span><b>Akten</b></div><div><span>{room.verdict.length}</span><b>Urteilszeichen</b></div></div><ScorePanel room={room} /></section>
        <section className="event-log"><h2>Aktivitätsverlauf</h2>{[...room.events].reverse().slice(0, 12).map((event) => <div key={event.id}><time>{new Date(event.at).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" })}</time><p><b>{event.actor}</b>{event.detail}</p><span>{event.type}</span></div>)}</section>
        <section className="teacher-evidence"><h2>Letzte Belege</h2>{room.evidence.slice(-6).reverse().map((item) => <article key={item.id}><span>{item.category} · {item.resourceId.toUpperCase()}</span><p>{item.note}</p><small>{item.actor} · {item.locator}</small></article>)}{room.evidence.length === 0 && <p className="empty">Noch keine Belege eingereicht.</p>}</section>
      </div>
    </main>
  );
}
