import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Calendar, Tag, Inbox } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [counts, setCounts] = useState({ programs: 0, schedules: 0, tiers: 0, enquiries: 0, newEnquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, s, t, e, n] = await Promise.all([
        supabase.from("programs").select("*", { count: "exact", head: true }),
        supabase.from("schedules").select("*", { count: "exact", head: true }),
        supabase.from("pricing_tiers").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setCounts({
        programs: p.count ?? 0,
        schedules: s.count ?? 0,
        tiers: t.count ?? 0,
        enquiries: e.count ?? 0,
        newEnquiries: n.count ?? 0,
      });
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: "Programs", value: counts.programs, icon: BookOpen },
    { label: "Schedules", value: counts.schedules, icon: Calendar },
    { label: "Pricing tiers", value: counts.tiers, icon: Tag },
    { label: "Enquiries", value: counts.enquiries, icon: Inbox, badge: counts.newEnquiries ? `${counts.newEnquiries} new` : undefined },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Quick snapshot of your academy.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{c.label}</p>
              <c.icon className="h-4 w-4 text-accent" />
            </div>
            <p className="mt-2 font-display text-3xl">{loading ? "—" : c.value}</p>
            {c.badge && <p className="mt-1 text-xs font-semibold text-accent">{c.badge}</p>}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        Use the sidebar to manage programs, schedule new training batches, edit pricing tiers, or review incoming enquiries.
      </div>
    </div>
  );
}
