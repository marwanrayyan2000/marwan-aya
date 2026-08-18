import { useCallback, useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding";
import { sfx, startMusic } from "@/lib/audio";
import { usePrefersReducedMotion } from "@/lib/useReveal";
import { cn } from "@/lib/utils";

/**
 * Cinematic full-screen overture.
 * Stage 0  gate (M × A + open button, no sound until tapped)
 * Stage 1  light seam
 * Stage 2  curtains part
 * Stage 3  date
 * Stage 4  names
 * Stage 5  hand-off: the dark stage dissolves into the invitation
 */
const CUES = [0, 650, 2500, 4200, 7400] as const; // stages 1..5

export function Overture({ onDone }: { onDone: () => void }) {
  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState(0);
  const reduced = usePrefersReducedMotion();
  const done = useRef(false);
  const timers = useRef<number[]>([]);

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setStage(5);
    window.setTimeout(onDone, 1400);
  }, [onDone]);

  const begin = () => {
    if (started) return;
    setStarted(true);
    void startMusic();
    sfx.whoosh();

    if (reduced) {
      setStage(4);
      timers.current.push(window.setTimeout(finish, 1400));
      return;
    }

    CUES.forEach((delay, i) => {
      timers.current.push(
        window.setTimeout(() => {
          const next = i + 1;
          if (next === 5) {
            finish();
            return;
          }
          setStage(next);
          if (next === 1) sfx.chime();
          if (next === 2) sfx.impact();
          if (next === 4) sfx.bell();
        }, delay),
      );
    });
  };

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const on = (n: number) => stage >= n;
  const curtainsOpen = on(2);

  return (
    <div
      role="dialog"
      aria-label="افتتاحية الدعوة"
      className={cn(
        "grain vignette fixed inset-0 z-50 overflow-hidden transition-opacity duration-[1400ms]",
        stage >= 5 && "pointer-events-none opacity-0",
      )}
    >
      {/* Dark cinematic stage */}
      <div
        className={cn(
          "surface-dark absolute inset-0 transition-opacity duration-[1600ms]",
          stage >= 5 ? "opacity-0" : "opacity-100",
        )}
      />

      {/* Ambient glow + light leak */}
      <div
        className="light-bloom animate-breathe pointer-events-none absolute top-1/2 left-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 opacity-40"
        aria-hidden="true"
      />
      <div
        className="animate-drift pointer-events-none absolute -top-24 -right-16 h-[46vh] w-[46vh] rounded-full opacity-25 blur-[70px]"
        style={{ background: "radial-gradient(closest-side, var(--gold-light), transparent)" }}
        aria-hidden="true"
      />

      {/* Dust particles */}
      {started && !reduced && <Dust />}

      {/* Stage 1 — light seam */}
      {started && (
        <span
          className={cn(
            "pointer-events-none absolute top-0 left-1/2 h-full w-px origin-top -translate-x-1/2",
            on(1) && "animate-light-seam",
            curtainsOpen && "opacity-0 transition-opacity duration-[2000ms]",
          )}
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--gold-light) 22%, oklch(1 0 0) 50%, var(--gold-light) 78%, transparent)",
            boxShadow: "0 0 26px 3px color-mix(in oklab, var(--gold-light) 45%, transparent)",
            opacity: on(1) ? undefined : 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* Stage 3 — curtains */}
      {started && (
        <>
          <Curtain side="left" open={curtainsOpen} />
          <Curtain side="right" open={curtainsOpen} />
        </>
      )}

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-7 text-center">
        {!started ? (
          <div className="flex flex-col items-center">
            <p
              className="animate-type-in font-serif text-4xl text-ivory sm:text-5xl"
              dir="ltr"
              style={{ animationDelay: "200ms" }}
            >
              M <span className="text-gold-light">&times;</span> A
            </p>
            <p
              className="mt-6 font-display text-base text-ivory/70 sm:text-lg"
              style={{ animation: "float-up 1.4s cubic-bezier(0.22,1,0.36,1) 900ms both" }}
            >
              {WEDDING.groomAr} و{WEDDING.brideAr}
            </p>
            <button
              type="button"
              onClick={begin}
              className="btn-luxe-light mt-14 px-10 py-4 font-kufi text-[0.78rem]"
              style={{ animation: "float-up 1.4s cubic-bezier(0.22,1,0.36,1) 1500ms both" }}
            >
              افتح الدعوة
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Date */}
            <p
              className={cn(
                "font-serif text-lg text-ivory/85 transition-all duration-[1600ms] sm:text-2xl",
                on(3) ? "animate-type-in" : "opacity-0",
                on(4) && "-translate-y-2",
              )}
              dir="ltr"
            >
              {WEDDING.dateEn}
            </p>

            {/* Names */}
            <div className={cn("mt-9 flex flex-col items-center", !on(4) && "opacity-0")}>
              <h1
                className={cn(
                  "font-display text-5xl leading-[1.25] text-ivory sm:text-7xl",
                  on(4) && "animate-name-in",
                )}
                style={{ textShadow: "0 0 42px color-mix(in oklab, var(--gold-light) 30%, transparent)" }}
              >
                {WEDDING.groomAr}
              </h1>
              <span
                className={cn(
                  "my-3 font-display text-2xl text-gold-light/85 sm:text-3xl",
                  on(4) && "animate-name-in",
                )}
                style={{ animationDelay: "700ms" }}
                aria-hidden="true"
              >
                و
              </span>
              <p
                className={cn(
                  "font-display text-5xl leading-[1.25] text-ivory sm:text-7xl",
                  on(4) && "animate-name-in",
                )}
                style={{
                  animationDelay: "1200ms",
                  textShadow: "0 0 42px color-mix(in oklab, var(--gold-light) 30%, transparent)",
                }}
              >
                {WEDDING.brideAr}
              </p>
            </div>
          </div>
        )}
      </div>

      {started && stage < 5 && (
        <button
          type="button"
          onClick={finish}
          className="absolute inset-x-0 bottom-9 z-30 mx-auto w-fit font-sans text-[0.58rem] tracking-luxe text-ivory/45 uppercase transition-colors hover:text-gold-light"
        >
          Skip
        </button>
      )}
    </div>
  );
}

