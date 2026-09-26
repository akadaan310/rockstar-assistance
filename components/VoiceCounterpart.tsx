"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  CounterpartState,
  Note,
  OptionNode,
  Session,
  VoiceCounterpartProps,
} from "@/lib/counterpart/types";
import {
  endSession,
  loadNotes,
  loadPositionSession,
  loadSessions,
  logSessionEvent,
  recordDecision,
  saveNote as persistNote,
  savePosition,
  startSession,
} from "@/lib/counterpart/store";
import { getReply, greetingOptions, pushDecision } from "@/lib/counterpart/brain";
import {
  createRecognizer,
  micAvailable,
  speak,
  startMic,
  stopSpeaking,
  ttsSupported,
  type MicSession,
} from "@/lib/counterpart/speech";
import Waveform from "./counterpart/Waveform";
import OptionChips from "./counterpart/OptionChips";
import NotesPanel from "./counterpart/NotesPanel";
import HistoryPanel from "./counterpart/HistoryPanel";

interface Message {
  id: number;
  from: "ai" | "user";
  text: string;
}

const STATE_LABEL: Record<CounterpartState, string> = {
  idle: "Idle",
  listening: "Listening…",
  transcribing: "Transcribing…",
  speaking: "Speaking…",
  "saving-note": "Saving note…",
};

let msgId = 0;
const nextMsgId = () => ++msgId;

const BUBBLE = 64;
const MARGIN = 20;

