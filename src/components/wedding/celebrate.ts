import { sfx } from "@/lib/audio";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  alpha: number;
  tone: string;
};

const TONES = [
  "rgba(201,169,110,",
  "rgba(226,208,168,",
  "rgba(176,142,88,",
  "rgba(250,248,243,",
];

let running = false;

/** Restrained gold foil celebration — slow, weighted, cinematic. */
export function celebrate(durationMs = 5200) {
  if (typeof window === "undefined" || running) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  running = true;
  sfx.sparkle();
  setTimeout(() => sfx.impact(), 180);

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:60";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    running = false;
    return;
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  const count = window.innerWidth < 640 ? 70 : 120;
  const pieces: Piece[] = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: -40 - Math.random() * window.innerHeight * 0.6,
    vx: (Math.random() - 0.5) * 0.035,
    vy: 0.035 + Math.random() * 0.06,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.004,
    w: 3 + Math.random() * 5,
    h: 7 + Math.random() * 11,
    alpha: 0.5 + Math.random() * 0.5,
    tone: TONES[Math.floor(Math.random() * TONES.length)]!,
  }));

  const start = performance.now();
  let last = start;

  const frame = (now: number) => {
    const dt = Math.min(now - last, 48);
    last = now;
    const elapsed = now - start;
    const fade = elapsed > durationMs - 1200 ? Math.max(0, (durationMs - elapsed) / 1200) : 1;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.x += p.vx * dt + Math.sin((now + p.rot * 900) / 900) * 0.16;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      if (p.y > window.innerHeight + 40) {
        p.y = -30;
        p.x = Math.random() * window.innerWidth;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = `${p.tone}${(p.alpha * fade).toFixed(3)})`;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot)));
      ctx.restore();
    }

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      window.removeEventListener("resize", resize);
      canvas.remove();
      running = false;
    }
  };
  requestAnimationFrame(frame);
}
