import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Check, Clock, MessageCircle, Sparkles, Video, Gift, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/whatsapp";

export const Route = createFileRoute("/programs/ai-business-growth/curriculum")({
  head: () => ({
    meta: [
      { title: "AI Business Growth Curriculum — 2 Saturdays (4 & 11 July 2026)" },
      {
        name: "description",
        content:
          "Full 2-Saturday curriculum: use ChatGPT and AI tools to attract customers, create content and close more sales. Live on Zoom, 2 hours per session.",
      },
      { property: "og:title", content: "AI Business Growth — 2-Saturday Curriculum" },
      {
        property: "og:description",
        content:
          "Saturday 4 & 11 July 2026 · 2 hours each · Live on Zoom. No-tech AI training to grow your business.",
      },
    ],
  }),
  component: CurriculumPage,
});

const day1Modules = [
  {
    title: "Module 1: AI Basics (No Technical Jargon)",
    points: [
      "What AI really is — your smart business assistant",
      "The types of AI tools transforming small businesses today",
      "Why AI is changing business right now (and how to ride the wave)",
      "How small businesses use AI to attract customers, save time and increase sales",
      "Activity: map your business + biggest growth challenge",
    ],
  },
  {
    title: "Module 2: Mastering ChatGPT",
    points: [
      "How to talk to AI properly so it gives you usable answers",
      "The Role + Task + Context + Output prompt framework",
      "Live demo: marketing expert prompts and sales-post prompts",
      "Common mistakes to avoid (vague prompts, no context, no refining)",
      "Activity: generate 1 business post + 1 sales message",
    ],
  },
  {
    title: "Module 3: Everyday AI Tools",
    points: [
      "Canva — flyers and designs in minutes",
      "Grammarly — polished, professional writing",
      "AI image tools — product visuals without a designer",
      "Voice tools — turn ideas into audio content",
      "Activity: create 1 flyer + 1 social media post",
    ],
  },
  {
    title: "Module 4 (Part 1): Content Creation in Practice",
    points: [
      "Create Instagram posts, WhatsApp promotions and Facebook ads",
      "Hands-on: generate a 7-day content plan",
      "Hands-on: write 3 ready-to-post captions",
    ],
  },
];

const day2Modules = [
  {
    title: "Module 4 (Part 2): Sales & Marketing with AI",
    points: [
      "Sales messaging that actually converts",
      "WhatsApp selling scripts that close customers",
      "Customer attraction: offers, hooks and call-to-actions",
      "Activity: 1 full sales post + 1 WhatsApp closing script",
    ],
  },
  {
    title: "Module 5: Making Money / ROI with AI",
    points: [
      "Grow your business with sharper messaging and faster content",
      "Open new income streams: social media management, content, flyer design",
      "Productivity = profit — save time, focus on closing sales",
      "Activity: define one clear way AI will increase your income",
    ],
  },
  {
    title: "Module 6: AI Workflows (Simple Automation)",
    points: [
      "Workflow 1: ChatGPT → Content → Canva → Publish",
      "Workflow 2: ChatGPT → Sales script → WhatsApp → Close sale",
      "Templates included: content system, sales system, customer response system",
      "Activity: build your personal AI workflow for your business",
    ],
  },
  {
    title: "Final Practical Session — Build Your AI Marketing System",
    points: [
      "1 flyer (using Canva)",
      "3 social media posts",
      "1 sales message",
      "1 WhatsApp closing script",
      "7-day content plan",
    ],
  },
];

const outcomes = [
  { label: "Marketing", items: ["Create content consistently", "Design flyers and visuals", "Plan campaigns"] },
  { label: "Sales", items: ["Write messages that convert", "Close customers on WhatsApp"] },
  { label: "Business Growth", items: ["Attract more customers", "Save time using AI", "Increase your revenue"] },
];

const bonuses = [
  "Prompt templates pack",
  "30-day content calendar",
  "Sales scripts library",
  "Flyer templates",
];

function CurriculumPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <Link to="/programs/$slug" params={{ slug: "ai-business-growth" }} className="text-sm text-primary-foreground/70 hover:text-accent">
            ← Back to AI for Business Growth
          </Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            2-Saturday Online Curriculum
          </p>
          <h1 className="mt-2 font-display text-3xl text-balance md:text-5xl">
            Use AI to Get Customers and Increase Your Sales — in 2 Saturdays
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            No-tech AI training for business owners. Walk away with a working marketing system you can use the
            next morning — flyers, posts, sales scripts and a full content plan.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <Calendar className="h-5 w-5 text-accent" />
              <div className="text-sm">
                <p className="font-semibold">Sat 4 & 11 July 2026</p>
                <p className="text-primary-foreground/70 text-xs">Two live sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <Clock className="h-5 w-5 text-accent" />
              <div className="text-sm">
                <p className="font-semibold">2 hours each</p>
                <p className="text-primary-foreground/70 text-xs">Hands-on workshop</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-4 py-3">
              <Video className="h-5 w-5 text-accent" />
              <div className="text-sm">
                <p className="font-semibold">Live on Zoom</p>
                <p className="text-primary-foreground/70 text-xs">Join from anywhere</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="hero" size="lg">
              <Link to="/enquire" search={{ program: "ai-business-growth" }}>
                Enroll Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <a href={whatsappLink("AI for Business Growth — July 2026 batch")} target="_blank" rel="noreferrer">
                <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-16 px-4 py-16">
        {/* Day 1 */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Saturday 1 · 4 July 2026</p>
          <h2 className="mt-2 font-display text-3xl">Foundation + Content Creation Engine</h2>
          <p className="mt-3 max-w-3xl text-foreground/75">
            Understand AI and start creating real business content immediately.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {day1Modules.map((m) => (
              <div key={m.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-lg">{m.title}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {m.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-5 text-sm">
            <strong className="font-semibold">End of Day 1:</strong> you can use AI tools, create content and design simple marketing materials.
          </div>
        </section>

        {/* Day 2 */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Saturday 2 · 11 July 2026</p>
          <h2 className="mt-2 font-display text-3xl">Sales, Marketing & Automation</h2>
          <p className="mt-3 max-w-3xl text-foreground/75">
            Turn your content into customers and revenue.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {day2Modules.map((m) => (
              <div key={m.title} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-lg">{m.title}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {m.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Final Outcome</p>
          <h2 className="mt-2 font-display text-3xl">What you walk away with</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {outcomes.map((o) => (
              <div key={o.label} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-xl">{o.label}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {o.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Bonuses */}
        <section className="rounded-3xl border border-accent/30 bg-accent/5 p-8 md:p-10">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-accent" />
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Bonuses Included</p>
          </div>
          <h2 className="mt-2 font-display text-3xl">Extras to multiply your results</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {bonuses.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <span className="text-sm font-medium">{b}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-primary p-8 text-primary-foreground md:p-12">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] md:items-center">
            <div>
              <h2 className="font-display text-3xl text-balance">Ready to grow your business with AI?</h2>
              <p className="mt-2 text-primary-foreground/75">
                Reserve your seat for the July 2026 cohort — limited spots to keep the workshop hands-on.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
              <Button asChild variant="hero" size="lg">
                <Link to="/enquire" search={{ program: "ai-business-growth" }}>
                  Enroll Now
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <a href={whatsappLink("AI for Business Growth curriculum")} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
