import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { fetchPrograms, type Program } from "@/lib/programs";
import { ProgramIcon } from "@/components/site/ProgramIcon";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — AI Mastery Academy" },
      { name: "description", content: "Browse all live AI programs: Business Growth, Job Seekers, Content Creators, Professionals, Freelancers." },
    ],
  }),
  loader: () => fetchPrograms(),
  component: ProgramsPage,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">Error: {error.message}</div>,
});

function ProgramsPage() {
  const programs = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">All Programs</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Find the program built for your goal.</h1>
        <p className="mt-4 text-muted-foreground">
          Each track is a focused, beginner-friendly cohort with templates, recordings, and community support.
        </p>
      </header>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(programs as Program[]).map((p) => {
          const isAIBG = p.slug === "ai-business-growth";
          const className = "group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-elegant";
          const inner = (
            <>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                <ProgramIcon name={p.icon} className="h-6 w-6 text-navy" />
              </div>
              <h3 className="mt-5 font-display text-xl">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.audience}</p>
              <p className="mt-3 flex-1 text-sm text-foreground/80">{p.outcome}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">{p.duration}</span>
                <span className="inline-flex items-center gap-1 font-medium group-hover:text-accent">
                  Click to Register Now <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </>
          );
          if (isAIBG) {
            return (
              <Link key={p.id} to="/programs/ai-business-growth/curriculum" className={className}>
                {inner}
              </Link>
            );
          }
          return (
            <Link key={p.id} to="/programs/$slug" params={{ slug: p.slug }} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
