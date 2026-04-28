import { createFileRoute, Link } from "@tanstack/react-router";
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

const PROGRAM_ID = "258bdd73-d90a-419d-91e2-7d5c066989c4";
const PROGRAM_TITLE = "AI Video Bootcamp for Teens";
const SCHEDULE_LABEL = "4 Saturdays · 1, 8, 15 & 22 August 2026";

export const Route = createFileRoute("/register/ai-video-teens")({
  head: () => ({
    meta: [
      { title: "Register — AI Video Bootcamp for Teens" },
      { name: "description", content: "Reserve a seat for the AI Video Bootcamp for Teens. 4 Saturdays in August 2026, live online." },
      { property: "og:title", content: "Register — AI Video Bootcamp for Teens" },
      { property: "og:description", content: "4 Saturdays · 1–22 August 2026. Create, post & grow with AI video." },
    ],
  }),
  component: RegisterPage,
});

const formSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter the teen's full name").max(120),
  age: z.coerce.number().int().min(13, "Bootcamp is for ages 13–19").max(19, "Bootcamp is for ages 13–19"),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  parentName: z.string().trim().min(2, "Parent/guardian name is required").max(120),
  experience: z.string().trim().max(150).optional(),
  goals: z.string().trim().max(2000).optional(),
});

function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = formSchema.safeParse({
      fullName: fd.get("fullName"),
      age: fd.get("age"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      parentName: fd.get("parentName"),
      experience: (fd.get("experience") as string) || undefined,
      goals: (fd.get("goals") as string) || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    const messageParts = [
      `Age: ${parsed.data.age}`,
      `Parent/Guardian: ${parsed.data.parentName}`,
      parsed.data.experience ? `Experience: ${parsed.data.experience}` : null,
      parsed.data.goals ? `Goals: ${parsed.data.goals}` : null,
    ].filter(Boolean);

    const { error } = await supabase.from("enquiries").insert({
      name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      program_id: PROGRAM_ID,
      program_title: PROGRAM_TITLE,
      preferred_date: SCHEDULE_LABEL,
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
        <h1 className="mt-6 font-display text-4xl">You're in 🎬</h1>
        <p className="mt-3 text-muted-foreground">
          Thanks for registering for the <strong>{PROGRAM_TITLE}</strong>. Our team will reach out on WhatsApp with payment details and the Zoom link.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="hero" size="lg">
            <a href={whatsappLink(PROGRAM_TITLE)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/programs/$slug" params={{ slug: "ai-video-teens" }}>
              Back to program
            </Link>
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
            <Sparkles className="h-3.5 w-3.5" /> Teen Bootcamp Registration
          </div>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            AI Video Bootcamp for Teens
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            A 4-Saturday hands-on bootcamp for teens (13–19). Learn to create AI-powered videos, post like a pro and grow a real audience.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Pill icon={<CalendarDays className="h-4 w-4" />}>{SCHEDULE_LABEL}</Pill>
            <Pill icon={<Clock className="h-4 w-4" />}>11:00 AM – 1:30 PM</Pill>
            <Pill icon={<MapPin className="h-4 w-4" />}>Live Online (Zoom)</Pill>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: Highlights */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl">What teens will learn</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "The full AI video workflow (idea → script → edit → post)",
                "How to find trending topics with YTRadar",
                "Hook engineering that stops the scroll",
                "CapCut deep dive with AI editing tools",
                "Real ways to monetize as a teen creator",
              ].map((t) => (
                <li key={t} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-accent/10 to-primary/10 p-6">
            <p className="text-sm font-semibold">Small cohorts</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Limited seats so every teen gets feedback on their videos. Reserve early.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/programs_/ai-video-teens/curriculum">View full curriculum →</Link>
            </Button>
          </div>
        </aside>

        {/* Right: Form */}
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
        >
          <h2 className="font-display text-2xl">Reserve a seat</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill the form below — it takes less than a minute. Fields marked with * are required.
          </p>

          <div className="mt-6 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
              <FieldWithIcon
                label="Teen's full name"
                name="fullName"
                required
                placeholder="Alex Doe"
                icon={<User className="h-4 w-4" />}
              />
              <Field label="Age" name="age" type="number" required placeholder="15" />
            </div>
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
              <Field label="Parent / Guardian name" name="parentName" required placeholder="Jane Doe" />
              <Field label="Video editing experience" name="experience" placeholder="Beginner, some CapCut, etc." />
            </div>
            <div>
              <Label htmlFor="goals">What do you want to create or achieve? <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea
                id="goals"
                name="goals"
                rows={4}
                placeholder="e.g. Start a TikTok channel, grow a YouTube Shorts page, learn to edit faster…"
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
            By registering, you confirm a parent/guardian is aware of this enrollment. We respect your privacy and will never share your details.
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
