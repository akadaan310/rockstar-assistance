"use client";

import { useEffect, useRef } from "react";
import type { CounterpartState } from "@/lib/counterpart/types";

interface Props {
  state: CounterpartState;
  /** Live analyser when listening; otherwise the visual is simulated */
  analyser?: AnalyserNode | null;
}

/**
 * Canvas waveform / spectrogram for the counterpart bubble.
 * - listening: real mic levels from the analyser
 * - speaking: animated bars synced to a lively simulated envelope
 * - idle: slow, shallow breathing bars
 * - transcribing / saving-note: handled by overlays in the parent
 */
export default function Waveform({ state, analyser }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = 120);
    const H = (canvas.height = 44);
    const BARS = 24;
    let raf = 0;
    const data = new Uint8Array(128);

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const bw = W / BARS;
      for (let i = 0; i < BARS; i++) {
        let v: number;
        if (state === "listening" && analyser) {
          analyser.getByteFrequencyData(data);
          const idx = Math.floor((i / BARS) * data.length * 0.7);
          v = data[idx] / 255;
        } else if (state === "speaking") {
          v =
            0.35 +
            0.3 * Math.abs(Math.sin(t / 260 + i * 0.55)) +
            0.25 * Math.abs(Math.sin(t / 97 + i * 1.3));
        } else {
          // idle breathing
          v = 0.16 + 0.1 * Math.abs(Math.sin(t / 900 + i * 0.4));
        }
        v = Math.min(1, Math.max(0.06, v));
        const h = v * (H - 6);
        const x = i * bw + bw * 0.22;
        const grad = ctx.createLinearGradient(0, H - h, 0, H);
        grad.addColorStop(0, "rgba(233,207,150,0.95)");
        grad.addColorStop(1, "rgba(201,162,39,0.45)");
        ctx.fillStyle = grad;
        const w = bw * 0.56;
        const y = (H - h) / 2;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, w, h, w / 2);
        else ctx.rect(x, y, w, h);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [state, analyser]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="h-11 w-[120px]"
      style={{ width: 120, height: 44 }}
    />
  );
}
