"use client";

import { useState } from "react";
import type { Note } from "@/lib/counterpart/types";
import { deleteNote } from "@/lib/counterpart/store";

interface Props {
  notes: Note[];
  onChanged: () => void;
  onClose: () => void;
}

function fmt(iso: string) {
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

export default function NotesPanel({ notes, onChanged, onClose }: Props) {
  const [confirmId, setConfirmId] = useState<string | null>(null);
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b hairline px-4 py-3">
        <h3 className="font-display text-lg text-gild-200">Your notes</h3>
        <button
          onClick={onClose}
          aria-label="Close notes"
          className="rounded-full px-2 py-1 text-xl leading-none text-candle/70 hover:text-candle"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {notes.length === 0 ? (
          <p className="text-sm text-candle/60">
            Nothing saved yet. Say “save a note” or tap the note button and I’ll keep it here for
            you.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {notes.map((n) => (
              <li
                key={n.id}
                className="rounded-xl border hairline bg-noir-800/80 px-3.5 py-2.5 text-sm text-candle"
              >
                <p className="leading-snug">{n.text}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-candle/45">
                    {fmt(n.at)}
                  </span>
                  {confirmId === n.id ? (
                    <span className="flex gap-2 text-[12px]">
                      <button
                        className="text-red-300"
                        onClick={() => {
                          deleteNote(n.id);
                          setConfirmId(null);
                          onChanged();
                        }}
                      >
                        Delete
                      </button>
                      <button className="text-candle/60" onClick={() => setConfirmId(null)}>
                        Keep
                      </button>
                    </span>
                  ) : (
                    <button
                      className="text-[12px] text-candle/45 hover:text-candle"
                      onClick={() => setConfirmId(n.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
