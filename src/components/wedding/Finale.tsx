import { useEffect } from "react";
import { WEDDING } from "@/lib/wedding";
import { useReveal } from "@/lib/useReveal";
import { celebrate } from "./celebrate";
import { GoldParticles } from "./GoldParticles";
import { Monogram } from "./Monogram";
import { ArchPhoto, GoldRule } from "./atoms";
import { cn } from "@/lib/utils";

export function Finale() {
  const { ref, shown } = useReveal<HTMLElement>(0.35);

  useEffect(() => {
    if (!shown) return;
    const timer = window.setTimeout(() => celebrate(5600), 700);
    return () => window.clearTimeout(timer);
  }, [shown]);

  return (
    <footer
      ref={ref}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      <GoldParticles density={26} />

      <div
        className={cn(
          "relative z-10 flex w-full max-w-sm flex-col items-center transition-all duration-[1600ms]",
          shown ? "opacity-100 blur-0" : "translate-y-6 opacity-0 blur-sm",
        )}
      >
        <ArchPhoto
          storageKey="ma-photo-final"
          label="Upload couple photo here"
          className="max-w-[11rem]"
          ratio="aspect-[4/5]"
        />

        <h2 className="mt-12 font-display text-3xl text-ink sm:text-4xl">
          {WEDDING.groomAr} <span className="text-gold">&</span> {WEDDING.brideAr}
        </h2>

        <p className="mt-8 font-naskh text-[1.02rem] leading-[2.2] text-ink/80">
          شكرًا لأنكم كنتم جزءًا من أجمل فصول حكايتنا.
        </p>

        <p className="mt-10 font-serif text-lg tracking-[0.24em] text-gold-deep" dir="ltr">
          {WEDDING.dateEn}
        </p>

        <GoldRule className="mt-10 w-28" />

        <Monogram className="mt-10 h-24 w-20" />


        <p
          className="mt-8 font-sans text-[0.58rem] tracking-luxe text-gold-deep/70 uppercase"
          dir="ltr"
        >
          Forever starts here
        </p>
      </div>
    </footer>
  );
}
