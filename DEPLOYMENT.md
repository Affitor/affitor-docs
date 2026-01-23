# Vercel Deployment Guide for Affitor Documentation

This guide provides step-by-step instructions for deploying the Astro Starlight documentation site to Vercel.

## Prerequisites

- ✅ GitHub repository: https://github.com/tothang/affiliate-docs
- ✅ Code pushed to GitHub
- ✅ Vercel account (sign up at https://vercel.com if needed)

## Deployment Method: Vercel Dashboard (Recommended)

### Step 1: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with your GitHub account (recommended for seamless integration)

2. **Import Git Repository**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - If this is your first time, authorize Vercel to access your GitHub account
   - Search for or select: `tothang/affiliate-docs`
   - Click "Import"

### Step 2: Configure Project Settings

Vercel will auto-detect Astro and pre-fill most settings. Verify the following:

#### Build & Development Settings

- **Framework Preset**: `Astro` (auto-detected)
- **Root Directory**: `./` (leave as default)
- **Build Command**: `npm run build` (auto-filled)
- **Output Directory**: `dist` (auto-filled)
- **Install Command**: `npm install` (auto-filled)

#### Node.js Version

- **Node.js Version**: `18.x` or `20.x` (recommended)
  - This is set automatically, but you can override in Project Settings later if needed

### Step 3: Environment Variables (Optional)

For this documentation site, **no environment variables are required** for basic deployment.

If you need to add any in the future:
- Click "Environment Variables" section
- Add key-value pairs
- Select environments (Production, Preview, Development)

### Step 4: Deploy

1. Click **"Deploy"** button
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Build the site (`npm run build`)
   - Deploy to a production URL

3. **Wait for deployment** (usually 1-3 minutes)
   - You'll see real-time build logs
   - Green checkmark indicates successful deployment

4. **Access your site**
   - Vercel provides a default URL: `https://affiliate-docs-*.vercel.app`
   - Click "Visit" to preview your deployed documentation

### Step 5: Configure Custom Domain (docs.affitor.com)

#### Add Custom Domain

1. **Go to Project Settings**
   - From your project dashboard, click "Settings" tab
   - Navigate to "Domains" section

2. **Add Domain**
   - Click "Add" button
   - Enter: `docs.affitor.com`
   - Click "Add"

3. **Configure DNS Records**

   Vercel will provide DNS configuration instructions. You have two options:

   **Option A: Using Vercel Nameservers (Recommended)**
   - Vercel provides nameservers (e.g., `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
   - Go to your domain registrar (where you bought `affitor.com`)
   - Update nameservers to Vercel's nameservers
   - This gives Vercel full DNS control and automatic SSL

   **Option B: Using CNAME Record**
   - Go to your DNS provider (e.g., Cloudflare, Route53, Namecheap)
   - Add a CNAME record:
     - **Name/Host**: `docs`
     - **Value/Target**: `cname.vercel-dns.com`
     - **TTL**: Automatic or 3600
   - Save the record

4. **Verify Domain**
   - Vercel will automatically verify DNS configuration
   - This may take a few minutes to propagate
   - Once verified, you'll see a green checkmark

5. **SSL Certificate**
   - Vercel automatically provisions SSL certificates via Let's Encrypt
   - Your site will be accessible via `https://docs.affitor.com`
   - No additional configuration needed

#### Set as Primary Domain (Optional)

- In the Domains section, click the three dots next to `docs.affitor.com`
- Select "Set as Primary Domain"
- This redirects the Vercel default URL to your custom domain

## Automatic Deployments

### Production Deployments

- **Trigger**: Every push to `main` branch
- **URL**: `https://docs.affitor.com` (after custom domain setup)
- **Behavior**: Automatically builds and deploys

### Preview Deployments

- **Trigger**: Every push to non-main branches or pull requests
- **URL**: Unique preview URL (e.g., `https://affiliate-docs-git-feature-*.vercel.app`)
- **Behavior**: Creates isolated preview environment
- **Benefits**: Test changes before merging to production

## Vercel CLI (Alternative Method)

If you prefer using the command line:

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy from Terminal

```bash
cd /Users/admin/Documents/cosplay/affitor/affiliate-docs
vercel
```

Follow the prompts:
- Link to existing project or create new one
- Confirm settings
- Deploy

### Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Verification

### 1. Check Site Functionality

- ✅ Visit `https://docs.affitor.com` (or Vercel URL)
- ✅ Verify homepage loads correctly
- ✅ Test navigation through sidebar
- ✅ Check all migrated pages render properly
- ✅ Test search functionality (Pagefind)
- ✅ Verify responsive design on mobile

### 2. Check Build Logs

- Go to Vercel Dashboard → Your Project → Deployments
- Click on latest deployment
- Review build logs for any warnings or errors

### 3. Performance Check

- Run Lighthouse audit (Chrome DevTools)
- Expected scores:
  - Performance: 95-100
  - Accessibility: 95-100
  - Best Practices: 95-100
  - SEO: 95-100

## Troubleshooting

### Build Fails

**Check build logs** in Vercel dashboard for specific errors:

- **Dependency issues**: Ensure `package.json` is committed
- **Node version**: Try changing Node.js version in Project Settings
- **Build command**: Verify `npm run build` works locally

### Domain Not Working

- **DNS propagation**: Can take up to 48 hours (usually much faster)
- **Check DNS**: Use `dig docs.affitor.com` or https://dnschecker.org
- **Verify CNAME**: Should point to `cname.vercel-dns.com`

### 404 Errors

- **Output directory**: Ensure `dist` is correct in settings
- **Build output**: Check that `dist` folder is generated during build

## Vercel Project Settings

Access via: Dashboard → Your Project → Settings

### Recommended Settings

- **General**
  - Node.js Version: `20.x`
  - Framework: Astro

- **Git**
  - Production Branch: `main`
  - Auto-deploy: Enabled

- **Domains**
  - Primary: `docs.affitor.com`
  - Redirect: `www.docs.affitor.com` → `docs.affitor.com` (optional)

- **Environment Variables**
  - None required for basic setup

## Monitoring & Analytics

### Vercel Analytics (Optional)

1. Go to Project → Analytics tab
2. Enable Vercel Analytics
3. Add to `astro.config.mjs`:

```javascript
import vercel from '@astrojs/vercel/static';

export default defineConfig({
  site: 'https://docs.affitor.com',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  // ... rest of config
});
```

4. Install adapter: `npm install @astrojs/vercel`

## Summary

✅ **vercel.json** created with optimal settings  
✅ **Auto-deployment** configured for main branch  
✅ **Preview deployments** for all PRs  
✅ **Custom domain** setup instructions provided  
✅ **SSL** automatically provisioned  
✅ **Zero configuration** required for Astro  

## Next Steps

1. Import project to Vercel via dashboard
2. Deploy and verify
3. Configure custom domain `docs.affitor.com`
4. Monitor first deployment
5. Set up branch protection rules on GitHub (optional)

## Resources

- Vercel Documentation: https://vercel.com/docs
- Astro on Vercel: https://docs.astro.build/en/guides/deploy/vercel/
- Vercel CLI Docs: https://vercel.com/docs/cli
- DNS Configuration: https://vercel.com/docs/concepts/projects/domains

