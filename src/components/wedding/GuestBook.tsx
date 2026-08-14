import { useCallback, useEffect, useState } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { sfx } from "@/lib/audio";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoldRule, Reveal, SectionLabel, SectionTitle } from "./atoms";
import { Monogram } from "./Monogram";
import { cn } from "@/lib/utils";

type Entry = { id: string; name: string; message: string };

export function GuestBook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [landed, setLanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("id, name, message")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setEntries(data as Entry[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) {
      toast.error("أكمل الاسم والرسالة من فضلك");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("guestbook_entries")
      .insert({ name: cleanName.slice(0, 60), message: cleanMessage.slice(0, 600) })
      .select("id, name, message")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("تعذّر إرسال الرسالة", { description: "حاول مرة أخرى." });
      return;
    }
    setOpen(false);
    setName("");
    setMessage("");
    sfx.bell();
    setEntries((prev) => [data as Entry, ...prev]);
    setLanded((data as Entry).id);
    window.setTimeout(() => setLanded(null), 2600);
    toast.success("وُضعت ذكرتك في كتابنا", { description: "شكرًا لكلماتكم الجميلة." });
  };

  return (
    <section
      aria-labelledby="guestbook-title"
      className="surface-ivory relative px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-2xl text-center">
        <Reveal>
          <SectionLabel>Guest Book</SectionLabel>
        </Reveal>
        <Reveal delay={100} className="mt-5">
          <SectionTitle>
            <span id="guestbook-title">اكتب لنا ذكرى</span>
          </SectionTitle>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-4 max-w-sm font-kufi text-[0.85rem] leading-[2] text-muted-foreground">
            وجودكم هو أجمل هدية، وكلماتكم تبقى معنا.
          </p>
        </Reveal>

        <GoldRule className="mt-10" />

        {/* The book */}
        <Reveal delay={220}>
          <div className="card-luxe relative mx-auto mt-12 max-w-sm rounded-sm px-8 py-12">
            <span
              className="absolute inset-y-4 end-2 w-[3px] rounded-full bg-gradient-to-b from-gold-light via-gold to-gold-deep"
              aria-hidden="true"
            />
            <Monogram className="mx-auto h-20 w-16" />
            <p className="mt-6 font-naskh text-[0.95rem] leading-[2] text-ink/75">
              كتاب ذكرياتنا — بانتظار كلمتكم
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-gold mt-8 inline-flex items-center gap-3 rounded-sm px-8 py-4 font-kufi text-[0.8rem]"
            >
              <BookOpen className="size-4" aria-hidden="true" />
              اكتب لنا ذكرى
            </button>
          </div>
        </Reveal>

        {entries.length > 0 && (
          <ul className="mt-14 grid gap-4 text-start sm:grid-cols-2">
            {entries.map((entry, index) => (
              <Reveal as="li" key={entry.id} delay={Math.min(index, 6) * 70}>
                <div
                  className={cn(
                    "card-luxe h-full rounded-sm px-6 py-6 transition-all duration-[1200ms]",
                    landed === entry.id && "border-gold shadow-soft",
                  )}
                >
                  <p className="font-naskh text-[0.95rem] leading-[2] text-ink/80">
                    {entry.message}
                  </p>
                  <p className="mt-4 font-kufi text-[0.72rem] tracking-widest text-gold-deep">
                    — {entry.name}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="max-w-md rounded-sm border-gold/40 bg-popover">
          <DialogHeader className="text-center sm:text-center">
            <DialogTitle className="font-display text-xl text-ink">اكتب لنا ذكرى</DialogTitle>
            <DialogDescription className="font-kufi text-[0.8rem] text-muted-foreground">
              كلماتكم ستوضع في كتاب ذكرياتنا.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="mt-2 space-y-5">
            <div>
              <label htmlFor="gb-name" className="font-kufi text-[0.72rem] text-muted-foreground">
                الاسم
              </label>
              <input
                id="gb-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
                required
                className="mt-2 w-full rounded-sm border border-input bg-background px-4 py-3 font-kufi text-sm outline-none focus:border-gold"
              />
            </div>
            <div>
              <label
                htmlFor="gb-message"
                className="font-kufi text-[0.72rem] text-muted-foreground"
              >
                الذكرى / الرسالة
              </label>
              <textarea
                id="gb-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={600}
                rows={4}
                required
                className="mt-2 w-full resize-none rounded-sm border border-input bg-background px-4 py-3 font-kufi text-sm outline-none focus:border-gold"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-sm px-8 py-4 font-kufi text-[0.8rem] disabled:opacity-60"
            >
              {saving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              ضعها في الكتاب
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
