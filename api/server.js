import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

export const app = express();

app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing SUPABASE keys; endpoint will still accept requests but DB calls will fail. Fill .env with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '', { auth: { persistSession: false } });

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Minimal workspace creation endpoint
// Expects JSON: { email, fullName, company, planTier }
app.post('/api/workspaces', async (req, res) => {
  const { email, fullName, company, planTier } = req.body || {};

  if (!email) return res.status(400).json({ error: 'email is required' });

  const workspaceName = company || `${fullName?.split(' ')[0] || 'Workspace'}'s Workspace`;
  // Generate a URL-safe slug from company or name + random suffix
  const slugBase = (company || fullName || 'ws').toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
  const slug = `${slugBase}-${Math.random().toString(36).substring(2, 8)}`;

  try {
    // Insert into workspaces table. Requires the table/migration created in migrations/create_workspaces.sql
    if (supabaseUrl && supabaseKey) {
      const insertRow = {
        name: workspaceName,
        slug: slug,
        plan: planTier || 'free'
      };

      const { data, error } = await supabase.from('workspaces').insert([insertRow]).select().limit(1);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ error: 'db_insert_failed', details: error.message });
      }

      const workspace = data?.[0];
      const workspaceLink = `${process.env.SUPABASE_SERVICE_ROLE_KEY || 'http://localhost:3000'}/app/${workspace?.slug || ''}`;

      // TODO: create Supabase user and link owner_user_id (optional)

      return res.status(201).json({ workspace, workspaceLink });
    }

    // Fallback response when Supabase not configured
    return res.status(201).json({ workspace: { id: slug, name: workspaceName, slug: slug, plan: planTier || 'free', owner_email: email }, workspaceLink: `${process.env.APP_BASE_URL || 'http://localhost:3000'}/app/${slug}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// Export app for Vercel serverless
export default app;
