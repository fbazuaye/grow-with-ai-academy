import { Link } from "@tanstack/react-router";
import { SITE_NAME } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h3 className="font-display text-xl">{SITE_NAME}</h3>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Practical AI training for real outcomes — sales, jobs, content, productivity, income.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/programs" className="hover:text-accent">All Programs</Link></li>
            <li><Link to="/enquire" className="hover:text-accent">Make an Enquiry</Link></li>
            <li><Link to="/auth" className="hover:text-accent">Admin Sign In</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">Contact</h4>
          <p className="mt-3 text-sm text-primary-foreground/70">
            Reach our team on WhatsApp for enrolments and questions.
          </p>
        </div>
      </div>
      <div className="space-y-1 border-t border-white/10 py-5 text-center text-xs text-primary-foreground/60">
        <p>© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        <p>
          Designed by <span className="font-medium text-primary-foreground/80">Frank Bazuaye</span> · Powered by{" "}
          <span className="font-medium text-accent">LiveGig Ltd</span>
        </p>
      </div>
    </footer>
  );
}
