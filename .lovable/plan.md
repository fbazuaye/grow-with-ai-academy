# Plan: GEO Visitor Analytics on Admin Dashboard

Track every public page visit with geographic location and surface it inside the existing **Admin** area as a new "Visitors" section.

## What you'll see (Admin → Visitors)

- **KPI cards**: Total visits, unique visitors, top country, top page (with 7d / 30d / 90d toggle)
- **Daily visits trend** — line chart
- **Top countries** — bar chart + table with flag emojis and visit counts
- **Top cities** — table
- **Top pages** — table with visit counts
- **Top referrers** — where traffic comes from (Google, direct, social, etc.)

Plus a small **"Visitors (last 7d)"** summary card on the Admin **Overview** page that links to the full Visitors view.

## How it works

```text
Public page loads
      │
      ▼
src/lib/analytics.ts  ── sendBeacon ──►  POST /api/public/track
                                              │
                                              ├─ reads CF-IPCountry header (country)
                                              ├─ enriches with ipapi.co (region, city)
                                              ├─ hashes IP+UA+date → visitor_hash
                                              ▼
                                         page_views table
                                              │
                                              ▼
                                  Admin → Visitors (charts + tables)
```

## Technical details

### 1. Database migration — `page_views` table
- `id` uuid pk, `created_at` timestamptz default now()
- `path` text, `referrer` text, `referrer_host` text
- `country` text (ISO-2), `region` text, `city` text
- `visitor_hash` text (sha256, daily-rotating — privacy-friendly unique counter)
- `user_agent` text
- Indexes: `created_at`, `country`, `path`
- **RLS**: SELECT restricted to admins via `private.has_role(auth.uid(), 'admin')`. No public INSERT policy — inserts go through `supabaseAdmin` in the server route.

### 2. Server route — `src/routes/api/public/track.ts`
- POST, accepts `{ path, referrer }` validated with Zod (path ≤ 512 chars).
- Skips if `path` starts with `/admin` or `/api`.
- Reads country from `CF-IPCountry` request header.
- Optional fetch to `https://ipapi.co/{ip}/json/` for region + city (fails silently — country still recorded).
- Computes `visitor_hash = sha256(ip + ua + YYYY-MM-DD)`.
- Inserts via `supabaseAdmin`, returns `204` quickly.

### 3. Client tracker — `src/lib/analytics.ts`
- `useTrackPageView()` hook subscribes to `useLocation()` and fires once per route change via `navigator.sendBeacon` (falls back to `fetch` with `keepalive`).
- Skips `/admin/*`, `/auth`, and bots (`navigator.webdriver`).
- Mounted once in `src/routes/__root.tsx` inside `RootComponent`.

### 4. Admin "Visitors" page — `src/routes/admin.visitors.tsx`
- Range selector (7 / 30 / 90 days).
- Server function `getVisitorAnalytics` (uses `requireSupabaseAuth` + admin check) returns aggregated buckets so we never ship raw rows to the browser.
- Recharts: line chart (daily) + bar chart (top countries).
- Tables for cities, pages, referrers. Country names + flag emoji from ISO-2 code (small local helper, no extra dep).

### 5. Admin nav + overview
- Add `{ to: "/admin/visitors", label: "Visitors", icon: Globe }` to `NAV` in `src/routes/admin.tsx`.
- Add a compact "Visitors (7d)" card to `src/routes/admin.index.tsx`.

### 6. Files

**New**
- `supabase/migrations/<ts>_page_views.sql`
- `src/routes/api/public/track.ts`
- `src/lib/analytics.ts`
- `src/server/analytics.functions.ts` (aggregation server fns)
- `src/routes/admin.visitors.tsx`

**Edited**
- `src/routes/__root.tsx` — mount `useTrackPageView()`
- `src/routes/admin.tsx` — add Visitors nav link
- `src/routes/admin.index.tsx` — add 7d visitors card
- `src/routeTree.gen.ts` — auto-regenerated

## Notes

- Works on Lovable hosting (server routes + edge `CF-IPCountry`). On a static Netlify deploy the `/api/public/track` endpoint won't run, so analytics silently no-ops there.
- No paid services. ipapi.co free tier (~1k/day) covers region/city; country always works via the edge header.
- No PII stored — IPs are never written to the DB, only the daily-rotated hash.
