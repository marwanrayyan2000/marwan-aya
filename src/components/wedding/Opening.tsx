import { useCallback, useEffect, useRef, useState } from "react";
import { WEDDING } from "@/lib/wedding";
import { sfx } from "@/lib/audio";
import { usePrefersReducedMotion } from "@/lib/useReveal";
import { GoldParticles } from "./GoldParticles";
import { Monogram } from "./Monogram";
import { cn } from "@/lib/utils";

const STEP_DELAYS = [300, 900, 1500, 2500, 3400, 4400, 5900, 7300];

export function Opening({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [closing, setClosing] = useState(false);
  const reduced = usePrefersReducedMotion();
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    sfx.whoosh();
    setClosing(true);
    window.setTimeout(onDone, 1100);
  }, [onDone]);

  useEffect(() => {
    if (reduced) {
      setStep(STEP_DELAYS.length);
      const t = window.setTimeout(finish, 1200);
      return () => window.clearTimeout(t);
    }
    const timers = STEP_DELAYS.map((delay, index) =>
      window.setTimeout(() => {
        setStep(index + 1);
        if (index === 1) sfx.chime();
        if (index === 4) sfx.bell();
        if (index === 6) sfx.impact();
      }, delay),
    );
    const end = window.setTimeout(finish, 9600);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(end);
    };
  }, [reduced, finish]);

  const on = (n: number) => step >= n;

  return (
    <div
      role="dialog"
      aria-label="افتتاحية الدعوة"
      className={cn(
        "fixed inset-0 z-50 flex min-h-[100svh] flex-col items-center justify-center bg-background px-8 text-center transition-all duration-1000",
        closing && "pointer-events-none opacity-0",
      )}
    >
      <GoldParticles density={22} />

      <span
        className={cn(
          "hairline-gold draw-line absolute top-[16%] w-52 max-w-[70%]",
          on(1) && "draw-line-in",
        )}
      />

      <div className="relative z-10 flex flex-col items-center">
        <Monogram
          className={cn(
            "h-28 w-24 transition-all duration-[1600ms] sm:h-32 sm:w-28",
            on(2) ? "animate-seal-in" : "opacity-0",
          )}
        />

        <h1
          className={cn(
            "mt-8 font-display text-3xl text-ink transition-all duration-1000 sm:text-4xl",
            on(3) ? "animate-float-up" : "opacity-0",
          )}
        >
          {WEDDING.groomAr} <span className="text-gold">&</span> {WEDDING.brideAr}
        </h1>

        <p
          className={cn(
            "mt-3 font-serif text-sm tracking-[0.34em] text-muted-foreground uppercase transition-all duration-1000",
            on(4) ? "animate-float-up" : "opacity-0",
          )}
          dir="ltr"
        >
          {WEDDING.groomEn} &amp; {WEDDING.brideEn}
        </p>

        <p
          className={cn(
            "mt-9 max-w-xs font-naskh text-base leading-[2] text-ink/80 transition-all duration-1000 sm:text-lg",
            on(5) ? "animate-float-up" : "opacity-0",
          )}
        >
          {WEDDING.conceptAr}
        </p>

        <p
          className={cn(
            "mt-10 font-serif text-2xl tracking-[0.22em] text-gold-deep transition-all duration-1000",
            on(6) ? "animate-float-up" : "opacity-0",
          )}
          dir="ltr"
        >
          {WEDDING.dateDotted}
        </p>

        <p
          className={cn(
            "mt-5 font-sans text-[0.6rem] tracking-luxe text-muted-foreground uppercase transition-all duration-1000",
            on(7) ? "animate-float-up" : "opacity-0",
          )}
          dir="ltr"
        >
          A New Chapter Begins
        </p>
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute bottom-10 font-sans text-[0.6rem] tracking-luxe text-muted-foreground/70 uppercase transition-colors hover:text-gold-deep"
      >
        Enter
      </button>
    </div>
  );
}
