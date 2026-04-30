import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { buildHead } from "@/lib/seo";
import { faqSchema, breadcrumbSchema, jsonLdScript } from "@/lib/schema";

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "What is AI Mastery Academy?",
    a: "AI Mastery Academy is a practical AI training school based in Lagos, Nigeria, offering live online cohorts that teach non-engineers how to use AI tools (ChatGPT, Gemini, Claude, CapCut, Canva, YTRadar) to grow businesses, find jobs, create content, work smarter and earn online. It is operated by LiveGig Ltd.",
  },
  {
    q: "Which programs do you currently offer?",
    a: "Two flagship live cohorts: (1) the AI for Business Growth Masterclass — 2 Saturdays on 4 & 11 July 2026 for business owners; and (2) the AI Video Bootcamp for Teens (Create, Post & Grow) — 4 Saturdays from 1–22 August 2026 for teens aged 13–19. We also run AI tracks for job seekers, content creators, professionals and freelancers.",
  },
  {
    q: "Who is the AI for Business Growth Masterclass for?",
    a: "Founders, executives, marketers and operators who want to use AI to attract customers, write sales messages and close deals on WhatsApp — no coding required. It runs 2 Saturdays (4 & 11 July 2026), 10:00 AM – 2:00 PM WAT, live on Zoom.",
  },
  {
    q: "Who is the AI Video Bootcamp for Teens for?",
    a: "Teens aged 13–19 who want to create AI-powered short-form videos and grow on TikTok, Instagram Reels and YouTube Shorts. It runs 4 Saturdays (1, 8, 15 & 22 August 2026), 11:00 AM – 1:30 PM WAT, live on Zoom. Parents/guardians register the teen.",
  },
  {
    q: "How are classes delivered?",
    a: "All cohorts are delivered live on Zoom. Sessions include hands-on activities, downloadable templates, recordings, and access to a private alumni community. You only need a phone or laptop and a stable internet connection.",
  },
  {
    q: "Where are you based?",
    a: "We are based in Lagos, Nigeria, and serve learners across Africa and globally online.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes. Participants who complete the live sessions and final practical receive a digital Certificate of Completion from AI Mastery Academy.",
  },
  {
    q: "How do I register?",
    a: "Visit /programs to pick a program, then click Register. You'll fill a short form and complete payment via our secure payment page (Paystack). For any questions, message us on WhatsApp at +234 705 426 5401.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept card, bank transfer and USSD via Paystack. International learners can also pay via card. WhatsApp our team for invoice or alternative methods.",
  },
  {
    q: "Are there prerequisites?",
    a: "No technical or coding background is required. The Business Growth Masterclass assumes you run or work in a business. The Teen Video Bootcamp is beginner-friendly — no editing experience needed.",
  },
  {
    q: "Do you offer refunds?",
    a: "Refunds are available up to 7 days before the cohort start date. After the cohort begins, fees are non-refundable but seats can be transferred to a future cohort on request.",
  },
  {
    q: "Will I get the recordings?",
    a: "Yes. All registered participants receive session recordings, slides and templates so you can revisit the material at any time.",
  },
  {
    q: "How can I contact AI Mastery Academy?",
    a: "WhatsApp: +234 705 426 5401. You can also use the enquiry form at /enquire and a member of our team will respond within one business day.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => {
    const base = buildHead({
      title: "FAQ — AI Mastery Academy",
      description:
        "Answers to common questions about AI Mastery Academy: programs, schedule, pricing, delivery, certificates, refunds and how to register.",
      path: "/faq",
    });
    return {
      ...base,
      scripts: [
        jsonLdScript(faqSchema(FAQS)),
        jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ),
      ],
    };
  },
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="bg-background">
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Frequently Asked Questions
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            Everything you need to know
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Quick answers about our live AI cohorts, pricing, delivery and how to register. Can't find what you're looking for? Reach out below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base font-semibold">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="font-display text-xl">Still have questions?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Send us an enquiry and our team will get back to you within one business day.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to="/enquire">Make an Enquiry</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/programs">Browse Programs</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
