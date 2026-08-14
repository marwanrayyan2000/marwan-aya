import { useReveal } from "@/lib/useReveal";
import { cn } from "@/lib/utils";
import { ArchPhoto, Reveal, SectionLabel, SectionTitle } from "./atoms";

const CHAPTERS = [
  { date: "١٦ / ٠٩ / ٢٠٢٥", en: "16 / 09 / 2025", title: "بداية الحكاية", note: "خطوة أولى غيّرت اتجاه الأيام." },
  { date: "٠٤ / ١٠ / ٢٠٢٥", en: "04 / 10 / 2025", title: "وعدٌ ببداية جديدة", note: "قلبان اتفقا على العمر كله." },
  { date: "٠٤ / ٠٩ / ٢٠٢٦", en: "04 / 09 / 2026", title: "واليوم… نكمل الحكاية معًا", note: "وبينكم يكتمل الفرح." },
] as const;

function Chapter({ index, chapter }: { index: number; chapter: (typeof CHAPTERS)[number] }) {
  const { ref, shown } = useReveal<HTMLLIElement>(0.35);
  return (
    <li ref={ref} className="relative pe-10 pb-16 last:pb-0">
      <span
        className={cn(
          "absolute end-[-4.5px] top-2 size-[9px] rounded-full bg-gold transition-all duration-700",
          shown ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        aria-hidden="true"
      />
      <div
        className={cn("reveal", shown && "reveal-in")}
        style={{ transitionDelay: `${index * 90}ms` }}
      >
        <p className="font-display text-lg text-gold-deep">{chapter.date}</p>
        <p className="mt-1 font-serif text-[0.65rem] tracking-luxe text-muted-foreground" dir="ltr">
          {chapter.en}
        </p>
        <h3 className="mt-4 font-display text-xl leading-[1.7] text-ink">{chapter.title}</h3>
        <p className="mt-2 font-kufi text-[0.82rem] leading-[2] text-muted-foreground">
          {chapter.note}
        </p>
      </div>
    </li>
  );
}

export function Timeline() {
  const { ref, shown } = useReveal<HTMLDivElement>(0.1);

  return (
    <section
      aria-labelledby="story-title"
      className="surface-ivory relative overflow-hidden px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Reveal>
            <SectionLabel>Our Story</SectionLabel>
          </Reveal>
          <Reveal delay={100} className="mt-5">
            <SectionTitle>
              <span id="story-title">حكايتنا في ثلاث لحظات</span>
            </SectionTitle>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-14 md:grid-cols-[1fr_auto]">
          <div ref={ref} className="relative">
            <span
              className={cn(
                "absolute end-0 top-2 w-px origin-top bg-gradient-to-b from-gold via-gold/60 to-transparent transition-transform duration-[2200ms] ease-out",
                shown ? "scale-y-100" : "scale-y-0",
              )}
              style={{ height: "calc(100% - 1rem)" }}
              aria-hidden="true"
            />
            <ol className="relative">
              {CHAPTERS.map((chapter, index) => (
                <Chapter key={chapter.en} index={index} chapter={chapter} />
              ))}
            </ol>
          </div>

          <Reveal delay={160} className="mx-auto w-full max-w-[13rem]">
            <ArchPhoto storageKey="ma-photo-story" label="Upload couple photo here" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
