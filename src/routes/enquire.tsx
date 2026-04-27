import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { fetchPrograms, fetchProgramBySlug, type Program, type Schedule } from "@/lib/programs";
import { whatsappLink } from "@/lib/whatsapp";

const searchSchema = z.object({
  program: z.string().optional(),
  batch: z.string().optional(),
  tier: z.string().optional(),
});

export const Route = createFileRoute("/enquire")({
  head: () => ({
    meta: [
      { title: "Enquire — AI Mastery Academy" },
      { name: "description", content: "Send an enquiry and we'll match you with the right program and the next available batch." },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  loader: () => fetchPrograms(),
  component: EnquirePage,
});

const formSchema = z.object({
  name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().min(4, "Too short").max(30),
  programId: z.string().min(1, "Pick a program"),
  preferredDate: z.string().optional(),
  message: z.string().max(2000).optional(),
});

function EnquirePage() {
  const programs = Route.useLoaderData() as Program[];
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const initialProgram = programs.find((p) => p.slug === search.program) ?? null;
  const [programId, setProgramId] = useState<string>(initialProgram?.id ?? "");
  const [batchId, setBatchId] = useState<string>(search.batch ?? "");

  // Load schedules whenever programId changes
  useEffect(() => {
    let active = true;
    if (!programId) {
      setSchedules([]);
      return;
    }
    const slug = programs.find((p) => p.id === programId)?.slug;
    if (!slug) return;
    fetchProgramBySlug(slug).then((d) => {
      if (active && d) setSchedules(d.schedules);
    });
    return () => { active = false; };
  }, [programId, programs]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = formSchema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      programId,
      preferredDate: batchId || undefined,
      message: (fd.get("message") as string) || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmitting(true);
    const program = programs.find((p) => p.id === parsed.data.programId);
    const batch = schedules.find((s) => s.id === parsed.data.preferredDate);
    const preferredText = batch
      ? `${batch.batch_label}: ${format(parseISO(batch.start_date), "MMM d")}–${format(parseISO(batch.end_date), "MMM d, yyyy")}`
      : null;

    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      program_id: parsed.data.programId,
      program_title: program?.title ?? null,
      preferred_date: preferredText,
      message: parsed.data.message ?? null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit enquiry. Please try again.");
      return;
    }
    toast.success("Enquiry sent! We'll be in touch shortly.");
    navigate({ to: "/" });
  }

  const selectedProgram: Program | undefined = programs.find((p) => p.id === programId);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Enquiry</p>
        <h1 className="mt-2 font-display text-4xl">Tell us a bit about yourself.</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Fill the form and our team will reach out with details, payment options, and next steps. Prefer chat?
          Use WhatsApp instead.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-10 grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="name" placeholder="Jane Doe" required />
          <Field label="Email" name="email" type="email" placeholder="you@email.com" required />
          <Field label="Phone (WhatsApp)" name="phone" placeholder="+234 800 000 0000" required />
          <div>
            <Label htmlFor="program">Program *</Label>
            <select
              id="program"
              required
              value={programId}
              onChange={(e) => { setProgramId(e.target.value); setBatchId(""); }}
              className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select a program…</option>
              {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="batch">Preferred batch</Label>
          <select
            id="batch"
            value={batchId}
            onChange={(e) => setBatchId(e.target.value)}
            disabled={!programId}
            className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm disabled:opacity-50"
          >
            <option value="">No preference</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.batch_label} · {format(parseISO(s.start_date), "MMM d")}–{format(parseISO(s.end_date), "MMM d")} · {s.time_text}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" rows={4} placeholder="Anything you'd like us to know?" className="mt-1.5" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" variant="hero" size="lg" disabled={submitting} className="flex-1">
            <Send className="h-4 w-4" />{submitting ? "Sending…" : "Send Enquiry"}
          </Button>
          <Button asChild type="button" variant="outline" size="lg" className="flex-1">
            <a href={whatsappLink(selectedProgram?.title)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp Instead
            </a>
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}{required && " *"}</Label>
      <Input id={name} name={name} type={type} required={required} placeholder={placeholder} className="mt-1.5" />
    </div>
  );
}
