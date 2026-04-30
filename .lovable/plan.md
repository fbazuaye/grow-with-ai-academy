## Goal
Upgrade the site from "basic SEO" to fully optimized for AEO (answer engines), GEO (generative engines / LLM citation), and AIO (AI + local discovery), while keeping classic SEO clean.

## 1. Classic SEO foundations
- Add `public/robots.txt` allowing all, disallowing `/admin`, `/auth`, `/api/`, pointing to `/sitemap.xml`.
- Add `src/routes/sitemap[.]xml.tsx` server route that dynamically lists: `/`, `/programs`, every `/programs/$slug`, curriculum pages, `/register/*`, `/enquire`. Uses program slugs from DB.
- Add **canonical URL** meta on every public route (computed from the published domain).
- Add per-page OG images (or fall back to a branded default) on curriculum + register pages.
- Set a single `SITE_URL` constant (`https://grow-with-ai-academy.lovable.app`) in `src/lib/seo.ts`.

## 2. AEO — JSON-LD structured data
Create `src/components/seo/JsonLd.tsx` (renders `<script type="application/ld+json">`) and `src/lib/schema.ts` builders. Inject:
- **Root** (`__root.tsx`): `Organization` + `EducationalOrganization` + `WebSite` (with `SearchAction`) + `LocalBusiness` (Nigeria address, WhatsApp `contactPoint`).
- **`/programs/$slug`**: `Course` schema with `provider`, `hasCourseInstance` (from schedules → `CourseInstance` w/ `startDate`, `endDate`, `courseMode`, `location`), and `offers` (from pricing tiers).
- **Curriculum pages**: `Course` + `syllabusSections` (weekly modules) + `BreadcrumbList`.
- **Register pages**: `Event` + `Offer`.
- **Homepage**: `FAQPage` (see #3).
- All pages: `BreadcrumbList`.

## 3. FAQ section (for Answer Engines)
Add an FAQ section to homepage + each program page with clean Q&A pairs ("Who is this for?", "How much does it cost?", "When does it start?", "Is it online or in-person?", "Do I get a certificate?"). Mirror them in `FAQPage` JSON-LD so Google/Bing AI Overviews can extract direct answers.

## 4. GEO — LLM-friendly surfaces
- Add `public/llms.txt` (concise site map for LLMs: what this site is, key pages, programs list with one-line descriptions, contact).
- Add `public/llms-full.txt` (longer, full program curricula + pricing + dates + FAQ in plain Markdown — single file LLMs can ingest).
- Add `src/routes/api/public/site-summary.ts` returning JSON of programs + schedules + pricing for AI agents/scrapers.
- Rewrite key sections to be **citation-friendly**: short declarative sentences, named entities ("AI Mastery Academy"), explicit dates, prices in NGN/USD, locations.

## 5. AIO — Local + entity signals
- `LocalBusiness` schema with address, geo coords, opening hours, WhatsApp.
- Add a small "About / Trainers" page (`/about`) with named instructor(s), credentials, photo, bio — strong E-E-A-T signal LLMs cite.
- Add explicit location text ("Based in Lagos, Nigeria · Serving learners across Africa & globally online") to footer + homepage.
- Expose WhatsApp + email as `ContactPoint` in Organization schema.

## 6. Per-page metadata polish
Helper `buildHead({ title, description, path, image, type })` in `src/lib/seo.ts` returns meta + canonical + og + twitter consistently. Replace inline `head:` blocks across all public routes.

## Technical notes
- New files: `src/lib/seo.ts`, `src/lib/schema.ts`, `src/components/seo/JsonLd.tsx`, `src/routes/sitemap[.]xml.tsx`, `src/routes/about.tsx`, `public/robots.txt`, `public/llms.txt`, `public/llms-full.txt`, `src/routes/api/public/site-summary.ts`.
- Updated: `src/routes/__root.tsx`, `index.tsx`, `programs.tsx`, `programs.$slug.tsx`, both curriculum routes, both register routes — all consume `buildHead()` and inject relevant JSON-LD.
- `llms.txt` + `llms-full.txt` can be regenerated; for now, hand-author from `src/lib/programs.ts` + DB seed data.
- No new npm dependencies required (JSON-LD is plain script tags).
- `noindex` stays on `/admin` and `/auth`.

## Out of scope (recommend later)
- Real OG images per program (needs design assets).
- Hooking sitemap to actual published domain once a custom domain is set.
- Submitting sitemap to Google Search Console / Bing Webmaster.
- Backlink/PR strategy (off-site GEO).
