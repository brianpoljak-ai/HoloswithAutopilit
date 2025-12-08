<!-- Copilot instructions for HolosCX repository -->
# HolosCX — Copilot / AI Agent Instructions

This file is a concise, action-oriented guide to help AI coding agents get productive quickly in this repository and finish the minimal, high-impact work needed to ship the product.

## Big picture (what matters)
- Product: HolosCX is a B2B SaaS AI CX platform (marketing site + self-serve app).
- Frontend: marketing site with routes `/`, `/roi`, `/onboarding` (static pages currently served on Netlify). These pages include the ROI calculator UI and onboarding guides.
- Backend (target): Supabase (Auth + Postgres) + Stripe for payments + a workspace-per-customer data model. The repo currently contains only marketing assets; backend work is in scope.

## Key files / examples to reference
- Marketing pages (live): `/`, `/roi`, `/onboarding` — copy, form names and plan fields are visible on the live site and should be used by the app.
  - Example form names: `holoscx-signup`, `holoscx-enterprise-quote` and hidden inputs like `plan` / `plan-tier` — use these when wiring server endpoints.
  - Pricing Checkout: there are Stripe payment links embedded (e.g. `https://buy.stripe.com/fZu4gs00p8LfbNhfgYfQI02`) — use Stripe Payment Links for quick checkout paths.

## Project-specific conventions & patterns (discoverable)
- Self-serve flows are prioritized: homepage → ROI → signup → create workspace (no sales call).
- Onboarding steps are intentionally short (3 steps). The UI expects a fast “create workspace” flow that accepts email, name, company and plan tier.
- Widget snippet: copy/paste before `</head>` on customer sites; keep widget script small and configurable per-workspace.

## Minimal developer workflow (straightforward, low-risk)
1. Inspect `package.json` (if present) for exact scripts. Typical commands if Node/Next project:
   - `npm install`
   - `npm run dev` (local)
   - `npm run build && npm run start` (production)
   - If using `pnpm`/`yarn`, use corresponding commands.
2. Local dev checklist (minimal):
   - Create `.env.local` with keys for Supabase and Stripe (see "Env vars" below).
   - Run `npm install` then `npm run dev` and confirm the marketing pages render.

## Environment variables (expected)
- Recommended (typical names; verify platform-specific names before committing secrets):
  - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for server-side jobs / migrations)
  - `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `DATABASE_URL` (if using a direct Postgres connection locally)

## Minimal path to completion (do as little as possible) — prioritized steps
1. Freeze the stack: pick Supabase (Auth + Postgres) + Stripe + Netlify/Vercel. Do not introduce more services.
2. Implement Auth + Workspace scaffold (high-impact, low-effort):
   - Create a `workspaces` table: `id, name, plan, owner_user_id, created_at`.
   - Implement a server route to create a workspace on signup that: creates the workspace row, links user → workspace, and returns workspace metadata.
   - Wire Supabase Auth sign-up to call this route (or use a Postgres trigger if preferred).
3. Wire the signup form(s) from the marketing site to create a workspace and send the user an email with workspace link and onboarding steps.
   - Use the existing form names (`holoscx-signup`, `holoscx-enterprise-quote`) as endpoints to accept data.
4. ROI calculator: implement a simple client-side calculator (the layout exists). Persist the user's responses in a `roi_submissions` table only if they proceed to signup — otherwise keep UI-only.
5. Payments: use Stripe Payment Links for Starter/Growth tiers for fastest path to checkout. On successful payment, mark workspace as paid and attach Stripe customer id.

## Examples and implementation notes
- Quick workspace API (pseudo): POST `/api/workspaces` body `{ email, name, company, planTier }` → creates Supabase user (if needed), workspaces row, sends onboarding email.
- Use the hidden input `plan-tier` from the signup form to decide which Stripe Payment Link to present.
- Keep enterprise flow separate: POST `/api/enterprise-quote` → validate fields and enqueue an email/CRM entry (Zoho) — do not block self-serve paths.

## Testing & deployment notes
- Locally: verify marketing pages load and that POST endpoints respond. Use `curl` or Postman to test signup endpoints.
- Deploy: keep Netlify or move to Vercel if you prefer zero-config Next.js. Netlify is OK for the static marketing site; Vercel often simplifies Next.js App Router deployments.

## What NOT to change
- Do not change the public marketing copy (homepage, ROI, onboarding) unless you're iterating copy for conversion tests.
- Avoid swapping core infra mid-work (e.g. replacing Supabase) — pick and implement, then iterate.

## What I (the human owner) expect next
- The fastest wins: (A) stable signup → workspace creation flow, (B) Stripe payment link wiring, (C) basic Supabase usage tracking (messages/queries count) and (D) send onboarding email with workspace link.

---
If anything in this file is unclear or missing (e.g., the repo has additional code or specific scripts), tell me which piece you want me to update and I will adjust the instructions before making implementation changes.
