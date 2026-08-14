import { GoldRule, Reveal, SectionLabel, SectionTitle } from "./atoms";

export function Message() {
  return (
    <section aria-labelledby="message-title" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <SectionLabel>Our Beginning</SectionLabel>
        </Reveal>
        <Reveal delay={100} className="mt-5">
          <SectionTitle className="[&]:leading-[1.8]">
            <span id="message-title">ومن بين كل الطرق… اخترنا أن نمشيها معًا</span>
          </SectionTitle>
        </Reveal>

        <GoldRule className="mt-10" />

        <Reveal delay={200}>
          <p className="mt-10 font-naskh text-[1.05rem] leading-[2.3] text-ink/80 sm:text-lg">
            بدأت الحكاية بخطوة هادئة، ثم صارت أمنية نحملها في القلب،
            <br className="hidden sm:block" /> ثم صارت وعدًا لا يُنقض.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="mt-6 font-naskh text-[1.05rem] leading-[2.3] text-ink/70 sm:text-lg">
            واليوم نكتب فصلًا جديدًا من العمر، بيتًا يتّسع للفرح،
            <br className="hidden sm:block" /> وعمرًا نتقاسمه بالحب والرضا.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <p
            className="mt-12 font-serif text-[0.68rem] tracking-luxe text-gold-deep uppercase"
            dir="ltr"
          >
            When our story began, forever followed
          </p>
        </Reveal>
      </div>
    </section>
  );
}
