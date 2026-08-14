import { Reveal, SectionLabel } from "./atoms";

export function DressCode() {
  return (
    <section aria-labelledby="dress-title" className="surface-ivory px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <SectionLabel>Dress Code</SectionLabel>
        </Reveal>
        <Reveal delay={100}>
          <h2 id="dress-title" className="mt-5 font-display text-xl text-ink sm:text-2xl">
            لمستكم تكمل ليلتنا
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p
            className="mt-5 font-serif text-[0.66rem] tracking-luxe text-gold-deep uppercase"
            dir="ltr"
          >
            Elegant Evening
          </p>
          <p className="mt-4 font-kufi text-[0.82rem] leading-[2] text-muted-foreground">
            ننتظركم بأجمل إطلالاتكم لتكتمل الصورة.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