function Curtain({ side, open }: { side: "left" | "right"; open: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute top-0 z-10 h-full w-[52%] transition-transform duration-[3400ms]",
        side === "left" ? "left-0" : "right-0",
        open && (side === "left" ? "-translate-x-full" : "translate-x-full"),
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(0.7, 0, 0.28, 1)",
        backgroundImage: `repeating-linear-gradient(90deg,
            color-mix(in oklab, var(--burgundy-deep) 92%, black) 0px,
            var(--burgundy) 26px,
            color-mix(in oklab, var(--burgundy-deep) 96%, black) 54px),
          linear-gradient(180deg, color-mix(in oklab, var(--burgundy) 60%, black), var(--burgundy-deep))`,
        boxShadow:
          side === "left"
            ? "8px 0 60px -10px oklch(0 0 0 / 0.75) inset, 14px 0 40px -12px oklch(0 0 0 / 0.6)"
            : "-8px 0 60px -10px oklch(0 0 0 / 0.75) inset, -14px 0 40px -12px oklch(0 0 0 / 0.6)",
      }}
    />
  );
}

/** A handful of slow drifting light motes — cheap, CSS only. */
function Dust() {
  const motes = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {motes.map((i) => (
        <span
          key={i}
          className="animate-breathe absolute rounded-full"
          style={{
            top: `${(i * 37) % 92 + 3}%`,
            left: `${(i * 61) % 94 + 3}%`,
            width: i % 3 === 0 ? "3px" : "2px",
            height: i % 3 === 0 ? "3px" : "2px",
            background: "var(--gold-light)",
            boxShadow: "0 0 8px 1px color-mix(in oklab, var(--gold-light) 60%, transparent)",
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${7 + (i % 5) * 2}s`,
          }}
        />
      ))}
    </div>
  );
}
