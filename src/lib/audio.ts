/**
 * Lightweight cinematic audio engine.
 * Generates a warm Middle-Eastern (Hijaz) instrumental loop plus subtle
 * sound effects with the Web Audio API — no external media files, no
 * loading cost, and nothing that can fail to stream on mobile.
 */

type Ctx = AudioContext & { _weddingWired?: boolean };

let ctx: Ctx | null = null;
let masterGain: GainNode | null = null;
let musicGain: GainNode | null = null;
let delay: DelayNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let musicStarted = false;
let muted = false;

const listeners = new Set<(playing: boolean) => void>();

function notify() {
  listeners.forEach((l) => l(isPlaying()));
}

export function onAudioChange(listener: (playing: boolean) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function isPlaying() {
  return Boolean(ctx && ctx.state === "running" && musicStarted && !muted);
}

function ensureCtx(): Ctx | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC() as Ctx;

  masterGain = ctx.createGain();
  masterGain.gain.value = 0.9;
  masterGain.connect(ctx.destination);

  // Simple feedback delay for an airy, hall-like tail.
  delay = ctx.createDelay(1.2);
  delay.delayTime.value = 0.34;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.32;
  const wet = ctx.createGain();
  wet.gain.value = 0.3;
  delay.connect(feedback);
  feedback.connect(delay);
  delay.connect(wet);
  wet.connect(masterGain);

  musicGain = ctx.createGain();
  musicGain.gain.value = 0;
  musicGain.connect(masterGain);

  return ctx;
}

function voice(freq: number, at: number, dur: number, gain: number, type: OscillatorType = "triangle") {
  if (!ctx || !musicGain || !delay) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 2200;

  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, at);
  amp.gain.exponentialRampToValueAtTime(gain, at + 0.03);
  amp.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  osc.connect(filter);
  filter.connect(amp);
  amp.connect(musicGain);
  amp.connect(delay);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

// Hijaz-flavoured scale rooted on D (D, Eb, F#, G, A, Bb, C#, D)
const SCALE = [293.66, 311.13, 369.99, 392.0, 440.0, 466.16, 554.37, 587.33];
const PHRASE = [0, 2, 3, 2, 4, 3, 2, 0, 1, 0, 3, 2, 5, 4, 3, 2];

let step = 0;

function scheduleBar() {
  if (!ctx) return;
  const now = ctx.currentTime + 0.05;
  const beat = 0.5;
  for (let i = 0; i < 4; i++) {
    const idx = PHRASE[(step + i) % PHRASE.length]!;
    const note = SCALE[idx]!;
    voice(note, now + i * beat, 1.6, 0.05);
    if (i % 2 === 0) voice(note / 2, now + i * beat, 2.4, 0.035, "sine");
  }
  // Soft sustained pad on the root every bar.
  voice(146.83, now, 2.6, 0.03, "sine");
  step = (step + 4) % PHRASE.length;
}

function startMusicLoop() {
  if (musicTimer) return;
  scheduleBar();
  musicTimer = setInterval(scheduleBar, 2000);
}

export async function startMusic() {
  const c = ensureCtx();
  if (!c) return false;
  try {
    await c.resume();
  } catch {
    /* blocked until a gesture */
  }
  if (c.state !== "running") {
    notify();
    return false;
  }
  musicStarted = true;
  muted = false;
  startMusicLoop();
  musicGain?.gain.cancelScheduledValues(c.currentTime);
  musicGain?.gain.setTargetAtTime(0.5, c.currentTime, 2.5);
  notify();
  return true;
}

export function toggleMute() {
  const c = ensureCtx();
  if (!c) return;
  if (!musicStarted) {
    void startMusic();
    return;
  }
  muted = !muted;
  musicGain?.gain.setTargetAtTime(muted ? 0 : 0.5, c.currentTime, 0.4);
  notify();
}

/** Attempt autoplay now; otherwise begin on the very first interaction. */
export function primeAudio() {
  void startMusic();
  const c = ensureCtx();
  if (!c || c._weddingWired) return;
  c._weddingWired = true;
  const kick = () => {
    void startMusic();
    if (isPlaying()) {
      events.forEach((e) => window.removeEventListener(e, kick));
    }
  };
  const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
  events.forEach((e) => window.addEventListener(e, kick, { passive: true }));
}

function fx(freqs: number[], dur: number, gain: number, type: OscillatorType = "sine") {
  const c = ensureCtx();
  if (!c || c.state !== "running" || !masterGain || !delay) return;
  const at = c.currentTime + 0.01;
  const out = masterGain;
  const tail = delay;
  freqs.forEach((f, i) => {
    const osc = c.createOscillator();
    const amp = c.createGain();
    osc.type = type;
    osc.frequency.value = f;
    const start = at + i * 0.055;
    amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(gain, start + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(amp);
    amp.connect(out);
    amp.connect(tail);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  });
}

export const sfx = {
  chime: () => fx([880, 1174.66, 1567.98], 1.4, 0.07),
  bell: () => fx([1046.5, 1396.9], 1.8, 0.055),
  whoosh: () => {
    const c = ensureCtx();
    if (!c || c.state !== "running" || !masterGain) return;
    const buffer = c.createBuffer(1, c.sampleRate * 0.7, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) ** 2;
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 550;
    bp.Q.value = 0.8;
    const amp = c.createGain();
    amp.gain.value = 0.09;
    src.connect(bp);
    bp.connect(amp);
    amp.connect(masterGain);
    src.start();
  },
  impact: () => fx([98, 146.83, 196], 2.4, 0.09, "sine"),
  sparkle: () => fx([1567.98, 1975.53, 2349.32, 2793.83], 1.1, 0.045),
};
