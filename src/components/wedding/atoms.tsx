import { useEffect, useState, type ReactNode } from "react";
import { ImagePlus } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import { fileToCompressedDataUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p" | "span";
}) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", shown && "reveal-in", className)}
    >
      {children}
    </Tag>
  );
}

export function GoldRule({ className }: { className?: string }) {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={cn("mx-auto w-40 max-w-[60%]", className)}>
      <span className={cn("hairline-gold block draw-line", shown && "draw-line-in")} />
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="font-sans text-[0.62rem] tracking-luxe text-gold-deep/80 uppercase">
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-2xl leading-[1.7] text-ink sm:text-3xl md:text-[2.35rem]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Ornamental Arabic arch divider. */
export function ArchOrnament({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 40"
      aria-hidden="true"
      className={cn("h-8 w-40 text-gold", className)}
      fill="none"
    >
      <path d="M0 34 H70" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <path d="M130 34 H200" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <path
        d="M78 34 V22 C78 12 88 6 100 6 C112 6 122 12 122 22 V34"
        stroke="currentColor"
        strokeWidth="0.9"
      />
      <circle cx="100" cy="34" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Arch-masked photo frame. Renders a refined placeholder until a photo is
 * chosen; the choice is remembered locally on the device.
 */
export function ArchPhoto({
  storageKey,
  label,
  className,
  ratio = "aspect-[3/4]",
}: {
  storageKey: string;
  label: string;
  className?: string;
  ratio?: string;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    try {
      setSrc(window.localStorage.getItem(storageKey));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const onPick = async (file: File | undefined) => {
    if (!file) return;
    const dataUrl = await fileToCompressedDataUrl(file, 1200, 0.8);
    setSrc(dataUrl);
    try {
      window.localStorage.setItem(storageKey, dataUrl);
    } catch {
      /* storage full — keep it in memory for this visit */
    }
  };

  const inputId = `photo-${storageKey}`;

  return (
    <figure className={cn("relative mx-auto w-full", className)}>
      <div className="pointer-events-none absolute -inset-2 rounded-t-[999px] border border-gold/35" />
      <label
        htmlFor={inputId}
        className={cn(
          "group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-t-[999px] border border-gold/50 bg-ivory",
          ratio,
        )}
      >
        {src ? (
          <img
            src={src}
            alt={label}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex flex-col items-center gap-3 px-6 text-center">
            <span className="arabesque-grid absolute inset-0" aria-hidden="true" />
            <ImagePlus className="size-5 text-gold-deep/70" aria-hidden="true" />
            <span className="font-sans text-[0.6rem] tracking-luxe text-gold-deep/80 uppercase">
              {label}
            </span>
            <span className="font-kufi text-[0.7rem] text-muted-foreground">
              اضغط لإضافة صورة
            </span>
          </span>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void onPick(e.target.files?.[0])}
      />
    </figure>
  );
}
