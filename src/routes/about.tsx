import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, MapPin, MessageCircle, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/about")({
  head: () => {
    const base = buildHead({
      title: "About AI Mastery Academy — Practical AI Training in Africa",
      description:
        "AI Mastery Academy is a Lagos-based live training school teaching practical AI skills to entrepreneurs, job seekers, creators, professionals, freelancers and teens across Africa and globally.",
      path: "/about",
    });
    return {
      ...base,
      scripts: [
        jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ),
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">About</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">
        Practical AI training, built for real outcomes.
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        AI Mastery Academy is a live training school based in <strong>Lagos, Nigeria</strong>,
        serving learners across <strong>Africa and globally online</strong>. We teach beginners — not
        engineers — how to use AI tools to grow businesses, find jobs, create content, work smarter
        and earn online.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {[
          { icon: Users, label: "Beginner-friendly", text: "No coding or tech background needed." },
          { icon: Sparkles, label: "Live cohorts", text: "Hands-on Zoom classes with recordings." },
          { icon: Award, label: "Real outcomes", text: "Templates, prompts and a working AI workflow." },
        ].map(({ icon: Icon, label, text }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-gold shadow-gold">
              <Icon className="h-5 w-5 text-navy" />
            </div>
            <p className="mt-4 font-display text-lg">{label}</p>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="font-display text-2xl">What we teach</h2>
        <p className="mt-3 text-muted-foreground">
          Five focused tracks built around real goals: <strong>AI for Business Growth</strong>,{" "}
          <strong>AI for Job Seekers</strong>, <strong>AI for Content Creators</strong>,{" "}
          <strong>AI for Professionals</strong>, <strong>AI for Freelancers</strong>, plus our
          flagship <strong>AI Video Bootcamp for Teens</strong>. Every cohort is live on Zoom with
          recordings, templates and a private community.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Who runs it</h2>
        <p className="mt-3 text-muted-foreground">
          AI Mastery Academy is operated by <strong>LiveGig Ltd</strong> and designed by{" "}
          <strong>Frank Bazuaye</strong>. Our trainers are practitioners who use these tools daily —
          you'll learn workflows that already work in real businesses.
        </p>
      </section>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 text-accent" />
          <div>
            <p className="font-display text-lg">Based in Lagos, Nigeria</p>
            <p className="mt-1 text-sm text-muted-foreground">
              All classes are 100% online. WhatsApp: +234 705 426 5401.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-12 flex flex-wrap gap-3">
        <Button asChild variant="hero" size="lg">
          <Link to="/programs">Explore Programs</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href={whatsappLink()} target="_blank" rel="noreferrer">
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
