import { MapPin } from "lucide-react";
import { MAPS_URL, WEDDING } from "@/lib/wedding";
import { GoldRule, Reveal, SectionLabel, SectionTitle } from "./atoms";

export function Location() {
  return (
    <section aria-labelledby="location-title" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-xl text-center">
        <Reveal>
          <SectionLabel>The Venue</SectionLabel>
        </Reveal>
        <Reveal delay={100} className="mt-5">
          <SectionTitle>
            <span id="location-title">نلتقي هناك</span>
          </SectionTitle>
        </Reveal>

        <GoldRule className="mt-10" />

        <Reveal delay={180}>
          <div className="relative mt-12 overflow-hidden rounded-sm border border-gold/40 px-6 py-14">
            <span className="arabesque-grid absolute inset-0" aria-hidden="true" />
            <MapPin className="relative mx-auto size-6 text-gold" aria-hidden="true" />
            <p className="relative mt-6 font-display text-2xl text-ink">{WEDDING.venueAr}</p>
            <p className="relative mt-2 font-kufi text-sm text-muted-foreground">
              {WEDDING.cityAr}
            </p>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxe relative mt-10 inline-flex items-center justify-center px-10 py-4 font-kufi text-[0.78rem]"
            >
              الوصول إلى الصالة
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
