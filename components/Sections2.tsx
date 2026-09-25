"use client";

import { useState } from "react";
import { Eyebrow } from "./Sections1";

export function WhitePaperBand() {
  return (
    <section id="field-manual" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="overflow-hidden rounded-3xl border hairline bg-noir-900">
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-14">
              <Eyebrow>Free field manual — no email required</Eyebrow>
              <h2 className="font-display text-4xl leading-tight md:text-5xl">
                <span className="gild-text emboss">The Invisible</span>
                <br />
                <span className="text-candle">Operating System</span>
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-candle/70">
                Thirty pages on how AI workflows transform virtual, executive, and personal
                assistance — the patterns we&apos;ve learned running high-trust engagements,
                written so any executive, leader, or assistance company can use them. Download
                the PDF, keep it, share it.
              </p>
              <button
                disabled
                title="Coming soon"
                className="mt-8 cursor-not-allowed rounded-full border hairline px-8 py-3.5 font-medium text-candle/50"
              >
                Download the manual — coming soon
              </button>
              <p className="mt-3 text-[13px] text-candle/45">
                Free PDF · 30 pages · No email required
              </p>
            </div>
            <div
              aria-hidden
              className="relative hidden min-h-[320px] bg-noir-800 md:block"
              style={{
                background:
                  "radial-gradient(500px 320px at 50% 40%, rgba(201,162,39,0.18), transparent 70%), linear-gradient(160deg, #1b1712, #0a0908)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 -rotate-3 rounded-lg border border-gild-500/40 bg-noir-950 p-6 shadow-2xl">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-gild-400">Field manual</p>
                  <p className="mt-2 font-display text-2xl leading-snug text-candle">
                    The Invisible Operating System
                  </p>
                  <div className="mt-4 space-y-1.5">
                    {[92, 78, 85, 70].map((w, i) => (
                      <div key={i} className="h-1.5 rounded bg-gild-500/20" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 text-center">
          <p className="font-display text-2xl text-candle">Talk it through with an operator — book a call</p>
          <p className="mt-2 text-candle/60">Read the manual, then pressure-test it against your reality.</p>
          <a
            href="#contact"
            className="mt-6 inline-block rounded-full bg-gild-500 px-8 py-3.5 font-semibold text-noir-950 hover:bg-gild-400"
          >
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
}

const INSIGHTS = [
  {
    title: "What “same-day” really costs — and saves",
    body: "Speed is a system, not a scramble. Same-day engagement is only honest if three things are already true: a bench of senior operators with cleared calendars, an intake process measured in hours not weeks, and a workflow layer that lets a new operator be effective on day one. Most agencies can't do same-day because they staff per-deal. We keep the studio small and the bench warm — so “urgent” is a scheduling problem, not a hiring problem. The cost of waiting: a principal's distracted week is worth more than any rush premium. Do the math on your own attention before you decide speed is expensive.",
  },
  {
    title: "The four-layer delegation stack",
    body: "Tasks, rhythms, systems, judgment — most delegation fails at layer one. The stack we use to decide what gets automated, what gets templated, and what stays human.",
  },
  {
    title: "On-site vs. virtual: a decision framework",
    body: "Five questions that settle it: when a body in the room beats a screen, and when virtual wins outright.",
  },
];

export function Insights() {
  const [open, setOpen] = useState(0);
  return (
    <section className="border-y hairline bg-noir-900 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5">
        <div className="text-center">
          <Eyebrow>From the studio</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl text-candle">Notes on leverage.</h2>
        </div>
        <div className="mt-10 space-y-4">
          {INSIGHTS.map((a, i) => (
            <div key={a.title} className="overflow-hidden rounded-2xl border hairline bg-noir-950">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="font-display text-xl text-candle">{a.title}</span>
                <span className="ml-4 shrink-0 text-2xl text-gild-400">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && (
                <p className="border-t hairline px-6 py-5 text-[15px] leading-relaxed text-candle/70">
                  {a.body}
                </p>
              )}
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <p className="font-display text-2xl text-candle">Ask us anything — book a call</p>
          <p className="mt-2 text-candle/60">Bring your hardest delegation problem. We like those.</p>
          <a
            href="#contact"
            className="mt-6 inline-block rounded-full bg-gild-500 px-8 py-3.5 font-semibold text-noir-950 hover:bg-gild-400"
          >
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
}

export function Founder() {
  return (
    <section id="founder" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* monogram placeholder — professional headshot arriving; never a generated face */}
          <div className="mx-auto w-full max-w-sm">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl border hairline bg-noir-800"
              role="img"
              aria-label="Founder portrait placeholder — professional headshot arriving"
            >
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(420px 420px at 50% 30%, rgba(201,162,39,0.16), transparent 70%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gild-500/50 bg-noir-950 font-display text-4xl font-semibold gild-text">
                  SD
                </span>
                <p className="mt-6 px-8 text-center text-[13px] uppercase tracking-[0.2em] text-candle/50">
                  Portrait arriving soon
                </p>
              </div>
            </div>
          </div>
          <div>
            <Eyebrow>The founder</Eyebrow>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              <span className="gild-text emboss">Sarah Dawn</span>
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-candle/70">
              <p>
                Rockstar Assistance was founded by <strong className="text-candle">Sarah Dawn</strong>,
                who operated in this craft for years — as a 1099 contractor and independent
                operator serving principals directly — before building the studio the practice
                deserved: scoped to outcomes, run by seniors, and designed to transfer its
                systems to every client.
              </p>
              <p>
                We&apos;re a new business, and we&apos;re honest about it: there are no client
                logos on this site. What we offer instead is the method, the manuals, the
                operators — and transformation stories told without names, because discretion is
                the first skill of this profession.
              </p>
            </div>
            <div className="mt-8">
              <p className="text-[13px] uppercase tracking-[0.2em] text-gild-400">Studio principles</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Senior operators only — no handoffs down a chain, no junior coverage",
                  "Scoped to outcomes — engagements defined by leverage, not hours",
                  "Systems that stay — every engagement ends in transfer",
                  "Discretion as infrastructure — documented, practiced, non-negotiable",
                  "Small by design — seven to ten, like the best teams in tech history",
                ].map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-candle/75">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gild-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="border-t hairline bg-noir-900 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="font-display text-5xl md:text-6xl">
            <span className="gild-text emboss">Book a call.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-candle/70">
            Thirty minutes with a senior operator — not a sales rep. Tell us what leverage
            looks like for you; we respond within one business day. Prefer reading first? The
            field manual is free and ungated.
          </p>
        </div>
        {sent ? (
          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-gild-500/50 bg-noir-800 p-8 text-center">
            <p className="font-display text-2xl text-gild-200">Thank you.</p>
            <p className="mt-2 text-candle/70">
              We&apos;ll be in touch within one business day.
            </p>
          </div>
        ) : (
          <form
            className="mx-auto mt-10 max-w-xl space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] uppercase tracking-wider text-candle/60">Name</span>
                <input
                  required
                  className="w-full rounded-xl border hairline bg-noir-950 px-4 py-3 text-candle placeholder:text-candle/30 focus:border-gild-400 focus:outline-none"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] uppercase tracking-wider text-candle/60">Email</span>
                <input
                  required
                  type="email"
                  className="w-full rounded-xl border hairline bg-noir-950 px-4 py-3 text-candle placeholder:text-candle/30 focus:border-gild-400 focus:outline-none"
                  placeholder="you@company.com"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-[13px] uppercase tracking-wider text-candle/60">I need</span>
                <select
                  className="w-full rounded-xl border hairline bg-noir-950 px-4 py-3 text-candle focus:border-gild-400 focus:outline-none"
                  defaultValue="Virtual assistance"
                >
                  <option>Virtual assistance</option>
                  <option>Executive assistance</option>
                  <option>Personal assistance</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13px] uppercase tracking-wider text-candle/60">Mode</span>
                <select
                  className="w-full rounded-xl border hairline bg-noir-950 px-4 py-3 text-candle focus:border-gild-400 focus:outline-none"
                  defaultValue="Virtual"
                >
                  <option>Virtual</option>
                  <option>On-site</option>
                  <option>Both</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-[13px] uppercase tracking-wider text-candle/60">
                What should we know?
              </span>
              <textarea
                rows={4}
                className="w-full rounded-xl border hairline bg-noir-950 px-4 py-3 text-candle placeholder:text-candle/30 focus:border-gild-400 focus:outline-none"
                placeholder="A few lines about your world…"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-full bg-gild-500 py-4 text-base font-semibold text-noir-950 hover:bg-gild-400"
            >
              Book a call
            </button>
            <p className="text-center text-[13px] text-candle/45">
              Rather read first?{" "}
              <a href="#field-manual" className="text-gild-300 underline-offset-4 hover:underline">
                Get the field manual →
              </a>
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t hairline py-14">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <p className="font-display text-lg text-candle">
              Rockstar <span className="gild-text">Assistance</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-candle/55">
              A boutique studio for executive leverage.
            </p>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gild-400">Services</p>
            <ul className="mt-3 space-y-2 text-sm text-candle/65">
              {["Virtual Assistant", "Executive Assistant", "Personal Assistant"].map((s) => (
                <li key={s}><a href="#services" className="hover:text-gild-300">{s}</a></li>
              ))}
              <li><a href="#how-it-works" className="hover:text-gild-300">Virtual &amp; on-site engagements</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gild-400">Studio</p>
            <ul className="mt-3 space-y-2 text-sm text-candle/65">
              <li><a href="#how-it-works" className="hover:text-gild-300">Method</a></li>
              <li><a href="#founder" className="hover:text-gild-300">About</a></li>
              <li><a href="#contact" className="hover:text-gild-300">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gild-400">Library</p>
            <ul className="mt-3 space-y-2 text-sm text-candle/65">
              <li><a href="#field-manual" className="hover:text-gild-300">The Invisible Operating System</a></li>
              <li><a href="#field-manual" className="hover:text-gild-300">White papers — coming soon</a></li>
            </ul>
            <a
              href="#contact"
              className="mt-5 inline-block rounded-full bg-gild-500 px-5 py-2.5 text-sm font-semibold text-noir-950 hover:bg-gild-400"
            >
              Book a call
            </a>
          </div>
        </div>
        <div className="mt-12 border-t hairline pt-6 text-center text-[13px] text-candle/45">
          <p>© 2026 Rockstar Assistance. A boutique assistance studio.</p>
        </div>
      </div>
    </footer>
  );
}
