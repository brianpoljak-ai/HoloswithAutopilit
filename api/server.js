import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Deprecated: moved to file-based Vercel handlers.
// Use `api/health.js` and `api/workspaces.js` instead.
export default function _deprecated(_req, res) {
  res.status(410).json({ error: 'moved', message: 'Use /api/health and /api/workspaces handlers' });
}
app.use(bodyParser.json());
