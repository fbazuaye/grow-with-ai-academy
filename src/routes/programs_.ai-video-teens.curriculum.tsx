import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  Sparkles,
  Video,
  Gift,
  Target,
  TrendingUp,
  Rocket,
  Zap,
  Film,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { buildHead } from "@/lib/seo";
import { courseSchema, breadcrumbSchema, jsonLdScript } from "@/lib/schema";

export const Route = createFileRoute("/programs_/ai-video-teens/curriculum")({
  head: () => {
    const base = buildHead({
      title: "AI Video Bootcamp for Teens — Create, Post & Grow (4 Saturdays)",
      description:
        "A 4-Saturday hands-on bootcamp for teens (13–19). Master AI video tools, CapCut, trending hooks and monetization. Live online on Zoom in August 2026.",
      path: "/programs/ai-video-teens/curriculum",
      type: "course",
    });
    return {
      ...base,
      scripts: [
        jsonLdScript(
          courseSchema({
            name: "AI Video Bootcamp for Teens — Create, Post & Grow",
            description:
              "A 4-Saturday live bootcamp teaching teens (13–19) how to create AI-powered short-form videos, find trends, edit in CapCut and monetize as creators.",
            path: "/programs/ai-video-teens/curriculum",
            audience: "Teens aged 13–19",
            startDate: "2026-08-01T11:00:00+01:00",
            endDate: "2026-08-22T13:30:00+01:00",
            mode: "online",
            location: "Zoom",
          }),
        ),
        jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Programs", path: "/programs" },
            { name: "AI Video Bootcamp for Teens", path: "/programs/ai-video-teens/curriculum" },
          ]),
        ),
      ],
    };
  },
  component: CurriculumPage,
});

// Class start: Saturday 1 August 2026, 11:00 AM WAT (UTC+1) — mock
const CLASS_START = new Date("2026-08-01T11:00:00+01:00").getTime();

const weeks = [
  {
    label: "Saturday 1 · 1 Aug 2026",
    title: "AI Video Foundations",
    summary: "Understand the AI video workflow and the creator economy.",
    points: [
      "How short-form video really works in 2026",
      "The full AI video workflow: idea → script → visuals → edit → post",
      "Meet your toolkit: ChatGPT, CapCut, YTRadar",
      "Set up your creator profile the right way",
      "Activity: pick your niche and channel name",
    ],
  },
  {
    label: "Saturday 2 · 8 Aug 2026",
    title: "Trending Topics & Hook Engineering",
    summary: "Find what's hot and write hooks that stop the scroll.",
    points: [
      "Using YTRadar to spot trending topics in your niche",
      "The 3-second hook formula that works",
      "Writing scripts with ChatGPT (without sounding like a robot)",
      "Storyboarding short-form videos",
      "Activity: 5 hook ideas + 1 full script",
    ],
  },
  {
    label: "Saturday 3 · 15 Aug 2026",
    title: "CapCut Deep Dive",
    summary: "Edit videos like a pro using CapCut + AI features.",
    points: [
      "CapCut interface tour (mobile & desktop)",
      "Auto captions, transitions, effects and sound",
      "Using CapCut AI: voiceovers, scripts, templates",
      "Thumbnail design that earns the click",
      "Activity: edit your first finished video",
    ],
  },
  {
    label: "Saturday 4 · 22 Aug 2026",
    title: "Post, Grow & Monetize",
    summary: "Publish strategically and turn views into income.",
    points: [
      "Best times & platforms to post (TikTok, Reels, Shorts)",
      "Hashtags, captions and the algorithm",
      "Monetization paths: creator funds, brand deals, services",
      "Building a content calendar you'll actually keep",
      "Final project: publish your first AI video live",
    ],
  },
];

const outcomes = [
  { icon: Film, title: "Create", text: "Produce scroll-stopping short videos using AI from idea to final cut" },
  { icon: TrendingUp, title: "Post", text: "Understand trends, hooks and algorithms across TikTok, Reels & Shorts" },
  { icon: DollarSign, title: "Grow & Earn", text: "Build an audience and unlock real ways to monetize as a teen creator" },
];

const bonuses = [
  "Hook & Script Templates Pack",
  "CapCut Preset Library",
  "30-Day Posting Calendar",
  "Teen Creator Community Access",
];

