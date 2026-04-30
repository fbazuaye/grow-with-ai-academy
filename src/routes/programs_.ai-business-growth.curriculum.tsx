import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Calendar,
  Check,
  Clock,
  MessageCircle,
  Sparkles,
  Video,
  Gift,
  Target,
  TrendingUp,
  Rocket,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

import { buildHead } from "@/lib/seo";
import { courseSchema, breadcrumbSchema, jsonLdScript } from "@/lib/schema";

export const Route = createFileRoute("/programs_/ai-business-growth/curriculum")({
  head: () => {
    const base = buildHead({
      title: "AI for Business Growth — 2 Saturdays Live on Zoom (4 & 11 July 2026)",
      description:
        "Use AI to get customers and increase your sales in just 2 Saturdays. Live on Zoom, 2 hours per session. No tech skills needed.",
      path: "/programs/ai-business-growth/curriculum",
      type: "course",
    });
    return {
      ...base,
      scripts: [
        jsonLdScript(
          courseSchema({
            name: "AI for Business Growth Masterclass",
            description:
              "A 2-Saturday hands-on live class teaching business owners how to use AI to attract customers, write sales messages and close deals on WhatsApp.",
            path: "/programs/ai-business-growth/curriculum",
            audience: "Business owners and operators",
            startDate: "2026-07-04T10:00:00+01:00",
            endDate: "2026-07-11T12:00:00+01:00",
            mode: "online",
            location: "Zoom",
          }),
        ),
        jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Programs", path: "/programs" },
            { name: "AI for Business Growth", path: "/programs/ai-business-growth/curriculum" },
          ]),
        ),
      ],
    };
  },
  component: CurriculumPage,
});

// Class start: Saturday 4 July 2026, 10:00 AM WAT (UTC+1)
const CLASS_START = new Date("2026-07-04T10:00:00+01:00").getTime();

const day1Modules = [
  {
    title: "Module 1: AI Basics (No Technical Jargon)",
    points: [
      "What AI really is — your smart business assistant",
      "The types of AI tools available today",
      "Why AI is changing business RIGHT NOW",
      "How small businesses use AI to attract customers, save time and increase sales",
    ],
  },
  {
    title: "Module 2: Mastering ChatGPT",
    points: [
      "How to talk to AI properly (the prompt secret)",
      "The Role + Task + Context + Output framework",
      "Live demos: marketing experts, sales posts, more",
      "Avoiding the 3 most common prompt mistakes",
      "Activity: generate 1 business post + 1 sales message",
    ],
  },
  {
    title: "Module 3: Everyday AI Tools",
    points: [
      "Canva for flyers and designs",
      "Grammarly for polished writing",
      "AI image tools for product visuals",
      "Voice tools for audio content",
      "Activity: create 1 flyer + 1 social media post",
    ],
  },
  {
    title: "Module 4 (Part 1): Content Creation",
    points: [
      "Instagram posts that stop the scroll",
      "WhatsApp promotions that convert",
      "Facebook ad copy that gets clicks",
      "Hands-on: build a 7-day content plan + 3 ready-to-post captions",
    ],
  },
];

const day2Modules = [
  {
    title: "Module 4 (Part 2): Sales & Marketing",
    points: [
      "How to write messages that actually convert",
      "WhatsApp selling scripts that close deals",
      "Customer attraction: offers, hooks and call-to-actions",
      "Activity: 1 full sales post + 1 WhatsApp closing script",
    ],
  },
  {
    title: "Module 5: Making Money / ROI with AI",
    points: [
      "More customers through better messaging",
      "Faster content = more visibility",
      "New income streams: offer AI services (social media, content, flyer design)",
      "Productivity = profit: save time, focus on sales",
    ],
  },
  {
    title: "Module 6: AI Workflows (Simple Automation)",
    points: [
      "Workflow 1: ChatGPT → Content → Canva → Publish",
      "Workflow 2: ChatGPT → Sales Script → WhatsApp → Close sale",
      "Templates: content system, sales system, customer-response system",
      "Activity: build your personal AI workflow",
    ],
  },
  {
    title: "Final Practical: Build Your AI Marketing System",
    points: [
      "1 Flyer (using Canva)",
      "3 Social media posts",
      "1 Sales message",
      "1 WhatsApp closing script",
      "7-day content plan",
    ],
  },
];

