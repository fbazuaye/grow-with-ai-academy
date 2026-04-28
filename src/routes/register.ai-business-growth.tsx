import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { CalendarDays, CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone, Send, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { whatsappLink } from "@/lib/whatsapp";

const PROGRAM_ID = "207aed39-2cd7-4fc2-b502-68d35dda7e81";
const PROGRAM_TITLE = "AI for Business Growth";

export const Route = createFileRoute("/register/ai-business-growth")({
  head: () => ({
    meta: [
      { title: "Register — AI for Business Growth Masterclass" },
      { name: "description", content: "Reserve your seat for the AI for Business Growth Masterclass on 4th & 11th July 2026. Two Saturdays, live online." },
      { property: "og:title", content: "Register — AI for Business Growth Masterclass" },
      { property: "og:description", content: "Two Saturdays · 4th & 11th July 2026. Practical AI to grow your business." },
    ],
  }),
  component: RegisterPage,
});

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  business: z.string().trim().max(150).optional(),
  role: z.string().trim().max(150).optional(),
  goals: z.string().trim().max(2000).optional(),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = formSchema.safeParse({
      fullName: fd.get("fullName"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      business: (fd.get("business") as string) || undefined,
      role: (fd.get("role") as string) || undefined,
      goals: (fd.get("goals") as string) || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    const messageParts = [
      parsed.data.business ? `Business: ${parsed.data.business}` : null,
      parsed.data.role ? `Role: ${parsed.data.role}` : null,
      parsed.data.goals ? `Goals: ${parsed.data.goals}` : null,
    ].filter(Boolean);

    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      program_id: PROGRAM_ID,
      program_title: PROGRAM_TITLE,
      preferred_date: "2 Saturdays · 4th & 11th July 2026",
      message: messageParts.join("\n") || null,
    });
    setSubmitting(false);

    if (error) {
      toast.error("Could not submit your registration. Please try again.");
      return;
    }
    toast.success("Registration received! We'll be in touch shortly.");
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl">You're on the list 🎉</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks for registering for the <strong>AI for Business Growth Masterclass</strong>. We've received your details and our team will reach out shortly with payment options and joining instructions.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <a href={whatsappLink(PROGRAM_TITLE)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" onClick={() => navigate({ to: "/" })}>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="h-3.5 w-3.5" /> Masterclass Registration
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            AI for Business Growth
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A practical, hands-on masterclass for founders, executives and operators who want to put AI to work — to grow revenue, save time and build a sharper edge.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Pill icon={<CalendarDays className="h-4 w-4" />}>2 Saturdays · 4th & 11th July 2026</Pill>
            <Pill icon={<Clock className="h-4 w-4" />}>10:00 AM – 2:00 PM</Pill>
            <Pill icon={<MapPin className="h-4 w-4" />}>Live Online (Zoom)</Pill>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Highlights */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl">What you'll walk away with</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "A clear AI roadmap tailored to your business",
                "Working prompts & playbooks you can use Monday morning",
                "Hands-on with the leading AI tools (ChatGPT, Gemini, Claude)",
                "Templates for marketing, sales, ops & customer service",
                "Live Q&A and a private alumni community",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
            <p className="text-sm font-semibold">Limited seats</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cohorts are intentionally small so every participant gets attention. Reserve your spot early.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/ai-business-growth/curriculum">View full curriculum →</Link>
            </Button>
          </div>
        </aside>

        {/* Right: Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
        >
          <h2 className="font-display text-2xl">Reserve your seat</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill the form below — it takes less than a minute. Fields marked with * are required.
          </p>

          <div className="mt-6 grid gap-5">
            <FieldWithIcon
              label="Full name"
              name="fullName"
              required
              placeholder="Jane Doe"
              icon={<User className="h-4 w-4" />}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FieldWithIcon
                label="Email address"
                name="email"
                type="email"
                required
                placeholder="you@email.com"
                icon={<Mail className="h-4 w-4" />}
              />
              <FieldWithIcon
                label="Phone (WhatsApp)"
                name="phone"
                type="tel"
                required
                placeholder="+234 800 000 0000"
                icon={<Phone className="h-4 w-4" />}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Business / Company" name="business" placeholder="Acme Ltd." />
              <Field label="Your role" name="role" placeholder="Founder, Marketing Lead…" />
            </div>
            <div>
              <Label htmlFor="goals">What do you hope to achieve? <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea
                id="goals"
                name="goals"
                rows={4}
                placeholder="e.g. Automate customer support, generate marketing content faster, build an AI product…"
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" variant="hero" size="lg" disabled={submitting} className="flex-1">
              <Send className="h-4 w-4" />
              {submitting ? "Submitting…" : "Complete Registration"}
            </Button>
            <Button asChild type="button" variant="outline" size="lg">
              <a href={whatsappLink(PROGRAM_TITLE)} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> Ask a question
              </a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            By registering, you agree to receive updates about this masterclass. We respect your privacy and will never share your details.
          </p>
        </form>
      </div>
    </div>
  );
}

function Pill({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 backdrop-blur">
      <span className="text-accent">{icon}</span>
      <span className="font-medium">{children}</span>
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && " *"}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-1.5"
      />
    </div>
  );
}

function FieldWithIcon({
  label,
  name,
  type = "text",
  required,
  placeholder,
  icon,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label}
        {required && " *"}
      </Label>
      <div className="relative mt-1.5">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className="pl-10"
        />
      </div>
    </div>
  );
}
