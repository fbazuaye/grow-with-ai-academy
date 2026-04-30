import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Globe, Users, MapPin, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/visitors")({
  head: () => ({ meta: [{ title: "Visitors — Admin" }, { name: "robots", content: "noindex" }] }),
  component: VisitorsPage,
});

type Row = {
  created_at: string;
  path: string;
  referrer_host: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  visitor_hash: string | null;
};

const RANGES = [
  { key: 7, label: "7 days" },
  { key: 30, label: "30 days" },
  { key: 90, label: "90 days" },
] as const;

function flagEmoji(cc?: string | null) {
  if (!cc || cc.length !== 2) return "🌐";
  const A = 0x1f1e6;
  const code = cc.toUpperCase();
  return String.fromCodePoint(A + (code.charCodeAt(0) - 65), A + (code.charCodeAt(1) - 65));
}

function topN<T extends string>(rows: Row[], key: keyof Row, n = 10) {
  const map = new Map<T, number>();
  for (const r of rows) {
    const v = (r[key] as T | null) ?? null;
    if (!v) continue;
    map.set(v, (map.get(v) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k, v]) => ({ key: k, count: v }));
}

function dailySeries(rows: Row[], days: number) {
  const buckets = new Map<string, number>();
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([day, count]) => ({
    day: day.slice(5),
    count,
  }));
}

function VisitorsPage() {
  const [days, setDays] = useState<number>(7);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const since = new Date();
      since.setUTCDate(since.getUTCDate() - days);
      const { data, error } = await supabase
        .from("page_views")
        .select("created_at,path,referrer_host,country,region,city,visitor_hash")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false })
        .limit(10000);
      if (cancelled) return;
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data ?? []) as Row[]);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const stats = useMemo(() => {
    const total = rows.length;
    const unique = new Set(rows.map((r) => r.visitor_hash).filter(Boolean)).size;
    const countries = topN<string>(rows, "country", 10);
    const cities = topN<string>(rows, "city", 10);
    const regions = topN<string>(rows, "region", 10);
    const paths = topN<string>(rows, "path", 10);
    const refs = topN<string>(rows, "referrer_host", 10);
    const daily = dailySeries(rows, days);
    return { total, unique, countries, cities, regions, paths, refs, daily };
  }, [rows, days]);

  const topCountry = stats.countries[0];
  const topPage = stats.paths[0];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Visitors</h1>
          <p className="text-sm text-muted-foreground">
            Geographic analytics for public pages. Privacy-friendly — no IPs stored.
          </p>
        </div>
        <div className="flex gap-1 rounded-md border bg-card p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setDays(r.key)}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                days === r.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={<Users className="h-4 w-4" />} label="Total visits" value={stats.total} />
        <Kpi icon={<Users className="h-4 w-4" />} label="Unique visitors" value={stats.unique} />
        <Kpi
          icon={<Globe className="h-4 w-4" />}
          label="Top country"
          value={topCountry ? `${flagEmoji(topCountry.key)} ${topCountry.key}` : "—"}
          sub={topCountry ? `${topCountry.count} visits` : undefined}
        />
        <Kpi
          icon={<FileText className="h-4 w-4" />}
          label="Top page"
          value={topPage ? topPage.key : "—"}
          sub={topPage ? `${topPage.count} visits` : undefined}
        />
      </div>

      <Card title="Daily visits">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.daily}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Top countries">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.countries.map((c) => ({ name: c.key, count: c.count }))}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <RankList
            items={stats.countries.map((c) => ({
              label: `${flagEmoji(c.key)} ${c.key}`,
              count: c.count,
            }))}
            empty="No country data yet."
          />
        </Card>

        <Card title="Top cities" icon={<MapPin className="h-4 w-4" />}>
          <RankList
            items={stats.cities.map((c) => ({ label: c.key, count: c.count }))}
            empty="No city data yet (city enrichment may be rate-limited)."
          />
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Top pages">
          <RankList items={stats.paths.map((p) => ({ label: p.key, count: p.count }))} empty="No visits yet." />
        </Card>
        <Card title="Top referrers">
          <RankList
            items={stats.refs.map((r) => ({ label: r.key, count: r.count }))}
            empty="No external referrers yet."
          />
        </Card>
      </div>

      {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-2 font-display text-2xl">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function RankList({
  items,
  empty,
}: {
  items: { label: string; count: number }[];
  empty: string;
}) {
  if (!items.length) return <p className="text-sm text-muted-foreground">{empty}</p>;
  const max = items[0].count || 1;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label} className="text-sm">
          <div className="mb-1 flex justify-between gap-3">
            <span className="truncate" title={it.label}>
              {it.label}
            </span>
            <span className="tabular-nums text-muted-foreground">{it.count}</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-gold"
              style={{ width: `${(it.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
