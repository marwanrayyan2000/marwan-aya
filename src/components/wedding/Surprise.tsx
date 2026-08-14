import { useState } from "react";
import { celebrate } from "./celebrate";
import { sfx } from "@/lib/audio";
import { Monogram } from "./Monogram";
import { Reveal, SectionLabel } from "./atoms";
import { cn } from "@/lib/utils";

export function Surprise() {
  const [taps, setTaps] = useState(0);
  const revealed = taps >= 3;

  const onTap = () => {
    if (revealed) return;
    const next = taps + 1;
    setTaps(next);
    if (next < 3) {
      sfx.chime();
    } else {
      celebrate(4200);
    }
  };

  return (
    <section aria-labelledby="surprise-title" className="px-6 py-24">
      <div className="mx-auto max-w-lg text-center">
        <Reveal>
          <SectionLabel>
            <span id="surprise-title">A Hidden Note</span>
          </SectionLabel>
        </Reveal>

        <Reveal delay={100}>
          <button
            type="button"
            onClick={onTap}
            aria-label="اضغط على الشعار ثلاث مرات لكشف رسالة"
            className="mt-8 inline-flex rounded-sm p-3 transition-transform duration-700 hover:scale-105 focus-visible:ring-1 focus-visible:ring-gold focus-visible:outline-none"
          >
            <Monogram
              className={cn(
                "h-24 w-20 transition-transform duration-[1600ms]",
                revealed && "rotate-[4deg]",
              )}
            />
          </button>
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-4 font-kufi text-[0.7rem] text-muted-foreground">
            {revealed ? "" : `اضغط على الشعار ثلاث مرات (${taps}/3)`}
          </p>
        </Reveal>

        <div
          className={cn(
            "mt-6 transition-all duration-[1400ms]",
            revealed ? "opacity-100 blur-0" : "pointer-events-none opacity-0 blur-sm",
          )}
          aria-hidden={!revealed}
        >
          <span className="hairline-gold mx-auto block w-28" />
          <p className="mt-8 font-naskh text-[1.05rem] leading-[2.2] text-ink/85 sm:text-lg">
            وبين بداية الحكاية ونهايتها… اخترنا أن تكون النهاية بداية.
          </p>
          <p
            className="mt-6 font-serif text-[0.68rem] tracking-luxe text-gold-deep uppercase"
            dir="ltr"
          >
            Forever Starts Here
          </p>
        </div>
      </div>
    </section>
  );
}
