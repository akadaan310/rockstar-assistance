# Rockstar Assistance — marketing site

A boutique studio for executive leverage. Next.js 14 + Tailwind, Noir Gilded design
(near-black, champagne gold, candlelight warmth).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## The VoiceCounterpart component

`components/VoiceCounterpart.tsx` is the reusable counterpart, built to be dropped
into all of Sarah's future sites unchanged. Re-exported from `components/index.ts`.

### Props

| Prop | Type | Default | Purpose |
|---|---|---|---|
| `apiBase` | `string` | — | Studio backend base URL (e.g. `NEXT_PUBLIC_API_URL`). When set, the brain POSTs to `${apiBase}/api/ai/chat` with `client_id`; when unset or unreachable, it degrades to scripted local decision trees. |
| `clientId` | `string` | `"sarah"` | Client pillar for AI scoping |
| `greeting` | `string` | `"Hey Sarah — I'm here."` | First spoken line on load |
| `personaName` | `string` | `"Sarah"` | Persona display name + bubble monogram |
| `siteMap` | `{label, href}[]` | `[]` | Sections the counterpart can tour/guide to |

### Behavior

- **Floating bubble, draggable** (pointer events: touch + mouse). Position persists
  per session via `sessionStorage`; defaults to bottom-right.
- **Hamburger badge** on the bubble opens a right-side **session history** panel:
  one entry per visit interval (open → leave), each with site, date/time,
  duration, and an auto-summary; tap for the event detail.
- **States are always visible**: `idle` (soft gold pulse), `listening` (spinning
  conic ring + live mic waveform), `transcribing` (bouncing dots),
  `speaking` (expanding rings + animated bars), `saving-note` (flash + pop).
  A small caption under the bubble and the chat header both name the state.
- **Voice in/out (free path)**: Web Speech API `speechSynthesis` for speech;
  `getUserMedia` + `MediaRecorder` for mic. Mic requires a secure context —
  **HTTPS in production** (the Vercel deploy provides this); on plain HTTP the
  mic button degrades gracefully to typed input. Browser speech recognition
  (Chrome/Edge) transcribes; otherwise it falls back to typing.
- **Notes widget**: notebook button in the chat header opens saved notes
  (localStorage). The bubble flashes + pops when a note is saved.
- **Decision funnel**: the counterpart never leads with open-ended questions —
  it presents tappable option chips (4 → 3 → binary/multiple choice); every
  path converges to a recorded decision (localStorage + best-effort POST to
  `${apiBase}/api/decisions`). Sarah can also always talk or type freely.
- **Pre-launch awareness**: greets her, knows the site is pre-launch, offers
  tour / what's new / ask anything / book a call.
- **App-aware**: tour options smooth-scroll to `siteMap` anchors.

### Reuse on another site

```tsx
import { VoiceCounterpart } from "@/components"; // or copy the folder

<VoiceCounterpart
  apiBase={process.env.NEXT_PUBLIC_API_URL}
  clientId="sarah"
  personaName="Sarah"
  greeting="Hey Sarah — I'm here."
  siteMap={[
    { label: "Services", href: "#services" },
    { label: "Book a call", href: "#contact" },
  ]}
/>
```

Copy `components/VoiceCounterpart.tsx`, `components/counterpart/*`, and
`lib/counterpart/*` as a unit. The glow/waveform keyframes live in
`app/globals.css` (the `.vc-*` classes) — copy those too.

## Placeholders (intentional, to be replaced)

- Founder portrait: elegant "SD" monogram tile — professional headshot arriving,
  never a generated face.
- Studio film: 16:9 placeholder with play glyph, "Studio film — coming soon".
- White paper download: button disabled, "coming soon" — the 30-page PDF is
  being written.
- Contact form: front-end demo; wire to a real endpoint before launch.
- No testimonials, no metrics, no client logos — the studio is new and the
  copy is honest about it.
