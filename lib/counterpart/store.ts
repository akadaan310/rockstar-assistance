import type { Decision, Note, Session, SessionEvent } from "./types";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/* ---------------- notes ---------------- */
const NOTES_KEY = "vc-notes";
export function loadNotes(): Note[] {
  return read<Note[]>(NOTES_KEY, []);
}
export function saveNote(text: string): Note {
  const notes = loadNotes();
  const note: Note = { id: uid(), text, at: new Date().toISOString() };
  notes.unshift(note);
  write(NOTES_KEY, notes.slice(0, 200));
  return note;
}
export function deleteNote(id: string) {
  write(NOTES_KEY, loadNotes().filter((n) => n.id !== id));
}

/* ---------------- decisions ---------------- */
const DECISIONS_KEY = "vc-decisions";
export function loadDecisions(): Decision[] {
  return read<Decision[]>(DECISIONS_KEY, []);
}
export function recordDecision(text: string): Decision {
  const decisions = loadDecisions();
  const d: Decision = { id: uid(), text, at: new Date().toISOString() };
  decisions.unshift(d);
  write(DECISIONS_KEY, decisions.slice(0, 200));
  return d;
}

/* ---------------- sessions ---------------- */
const SESSIONS_KEY = "vc-sessions";
const MAX_SESSIONS = 20;

export function loadSessions(): Session[] {
  return read<Session[]>(SESSIONS_KEY, []);
}

export function startSession(site: string): Session {
  const session: Session = {
    id: uid(),
    site,
    startedAt: new Date().toISOString(),
    events: [{ at: new Date().toISOString(), kind: "visit", text: "Arrived on site" }],
  };
  const sessions = loadSessions();
  sessions.unshift(session);
  write(SESSIONS_KEY, sessions.slice(0, MAX_SESSIONS));
  return session;
}

export function logSessionEvent(sessionId: string, event: Omit<SessionEvent, "at">) {
  const sessions = loadSessions();
  const s = sessions.find((x) => x.id === sessionId);
  if (!s) return;
  s.events.push({ ...event, at: new Date().toISOString() });
  write(SESSIONS_KEY, sessions);
}

/** Build a short human summary from a session's events. */
export function summarizeSession(s: Session): string {
  const decisions = s.events.filter((e) => e.kind === "decision").length;
  const notes = s.events.filter((e) => e.kind === "note").length;
  const visits = s.events.filter((e) => e.kind === "visit").length - 1; // minus arrival
  const parts: string[] = [];
  if (decisions) parts.push(`${decisions} decision${decisions > 1 ? "s" : ""}`);
  if (notes) parts.push(`${notes} note${notes > 1 ? "s" : ""}`);
  if (visits) parts.push(`toured ${visits} section${visits > 1 ? "s" : ""}`);
  return parts.length ? parts.join(" · ") : "Browsed the site";
}

export function endSession(sessionId: string) {
  const sessions = loadSessions();
  const s = sessions.find((x) => x.id === sessionId);
  if (!s || s.endedAt) return;
  const endedAt = new Date().toISOString();
  s.endedAt = endedAt;
  s.durationSec = Math.max(
    1,
    Math.round((new Date(endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000)
  );
  s.summary = summarizeSession(s);
  write(SESSIONS_KEY, sessions);
}

/* ---------------- bubble position (per session) ---------------- */
const POS_KEY = "vc-pos";
export function loadPosition(): { x: number; y: number } | null {
  return read<{ x: number; y: number } | null>(POS_KEY, null);
}
export function savePosition(x: number, y: number) {
  try {
    sessionStorage.setItem(POS_KEY, JSON.stringify({ x, y }));
  } catch {
    write(POS_KEY, { x, y });
  }
}
export function loadPositionSession(): { x: number; y: number } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(POS_KEY);
    return raw ? JSON.parse(raw) : loadPosition();
  } catch {
    return loadPosition();
  }
}
