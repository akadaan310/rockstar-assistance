import type { OptionNode, SiteLink } from "./types";

/**
 * The counterpart's conversational brain.
 * When apiBase is set, it asks the studio backend first
 * (POST ${apiBase}/api/ai/chat, client-scoped). Any failure —
 * no env, offline, timeout — falls back to the scripted trees below,
 * so the component works fully standalone on any site.
 */

export interface BrainReply {
  text: string;
  options?: OptionNode[];
}

async function askBackend(
  apiBase: string,
  clientId: string,
  message: string,
  mode: "censored" | "uncensored"
): Promise<string | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 12000);
    const res = await fetch(`${apiBase.replace(/\/$/, "")}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, message, mode }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data?.reply === "string" && data.reply.trim() ? data.reply : null;
  } catch {
    return null;
  }
}

/** Best-effort: mirror a recorded decision to the studio backend. */
export async function pushDecision(
  apiBase: string | undefined,
  clientId: string,
  text: string
): Promise<void> {
  if (!apiBase) return;
  try {
    await fetch(`${apiBase.replace(/\/$/, "")}/api/decisions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        lane: "sarah",
        text,
        project_id: "rockstar",
      }),
    });
  } catch {
    /* local record is the source of truth; backend sync is a bonus */
  }
}

/* ------------------------------------------------------------------ */
/* Scripted decision trees (offline fallback). Every path converges   */
/* to a recorded decision — the counterpart never leaves a thread     */
/* hanging and never leads with an open-ended question.               */
/* ------------------------------------------------------------------ */

function tourTree(siteMap: SiteLink[]): OptionNode[] {
  const stops = siteMap.slice(0, 4).map((s) => ({
    id: `tour-${s.href}`,
    label: s.label,
    href: s.href,
    reply: `Lovely choice. I've taken you to ${s.label} — have a look around, then tell me: does this section feel right for launch?`,
    options: [
      {
        id: "tour-yes",
        label: "Yes — it feels right",
        reply: "Wonderful. I've recorded that as approved for launch.",
        decision: "Approved site section for launch",
      },
      {
        id: "tour-tweak",
        label: "Needs a tweak",
        reply: "Noted — I'll save that as a change request for the studio team. Anything else you'd like to review?",
        decision: "Requested a tweak to a site section",
        options: [
          {
            id: "tour-more",
            label: "Review another section",
            reply: "Of course — pick where to next.",
            options: tourTree(siteMap),
          },
          {
            id: "tour-done",
            label: "That's everything",
            reply: "All recorded. You're all set for now — I'm right here whenever you need me.",
            decision: "Finished site review",
          },
        ],
      },
    ] as OptionNode[],
  }));
  return stops;
}

