import { Clock, MapPin, Sparkles } from "lucide-react";
import { WEDDING } from "@/lib/wedding";
import { GoldRule, Reveal, SectionLabel, SectionTitle } from "./atoms";

const CARDS = [
  { icon: Clock, title: "استقبال الضيوف", time: WEDDING.receptionAr, en: "5:00 PM" },
  { icon: Sparkles, title: "بداية الاحتفال", time: WEDDING.celebrationAr, en: "6:00 PM" },
] as const;

export function Details() {
  return (
    <section
      aria-labelledby="details-title"
      className="surface-ivory relative px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>The Evening</SectionLabel>
        </Reveal>
        <Reveal delay={100} className="mt-5">
          <SectionTitle>
            <span id="details-title">موعدنا</span>
          </SectionTitle>
        </Reveal>

        <GoldRule className="mt-10" />

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {CARDS.map(({ icon: Icon, title, time, en }, index) => (
            <Reveal key={title} delay={index * 120}>
              <article className="card-luxe flex h-full flex-col items-center rounded-sm px-6 py-10">
                <Icon className="size-5 text-gold" aria-hidden="true" />
                <h3 className="mt-5 font-display text-lg text-ink">{title}</h3>
                <p className="mt-3 font-display text-2xl text-gold-deep">{time}</p>
                <p
                  className="mt-2 font-serif text-[0.62rem] tracking-luxe text-muted-foreground"
                  dir="ltr"
                >
                  {en}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240} className="mt-6">
          <article className="card-luxe flex flex-col items-center rounded-sm px-6 py-10">
            <MapPin className="size-5 text-gold" aria-hidden="true" />
            <h3 className="mt-5 font-display text-lg text-ink">المكان</h3>
            <p className="mt-3 font-display text-xl text-gold-deep">{WEDDING.venueAr}</p>
            <span className="hairline-gold mt-6 block w-20" />
            <h4 className="mt-6 font-kufi text-[0.7rem] tracking-widest text-muted-foreground">
              الموقع
            </h4>
            <p className="mt-2 font-kufi text-sm text-ink/80">{WEDDING.cityAr}</p>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
