# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm start        # Serve the production build
npm run lint     # next lint (eslint-config-next)
```

There is no test suite. Verify changes by running `npm run dev` and exercising the flow in the browser.

### Environment

Copy `.env.example` to `.env.local` and fill in Supabase keys. The app will not boot without `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. `SUPABASE_SERVICE_ROLE_KEY` is required for the **public tracking** lookup and admin server actions — it is server-only and must never be referenced in a Client Component.

### Database

`supabase/schema.sql` is the single source of truth for the schema. Run it in the Supabase SQL editor on a fresh project. It defines enums, tables, RLS policies, and **triggers that drive core behavior** — re-run it after editing. To grant admin/agent rights there is no UI; update `profiles.role` directly in SQL.

## Architecture

Next.js 14 **App Router** + Supabase (Postgres/Auth/Realtime) + Tailwind. TypeScript throughout, path alias `@/*` → repo root.

### Supabase client boundary (important)

Three distinct clients in `lib/supabase/` — pick by execution context:
- `client.ts` → `createClient()` for **Client Components** (anon key, browser).
- `server.ts` → `createClient()` for Server Components / Actions / Route Handlers (reads auth via `cookies()`). Same file's `createAdminClient()` uses the service-role key and **bypasses RLS** — only use in trusted server paths.
- `middleware.ts` → `updateSession()` refreshes the auth cookie on every request and is the **only** place route protection lives (redirects `/dashboard` & `/admin` when signed out). The root `middleware.ts` just calls it.

### Auth & authorization model

- Sign-up/in/out are Server Actions in `lib/actions/auth.ts` (used with `useFormState`). A Postgres trigger (`handle_new_user`) auto-creates the `profiles` row.
- Server components guard themselves with `lib/auth.ts`: `requireProfile()` (redirects if anon) and `requireAdmin()` (redirects non-admins). Roles are `customer | agent | admin`.
- Authorization is enforced in **two layers that must stay in sync**: RLS policies in `schema.sql` (`is_admin()` / `is_agent()` SQL helpers) AND the `requireProfile/requireAdmin` guards. Changing who can see what means editing both.

### Database-driven side effects

Status changes are **not** orchestrated in app code. The `log_status_change` trigger fires on shipment insert/status-update and automatically (1) writes a `tracking_events` row and (2) creates a `notifications` row for the sender. When changing a shipment's status, just update `shipments.status`; the timeline and notification follow. Realtime is enabled on `shipments`, `tracking_events`, `notifications`.

### Domain conventions

- `lib/types.ts` mirrors the DB enums; `lib/constants.ts` holds the canonical status/service metadata (`STATUS_META`, `STATUS_FLOW`, `SERVICE_META`, `PRICING`) used by both UI and pricing. `lib/utils.ts` has `calculateQuote()` (must stay deterministic — runs on client preview and server save), `haversineKm()`, tracking/invoice number generators.
- Public tracking (`/track/[tracking]`) is unauthenticated: `lib/actions/tracking.ts#getPublicTracking` uses the admin client but returns only a curated, masked subset of fields. Never widen it to leak full shipment rows.

### Maps (Leaflet)

Leaflet touches `window`, so the real map (`components/map/tracking-map.tsx`) is **only** imported through `components/map/map-view.tsx` via `next/dynamic` with `ssr: false`. Always render maps through `MapView`, never import `tracking-map` directly into a server component.

### Routing layout

Route groups separate chrome: `app/(auth)` (login/register, split-screen layout), `app/dashboard` (customer/agent shell), `app/admin` (admin shell), plus public `app/`, `app/track`. Dark/light mode via `next-themes` (`class` strategy); shared styled primitives (`.btn-primary`, `.card`, `.input`, `.badge`) live in `app/globals.css`.
