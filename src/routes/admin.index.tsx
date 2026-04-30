import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Calendar, Tag, Inbox, Globe } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

type Enquiry = {
  id: string;
  status: string;
  program_title: string | null;
  created_at: string;
};

const STATUS_COLORS: Record<string, string> = {
  new: "hsl(var(--accent))",
  contacted: "#3b82f6",
  enrolled: "#10b981",
  closed: "#94a3b8",
};

function AdminOverview() {
  const [counts, setCounts] = useState({ programs: 0, schedules: 0, tiers: 0, enquiries: 0, newEnquiries: 0, visits7d: 0, uniques7d: 0 });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 29);
      const since7 = new Date();
      since7.setDate(since7.getDate() - 7);
      const [p, s, t, e, n, list, pv] = await Promise.all([
        supabase.from("programs").select("*", { count: "exact", head: true }),
        supabase.from("schedules").select("*", { count: "exact", head: true }),
        supabase.from("pricing_tiers").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }),
        supabase.from("enquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase
          .from("enquiries")
          .select("id,status,program_title,created_at")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: true }),
        supabase
          .from("page_views")
          .select("visitor_hash")
          .gte("created_at", since7.toISOString())
          .limit(10000),
      ]);
      const pvRows = (pv.data ?? []) as { visitor_hash: string | null }[];
      setCounts({
        programs: p.count ?? 0,
        schedules: s.count ?? 0,
        tiers: t.count ?? 0,
        enquiries: e.count ?? 0,
        newEnquiries: n.count ?? 0,
        visits7d: pvRows.length,
        uniques7d: new Set(pvRows.map((r) => r.visitor_hash).filter(Boolean)).size,
      });
      setEnquiries((list.data ?? []) as Enquiry[]);
      setLoading(false);
    })();
  }, []);

  const byProgram = useMemo(() => {
    const map = new Map<string, number>();
    enquiries.forEach((q) => {
      const k = q.program_title?.trim() || "Unspecified";
      map.set(k, (map.get(k) ?? 0) + 1);
    });
    return Array.from(map, ([program, count]) => ({ program, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [enquiries]);

  const overTime = useMemo(() => {
    const days: { date: string; label: string; new: number; contacted: number; enrolled: number; closed: number }[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      days.push({
        date: iso,
        label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        new: 0,
        contacted: 0,
        enrolled: 0,
        closed: 0,
      });
    }
    const idx = new Map(days.map((d, i) => [d.date, i]));
    enquiries.forEach((q) => {
      const key = q.created_at.slice(0, 10);
      const i = idx.get(key);
      if (i === undefined) return;
      const status = (q.status in STATUS_COLORS ? q.status : "new") as "new" | "contacted" | "enrolled" | "closed";
      days[i][status] = days[i][status] + 1;
    });
    return days;
  }, [enquiries]);

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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="font-display text-lg">Enquiries by program</h2>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">Top programs generating leads.</p>
          <div className="h-72">
            {loading ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading…</div>
            ) : byProgram.length === 0 ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">No enquiries yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byProgram} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="program" width={140} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--accent))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-1 flex items-baseline justify-between">
            <h2 className="font-display text-lg">Enquiries over time</h2>
            <span className="text-xs text-muted-foreground">Last 30 days, by status</span>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">Daily volume split by lead status.</p>
          <div className="h-72">
            {loading ? (
              <div className="grid h-full place-items-center text-sm text-muted-foreground">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overTime} margin={{ left: 4, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} interval={4} />
                  <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="new" stroke={STATUS_COLORS.new} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="contacted" stroke={STATUS_COLORS.contacted} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="enrolled" stroke={STATUS_COLORS.enrolled} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="closed" stroke={STATUS_COLORS.closed} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground">
        Use the sidebar to manage programs, schedule new training batches, edit pricing tiers, or review incoming enquiries.
      </div>
    </div>
  );
}
