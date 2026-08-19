import { Reveal, SectionLabel } from "./atoms";

const PALETTE = [
  { ar: "بورجندي", color: "var(--burgundy)" },
  { ar: "فحمي", color: "var(--charcoal)" },
  { ar: "عاجي", color: "var(--ivory)" },
  { ar: "شامبين", color: "var(--gold)" },
] as const;

export function DressCode() {
  return (
    <section aria-labelledby="dress-title" className="surface-ivory px-6 py-24">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <SectionLabel>Dress Code</SectionLabel>
        </Reveal>
        <Reveal delay={100}>
          <h2 id="dress-title" className="mt-5 font-display text-xl text-ink sm:text-2xl">
            لمستكم تكمل ليلتنا
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p
            className="mt-5 font-serif text-[0.66rem] tracking-luxe text-gold-deep uppercase"
            dir="ltr"
          >
            Elegant Evening
          </p>
        </Reveal>
        <Reveal delay={220}>
          <ul className="mt-9 flex items-center justify-center gap-5">
            {PALETTE.map(({ ar, color }) => (
              <li key={ar} className="flex flex-col items-center gap-3">
                <span
                  className="size-8 rounded-full border border-gold/40 shadow-[0_10px_24px_-16px_oklch(0_0_0/0.5)] sm:size-9"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
                <span className="font-kufi text-[0.62rem] text-muted-foreground">{ar}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
