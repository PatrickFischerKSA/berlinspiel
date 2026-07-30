/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
  TEACHER_PASSWORD?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

type StoredMember = {
  id: string;
  name: string;
  role: "source" | "space" | "critic";
  token: string;
  joinedAt: number;
  lastSeenAt: number;
};

type StoredRoom = {
  code: string;
  teamSize: 2 | 3;
  mode: "multi" | "desktop" | "demo" | "solo";
  missionIndex: number;
  phase: number;
  members: StoredMember[];
  evidence: unknown[];
  mapPins: unknown[];
  investigation?: {
    hypothesis: string;
    manipulation: string;
    status: "offen" | "bestätigt" | "eingeschränkt" | "verworfen";
  };
  verdict: string;
  verdictSubmitted: boolean;
  scores: Record<string, number>;
  events: { id: string; at: number; actor: string; type: string; detail: string }[];
  completedMissions: string[];
  finalMuseum?: unknown;
  updatedAt: number;
};

const roles: StoredMember["role"][] = ["source", "space", "critic"];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function randomText(length: number, alphabet: string) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (value) => alphabet[value % alphabet.length]).join("");
}

async function ensureRooms(db: D1Database) {
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS rooms (
        code TEXT PRIMARY KEY,
        state TEXT NOT NULL,
        teacher_token TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        expires_at INTEGER NOT NULL
      )`,
    )
    .run();
}

async function loadRoom(db: D1Database, code: string) {
  const row = await db
    .prepare("SELECT state, teacher_token FROM rooms WHERE code = ? AND expires_at > ?")
    .bind(code, Date.now())
    .first<{ state: string; teacher_token: string }>();
  if (!row) return null;
  return { state: JSON.parse(row.state) as StoredRoom, teacherToken: row.teacher_token };
}

function publicRoom(room: StoredRoom, token?: string) {
  const viewer = room.members.find((member) => member.token === token);
  return {
    ...room,
    members: room.members.map(({ token: _token, ...member }) => {
      void _token;
      return member;
    }),
    viewer: viewer ? { id: viewer.id, name: viewer.name, role: viewer.role } : null,
  };
}

function pushEvent(room: StoredRoom, actor: string, type: string, detail: string) {
  room.events.push({
    id: crypto.randomUUID(),
    at: Date.now(),
    actor,
    type,
    detail: detail.slice(0, 240),
  });
  room.events = room.events.slice(-200);
  room.updatedAt = Date.now();
}

async function saveRoom(db: D1Database, room: StoredRoom) {
  await db
    .prepare("UPDATE rooms SET state = ?, updated_at = ? WHERE code = ?")
    .bind(JSON.stringify(room), Date.now(), room.code)
    .run();
}

function passwordMatches(candidate: string, expected: string) {
  const left = new TextEncoder().encode(candidate);
  const right = new TextEncoder().encode(expected);
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function teacherApi(request: Request, env: Env) {
  if (!env.DB) return json({ error: "Die Raumdatenbank ist noch nicht verbunden." }, 503);
  if (!env.TEACHER_PASSWORD) return json({ error: "Der Lehrerbereich ist noch nicht konfiguriert." }, 503);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  if (!passwordMatches(String(body.password ?? ""), env.TEACHER_PASSWORD)) {
    return json({ error: "Passwort nicht korrekt." }, 403);
  }
  await ensureRooms(env.DB);
  const action = String(body.action ?? "list");
  if (action === "open") {
    const code = String(body.code ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
    const loaded = await loadRoom(env.DB, code);
    if (!loaded) return json({ error: "Raum nicht gefunden oder abgelaufen." }, 404);
    return json({ room: publicRoom(loaded.state), token: loaded.teacherToken });
  }
  const result = await env.DB
    .prepare("SELECT code, state, created_at, updated_at, expires_at FROM rooms WHERE expires_at > ? ORDER BY updated_at DESC LIMIT 100")
    .bind(Date.now())
    .all<{ code: string; state: string; created_at: number; updated_at: number; expires_at: number }>();
  const rooms = (result.results ?? []).map((row) => {
    const room = JSON.parse(row.state) as StoredRoom;
    return {
      code: row.code,
      mode: room.mode,
      teamSize: room.teamSize,
      memberCount: room.members.length,
      missionIndex: room.missionIndex,
      phase: room.phase,
      completedMissions: room.completedMissions.length,
      evidenceCount: room.evidence.length,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      expiresAt: row.expires_at,
    };
  });
  return json({ rooms });
}

async function roomApi(request: Request, env: Env, url: URL) {
  if (!env.DB) return json({ error: "Die Raumdatenbank ist noch nicht verbunden." }, 503);
  await ensureRooms(env.DB);
  const body: Record<string, unknown> =
    request.method === "POST"
      ? ((await request.json().catch(() => ({}))) as Record<string, unknown>)
      : {};
  const action = String(body.action ?? url.searchParams.get("action") ?? "");

  if (request.method === "POST" && action === "create") {
    let code = "";
    for (let attempt = 0; attempt < 8; attempt += 1) {
      code = randomText(6, "ABCDEFGHJKLMNPQRSTUVWXYZ23456789");
      const exists = await env.DB.prepare("SELECT code FROM rooms WHERE code = ?").bind(code).first();
      if (!exists) break;
    }
    const teacherToken = randomText(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    const hostToken = randomText(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    const now = Date.now();
    const host: StoredMember = {
      id: crypto.randomUUID(),
      name: String(body.name ?? "Teamleitung").slice(0, 40),
      role: "source",
      token: hostToken,
      joinedAt: now,
      lastSeenAt: now,
    };
    const isSolo = body.mode === "solo";
    const room: StoredRoom = {
      code,
      teamSize: isSolo ? 3 : Number(body.teamSize) === 2 ? 2 : 3,
      mode: isSolo ? "solo" : body.mode === "desktop" || body.mode === "demo" ? body.mode : "multi",
      missionIndex: 0,
      phase: 0,
      members: [host],
      evidence: [],
      mapPins: [],
      investigation: undefined,
      verdict: "",
      verdictSubmitted: false,
      scores: { source: 0, space: 0, perspective: 0, reconstruction: 0 },
      events: [],
      completedMissions: [],
      updatedAt: now,
    };
    pushEvent(room, host.name, "room-created", `Raum ${code} eröffnet`);
    await env.DB.prepare(
      "INSERT INTO rooms (code, state, teacher_token, created_at, updated_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(code, JSON.stringify(room), teacherToken, now, now, now + 1000 * 60 * 60 * 24 * 90)
      .run();
    return json({ room: publicRoom(room, hostToken), token: hostToken, teacherToken });
  }

  const code = String(body.code ?? url.searchParams.get("code") ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const loaded = code ? await loadRoom(env.DB, code) : null;
  if (!loaded) return json({ error: "Raum nicht gefunden oder abgelaufen." }, 404);
  const token = String(body.token ?? url.searchParams.get("token") ?? "");
  const isTeacher = token === loaded.teacherToken;
  let member = loaded.state.members.find((item) => item.token === token);

  if (request.method === "POST" && action === "join") {
    if (loaded.state.mode === "solo") return json({ error: "Dieser Einzelspielstand kann nicht als Teamraum geöffnet werden." }, 409);
    if (loaded.state.members.length >= loaded.state.teamSize) {
      return json({ error: "Dieser Raum ist vollständig." }, 409);
    }
    const name = String(body.name ?? "").trim().slice(0, 40);
    if (!name) return json({ error: "Bitte einen Namen eingeben." }, 400);
    const joinToken = randomText(32, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
    const usedRoles = new Set(loaded.state.members.map((item) => item.role));
    const role = roles.find((candidate) => !usedRoles.has(candidate)) ?? roles[loaded.state.members.length % roles.length];
    member = {
      id: crypto.randomUUID(),
      name,
      role,
      token: joinToken,
      joinedAt: Date.now(),
      lastSeenAt: Date.now(),
    };
    loaded.state.members.push(member);
    pushEvent(loaded.state, name, "member-joined", `${name} ist als ${role} beigetreten`);
    await saveRoom(env.DB, loaded.state);
    return json({ room: publicRoom(loaded.state, joinToken), token: joinToken });
  }

  if (request.method === "GET") {
    if (!member && !isTeacher) return json({ error: "Wiedereinstieg nicht autorisiert." }, 403);
    return json({ room: publicRoom(loaded.state, token), teacher: isTeacher });
  }

  if (!member && !isTeacher) return json({ error: "Aktion nicht autorisiert." }, 403);
  const actor = isTeacher ? "Spielleitung" : member!.name;

  if (action === "advance") {
    loaded.state.phase = Math.min(4, loaded.state.phase + 1);
    pushEvent(loaded.state, actor, "phase", `Phase ${loaded.state.phase + 1} freigeschaltet`);
  } else if (action === "reset") {
    loaded.state.missionIndex = 0;
    loaded.state.phase = 0;
    loaded.state.evidence = [];
    loaded.state.mapPins = [];
    loaded.state.investigation = undefined;
    loaded.state.verdict = "";
    loaded.state.verdictSubmitted = false;
    loaded.state.completedMissions = [];
    loaded.state.finalMuseum = undefined;
    loaded.state.scores = { source: 0, space: 0, perspective: 0, reconstruction: 0 };
    pushEvent(loaded.state, actor, "reset", "Spielstand zurückgesetzt");
  } else if (action === "set-mission") {
    loaded.state.missionIndex = Math.max(0, Math.min(8, Number(body.missionIndex) || 0));
    loaded.state.phase = 0;
    loaded.state.evidence = [];
    loaded.state.mapPins = [];
    loaded.state.investigation = undefined;
    loaded.state.verdict = "";
    loaded.state.verdictSubmitted = false;
    loaded.state.members = loaded.state.members.map((item, index) => ({
      ...item,
      role: roles[(index + loaded.state.missionIndex) % loaded.state.teamSize],
    }));
    pushEvent(loaded.state, actor, "mission", `Akte ${loaded.state.missionIndex + 1} geöffnet`);
  } else if (action === "evidence") {
    loaded.state.evidence.push({
      id: crypto.randomUUID(),
      actor,
      role: member?.role ?? "teacher",
      resourceId: String(body.resourceId ?? ""),
      taskId: String(body.taskId ?? ""),
      locator: String(body.locator ?? "").slice(0, 80),
      note: String(body.note ?? "").slice(0, 600),
      category: String(body.category ?? "Beobachtung").slice(0, 40),
      at: Date.now(),
    });
    pushEvent(loaded.state, actor, "evidence", "Beleg an die gemeinsame Wand übergeben");
  } else if (action === "pin") {
    const pin = {
      id: crypto.randomUUID(),
      actor,
      placeId: String(body.placeId ?? ""),
      stance: String(body.stance ?? "").slice(0, 20),
      note: String(body.note ?? "").slice(0, 300),
      at: Date.now(),
    };
    loaded.state.mapPins = [
      ...loaded.state.mapPins.filter((item) => (item as { placeId?: string }).placeId !== pin.placeId),
      pin,
    ];
    pushEvent(loaded.state, actor, "map", `Ort ${String(body.placeId ?? "")} verknüpft`);
  } else if (action === "theory") {
    loaded.state.investigation = {
      hypothesis: String(body.hypothesis ?? "").slice(0, 500),
      manipulation: String(body.manipulation ?? "").slice(0, 500),
      status: "offen",
    };
    pushEvent(loaded.state, actor, "theory", "Prüfhypothese festgelegt");
  } else if (action === "verdict") {
    loaded.state.verdict = String(body.verdict ?? "").slice(0, 3000);
    const theoryStatus = String(body.theoryStatus ?? "");
    if (loaded.state.investigation && ["offen", "bestätigt", "eingeschränkt", "verworfen"].includes(theoryStatus)) {
      loaded.state.investigation.status = theoryStatus as NonNullable<StoredRoom["investigation"]>["status"];
    }
    loaded.state.verdictSubmitted = Boolean(body.submit);
    if (body.submit) {
      if (!loaded.state.completedMissions.includes(String(loaded.state.missionIndex))) {
        loaded.state.completedMissions.push(String(loaded.state.missionIndex));
      }
      const sourceCount = loaded.state.evidence.length;
      const mapCount = loaded.state.mapPins.length;
      loaded.state.scores = {
        source: Math.min(3, sourceCount),
        space: Math.min(3, mapCount),
        perspective: Math.min(3, loaded.state.investigation?.status === "eingeschränkt" || loaded.state.investigation?.status === "verworfen" ? 3 : sourceCount >= 2 ? 2 : sourceCount),
        reconstruction: Math.min(3, loaded.state.verdict.length > 300 ? 3 : loaded.state.verdict.length > 120 ? 2 : 1),
      };
      pushEvent(loaded.state, actor, "verdict", "Historisches Urteil eingereicht");
    }
  } else if (action === "teacher-note" && isTeacher) {
    pushEvent(loaded.state, actor, "teacher-note", String(body.detail ?? ""));
  } else if (action === "final-museum") {
    loaded.state.finalMuseum = body.finalMuseum;
    pushEvent(loaded.state, actor, "museum", "Digitaler Museumsraum gespeichert");
  } else {
    return json({ error: "Unbekannte Aktion." }, 400);
  }

  await saveRoom(env.DB, loaded.state);
  return json({ room: publicRoom(loaded.state, token), teacher: isTeacher });
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/rooms") {
      return roomApi(request, env, url);
    }

    if (url.pathname === "/api/teacher" && request.method === "POST") {
      return teacherApi(request, env);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
