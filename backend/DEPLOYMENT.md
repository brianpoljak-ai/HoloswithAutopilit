# HolosCX backend deployment guide

## Quick deploy to Vercel

### 1. Prerequisites
- GitHub account
- Vercel account (free tier works)
- Push this repo to GitHub

### 2. Deploy to Vercel (3 steps)

```bash
# Step 1: Push repo to GitHub (if not already done)
git add .
git commit -m "Add Vercel config for backend deployment"
git push origin main

# Step 2: Go to https://vercel.com/new
# - Import your GitHub repo
# - Select Root Directory: backend
# - Click Deploy
```

### 3. Set environment variables on Vercel

After deployment, go to **Settings → Environment Variables** and add:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | `https://vpahgpboaflnmlykobkm.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | (from your `.env.example`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | (from your `.env.example`) |
| `APP_BASE_URL` | Base URL for workspace links | `https://your-vercel-url.vercel.app` |

**Note:** Do NOT commit `.env` to GitHub. Keep it local only.

### 4. Redeploy after setting env vars
- In Vercel dashboard, click **Deployments** → Latest → **Redeploy**
- Your backend will be live at `https://your-vercel-app.vercel.app`

### 5. Test the backend
```bash
curl -X POST https://your-vercel-app.vercel.app/api/workspaces \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test","company":"TestCo","planTier":"starter"}'
```

---

## Running locally

```bash
npm install
npm run dev
# Visit http://localhost:5000/api/health
```

## Next: Wire the marketing form
Once deployed, update `marketing/signup.js` to point to your Vercel backend:
```html
<script>window.HOLOS_BACKEND_URL='https://your-vercel-app.vercel.app'</script>
<script src="/marketing/signup.js"></script>
```
