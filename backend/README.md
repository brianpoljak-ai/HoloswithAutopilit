# HolosCX backend (minimal scaffold)

This is a tiny Express backend that provides a minimal `/api/workspaces` endpoint and Supabase wiring to create workspaces.

Quickstart
1. Copy `.env.example` to `.env` and fill the Supabase values and `APP_BASE_URL`.

2. Install and run locally:

```bash
cd backend
npm install
npm run dev
```

3. Create the `workspaces` table in your Supabase Postgres using the SQL file in `../migrations/create_workspaces.sql` (via psql or Supabase SQL editor).

How to wire the marketing form
- Option 1 (recommended): Update the front-end to `fetch` POST JSON to `https://<your-backend>/api/workspaces` with `email`, `fullName`, `company`, and `planTier` fields. The endpoint returns `{ workspace, workspaceLink }`.
- Option 2: Change the `form` `action` to point to your backend and have the backend accept urlencoded posts (you'd need to add `bodyParser.urlencoded` to the server).

Notes
- This scaffold uses the Supabase service role key for simplicity; do not commit secrets.
- The endpoint currently inserts directly into `workspaces`. In production you should create a Supabase user, link `owner_user_id`, and enforce row-level security.
