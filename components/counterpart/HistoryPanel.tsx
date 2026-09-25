"use client";

import { useState } from "react";
import type { Session } from "@/lib/counterpart/types";

interface Props {
  sessions: Session[];
  onClose: () => void;
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function fmtDur(sec?: number) {
  if (!sec && sec !== 0) return "in progress";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ${sec % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

export default function HistoryPanel({ sessions, onClose }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = sessions.find((s) => s.id === openId);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b hairline px-4 py-3">
        <h3 className="font-display text-lg text-gild-200">
          {open ? "Session detail" : "Session history"}
        </h3>
        <div className="flex items-center gap-2">
          {open && (
            <button
              onClick={() => setOpenId(null)}
              className="text-[13px] text-gild-300 hover:text-gild-200"
            >
              ← All sessions
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close history"
            className="rounded-full px-2 py-1 text-xl leading-none text-candle/70 hover:text-candle"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {open ? (
          <div>
            <p className="text-[12px] uppercase tracking-wider text-candle/50">
              {open.site} · {fmtDate(open.startedAt)} · {fmtDur(open.durationSec)}
            </p>
            {open.summary && <p className="mt-1 text-sm text-gild-200">{open.summary}</p>}
            <ul className="mt-3 space-y-2">
              {open.events.map((e, i) => (
                <li
                  key={i}
                  className="rounded-lg border hairline bg-noir-800/70 px-3 py-2 text-[13px] text-candle"
                >
                  <span
                    className={`mr-2 inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                      e.kind === "decision"
                        ? "bg-gild-500/20 text-gild-300"
                        : e.kind === "note"
                          ? "bg-candle/10 text-candle/80"
                          : "bg-noir-700 text-candle/50"
                    }`}
                  >
                    {e.kind}
                  </span>
                  {e.text}
                </li>
              ))}
            </ul>
          </div>
        ) : sessions.length === 0 ? (
          <p className="text-sm text-candle/60">
            No sessions yet. Each visit gets its own entry here — what you decided, what you saved,
            how long you stayed.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setOpenId(s.id)}
                  className="w-full rounded-xl border hairline bg-noir-800/80 px-3.5 py-3 text-left transition-colors hover:border-gild-400"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-candle">{s.site}</span>
                    <span className="text-[11px] uppercase tracking-wider text-candle/45">
                      {fmtDur(s.durationSec)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-candle/55">{fmtDate(s.startedAt)}</p>
                  {s.summary && <p className="mt-1 text-[13px] text-gild-200/90">{s.summary}</p>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
