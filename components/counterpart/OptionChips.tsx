"use client";

import type { OptionNode } from "@/lib/counterpart/types";

interface Props {
  options: OptionNode[];
  onPick: (opt: OptionNode) => void;
}

/** Tappable decision funnel — 4 → 3 → binary, always converging. */
export default function OptionChips({ options, onPick }: Props) {
  if (!options.length) return null;
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an option">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onPick(o)}
          className="rounded-full border hairline bg-noir-800/90 px-3.5 py-2 text-[13px] font-medium text-candle transition-all hover:border-gild-400 hover:bg-noir-700 active:scale-95"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