function useCountdown(target: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: false, ready: false };
  }
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds, ended: diff === 0, ready: true };
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-xl bg-background/10 backdrop-blur px-4 py-3 sm:px-6 sm:py-4 border border-background/20 min-w-[72px] sm:min-w-[88px]">
      <div className="text-3xl sm:text-4xl font-bold tabular-nums tracking-tight">
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] sm:text-xs uppercase tracking-widest opacity-80 mt-1">{label}</div>
    </div>
  );
}

function CurriculumPage() {
  const { days, hours, minutes, seconds, ended, ready } = useCountdown(CLASS_START);

  return (
    <div className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_40%),radial-gradient(circle_at_80%_60%,white_0,transparent_35%)]" />
        <div className="relative container mx-auto px-4 py-16 sm:py-24">
          <Link to="/programs" className="inline-flex items-center gap-2 text-sm opacity-80 hover:opacity-100 mb-6">
            ← All programs
          </Link>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur px-3 py-1 text-xs font-medium border border-background/20">
              <Zap className="h-3.5 w-3.5" /> Teens 13–19 · Limited seats
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              AI Video Bootcamp for Teens
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-3 opacity-90">
                Create. Post. Grow.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl opacity-90 max-w-2xl">
              4 Saturdays of hands-on AI video creation — from idea to published video. Build real skills, real
              content and a real path to monetization.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur px-3 py-2 border border-background/20">
                <Calendar className="h-4 w-4" /> 4 Saturdays · 1–22 Aug 2026
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur px-3 py-2 border border-background/20">
                <Clock className="h-4 w-4" /> 2–3 hours per session
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur px-3 py-2 border border-background/20">
                <Video className="h-4 w-4" /> Live on Zoom
              </div>
            </div>

            {/* Countdown */}
            <div className="mt-10">
              <div className="text-xs uppercase tracking-widest opacity-80 mb-3">
                {ended ? "Bootcamp is live" : "Bootcamp starts in"}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3" suppressHydrationWarning>
                {ready ? (
                  <>
                    <CountdownBox value={days} label="Days" />
                    <CountdownBox value={hours} label="Hours" />
                    <CountdownBox value={minutes} label="Minutes" />
                    <CountdownBox value={seconds} label="Seconds" />
                  </>
                ) : (
                  <>
                    <CountdownBox value={0} label="Days" />
                    <CountdownBox value={0} label="Hours" />
                    <CountdownBox value={0} label="Minutes" />
                    <CountdownBox value={0} label="Seconds" />
                  </>
                )}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary" className="text-base">
                <Link to="/register/ai-video-teens">
                  <Sparkles className="mr-2 h-5 w-5" /> Reserve My Seat
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-transparent border-background/40 text-primary-foreground hover:bg-background/10 hover:text-primary-foreground">
                <a href="#curriculum">View Curriculum</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What you'll walk away with</h2>
          <p className="mt-3 text-muted-foreground">By the end of the 4 Saturdays, you can:</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {outcomes.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="inline-flex items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CURRICULUM */}
      <section id="curriculum" className="bg-muted/30 border-y">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
              <Target className="h-3.5 w-3.5" /> Full Curriculum
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">4 Saturdays. Real Videos. Real Growth.</h2>
            <p className="mt-3 text-muted-foreground">
              Every session is hands-on. You ship a real video by the end of the bootcamp.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {weeks.map((w, i) => (
              <div key={w.title} className="rounded-2xl bg-card border shadow-sm overflow-hidden">
                <div className={`p-6 ${i % 2 === 0 ? "bg-primary text-primary-foreground" : "bg-foreground text-background"}`}>
                  <div className="text-xs uppercase tracking-widest opacity-80">{w.label}</div>
                  <h3 className="mt-1 text-2xl font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm opacity-90">{w.summary}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {w.points.map((p) => (
                      <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BONUSES */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 sm:p-12">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary text-primary-foreground shrink-0">
              <Gift className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold">Bonuses included</h2>
              <p className="mt-2 text-muted-foreground">Yours to keep, even after the bootcamp ends.</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {bonuses.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm font-medium">
                    <Check className="h-4 w-4 text-primary" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-2xl mx-auto">
            Ready to become an AI video creator?
          </h2>
          <p className="mt-4 opacity-90 max-w-xl mx-auto">
            Seats are limited. Reserve yours now and we'll send the Zoom link and welcome pack.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/register/ai-video-teens">
                <Rocket className="mr-2 h-5 w-5" /> Reserve My Seat
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-xs opacity-75">
            4 Saturdays · 1–22 Aug 2026 · Live on Zoom
          </p>
        </div>
      </section>
    </div>
  );
}