const outcomes = [
  { icon: Sparkles, title: "Marketing", text: "Create content consistently, design flyers, plan campaigns" },
  { icon: TrendingUp, title: "Sales", text: "Write messages that convert and close customers on WhatsApp" },
  { icon: Rocket, title: "Growth", text: "Attract more customers, save time, and increase revenue" },
];

const bonuses = [
  "Prompt Templates Pack",
  "30-Day Content Calendar",
  "Sales Scripts Library",
  "Flyer Templates",
];

function useCountdown(target: number) {
  // Start at null on both server and first client render to avoid hydration mismatches.
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
  const cta = whatsappLink("AI for Business Growth — 2 Saturdays (4 & 11 July 2026)");

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
              <Zap className="h-3.5 w-3.5" /> Live cohort · Limited seats
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
              Use AI to Get Customers & Increase Sales
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-3 opacity-90">
                in just 2 Saturdays.
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl opacity-90 max-w-2xl">
              A no-tech, hands-on live class for business owners. Walk away with content, sales scripts and an
              AI workflow that actually makes you money.
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <div className="inline-flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur px-3 py-2 border border-background/20">
                <Calendar className="h-4 w-4" /> Sat 4 & 11 July 2026
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur px-3 py-2 border border-background/20">
                <Clock className="h-4 w-4" /> 2 hours per session
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-background/10 backdrop-blur px-3 py-2 border border-background/20">
                <Video className="h-4 w-4" /> Live on Zoom
              </div>
            </div>

            {/* Countdown */}
            <div className="mt-10">
              <div className="text-xs uppercase tracking-widest opacity-80 mb-3">
                {ended ? "Class is live" : "Class starts in"}
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
                <Link to="/register/ai-business-growth">
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
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What you walk away with</h2>
          <p className="mt-3 text-muted-foreground">By the end of the 2 Saturdays, you can:</p>
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
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">2 Saturdays. Real Results.</h2>
            <p className="mt-3 text-muted-foreground">
              Every session is hands-on. You build your own marketing system as we go.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Day 1 */}
            <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
              <div className="p-6 bg-primary text-primary-foreground">
                <div className="text-xs uppercase tracking-widest opacity-80">Saturday 1 · 4 July 2026</div>
                <h3 className="mt-1 text-2xl font-bold">Foundation + Content Engine</h3>
                <p className="mt-2 text-sm opacity-90">
                  Understand AI and start creating real business content immediately.
                </p>
              </div>
              <div className="p-6 space-y-6">
                {day1Modules.map((m) => (
                  <div key={m.title}>
                    <h4 className="font-semibold text-foreground">{m.title}</h4>
                    <ul className="mt-3 space-y-2">
                      {m.points.map((p) => (
                        <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Day 2 */}
            <div className="rounded-2xl bg-card border shadow-sm overflow-hidden">
              <div className="p-6 bg-foreground text-background">
                <div className="text-xs uppercase tracking-widest opacity-80">Saturday 2 · 11 July 2026</div>
                <h3 className="mt-1 text-2xl font-bold">Sales, Marketing & Automation</h3>
                <p className="mt-2 text-sm opacity-90">Turn content into customers and revenue.</p>
              </div>
              <div className="p-6 space-y-6">
                {day2Modules.map((m) => (
                  <div key={m.title}>
                    <h4 className="font-semibold text-foreground">{m.title}</h4>
                    <ul className="mt-3 space-y-2">
                      {m.points.map((p) => (
                        <li key={p} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
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
              <p className="mt-2 text-muted-foreground">Yours to keep, even after the class ends.</p>
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
            Ready to grow your business with AI?
          </h2>
          <p className="mt-4 opacity-90 max-w-xl mx-auto">
            Seats are limited. Reserve yours on WhatsApp and we'll send you the Zoom link and welcome pack.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link to="/register/ai-business-growth">
                <Sparkles className="mr-2 h-5 w-5" /> Reserve My Seat
              </Link>
            </Button>
          </div>
          <p className="mt-6 text-xs opacity-75">
            Sat 4 & 11 July 2026 · 2 hours each · Live on Zoom
          </p>
        </div>
      </section>
    </div>
  );
}
