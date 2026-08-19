import { useEffect, useState } from "react";
import { WEDDING, pad2, toArabicDigits } from "@/lib/wedding";
import { GoldRule, Reveal, SectionLabel, SectionTitle } from "./atoms";

function remaining() {
  const diff = Math.max(0, WEDDING.startsAtUtc - Date.now());
  const seconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
}

const LABELS = [
  { key: "days", ar: "يوم" },
  { key: "hours", ar: "ساعة" },
  { key: "minutes", ar: "دقيقة" },
  { key: "seconds", ar: "ثانية" },
] as const;

export function Countdown() {
  // Start from a static value so SSR markup and the first client render match,
  // then switch to live values right after hydration.
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(remaining());
    const id = window.setInterval(() => setTime(remaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section aria-labelledby="countdown-title" className="relative overflow-hidden px-6 py-28 sm:py-36">
      <div
        className="light-bloom animate-breathe pointer-events-none absolute top-1/2 left-1/2 h-[42vh] w-[42vh] -translate-x-1/2 -translate-y-1/2 opacity-[0.35]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <SectionLabel>Countdown</SectionLabel>
        </Reveal>
        <Reveal delay={100} className="mt-5">
          <SectionTitle>
            <span id="countdown-title">اقترب الموعد</span>
          </SectionTitle>
        </Reveal>

        <GoldRule className="mt-10" />

        <Reveal delay={200}>
          <ul className="mt-14 flex items-start justify-center gap-4 sm:gap-10" dir="ltr">
            {LABELS.map(({ key, ar }, index) => (
              <li key={key} className="flex flex-1 flex-col items-center">
                {index > 0 && null}
                <p
                  className="font-display text-[2.6rem] leading-none text-ink tabular-nums sm:text-[4.5rem]"
                  aria-hidden="true"
                >
                  {toArabicDigits(key === "days" ? time.days : pad2(time[key]))}
                </p>
                <span className="hairline-gold mt-5 block w-8 sm:w-12" aria-hidden="true" />
                <p className="mt-4 font-kufi text-[0.62rem] tracking-widest text-muted-foreground sm:text-[0.75rem]">
                  {ar}
                </p>
                <span className="sr-only">{`${time[key]} ${ar}`}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-16 font-naskh text-[0.95rem] leading-[2.1] text-muted-foreground">
            باقي القليل لنلتقي ونحتفل معًا
          </p>
        </Reveal>
      </div>
    </section>
  );
}
