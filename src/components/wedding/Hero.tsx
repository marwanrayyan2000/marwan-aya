import { WEDDING } from "@/lib/wedding";
import { GoldParticles } from "./GoldParticles";
import { Monogram } from "./Monogram";
import { ArchPhoto, ArchOrnament, Reveal } from "./atoms";

export function Hero() {
  return (
    <header className="surface-ivory relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16 text-center">
      <GoldParticles density={20} />
      <Monogram
        seal={false}
        className="pointer-events-none absolute top-1/2 left-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.055]"
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Reveal>
          <span className="font-sans text-[0.6rem] tracking-luxe text-gold-deep/80 uppercase">
            Wedding Invitation
          </span>
        </Reveal>

        <Reveal delay={120}>
          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.4] text-ink sm:text-6xl">
            {WEDDING.groomAr} <span className="text-gold">&</span> {WEDDING.brideAr}
          </h1>
        </Reveal>

        <Reveal delay={220}>
          <p
            className="mt-3 font-serif text-xs tracking-[0.36em] text-muted-foreground uppercase sm:text-sm"
            dir="ltr"
          >
            {WEDDING.groomEn} &amp; {WEDDING.brideEn}
          </p>
        </Reveal>

        <Reveal delay={300} className="mt-8">
          <ArchOrnament />
        </Reveal>

        <Reveal delay={360}>
          <p className="mt-6 font-naskh text-base leading-[2.1] text-ink/85 sm:text-lg">
            يتشرّفان بدعوتكم لمشاركتهما أجمل ليلة في العمر
          </p>
        </Reveal>

        <Reveal delay={460} className="mt-10 w-full">
          <ArchPhoto
            storageKey="ma-photo-hero"
            label="Upload couple photo here"
            className="max-w-[15rem]"
          />
        </Reveal>

        <Reveal delay={540}>
          <p className="mt-12 font-display text-2xl text-ink sm:text-3xl">{WEDDING.dateAr}</p>
          <p
            className="mt-2 font-serif text-xs tracking-[0.3em] text-gold-deep uppercase"
            dir="ltr"
          >
            {WEDDING.dateEn}
          </p>
        </Reveal>

        <Reveal delay={620} className="mt-8">
          <span className="hairline-gold mx-auto block w-24" />
          <p className="mt-6 font-kufi text-sm text-ink/80">{WEDDING.venueAr}</p>
          <p className="mt-1 font-kufi text-[0.78rem] text-muted-foreground">{WEDDING.cityAr}</p>
        </Reveal>
      </div>
    </header>
  );
}
