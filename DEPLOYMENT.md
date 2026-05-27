# Scissor Deployment Guide

## Overview

Scissor can be deployed to multiple platforms. This guide covers the recommended setups.

## Prerequisites

- GitHub account with your Scissor repository
- Convex account
- Clerk account
- Vercel account (recommended)

## Deployment Options

### Option 1: Vercel + Convex (Recommended)

**Advantages:**
- Zero-config deployment
- Global edge network for fast redirects
- Automatic HTTPS
- Serverless scaling

#### Step 1: Prepare Repository

```bash
# Ensure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy Convex

```bash
# Login to Convex
npx convex auth

# Deploy to production
npx convex deploy --prod
```

#### Step 3: Set Production Environment Variables

In Convex dashboard:
1. Go to Settings → Environment Variables
2. Add production variables:
   ```
   CLERK_API_KEY=your_clerk_api_key
   ```

#### Step 4: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

#### Step 5: Add Environment Variables to Vercel

In Vercel dashboard → Settings → Environment Variables:

```
VITE_CONVEX_URL=https://your-project-prod.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_live_key
VITE_SHORT_DOMAIN=https://scs.io
VITE_API_URL=https://your-domain.vercel.app
```

#### Step 6: Enable Redirects

Add `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/:slug((?!_next|api|static)[a-zA-Z0-9-]+)",
      "destination": "/api/redirect?slug=:slug",
      "permanent": false
    }
  ]
}
```

#### Step 7: Deploy

Push to main branch - Vercel will automatically deploy:

```bash
git push origin main
```

---

### Option 2: Docker Deployment

#### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy files
COPY package*.json ./
COPY . .

# Install dependencies
RUN npm ci

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "run", "preview"]
```

#### Step 2: Build and Run Locally

```bash
docker build -t scissor .
docker run -p 3000:3000 -e VITE_CONVEX_URL=... scissor
```

#### Step 3: Push to Container Registry

```bash
# Docker Hub
docker tag scissor username/scissor:latest
docker push username/scissor:latest

# Or Google Container Registry
docker tag scissor gcr.io/project-id/scissor
docker push gcr.io/project-id/scissor
```

#### Step 4: Deploy to Cloud Run (Google Cloud)

```bash
gcloud run deploy scissor \
  --image gcr.io/project-id/scissor \
  --region us-central1 \
  --set-env-vars VITE_CONVEX_URL=... \
  --allow-unauthenticated
```

---

### Option 3: AWS Deployment

#### Step 1: Create AWS Amplify App

```bash
npm install -g @aws-amplify/cli
amplify init
```

#### Step 2: Configure Amplify

```bash
amplify add hosting
amplify publish
```

#### Step 3: Add Environment Variables

In AWS Amplify Console:
1. Go to App settings → Environment variables
2. Add production variables

---

## Custom Domain Setup

### Option A: Vercel Domains

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `scs.io`)
3. Update DNS records as shown

### Option B: Existing Domain

1. Buy domain from registrar (Namecheap, GoDaddy, etc)
2. Point to Vercel:
   - Add `A` record: `76.76.19.0`
   - Add `CNAME` for www

3. In Vercel:
   - Add custom domain
   - Vercel auto-configures SSL

### Option C: Short Domain Service

For short domains like `scs.io`:

```bash
# Buy from registrar
# Point nameservers to Vercel
# Add DNS CNAME: your-project.vercel.app
```

---

## SSL/TLS Certificate

Vercel automatically issues Let's Encrypt certificates for all domains.

To verify:
```bash
# Check certificate
curl -vI https://scs.io

# Should show: "Secure"
```

---

## Performance Optimization

### 1. Enable Caching

Add to `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 2. Minify Assets

```bash
npm run build
# Vite automatically minifies
```

### 3. Enable Compression

Vercel enables gzip by default.

---

## Monitoring & Analytics

### 1. Vercel Analytics

Enable in Vercel dashboard:
1. Settings → Analytics
2. Enable Web Analytics
3. View dashboard

### 2. Convex Monitoring

In Convex dashboard:
- View API usage
- Monitor database performance
- Check function execution times

### 3. Error Tracking

Add Sentry:

```bash
npm install @sentry/react @sentry/tracing
```

**src/main.tsx:**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

---

## Security Checklist

- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set secure cookies
- [ ] Add rate limiting (implemented in Convex)
- [ ] Enable CORS properly
- [ ] Validate all inputs (implemented)
- [ ] Keep dependencies updated
- [ ] Enable two-factor auth on accounts
- [ ] Review access logs regularly

### Update Dependencies

```bash
npm outdated
npm update
npm audit fix
```

---

## Database Backups

Convex automatically backs up your data daily.

To export data:

```bash
# Via Convex CLI
npx convex data export
```

---

## Scaling Considerations

### Database
- Convex auto-scales database
- Monitor in Convex dashboard
- Adjust indexes if needed

### Storage
- Short links are small (~500 bytes)
- Click events are ~200 bytes
- 1M links = ~500MB storage (acceptable)

### Concurrent Users
- Vercel handles auto-scaling
- Functions scale serverless
- No limits with Convex

---

## Disaster Recovery

### 1. Data Loss Prevention

- Convex has automated backups
- Export data regularly:
  ```bash
  npx convex data export > backup.json
  ```

### 2. Service Degradation

- Set up monitoring alerts
- Vercel status page: status.vercel.com
- Convex status page: status.convex.dev

### 3. Emergency Rollback

```bash
# Revert to previous deploy
git revert HEAD
git push origin main
# Vercel automatically redeploys
```

---

## Cost Estimation

### Vercel (Free Tier Limits)
- 100 GB-hours bandwidth/month
- Unlimited API routes
- Perfect for starting

### Convex (Free Tier)
- 1M documents
- 1M query/mutation invocations
- Good for small-medium apps

### Clerk (Free Tier)
- 500 monthly active users
- All features included
- Upgrade as you grow

**Example:** 10k daily active users, 5M links
- Vercel: Free tier sufficient
- Convex: ~$500/month
- Clerk: ~$25/month

---

## Maintenance

### Daily
- Monitor error rates
- Check analytics

### Weekly
- Review performance metrics
- Update dependencies if needed

### Monthly
- Analyze usage patterns
- Optimize slow queries
- Review security logs

---

## Troubleshooting

### Issue: Build fails on Vercel

```bash
# Check local build first
npm run build

# Check for environment variables
npm run typecheck

# Clear Vercel cache
# In Vercel: Settings → Git → Clear build cache
```

### Issue: Redirects not working

1. Check Convex deployment
2. Verify slug in database
3. Check HTTP handler in `convex/http.ts`

### Issue: Slow analytics

1. Check Convex query performance
2. Verify database indexes
3. Consider caching results

### Issue: Rate limiting too strict

1. Increase limit in `convex/mutations.ts`
2. Adjust throttle window
3. Implement user-based limits

---

## Next Steps

1. ✅ Deploy to production
2. ✅ Set up custom domain
3. ✅ Enable monitoring
4. ✅ Configure backups
5. ✅ Plan scaling strategy

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Convex Docs:** https://docs.convex.dev
- **Clerk Docs:** https://clerk.com/docs
- **GitHub Issues:** https://github.com/yourusername/scissor/issues

---

**Happy deploying! 🚀**
