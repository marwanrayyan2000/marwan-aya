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
    <section aria-labelledby="countdown-title" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>Countdown</SectionLabel>
        </Reveal>
        <Reveal delay={100} className="mt-5">
          <SectionTitle>
            <span id="countdown-title">اقترب الموعد</span>
          </SectionTitle>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-4 font-kufi text-[0.85rem] leading-[2] text-muted-foreground">
            باقي القليل لنلتقي ونحتفل معًا
          </p>
        </Reveal>

        <GoldRule className="mt-10" />

        <Reveal delay={240}>
          <ul className="mt-12 grid grid-cols-4 gap-2 sm:gap-4">
            {LABELS.map(({ key, ar }) => (
              <li key={key} className="card-luxe rounded-sm px-1 py-6 sm:py-8">
                <p
                  className="font-display text-2xl text-gold-deep tabular-nums sm:text-4xl"
                  aria-hidden="true"
                >
                  {toArabicDigits(key === "days" ? time.days : pad2(time[key]))}
                </p>
                <p className="mt-3 font-kufi text-[0.65rem] text-muted-foreground sm:text-xs">
                  {ar}
                </p>
                <span className="sr-only">{`${time[key]} ${ar}`}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
