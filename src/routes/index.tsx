import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { primeAudio, sfx } from "@/lib/audio";
import { Opening } from "@/components/wedding/Opening";
import { Hero } from "@/components/wedding/Hero";
import { Message } from "@/components/wedding/Message";
import { Timeline } from "@/components/wedding/Timeline";
import { Countdown } from "@/components/wedding/Countdown";
import { Details } from "@/components/wedding/Details";
import { Location } from "@/components/wedding/Location";
import { DressCode } from "@/components/wedding/DressCode";
import { Surprise } from "@/components/wedding/Surprise";
import { Memories } from "@/components/wedding/Memories";
import { GuestBook } from "@/components/wedding/GuestBook";
import { CalendarSection } from "@/components/wedding/CalendarSection";
import { Finale } from "@/components/wedding/Finale";
import { FloatingActions } from "@/components/wedding/FloatingActions";
import { cn } from "@/lib/utils";

const TITLE = "مروان & آية | ٤ سبتمبر ٢٠٢٦";
const DESCRIPTION = "دعوتنا لمشاركتنا أجمل ليلة في العمر — مروان & آية | ٤ سبتمبر ٢٠٢٦";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_PS" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#FFFFFF" },
    ],
  }),
  component: Invitation,
});

function Invitation() {
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    primeAudio();
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const enter = () => {
    setOpened(true);
    sfx.whoosh();
    window.scrollTo({ top: 0 });
  };

  return (
    <main dir="rtl" lang="ar" className="relative min-h-screen bg-background">
      {!opened && <Opening onDone={enter} />}

      <div
        className={cn(
          "transition-all duration-[1400ms]",
          opened ? "opacity-100 blur-0" : "opacity-0 blur-md",
        )}
      >
        <Hero />
        <Message />
        <Timeline />
        <Countdown />
        <Details />
        <Location />
        <DressCode />
        <Surprise />
        <Memories />
        <GuestBook />
        <CalendarSection />
        <Finale />
      </div>

      {opened && <FloatingActions />}
    </main>
  );
}