export default function VoiceCounterpart({
  apiBase,
  clientId = "sarah",
  greeting = "Hey Sarah — I'm here.",
  personaName = "Sarah",
  siteMap = [],
}: VoiceCounterpartProps) {
  const [state, setState] = useState<CounterpartState>("idle");
  const [open, setOpen] = useState(false);
  const [panel, setPanel] = useState<"none" | "notes" | "history">("none");
  const [messages, setMessages] = useState<Message[]>([]);
  const [options, setOptions] = useState<OptionNode[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [input, setInput] = useState("");
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [savingFlash, setSavingFlash] = useState(false);
  const [mode, setMode] = useState<"censored" | "uncensored">(() => {
    try {
      return sessionStorage.getItem("vc-mode") === "uncensored" ? "uncensored" : "censored";
    } catch {
      return "censored";
    }
  });

  const switchMode = useCallback((m: "censored" | "uncensored") => {
    setMode(m);
    try {
      sessionStorage.setItem("vc-mode", m);
    } catch {
      /* non-fatal */
    }
  }, []);

  const sessionRef = useRef<string>("");
  const speakRef = useRef<{ cancel: () => void } | null>(null);
  const micRef = useRef<MicSession | null>(null);
  const recogRef = useRef<{ stop: () => void } | null>(null);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const greetedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ---------------- session lifecycle ---------------- */
  useEffect(() => {
    const site = typeof window !== "undefined" ? window.location.hostname || "this site" : "site";
    const s = startSession(site);
    sessionRef.current = s.id;
    setSessions(loadSessions());
    setNotes(loadNotes());
    const saved = loadPositionSession();
    if (saved) {
      setPos(saved);
    } else {
      setPos({ x: window.innerWidth - BUBBLE - MARGIN, y: window.innerHeight - BUBBLE - MARGIN });
    }
    const finish = () => endSession(s.id);
    const onVis = () => {
      if (document.visibilityState === "hidden") finish();
    };
    window.addEventListener("pagehide", finish);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", finish);
      document.removeEventListener("visibilitychange", onVis);
      finish();
    };
  }, []);

  const log = useCallback((kind: "decision" | "note" | "visit" | "message", text: string) => {
    if (sessionRef.current) logSessionEvent(sessionRef.current, { kind, text });
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, options]);

  /* ---------------- speaking ---------------- */
  const say = useCallback(
    async (text: string, nextOptions?: OptionNode[]) => {
      setMessages((m) => [...m, { id: nextMsgId(), from: "ai", text }]);
      setOptions([]);
      if (!ttsSupported()) {
        setState("idle");
        setOptions(nextOptions ?? []);
        return;
      }
      setState("speaking");
      try {
        const handle = speak(text);
        speakRef.current = handle;
        await handle.done;
      } catch {
        /* TTS unavailable — text stands on its own */
      } finally {
        speakRef.current = null;
        setState("idle");
        setOptions(nextOptions ?? []);
      }
    },
    []
  );

  const doDecision = useCallback(
    (text: string) => {
      recordDecision(text);
      log("decision", text);
      pushDecision(apiBase, clientId, text);
    },
    [apiBase, clientId, log]
  );

  /* ---------------- greeting ---------------- */
  useEffect(() => {
    if (greetedRef.current || pos === null) return;
    greetedRef.current = true;
    const t = setTimeout(() => {
      setOpen(true);
      say(
        `${greeting} This is the new Rockstar Assistance site — still pre-launch, so you're seeing it before anyone else. What would you like to do?`,
        greetingOptions(siteMap)
      );
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pos]);

  /* ---------------- option funnel ---------------- */
  const pickOption = useCallback(
    (opt: OptionNode) => {
      stopSpeaking();
      setMessages((m) => [...m, { id: nextMsgId(), from: "user", text: opt.label }]);
      log("message", `Chose: ${opt.label}`);
      if (opt.href) {
        const el = document.querySelector(opt.href);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        log("visit", `Toured ${opt.label}`);
      }
      if (opt.decision) doDecision(opt.decision);
      // small beat before the reply so it feels conversational
      setState("idle");
      setOptions([]);
      setTimeout(() => say(opt.reply, opt.options), 350);
    },
    [doDecision, log, say]
  );

  /* ---------------- free text / voice input ---------------- */
  const submitText = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      stopSpeaking();
      setInput("");
      setMessages((m) => [...m, { id: nextMsgId(), from: "user", text: clean }]);
      log("message", clean);
      setState("transcribing");
      const reply = await getReply(apiBase, clientId, clean, siteMap, mode);
      setState("idle");
      say(reply.text, reply.options);
    },
    [apiBase, clientId, log, say, siteMap, mode]
  );

  const toggleMic = useCallback(async () => {
    // stop listening
    if (micRef.current) {
      const mic = micRef.current;
      micRef.current = null;
      recogRef.current?.stop();
      recogRef.current = null;
      setAnalyser(null);
      await mic.stop();
      if (state === "listening") {
        setState("idle");
        setMessages((m) => [
          ...m,
          { id: nextMsgId(), from: "ai", text: "I didn't catch that clearly — type it for me?" },
        ]);
      }
      return;
    }
    if (!micAvailable()) {
      say("The microphone needs a secure connection — that's coming with the launch. For now, type to me and I'll keep up.");
      return;
    }
    try {
      const mic = await startMic();
      micRef.current = mic;
      setAnalyser(mic.analyser);
      setState("listening");
      setOpen(true);
      const heardNothing = () => {
        // Never leave her hanging in "listening" — say so and hand back control.
        micRef.current = null;
        recogRef.current = null;
        setAnalyser(null);
        mic.stop();
        setState("idle");
        say("I couldn't catch that — my ears aren't cooperating. Type it for me?");
      };
      const recog = createRecognizer(
        (text) => {
          // transcribed — hand to the brain
          micRef.current = null;
          setAnalyser(null);
          mic.stop();
          setState("transcribing");
          setTimeout(() => submitText(text), 400);
        },
        heardNothing
      );
      if (!recog) {
        heardNothing();
        return;
      }
      recogRef.current = recog;
      recog.start();
    } catch {
      say("I couldn't reach the microphone. Check the browser permission, or just type to me.");
    }
  }, [say, state, submitText]);

  /* ---------------- notes ---------------- */
  const flashSaving = useCallback(() => {
    setSavingFlash(true);
    setState("saving-note");
    setTimeout(() => {
      setSavingFlash(false);
      setState("idle");
    }, 1800);
  }, []);

  const quickSaveNote = useCallback(() => {
    const lastUser = [...messages].reverse().find((m) => m.from === "user");
    const text = lastUser?.text ?? input.trim();
    if (!text) {
      say("Tell me what to save — say it or type it, then tap the note button again.");
      return;
    }
    persistNote(text);
    setNotes(loadNotes());
    log("note", text);
    flashSaving();
    say("Saved to your notes — tap the notebook anytime to read them back.");
  }, [messages, input, log, say, flashSaving]);

  /* ---------------- drag ---------------- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (!pos) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !pos) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 8) d.moved = true;
    if (d.moved) {
      const nx = Math.min(Math.max(8, d.ox + dx), window.innerWidth - BUBBLE - 8);
      const ny = Math.min(Math.max(8, d.oy + dy), window.innerHeight - BUBBLE - 8);
      setPos({ x: nx, y: ny });
    }
  };
  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && pos) savePosition(pos.x, pos.y);
    if (d && !d.moved) {
      // tap: toggle chat
      stopSpeaking();
      setOpen((o) => !o);
      if (!open && messages.length === 0) {
        say(
          `${greeting} What would you like to do?`,
          greetingOptions(siteMap)
        );
      }
    }
  };

  /* ---------------- render ---------------- */
  const bubbleClass =
    state === "speaking"
      ? "vc-speak-ring"
      : state === "listening"
        ? ""
        : state === "saving-note" || savingFlash
          ? "vc-saving"
          : "vc-idle";

  const bubbleLeft = pos?.x ?? 0;
  const bubbleTop = pos?.y ?? 0;
  // chat card anchors above the bubble, clamped to viewport
  const cardLeft = Math.min(Math.max(12, bubbleLeft - 320 + BUBBLE), windowWidth() - 372);
  const cardTop = Math.max(12, bubbleTop - 470);

  function windowWidth() {
    return typeof window !== "undefined" ? window.innerWidth : 400;
  }

  return (
    <>
      {/* ============ floating bubble (draggable) ============ */}
      {pos && (
        <div
          className="fixed z-[70] select-none"
          style={{ left: bubbleLeft, top: bubbleTop, touchAction: "none" }}
        >
          <div className="relative">
            {/* hamburger → session history */}
            <button
              aria-label="Open session history"
              onClick={(e) => {
                e.stopPropagation();
                setPanel("history");
                setSessions(loadSessions());
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute -left-2 -top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border hairline bg-noir-800 text-gild-300 shadow-lg hover:bg-noir-700"
            >
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[2px] w-3 bg-current" />
                <span className="block h-[2px] w-3 bg-current" />
                <span className="block h-[2px] w-3 bg-current" />
              </span>
            </button>

            <button
              aria-label={`${personaName} voice counterpart — ${STATE_LABEL[state]}. Tap to ${open ? "close" : "open"}.`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className={`relative flex h-16 w-16 items-center justify-center rounded-full border border-gild-500/60 bg-noir-800 ${bubbleClass}`}
              style={{ cursor: "grab" }}
            >
              {state === "listening" && (
                <span className="vc-listen-ring absolute inset-0 rounded-full" aria-hidden />
              )}
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gild-300 via-gild-500 to-gild-600 font-display text-xl font-semibold text-noir-950">
                {state === "transcribing" ? (
                  <span className="flex gap-1">
                    <span className="vc-dot h-1.5 w-1.5 rounded-full bg-noir-950" />
                    <span className="vc-dot h-1.5 w-1.5 rounded-full bg-noir-950" />
                    <span className="vc-dot h-1.5 w-1.5 rounded-full bg-noir-950" />
                  </span>
                ) : (
                  personaName.charAt(0).toUpperCase()
                )}
              </span>
            </button>

            {/* state caption */}
            <div className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-gild-300/80">
              {STATE_LABEL[state]}
            </div>
          </div>
        </div>
      )}

      {/* ============ chat card ============ */}
      {open && pos && (
        <div
          className="fixed z-[65] flex h-[440px] w-[min(360px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border hairline bg-noir-900/97 shadow-2xl backdrop-blur"
          style={{ left: Math.max(12, cardLeft), top: cardTop }}
          role="dialog"
          aria-label={`${personaName} voice counterpart`}
        >
          {/* header */}
          <div className="flex items-center justify-between border-b hairline bg-noir-800/60 px-4 py-2.5">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gild-300 to-gild-600 font-display text-sm font-semibold text-noir-950 ${state === "speaking" ? "vc-speak-ring" : ""}`}
              >
                {personaName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="text-sm font-semibold text-candle">{personaName}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-gild-300/80">
                  {STATE_LABEL[state]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                aria-label="Open notes"
                title="Your notes"
                onClick={() => {
                  setNotes(loadNotes());
                  setPanel("notes");
                }}
                className="rounded-full p-2 text-gild-300 hover:bg-noir-700"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M5 4h14v12H5z" />
                  <path d="M5 8h14M5 12h9" />
                  <path d="M9 16h6v4H9z" />
                </svg>
              </button>
              <button
                aria-label="Close"
                onClick={() => {
                  stopSpeaking();
                  setOpen(false);
                }}
                className="rounded-full p-2 text-xl leading-none text-candle/60 hover:text-candle"
              >
                ×
              </button>
            </div>
          </div>

          {/* mode toggle */}
          <div className="flex items-center justify-between border-b hairline bg-noir-950/50 px-4 py-1.5">
            <span className="text-[10px] uppercase tracking-[0.14em] text-candle/40">
              Conversation mode
            </span>
            <div className="flex rounded-full border hairline p-0.5" role="group" aria-label="Conversation mode">
              {(["censored", "uncensored"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    if (m === mode) return;
                    switchMode(m);
                    say(
                      m === "uncensored"
                        ? "Open mode — I'll keep it straight with you, no filters."
                        : "Back to gentle mode."
                    );
                  }}
                  aria-pressed={mode === m}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium capitalize transition-all ${
                    mode === m
                      ? "bg-gild-500 text-noir-950"
                      : "text-candle/55 hover:text-candle"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                    m.from === "user"
                      ? "bg-gild-500/20 text-candle"
                      : "border hairline bg-noir-800 text-candle"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {options.length > 0 && state === "idle" && (
              <div className="pt-1">
                <OptionChips options={options} onPick={pickOption} />
              </div>
            )}
          </div>

          {/* waveform strip */}
          <div className="flex justify-center border-t hairline bg-noir-950/60 px-4 py-1.5">
            {state === "transcribing" ? (
              <span className="flex items-center gap-1.5 py-2.5" aria-label="Transcribing">
                <span className="vc-dot h-2 w-2 rounded-full bg-gild-300" />
                <span className="vc-dot h-2 w-2 rounded-full bg-gild-300" />
                <span className="vc-dot h-2 w-2 rounded-full bg-gild-300" />
              </span>
            ) : (
              <Waveform state={state} analyser={analyser} />
            )}
          </div>

          {/* input row */}
          <div className="flex items-center gap-2 border-t hairline bg-noir-800/60 px-3 py-2.5">
            <button
              aria-label={state === "listening" ? "Stop listening" : "Talk"}
              title={state === "listening" ? "Stop" : "Hold to talk"}
              onClick={toggleMic}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                state === "listening"
                  ? "border-red-400/70 bg-red-500/20 text-red-200"
                  : "hairline text-gild-300 hover:bg-noir-700"
              }`}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitText(input)}
              placeholder="Type to me…"
              aria-label="Type a message"
              className="h-10 min-w-0 flex-1 rounded-full border hairline bg-noir-950 px-4 text-sm text-candle placeholder:text-candle/35 focus:border-gild-400 focus:outline-none"
            />
            <button
              aria-label="Save as note"
              title="Save as note"
              onClick={quickSaveNote}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border hairline text-gild-300 hover:bg-noir-700"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button
              aria-label="Send"
              onClick={() => submitText(input)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gild-500 text-noir-950 hover:bg-gild-400"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ============ side panels (notes / history) ============ */}
      <div
        className={`vc-panel fixed right-0 top-0 z-[80] h-full w-[min(380px,92vw)] border-l hairline bg-noir-900 shadow-2xl ${
          panel === "none" ? "translate-x-full" : "translate-x-0"
        }`}
        role="complementary"
        aria-label={panel === "notes" ? "Notes" : "Session history"}
      >
        {panel === "notes" && (
          <NotesPanel notes={notes} onChanged={() => setNotes(loadNotes())} onClose={() => setPanel("none")} />
        )}
        {panel === "history" && (
          <HistoryPanel sessions={sessions} onClose={() => setPanel("none")} />
        )}
      </div>
      {panel !== "none" && (
        <button
          aria-label="Close panel"
          className="fixed inset-0 z-[75] bg-black/50"
          onClick={() => setPanel("none")}
        />
      )}
    </>
  );
}
