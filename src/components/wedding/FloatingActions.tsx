import { useEffect, useState } from "react";
import { Share2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { WEDDING } from "@/lib/wedding";
import { isPlaying, onAudioChange, toggleMute } from "@/lib/audio";

const SHARE_TITLE = `${WEDDING.groomAr} & ${WEDDING.brideAr} | ${WEDDING.dateAr}`;
const SHARE_TEXT = "يسعدنا أن نشارككم دعوتنا لمشاركتنا أجمل ليلة في العمر ❤️";

export function FloatingActions() {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(isPlaying());
    const unsubscribe = onAudioChange(setPlaying);
    return () => {
      unsubscribe();
    };
  }, []);

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
        return;
      }
      await navigator.clipboard.writeText(`${SHARE_TITLE}\n${SHARE_TEXT}\n${url}`);
      toast.success("تم نسخ الدعوة", { description: "يمكنك إرسالها لمن تحب." });
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex items-center justify-center gap-3 px-4">
      <button
        type="button"
        onClick={() => void share()}
        className="btn-outline-gold pointer-events-auto inline-flex items-center gap-2 rounded-full bg-background/85 px-5 py-2.5 font-kufi text-[0.72rem] backdrop-blur-sm"
      >
        <Share2 className="size-3.5" aria-hidden="true" />
        شارك الدعوة
      </button>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={playing ? "إيقاف الموسيقى" : "تشغيل الموسيقى"}
        className="pointer-events-auto inline-flex size-8 items-center justify-center rounded-full border border-gold/40 bg-background/70 text-gold-deep/70 backdrop-blur-sm transition-colors hover:text-gold-deep"
      >
        {playing ? (
          <Volume2 className="size-3" aria-hidden="true" />
        ) : (
          <VolumeX className="size-3" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
