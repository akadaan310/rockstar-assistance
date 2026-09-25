export type CounterpartState =
  | "idle"
  | "listening"
  | "transcribing"
  | "speaking"
  | "saving-note";

export interface SiteLink {
  label: string;
  href: string;
}

export interface VoiceCounterpartProps {
  /** Base URL of the studio backend, e.g. process.env.NEXT_PUBLIC_API_URL */
  apiBase?: string;
  /** Client pillar for AI scoping — "sarah" on this site */
  clientId?: string;
  /** First thing she hears on load */
  greeting?: string;
  /** Display name of the persona */
  personaName?: string;
  /** Sections of this site the counterpart can guide her to */
  siteMap?: SiteLink[];
}

export interface Note {
  id: string;
  text: string;
  at: string;
}

export interface Decision {
  id: string;
  text: string;
  at: string;
}

export interface SessionEvent {
  at: string;
  kind: "decision" | "note" | "visit" | "message";
  text: string;
}

export interface Session {
  id: string;
  site: string;
  startedAt: string;
  endedAt?: string;
  durationSec?: number;
  summary?: string;
  events: SessionEvent[];
}

export interface OptionNode {
  id: string;
  label: string;
  /** What the counterpart says when this is picked */
  reply: string;
  /** Follow-up options; empty/undefined means this choice closes the exchange */
  options?: OptionNode[];
  /** Optional navigation target on selection */
  href?: string;
  /** Marks a terminal choice that gets recorded as a decision */
  decision?: string;
}
