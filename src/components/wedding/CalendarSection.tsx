import { CalendarPlus, Download } from "lucide-react";
import { GOOGLE_CALENDAR_URL, downloadIcs } from "@/lib/wedding";
import { Reveal, SectionLabel } from "./atoms";

export function CalendarSection() {
  return (
    <section aria-labelledby="calendar-title" className="px-6 py-20">
      <div className="mx-auto max-w-md text-center">
        <Reveal>
          <SectionLabel>Save The Date</SectionLabel>
        </Reveal>
        <Reveal delay={100}>
          <h2 id="calendar-title" className="mt-5 font-display text-xl text-ink sm:text-2xl">
            أضف الموعد إلى تقويمك
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
            <a
              href={GOOGLE_CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-sm px-6 py-4 font-kufi text-[0.78rem]"
            >
              <CalendarPlus className="size-4" aria-hidden="true" />
              تقويم جوجل
            </a>
            <button
              type="button"
              onClick={downloadIcs}
              className="btn-outline-gold inline-flex items-center justify-center gap-2 rounded-sm px-6 py-4 font-kufi text-[0.78rem]"
            >
              <Download className="size-4" aria-hidden="true" />
              آيفون / تقويم آبل
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
