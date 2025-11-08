# Vercel Deployment Guide for BudgetGuard UI

## Prerequisites
1. Vercel account (sign up at https://vercel.com)
2. GitHub repository connected to Vercel
3. Production backend URL (where your Spring Boot service is hosted)

## Step-by-Step Deployment

### Step 1: Update Vite Config for Production
The current `vite.config.ts` uses `/app/` as base path. For Vercel, you may want to use `/` instead.

**Option A: Deploy to root path (Recommended)**
- Update `vite.config.ts` base to `/` for production builds

**Option B: Deploy to `/app/` path**
- Keep current config, but ensure Vercel routes are configured correctly

### Step 2: Prepare Environment Variables
You'll need to set these in Vercel dashboard:

**Required:**
- `VITE_API_BASE_URL` - Your production backend URL (e.g., `https://api.yourdomain.com`)

**Note:** Auth0 config is fetched from backend `/api/config` endpoint, so you don't need to set Auth0 env vars in Vercel.

### Step 3: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Git Repository**
   - Select your GitHub repository: `budget-guard-app`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - **Install Command:** `npm install` (default)

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com`
   - Select environments: Production, Preview, Development
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Step 4: Update CSP for Production Backend

After deployment, update `index.html` CSP to include your production backend URL:

```html
connect-src 'self' https://your-backend-url.com https://your-backend-url.com/* https://*.auth0.com ...
```

Then commit and push - Vercel will auto-deploy.

### Step 5: Update Auth0 Redirect URI

1. Go to Auth0 Dashboard → Applications → Your App
2. Add your Vercel URL to **Allowed Callback URLs**:
   - `https://your-app.vercel.app/app/budget/dashboard`
   - `https://your-app.vercel.app/*` (for all routes)
3. Add to **Allowed Logout URLs**:
   - `https://your-app.vercel.app/app/login`
4. Save changes

### Step 6: Update Backend Configuration

Ensure your backend `/api/config` endpoint returns the correct production URLs:
- `redirectUri`: `https://your-app.vercel.app/app/budget/dashboard`
- `baseUrl`: `https://your-backend-url.com`

## Alternative: Deploy via Vercel CLI

### Install Vercel CLI
```bash
npm install -g vercel
```

### Login to Vercel
```bash
vercel login
```

### Deploy
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Set Environment Variables via CLI
```bash
vercel env add VITE_API_BASE_URL production
# Enter your production backend URL when prompted
```

## Post-Deployment Checklist

- [ ] App loads at Vercel URL
- [ ] Login page accessible
- [ ] Auth0 redirect works correctly
- [ ] Backend API calls succeed
- [ ] CSP headers allow production backend
- [ ] All routes work (SPA routing)
- [ ] Environment variables set correctly

## Troubleshooting

### Issue: App shows blank page
- Check browser console for errors
- Verify `VITE_API_BASE_URL` is set correctly
- Check if backend is accessible from Vercel

### Issue: Auth0 redirect fails
- Verify Auth0 callback URLs include Vercel domain
- Check backend config returns correct redirect URI
- Ensure CSP allows Auth0 domains

### Issue: API calls fail
- Verify backend CORS allows Vercel domain
- Check CSP `connect-src` includes backend URL
- Verify `VITE_API_BASE_URL` environment variable

### Issue: Routes return 404
- Verify `vercel.json` has rewrite rules
- Check `vite.config.ts` base path configuration

## Custom Domain Setup (Optional)

1. In Vercel dashboard, go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Auth0 redirect URIs with custom domain
5. Update backend config with custom domain

## Continuous Deployment

Vercel automatically deploys on every push to:
- `main` branch → Production
- Other branches → Preview deployments

No additional configuration needed if GitHub is connected!

