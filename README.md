# SwiftShip — Logistics & Courier Platform

A sophisticated full-stack shipping/logistics web app built with **Next.js 14 (App Router)**, **Supabase** (Postgres, Auth, Realtime), **Tailwind CSS** and **Leaflet.js**. Customers book and track shipments, agents update deliveries, and admins manage the whole operation — with live map tracking, auto-generated waybills, notifications and dark/light mode.

## Features

- 🔐 **Auth** — email/password registration & login (Supabase Auth), role-based access (`customer` / `agent` / `admin`).
- 📦 **Booking & instant quotes** — distance/weight/service pricing computed deterministically on client and server.
- 🗺️ **Real-time tracking** — interactive Leaflet map (OpenStreetMap tiles, free) with origin/current/destination markers, live status via Supabase Realtime.
- 🧾 **Waybill & invoice** — print/PDF-ready document with barcode and itemized charges.
- 🛎️ **Notifications** — auto-created on every status change (DB trigger), with unread badges and realtime updates.
- 🚚 **Agent assignment** — admins dispatch shipments to delivery agents; agents get a deliveries queue.
- 🛠️ **Admin panel** — platform stats, shipment management, user/role administration, settings.
- 🌗 **Dark/light mode**, responsive, courier-brand UI.
- 🌍 **Public tracking** — anyone can track by number, no account required (privacy-masked).

## Roles & the end-to-end flow

Every new signup is a **customer** by default; `agent` and `admin` are elevated roles you grant via SQL (`update profiles set role = '…'`). The three roles see different shells of the same app:

| Role | Sees | Can do |
| --- | --- | --- |
| **Customer** (default) | Overview · My Shipments · Book Shipment · Notifications · Profile | Book shipments, track them on the live map, view waybills/invoices. RLS scopes every query to their own rows. |
| **Agent** | The above **+ My Deliveries** | Advance the status of shipments assigned to them; add location scans. |
| **Admin** | The above **+ Administration** (All Shipments, Users & Agents, Settings) | Assign shipments to agents, change user roles, export CSV, delete shipments. |

**How they connect:** a **customer** books a shipment → an **admin** assigns it to an **agent** → the **agent** advances its status → a Postgres trigger logs a tracking event *and* notifies the customer, who watches it move in real time. To experience the customer side, just register a fresh account — it starts as a plain customer.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev
```

### 1. Create a Supabase project

At [app.supabase.com](https://app.supabase.com), create a project and copy the **Project URL**, **anon key** and **service_role key** into `.env.local`.

### 2. Apply the schema

Open the Supabase **SQL Editor** and run the contents of [`supabase/schema.sql`](supabase/schema.sql). This creates tables, enums, RLS policies, and triggers (auto profile creation, status logging, notifications, realtime).

### 3. Run

`npm run dev` → http://localhost:3000

### Create an admin / agent

Register a normal account, then in the SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Agents (role `agent`) appear in the admin assignment dropdown.

### (Optional) Load demo data

After registering at least one account, run [`supabase/seed.sql`](supabase/seed.sql) in the SQL editor to populate four sample shipments (delivered, in-transit, pending, out-for-delivery) with full tracking history and map coordinates — handy for demos and screenshots. It's safe to re-run.

To demo the **agent assignment → delivery queue** flow, register a second account, then run [`supabase/seed-agent.sql`](supabase/seed-agent.sql) (set the email at the top) — it promotes that account to `agent` and assigns the demo shipments to it.

## Architecture

See [`CLAUDE.md`](CLAUDE.md) for an architecture deep-dive. Highlights:

- **Three Supabase clients** (`lib/supabase/`): browser, server (cookie-based), and service-role admin. Route protection lives in `middleware.ts`.
- **Server Actions** in `lib/actions/` for all mutations; server components guard with `lib/auth.ts`.
- **Database-driven side effects**: changing `shipments.status` automatically logs a tracking event and notifies the customer via Postgres triggers.
- **Maps** are loaded client-only via `next/dynamic` (`components/map/map-view.tsx`).

## Deploy to Vercel

1. Push to GitHub and import the repo into [Vercel](https://vercel.com/new).
2. Add the env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL` to your production URL).
3. In Supabase **Auth → URL Configuration**, add `https://your-app.vercel.app/auth/callback` as a redirect URL.
4. Deploy.

## Tech

Next.js 14 · React 18 · TypeScript · Supabase · Tailwind CSS · Leaflet / react-leaflet · lucide-react · sonner · next-themes
