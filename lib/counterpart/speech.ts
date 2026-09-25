/**
 * Speech helpers for the VoiceCounterpart.
 * Free starting path: Web Speech API (speechSynthesis) for voice out,
 * getUserMedia + MediaRecorder for mic in. Mic recording requires a secure
 * context — HTTPS in production (the Vercel deploy provides this);
 * on plain HTTP the mic button degrades to typed input.
 */

export function ttsSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  // Prefer a natural female English voice; fall back to any English voice.
  return (
    voices.find((v) => /en[-_]US/i.test(v.lang) && /female|samantha|zira|aria|jenny/i.test(v.name)) ||
    voices.find((v) => /en[-_]GB/i.test(v.lang) && /female/i.test(v.name)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    voices[0]
  );
}

export interface SpeakHandle {
  cancel: () => void;
  done: Promise<void>;
}

/** Speak text; resolves when the utterance ends. Rejects if TTS is unavailable. */
export function speak(text: string): SpeakHandle {
  let cancel = () => {};
  const done = new Promise<void>((resolve, reject) => {
    if (!ttsSupported()) {
      reject(new Error("tts-unsupported"));
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const voice = pickVoice();
      if (voice) u.voice = voice;
      u.rate = 1.02;
      u.pitch = 1;
      u.onend = () => resolve();
      u.onerror = () => resolve(); // never trap the UI on a speech error
      cancel = () => {
        try {
          window.speechSynthesis.cancel();
        } catch {
          /* noop */
        }
        resolve();
      };
      window.speechSynthesis.speak(u);
    } catch {
      reject(new Error("tts-failed"));
    }
  });
  return { cancel, done };
}

export function stopSpeaking() {
  try {
    if (ttsSupported()) window.speechSynthesis.cancel();
  } catch {
    /* noop */
  }
}

export function micAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    window.isSecureContext
  );
}

export interface MicSession {
  stream: MediaStream;
  analyser: AnalyserNode;
  audioCtx: AudioContext;
  recorder: MediaRecorder;
  stop: () => Promise<Blob | null>;
}

/** Start mic capture with a live analyser for the listening waveform. */
export async function startMic(): Promise<MicSession> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const audioCtx = new AudioCtx();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  const recorder = new MediaRecorder(stream);
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };
  recorder.start();
  const stop = () =>
    new Promise<Blob | null>((resolve) => {
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close().catch(() => {});
        resolve(chunks.length ? new Blob(chunks, { type: recorder.mimeType }) : null);
      };
      try {
        recorder.stop();
      } catch {
        resolve(null);
      }
    });
  return { stream, analyser, audioCtx, recorder, stop };
}

/** Browser speech recognition for transcription (Chrome/Edge). Null when unsupported. */
export function createRecognizer(
  onResult: (text: string) => void,
  onError: () => void
): { start: () => void; stop: () => void } | null {
  const SR =
    (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
      .SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new (SR as new () => {
    lang: string;
    interimResults: boolean;
    onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
  })();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.onresult = (e) => {
    try {
      const text = e.results[0][0].transcript;
      if (text) onResult(text);
    } catch {
      onError();
    }
  };
  rec.onerror = onError;
  return {
    start: () => {
      try {
        rec.start();
      } catch {
        onError();
      }
    },
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    },
  };
}