export function rootOptions(siteMap: SiteLink[]): OptionNode[] {
  return [
    {
      id: "tour",
      label: "Take the tour",
      reply:
        "I'd love to show you around. This is the new Rockstar Assistance site — still pre-launch, so you're seeing it before anyone else. Where shall we start?",
      options: tourTree(siteMap),
    },
    {
      id: "updates",
      label: "What's new",
      reply:
        "Here's the latest: the site structure is finished and the voice studio is live in your portal. Your three new photos are still the one thing we're waiting on before final headshots. Want me to…",
      options: [
        {
          id: "upd-remind",
          label: "Remind me about the photos",
          reply: "Done — I've saved a reminder note: three new upper-angle phone photos for the headshot studio.",
          decision: "Saved reminder: send three new photos for headshots",
        },
        {
          id: "upd-voice",
          label: "Tell me about the voice studio",
          reply:
            "Thirty voices are ready for you to audition, each with three real scenarios. My personal shortlist is five — warm, assured, never stiff. Shall I…",
          options: [
            {
              id: "upd-voice-listen",
              label: "Play my top pick",
              reply: "Playing Warm Executive now — this is my flagship recommendation for your welcome message.",
              decision: "Listened to top voice pick",
            },
            {
              id: "upd-voice-later",
              label: "I'll audition later",
              reply: "Whenever you're ready — they're waiting in your portal under Voice Casting.",
              decision: "Deferred voice audition",
            },
          ],
        },
        {
          id: "upd-nothing",
          label: "Nothing for now",
          reply: "All good. I'm here whenever something comes up.",
          decision: "Reviewed updates — nothing needed",
        },
      ],
    },
    {
      id: "ask",
      label: "Ask anything",
      reply:
        "Of course — talk or type, I'm listening. To keep things quick I can also narrow it down: what's on your mind?",
      options: [
        {
          id: "ask-brand",
          label: "Brand & positioning",
          reply:
            "Rockstar Assistance is positioned as a boutique studio — seven to ten senior operators, never a gig marketplace. Does that positioning still feel right to you?",
          options: [
            {
              id: "ask-brand-yes",
              label: "Yes — keep it",
              reply: "Locked in. Boutique positioning confirmed.",
              decision: "Confirmed boutique positioning",
            },
            {
              id: "ask-brand-no",
              label: "I want to revisit it",
              reply: "I've saved that as a discussion topic for your next studio review.",
              decision: "Flagged positioning for revisit",
            },
          ],
        },
        {
          id: "ask-services",
          label: "Services & offers",
          reply:
            "Three disciplines: virtual, executive, and personal assistance — each virtual, on-site, or both. Which one should we talk through?",
          options: [
            {
              id: "ask-svc-va",
              label: "Virtual assistant",
              reply: "Your operating layer for the work that never stops — inbox, calendar, research, booking. Want this emphasized on the site?",
              options: [
                { id: "ask-svc-va-y", label: "Emphasize it", reply: "Done — noted as a launch priority.", decision: "Prioritized VA discipline" },
                { id: "ask-svc-va-n", label: "Keep balanced", reply: "Understood — all three stay balanced.", decision: "Kept disciplines balanced" },
              ],
            },
            {
              id: "ask-svc-ea",
              label: "Executive assistant",
              reply: "A chief of staff's right hand, on demand — calendar architecture, board prep, travel. Same question: emphasize or keep balanced?",
              options: [
                { id: "ask-svc-ea-y", label: "Emphasize it", reply: "Done — noted as a launch priority.", decision: "Prioritized EA discipline" },
                { id: "ask-svc-ea-n", label: "Keep balanced", reply: "Understood — all three stay balanced.", decision: "Kept disciplines balanced" },
              ],
            },
            {
              id: "ask-svc-pa",
              label: "Personal assistant",
              reply: "Life, handled — household, family logistics, events, on-site presence. Emphasize or keep balanced?",
              options: [
                { id: "ask-svc-pa-y", label: "Emphasize it", reply: "Done — noted as a launch priority.", decision: "Prioritized PA discipline" },
                { id: "ask-svc-pa-n", label: "Keep balanced", reply: "Understood — all three stay balanced.", decision: "Kept disciplines balanced" },
              ],
            },
          ],
        },
        {
          id: "ask-note",
          label: "Just save a note",
          reply: "Absolutely — say it or type it, and I'll keep it safe in your notes.",
          decision: "Opened notes",
        },
      ],
    },
    {
      id: "call",
      label: "Book a call",
      reply:
        "Thirty minutes with a senior operator — not a sales rep. Want me to take you to the booking section?",
      options: [
        {
          id: "call-yes",
          label: "Yes, take me there",
          href: "#contact",
          reply: "Here we go — the booking section is just below.",
          decision: "Went to book a call",
        },
        {
          id: "call-later",
          label: "Not yet",
          reply: "No rush. The invitation stands whenever you're ready.",
          decision: "Deferred booking a call",
        },
      ],
    },
  ];
}

/** Free-text fallback: short, warm, and always offering a next step. */
function freeTextFallback(): BrainReply {
  return {
    text: "Got it — I've noted that. If you'd like, I can save it as a note, or we can pick up one of these threads.",
    options: [
      {
        id: "ft-note",
        label: "Save it as a note",
        reply: "Saved to your notes — you can open them from the bubble anytime.",
        decision: "Saved a free-text note",
      },
      {
        id: "ft-tour",
        label: "Take the tour instead",
        reply: "Lovely — where shall we start?",
        options: [],
      },
    ],
  };
}

export async function getReply(
  apiBase: string | undefined,
  clientId: string,
  message: string,
  siteMap: SiteLink[],
  mode: "censored" | "uncensored" = "censored"
): Promise<BrainReply> {
  if (apiBase) {
    try {
      const backend = await askBackend(apiBase, clientId, message, mode);
      if (backend) return { text: backend };
    } catch {
      /* fall through to the visible offline note below */
    }
    // The studio didn't answer — say so plainly, never go silent.
    return {
      text: "I'm having trouble reaching the studio right now, so I'm running on my own for the moment. Try again in a bit — or pick one of these and I'll keep up.",
      options: rootOptions(siteMap).slice(0, 4),
    };
  }
  return freeTextFallback();
}

export function greetingOptions(siteMap: SiteLink[]): OptionNode[] {
  return rootOptions(siteMap);
}
