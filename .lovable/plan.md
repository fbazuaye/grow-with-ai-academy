# Code-side AI Discoverability Improvements

Implement the high-impact code changes that help LLMs and AI search engines (ChatGPT Search, Perplexity, Google AI Overviews, Bing Copilot) discover, parse, and cite this site faster and more reliably.

## What this delivers

1. **Fix the SSR/hydration warning** in `__root.tsx` so server-rendered HTML (which is what bots and LLM crawlers actually read) is clean and consistent.
2. **A real `/faq` page** with `FAQPage` JSON-LD — the single highest-leverage page format for AI answer engines, since they extract Q&A pairs verbatim.
3. **IndexNow integration** so Bing/Copilot/Yandex (and tools that pull from them) get notified instantly when content changes, instead of waiting weeks for a crawl.
4. **Tighter root metadata** — site-wide title template + a default `og:image` referenced from absolute URL so social/AI cards never break.
5. **Brand-consistent `og:image` per program** — register and curriculum pages reuse the program hero so AI answer cards have a relevant image.

---

## Changes

### 1. Fix root SSR shell (`src/routes/__root.tsx`)
- Add `suppressHydrationWarning` on `<html>` and `<body>` to prevent hydration mismatch warnings from theme/font scripts.
- Add a `titleTemplate`-style default by setting a generic `title` only when child routes don't override (already works via TanStack head dedup — just clean wording).
- Ensure `og:url` and canonical are present at the root with absolute URLs from `SITE_URL` in `src/lib/seo.ts`.

### 2. New `/faq` route (`src/routes/faq.tsx`)
- Curated FAQ covering: what programs are offered, who they're for, AI Business Growth details, AI Video Bootcamp for Teens details, pricing, schedule/cohort, location (Lagos, Nigeria), delivery (live online), certificate, refund policy, how to register, payment methods, prerequisites.
- Render visible Q&A (accordion using existing `@/components/ui/accordion`).
- Inject `FAQPage` JSON-LD via existing `src/lib/schema.ts` (`faqPageSchema(items)` helper — add if missing).
- `head()` with route-specific title, description, canonical, og tags, and `BreadcrumbList` JSON-LD.
- Add `/faq` to `src/routes/sitemap[.]xml.tsx`.
- Add a Footer link to `/faq` in `src/components/site/Footer.tsx`.

### 3. IndexNow (`public/<key>.txt` + `src/routes/api/public/indexnow-ping.ts`)
- Generate a stable IndexNow key (32-char hex), commit it as `public/<key>.txt` containing the same key (per IndexNow spec).
- Add a small server route `POST /api/public/indexnow-ping` that accepts `{ urls: string[] }` (Zod-validated, max 50) and forwards to `https://api.indexnow.org/indexnow` with the site host + key. No auth required (it's a fan-out helper) but rate-limit by capping URL count and validating each URL belongs to `SITE_URL`.
- Document usage in `public/llms.txt` (one line) — not user-facing.
- Optional: trigger automatically from sitemap render (skip for now to keep scope tight; manual trigger is enough).

### 4. Root metadata polish (`src/routes/__root.tsx` + `src/lib/seo.ts`)
- Move all OG/Twitter image URLs to absolute (already absolute — just confirm).
- Add `og:site_name`, `og:locale` (`en_NG`), and `twitter:site` placeholder (omit handle if unknown).
- Ensure every page that uses `buildHead()` gets a canonical link automatically (already implemented — verify all current routes call it; patch the two that don't if any).

### 5. Per-program `og:image` (`src/routes/register.*.tsx`, `src/routes/programs_.*.curriculum.tsx`)
- Each program page already references a hero image. Pass that same absolute URL into `buildHead({ ogImage })` so social/AI cards show the program-specific image rather than the global default.

---

## Files to create

- `src/routes/faq.tsx`
- `src/routes/api/public/indexnow-ping.ts`
- `public/<indexnow-key>.txt`

## Files to edit

- `src/routes/__root.tsx` — hydration suppression, `og:site_name`/`og:locale`
- `src/lib/schema.ts` — add `faqPageSchema()` helper if not present
- `src/lib/seo.ts` — accept and emit `ogImage` option (if not already)
- `src/routes/sitemap[.]xml.tsx` — add `/faq`
- `src/components/site/Footer.tsx` — add FAQ link
- `src/routes/register.ai-business-growth.tsx` — pass program hero as `ogImage`
- `src/routes/register.ai-video-teens.tsx` — same
- `src/routes/programs_.ai-business-growth.curriculum.tsx` — same
- `src/routes/programs_.ai-video-teens.curriculum.tsx` — same
- `public/llms.txt` — append `/faq` to the page list

---

## Out of scope (intentionally)

- Backlinks, directory submissions, social profiles — these are external/off-platform actions you do, not code.
- Google Search Console / Bing Webmaster verification — requires you to add a DNS or meta verification token; happy to add the meta tag once you have it.
- Auto-pinging IndexNow on every content change — keeping the helper manual for now.

## Notes for non-technical readers

After this ships, AI engines (ChatGPT Search, Perplexity, Copilot, Google AI Overviews) will have:
- A clean, machine-readable FAQ page they can quote directly when someone asks "What does AI Mastery Academy teach?" or "How much is the AI Video Bootcamp for Teens?"
- A fast notification channel (IndexNow) so Bing/Copilot index new pages within minutes instead of weeks.
- Program-specific share images so AI-generated answer cards look correct.

You should still expect 2–4 weeks before AI engines reliably cite a brand-new domain — code can't shortcut crawler trust, but it removes every technical reason for them to skip the site.
