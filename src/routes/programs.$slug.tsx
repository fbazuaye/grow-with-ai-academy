import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, Check, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProgramBySlug, type PricingTier, type Schedule } from "@/lib/programs";
import { ProgramIcon } from "@/components/site/ProgramIcon";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/programs/$slug")({
  loader: async ({ params }) => {
    const data = await fetchProgramBySlug(params.slug);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.program.title} — AI Mastery Academy` },
          { name: "description", content: loaderData.program.outcome },
          { property: "og:title", content: loaderData.program.title },
          { property: "og:description", content: loaderData.program.outcome },
        ]
      : [],
  }),
  component: ProgramDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md p-10 text-center">
      <h1 className="font-display text-2xl">Program not found</h1>
      <Link to="/programs" className="mt-4 inline-block text-accent">Back to programs</Link>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">Error: {error.message}</div>,
});

function ProgramDetail() {
  const data = Route.useLoaderData() as { program: any; schedules: Schedule[]; tiers: PricingTier[] };
  const { program, schedules, tiers } = data;
  const [selectedBatch, setSelectedBatch] = useState<string | null>(schedules[0]?.id ?? null);
  const selected = schedules.find((s) => s.id === selectedBatch);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <Link to="/programs" className="text-sm text-primary-foreground/70 hover:text-accent">← All Programs</Link>
          <div className="mt-6 flex items-start gap-5">
            <div className="hidden h-14 w-14 shrink-0 place-items-center rounded-xl bg-gradient-gold shadow-gold sm:grid">
              <ProgramIcon name={program.icon} className="h-7 w-7 text-navy" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{program.audience}</p>
              <h1 className="mt-2 font-display text-3xl text-balance md:text-5xl">
                {program.hero_headline ?? program.title}
              </h1>
              <p className="mt-4 max-w-2xl text-primary-foreground/80">{program.outcome}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {program.tools.map((t) => (
                  <span key={t} className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs">
                    <Sparkles className="mr-1 inline h-3 w-3 text-accent" />{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        {/* Problem */}
        {program.problem && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The Problem</p>
            <h2 className="mt-2 font-display text-3xl">Sound familiar?</h2>
            <p className="mt-4 max-w-2xl text-lg text-foreground/80">{program.problem}</p>
          </section>
        )}

        {/* What you'll learn */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">What You'll Learn</p>
          <h2 className="mt-2 font-display text-3xl">Skills you can apply this week</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {program.learnings.map((l) => (
              <li key={l} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm">{l}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Schedule */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Training Schedule</p>
          <h2 className="mt-2 font-display text-3xl">Pick your batch</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {schedules.length === 0 && <p className="text-muted-foreground">New batches coming soon. Send an enquiry to be notified.</p>}
            {schedules.map((s) => {
              const active = s.id === selectedBatch;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedBatch(s.id)}
                  className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                    active ? "border-accent bg-accent/5 shadow-gold" : "border-border bg-card hover:border-accent/50"
                  }`}
                >
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${active ? "bg-gradient-gold" : "bg-secondary"}`}>
                    <Calendar className={`h-5 w-5 ${active ? "text-navy" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.batch_label}</span>
                      <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase">{s.format}</span>
                    </div>
                    <p className="mt-1 font-display text-lg">
                      {format(parseISO(s.start_date), "MMM d")} – {format(parseISO(s.end_date), "MMM d, yyyy")}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.time_text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Pricing */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Pricing</p>
          <h2 className="mt-2 font-display text-3xl">Choose your level of support</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.id}
                className={`relative flex flex-col rounded-2xl border p-6 ${
                  t.popular ? "border-accent bg-card shadow-elegant ring-2 ring-accent/30" : "border-border bg-card"
                }`}
              >
                {t.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-gradient-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-gold">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl">{t.name}</h3>
                <p className="mt-2 font-display text-4xl text-foreground">{t.price_label}</p>
                <ul className="mt-5 space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={t.popular ? "hero" : "navy"} className="mt-6">
                  <Link
                    to="/enquire"
                    search={{ program: program.slug, batch: selected?.id ?? undefined, tier: t.name }}
                  >
                    Enroll Now
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-12">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl text-balance">Have questions before you enroll?</h2>
              <p className="mt-2 text-primary-foreground/75">
                Chat with us directly on WhatsApp or send a quick enquiry and we'll get back to you.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild variant="hero" size="lg">
                <Link to="/enquire" search={{ program: program.slug, batch: selected?.id ?? undefined }}>
                  Enquire Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                <a href={whatsappLink(program.title)} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
