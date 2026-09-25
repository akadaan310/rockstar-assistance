export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-gild-400">
      {children}
    </p>
  );
}

export function SectionHead({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-4xl leading-tight text-candle md:text-5xl">{title}</h2>
      {body && <p className="mt-5 text-[17px] leading-relaxed text-candle/70">{body}</p>}
    </div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-32 md:pt-40">
      {/* candlelight wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 480px at 50% -80px, rgba(201,162,39,0.14), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-5 text-center">
        <Eyebrow>A boutique assistance studio — est. on rigor, not headcount</Eyebrow>
        <h1 className="mx-auto max-w-4xl font-display text-5xl leading-[1.05] md:text-7xl">
          <span className="gild-text emboss">Executive leverage,</span>
          <br />
          <span className="text-candle">on demand.</span>
        </h1>
        <p className="mx-auto mt-7 max-w-3xl text-[17px] leading-relaxed text-candle/75 md:text-lg">
          Rockstar Assistance is a small, senior studio of seven to ten operators delivering
          virtual assistant, executive assistant, and personal assistant support — virtually
          and on site. Engagements start same-day, next-day, or within the week. And when we
          depart, the systems stay: every engagement leaves behind AI-driven workflows your
          team keeps.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contact"
            className="w-full rounded-full bg-gild-500 px-8 py-3.5 text-base font-semibold text-noir-950 transition-colors hover:bg-gild-400 sm:w-auto"
          >
            Book a call
          </a>
          <a
            href="#field-manual"
            className="w-full rounded-full border hairline px-8 py-3.5 text-base font-medium text-gild-200 transition-colors hover:border-gild-400 sm:w-auto"
          >
            Get the free field manual
          </a>
        </div>
        <p className="mt-4 text-[13px] text-candle/50">
          Free 30 minutes · With a senior operator · Zero pitch, ever
        </p>

        {/* studio film placeholder */}
        <div className="mx-auto mt-12 max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl border hairline bg-noir-800">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(600px 300px at 50% 120%, rgba(201,162,39,0.16), transparent 70%)",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="flex h-20 w-20 items-center justify-center rounded-full border border-gild-500/60 bg-noir-950/60">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-gild-300">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-candle/55">
                Studio film — coming soon
              </p>
            </div>
          </div>
        </div>

        {/* proof strip */}
        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl border hairline bg-gild-500/15 md:grid-cols-4">
          {[
            ["7–10", "senior operators"],
            ["3", "disciplines: VA / EA / PA"],
            ["2", "modes: virtual & on-site"],
            ["1", "promise: the workflows stay"],
          ].map(([n, label]) => (
            <div key={label} className="bg-noir-900 px-4 py-5">
              <p className="font-display text-3xl gild-text">{n}</p>
              <p className="mt-1 text-[13px] text-candle/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES = [
  {
    id: "va",
    name: "Virtual Assistant",
    tag: "Your operating layer for the work that never stops.",
    items: ["Inbox triage", "Scheduling", "Research", "Booking", "CRM hygiene", "Reporting"],
  },
  {
    id: "ea",
    name: "Executive Assistant",
    tag: "A chief of staff's right hand, on demand.",
    items: [
      "Calendar architecture",
      "Board preparation",
      "Travel orchestration",
      "Stakeholder communication",
      "Decision support",
    ],
  },
  {
    id: "pa",
    name: "Personal Assistant",
    tag: "Life, handled.",
    items: [
      "Household operations",
      "Family logistics",
      "Travel",
      "Events",
      "On-site presence where it matters",
    ],
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          eyebrow="Three disciplines, one studio"
          title="Assistance as a practice, not a gig."
          body="We don't sell hours by the task. Each discipline is a practiced craft with its own method, its own operators, and its own AI workflow layer."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-2xl border hairline bg-noir-900 p-7 transition-colors hover:border-gild-400/60"
            >
              <h3 className="font-display text-2xl text-gild-200">{s.name}</h3>
              <p className="mt-2 text-[15px] italic text-candle/70">{s.tag}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {s.items.map((i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-candle/75">
                    <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gild-500" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="font-display text-2xl text-candle">Find your leverage — book a call</p>
          <p className="mt-2 text-candle/60">
            Tell us where your week leaks. We&apos;ll show you the system that plugs it.
          </p>
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

export function BoutiqueBand() {
  return (
    <section id="studio" className="border-y hairline bg-noir-900 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <Eyebrow>Small by design</Eyebrow>
        <h2 className="font-display text-4xl leading-tight md:text-5xl">
          <span className="text-candle">Nine people built Instagram.</span>
          <br />
          <span className="gild-text emboss">We&apos;re seven to ten.</span>
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-candle/70">
          Before its acquisition, Instagram ran on nine people. Rigor is not headcount —
          it&apos;s density of talent and clarity of method. We stay deliberately small so every
          engagement is run by a senior operator, never handed down a chain.
        </p>
        <a
          href="#how-it-works"
          className="mt-8 inline-block rounded-full border hairline px-8 py-3.5 font-medium text-gild-200 hover:border-gild-400"
        >
          How the studio works
        </a>
      </div>
    </section>
  );
}

const PHASES = [
  {
    n: "01",
    name: "Map",
    tag: "We learn how work actually moves.",
    body: "A structured intake of your inbox, calendar, decisions, and recurring operations. We find the loops worth automating and the judgment calls worth keeping human.",
  },
  {
    n: "02",
    name: "Build",
    tag: "Workflows, not just effort.",
    body: "We construct the AI workflow layer: intake routing, drafting pipelines, briefing templates, follow-up sequences, travel and expense playbooks — inside your tools, under your control.",
  },
  {
    n: "03",
    name: "Operate",
    tag: "A senior operator at full capacity.",
    body: "Your VA, EA, or PA runs the system at a throughput multiples of traditional assistance — because the workflows carry the repetitive load and the operator carries the judgment.",
  },
  {
    n: "04",
    name: "Transfer",
    tag: "We depart. The operating system stays.",
    body: "Every workflow documented, every template handed over, your team trained. An engagement that ends by making you self-sufficient is an engagement done right.",
  },
];

export function Method() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead
          eyebrow="The method"
          title="We install leverage, then we transfer it."
          body="Map the work. Build the workflows. Operate at full capacity. Then hand over every system, template, and automation — documented, trained, yours. Most agencies rent you hands. We leave you an operating system."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PHASES.map((p) => (
            <div key={p.n} className="rounded-2xl border hairline bg-noir-900 p-6">
              <p className="font-display text-4xl gild-text">{p.n}</p>
              <h3 className="mt-3 font-display text-xl text-candle">{p.name}</h3>
              <p className="mt-1 text-sm italic text-gild-200/80">{p.tag}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-candle/65">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="font-display text-2xl text-candle">Install the operating system — book a call</p>
          <p className="mt-2 text-candle/60">Thirty minutes to map the workflows your team will keep.</p>
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

export function EngagementModes() {
  return (
    <section className="border-y hairline bg-noir-900 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-tight md:text-5xl">
            <span className="gild-text emboss">Virtual or on-site.</span>
            <br />
            <span className="text-candle">Same-day to within the week.</span>
          </h2>
          <p className="mt-5 text-[17px] text-candle/70">
            Remote operators embedded in your tools within hours — or a senior operator at your
            office, your home, or on the road with you.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border hairline bg-noir-950 p-8">
            <h3 className="font-display text-2xl text-gild-200">Virtual</h3>
            <p className="mt-2 italic text-candle/70">Embedded in your tools within hours.</p>
            <p className="mt-4 text-[15px] leading-relaxed text-candle/65">
              Remote senior operators working inside your inbox, calendar, and systems.
              Async-first, responsive within the hour, with scheduled syncs. Best for ongoing
              operational and executive support.
            </p>
          </div>
          <div className="rounded-2xl border hairline bg-noir-950 p-8">
            <h3 className="font-display text-2xl text-gild-200">On-Site</h3>
            <p className="mt-2 italic text-candle/70">A senior operator where you are.</p>
            <p className="mt-4 text-[15px] leading-relaxed text-candle/65">
              At your office, your home, or traveling with you. For board weeks, transitions,
              events, and principals who think better with someone in the room. Available in
              defined sprints or ongoing placements.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border hairline bg-noir-950 px-8 py-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-[13px] uppercase tracking-[0.18em] text-gild-400">Timeline</p>
            <p className="mt-1 text-[15px] text-candle/75">
              Same-day — urgent coverage begins · Next-day — matched operator kickoff · Within
              the week — full scoped engagement live
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 rounded-full bg-gild-500 px-7 py-3 font-semibold text-noir-950 hover:bg-gild-400"
          >
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
}
