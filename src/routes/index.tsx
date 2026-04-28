import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchPrograms, type Program } from "@/lib/programs";
import { ProgramIcon } from "@/components/site/ProgramIcon";
import { whatsappLink } from "@/lib/whatsapp";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  loader: () => fetchPrograms(),
  component: Index,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-md p-10 text-center">
      <p className="text-destructive">Couldn't load programs: {error.message}</p>
    </div>
  ),
});

function Index() {
  const programs = Route.useLoaderData();

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/40 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:py-24 md:gap-8">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/30 bg-white/5 px-3 py-1 text-xs font-medium text-accent">
              <Star className="h-3 w-3 fill-accent" /> Live cohorts · Real outcomes
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-balance sm:text-5xl md:text-6xl">
              Learn How to Use AI to <span className="text-accent">Grow, Earn,</span> and Work Smarter
            </h1>
            <p className="mt-5 max-w-lg text-pretty text-base text-primary-foreground/75 md:text-lg">
              Practical AI training designed for beginners — not engineers. Pick the track for your goal:
              more sales, a better job, faster content, sharper work, or new income.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/programs">Explore Programs <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-white/30 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                <Link to="/enquire">Enquire Now</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-primary-foreground/70">
              {["Beginner-friendly", "Live + recordings", "Templates included"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-accent" />{t}</span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/20 blur-2xl" />
            <img
              src={heroImg}
              alt="Learners using AI to grow their work and income"
              width={1536}
              height={1024}
              className="relative rounded-2xl border border-white/10 shadow-elegant"
            />
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Choose your track</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Programs built around your goal</h2>
          </div>
          <Link to="/programs" className="hidden items-center gap-1 text-sm font-medium text-foreground hover:text-accent md:inline-flex">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {(programs as Program[]).map((p) => {
            const isAIBG = p.slug === "ai-business-growth";
            const cardClass = "group relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all " +
              (isAIBG ? "hover:-translate-y-1 hover:border-accent/60 hover:shadow-elegant" : "opacity-90");
            const inner = (
              <>
                {p.featured && (
                  <span className="absolute right-4 top-4 rounded-full bg-accent/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                    Featured
                  </span>
                )}
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold shadow-gold">
                  <ProgramIcon name={p.icon} className="h-6 w-6 text-navy" />
                </div>
                <h3 className="mt-5 font-display text-xl">{p.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{p.audience}</p>
                <p className="mt-3 text-sm text-foreground/80">{p.outcome}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="text-muted-foreground">{p.duration}</span>
                  {isAIBG ? (
                    <span className="inline-flex items-center gap-1 font-medium text-foreground group-hover:text-accent">
                      Click to Register Now <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Coming Soon
                    </span>
                  )}
                </div>
              </>
            );
            if (isAIBG) {
              return (
                <Link key={p.id} to="/register/ai-business-growth" className={cardClass}>
                  {inner}
                </Link>
              );
            }
            return (
              <div key={p.id} className={cardClass} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS section removed — will be added once real learner stories are available. */}

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground shadow-elegant md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl text-balance">
                Ready to put AI to work in your life?
              </h2>
              <p className="mt-3 max-w-xl text-primary-foreground/75">
                Send an enquiry and we'll match you with the right program and the next available batch.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild variant="hero" size="lg"><Link to="/enquire">Enquire Now</Link></Button>
              <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                <a href={whatsappLink()} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
