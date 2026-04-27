## What's left to build

The public site is live (homepage, programs list, program detail, enquire form, DB schema with 5 seeded programs, "Warm & confident" navy/gold design system, PWA manifest). Still missing from the original PRD: **authentication** and the **admin dashboard** for managing programs, schedules, pricing, and viewing enquiries.

## Plan

### 1. Authentication route (`/auth`)
- Email + password sign-in / sign-up form (single page, toggle between modes)
- Google OAuth button
- On successful sign-in, redirect to `/admin`
- Use Supabase auth via the existing client; persist session

### 2. Admin layout + guard (`/admin`)
- Layout route with sidebar nav: Programs, Schedules, Pricing, Enquiries
- `beforeLoad` checks the session and calls `has_role(uid, 'admin')`; redirects non-admins to `/auth`
- Header shows current admin email + sign-out

### 3. Admin pages (CRUD)
- **Programs** (`/admin/programs`): table of programs with edit dialog (title, audience, outcome, problem, tools, learnings, hero headline, icon, featured toggle)
- **Schedules** (`/admin/schedules`): list batches per program with create/edit/delete (start date, end date, mode, location, seats)
- **Pricing** (`/admin/pricing`): list pricing tiers per program with create/edit/delete (name, price, currency, features, popular flag)
- **Enquiries** (`/admin/enquiries`): read-only table of leads with filter by program, mark-as-contacted toggle, WhatsApp/email quick links

All writes go through Supabase with RLS already enforcing admin-only access.

### 4. Seed first admin
- Add a SQL migration documenting how to grant the admin role to the first signed-up user (run once after the user signs up): `INSERT INTO user_roles (user_id, role) VALUES ('<uid>', 'admin')`. Surface this as a one-time instruction after `/auth` is built.

### 5. Polish
- Add `/admin` link to footer (already present as "Admin Sign In")
- Toast notifications on save/delete using sonner
- Loading + empty states on each admin table

## Technical notes

- New routes: `src/routes/auth.tsx`, `src/routes/admin.tsx` (layout), `src/routes/admin.index.tsx`, `src/routes/admin.programs.tsx`, `src/routes/admin.schedules.tsx`, `src/routes/admin.pricing.tsx`, `src/routes/admin.enquiries.tsx`
- Reuse existing `fetchProgramBySlug` patterns; add list/mutation helpers in `src/lib/programs.ts` and a new `src/lib/enquiries.ts`
- Forms: shadcn `Form` + `react-hook-form` + `zod`
- Tables: simple semantic `<table>` styled with Tailwind tokens (no new heavy deps)
- Auto-confirm email: **off** (per defaults) — users verify email before sign-in
- Google OAuth: requires the user to enable it; will prompt if needed
