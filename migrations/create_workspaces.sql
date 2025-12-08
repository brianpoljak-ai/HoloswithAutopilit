-- SQL migration: create workspaces table
-- Run this against your Supabase Postgres instance or via psql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  slug text NOT NULL UNIQUE,
  plan text,
  owner_user_id uuid,
  owner_email text,
  created_at timestamptz DEFAULT now()
);

-- Index on owner_email for quick lookups
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_email ON public.workspaces(owner_email);
CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON public.workspaces(slug);
