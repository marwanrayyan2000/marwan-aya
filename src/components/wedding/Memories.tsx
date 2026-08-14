import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fileToCompressedDataUrl } from "@/lib/image";
import { sfx } from "@/lib/audio";
import { toast } from "sonner";
import { GoldRule, Reveal, SectionLabel, SectionTitle } from "./atoms";

type Photo = { id: string; image_url: string; caption: string | null };

export function Memories() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("memory_photos")
      .select("id, image_url, caption")
      .order("created_at", { ascending: false })
      .limit(60);
    if (!error && data) setPhotos(data as Photo[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onPick = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 5)) {
        const dataUrl = await fileToCompressedDataUrl(file, 1100, 0.72);
        const { error } = await supabase.from("memory_photos").insert({ image_url: dataUrl });
        if (error) throw error;
      }
      sfx.chime();
      toast.success("شكرًا لمشاركتك", { description: "أصبحت لحظتك جزءًا من ذكرياتنا." });
      await load();
    } catch {
      toast.error("تعذّر إرسال الصورة", { description: "حاول مرة أخرى بصورة أصغر." });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <section aria-labelledby="memories-title" className="relative px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <Reveal>
            <SectionLabel>Digital Memory</SectionLabel>
          </Reveal>
          <Reveal delay={100} className="mt-5">
            <SectionTitle>
              <span id="memories-title">شاركنا لحظتك</span>
            </SectionTitle>
          </Reveal>
          <Reveal delay={180}>
            <p className="mx-auto mt-4 max-w-sm font-kufi text-[0.85rem] leading-[2] text-muted-foreground">
              لا نريد أن تنتهي ذكريات هذه الليلة بانتهاء الحفل.
            </p>
          </Reveal>

          <GoldRule className="mt-10" />

          <Reveal delay={220}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn-outline-gold mt-10 inline-flex items-center gap-3 rounded-sm px-8 py-4 font-kufi text-[0.8rem] disabled:opacity-60"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="size-4" aria-hidden="true" />
              )}
              شارك لحظتك
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => void onPick(e.target.files)}
            />
          </Reveal>
        </div>

        {photos.length > 0 && (
          <div className="mt-16 columns-2 gap-3 sm:columns-3 sm:gap-4 [&>*]:mb-3 sm:[&>*]:mb-4">
            {photos.map((photo, index) => (
              <Reveal key={photo.id} delay={Math.min(index, 6) * 70}>
                <img
                  src={photo.image_url}
                  alt={photo.caption ?? "لحظة من ليلة الزفاف"}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-sm border border-gold/30 object-cover"
                />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
