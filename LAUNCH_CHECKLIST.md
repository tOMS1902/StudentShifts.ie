# StudentShifts.ie - Launch Checklist
**Your Action Items** | **Estimated Time: 6-8 hours total**

---

## 🔴 CRITICAL - Do These FIRST (Before Any Testing)

### ☐ Task 1: Rotate Database Credentials (15 minutes)

**Why:** Your MongoDB password and JWT secret are exposed in Git history. Anyone can access your database right now.

**Steps:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in → Select your cluster "Cluster0"
3. Click "Database Access" (left sidebar)
4. Find user `toms1ephens_db_user` → Click "Edit"
5. Click "Edit Password" → Click "Autogenerate Secure Password"
6. **COPY THE NEW PASSWORD** (you'll need it in step 8)
7. Click "Update User"

8. Go to [Vercel Dashboard](https://vercel.com/dashboard)
9. Select your project "studentshifts"
10. Go to "Settings" → "Environment Variables"
11. Add/Update these variables:
    ```
    MONGODB_URI = mongodb+srv://toms1ephens_db_user:NEW_PASSWORD_HERE@cluster0.xkuroka.mongodb.net/studentshifts?appName=Cluster0
    JWT_SECRET = [Click "Generate" button in Vercel or use: openssl rand -hex 32]
    NODE_ENV = production
    ```
12. Click "Save"
13. Redeploy your app (Vercel → Deployments → Click "..." → Redeploy)

**Test:** Try logging in to your app after redeployment

---

### ☐ Task 2: Remove Credentials from Git History (10 minutes)

**Why:** Even after rotating, old credentials are still in Git history.

**Steps:**
1. Open PowerShell in your project folder
2. Run these commands:
   ```powershell
   # Backup first
   git branch backup-before-cleanup
   
   # Remove .env from history
   git filter-branch --force --index-filter "git rm --cached --ignore-unmatch server/.env" --prune-empty --tag-name-filter cat -- --all
   
   # Force push (WARNING: This rewrites history)
   git push origin --force --all
   ```

3. Update your `.gitignore` to ensure `.env` is ignored:
   ```
   # Add this line if not already there
   server/.env
   .env
   ```

4. Create `server/.env.example` template:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-secret-key-here
   PORT=4000
   ```

5. Commit the example file:
   ```powershell
   git add server/.env.example .gitignore
   git commit -m "docs: add .env.example template"
   git push
   ```

**Test:** Check GitHub repo - `.env` file should not be visible in history

---

### ☐ Task 3: Enable MongoDB Backups (2 minutes)

**Why:** Prevent total data loss if something goes wrong.

**Steps:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster "Cluster0"
3. Click "Backup" tab
4. Click "Enable Cloud Backup"
5. Choose settings:
   - **Snapshot frequency:** Every 12 hours
   - **Retention:** 7 days
   - Click "Enable"

**Cost:** Free on M10+ clusters (you're on M0, so upgrade to M10 for $57/month)

**Alternative (Free):** Use `mongodump` manually:
```powershell
# Install MongoDB tools first
mongodump --uri="YOUR_MONGODB_URI" --out=./backup-$(Get-Date -Format 'yyyy-MM-dd')
```

---

## 🟠 HIGH PRIORITY - Legal Requirements (2 hours)

### ☐ Task 4: Create Privacy Policy (30 minutes)

**Why:** GDPR requirement for EU users (Ireland-based = must have).

**Steps:**
1. Go to [TermsFeed Privacy Policy Generator](https://www.termsfeed.com/privacy-policy-generator/) (FREE)
2. Fill in:
   - **Website name:** StudentShifts.ie
   - **Website URL:** https://studentshifts.ie
   - **Country:** Ireland
   - **Email:** your-email@example.com
   - **Data collected:** Email, Name, Job Applications, Messages
   - **Cookies:** Yes (for authentication)
   - **Third parties:** MongoDB Atlas, Vercel
   - **User rights:** Access, deletion, correction
3. Click "Generate"
4. Copy the generated policy
5. Create `public/privacy-policy.html` in your project
6. Paste the policy
7. Add link to footer in `App.tsx`:
   ```tsx
   <a href="/privacy-policy.html" target="_blank">Privacy Policy</a>
   ```

**Test:** Visit https://studentshifts.ie/privacy-policy.html

---

### ☐ Task 5: Create Terms of Service (30 minutes)

**Why:** Legal protection for you and users.

**Steps:**
1. Go to [TermsFeed Terms Generator](https://www.termsfeed.com/terms-conditions-generator/) (FREE)
2. Fill in:
   - **Website name:** StudentShifts.ie
   - **Website URL:** https://studentshifts.ie
   - **Country:** Ireland
   - **Type:** Marketplace (connecting students & employers)
   - **User accounts:** Yes
   - **Payments:** No (or Yes if you plan to charge)
   - **Intellectual property:** Yes
3. Click "Generate"
4. Copy the generated terms
5. Create `public/terms-of-service.html`
6. Paste the terms
7. Add link to footer in `App.tsx`:
   ```tsx
   <a href="/terms-of-service.html" target="_blank">Terms of Service</a>
   ```

**Test:** Visit https://studentshifts.ie/terms-of-service.html

---

### ☐ Task 6: Add Cookie Consent Banner (1 hour)

**Why:** GDPR requirement - must inform users about cookies.

**Steps:**
1. Install package:
   ```powershell
   npm install react-cookie-consent
   ```

2. Add to `App.tsx` (at the bottom, before closing `</Layout>`):
   ```tsx
   import CookieConsent from "react-cookie-consent";
   
   // Inside return statement, before </Layout>
   <CookieConsent
     location="bottom"
     buttonText="Accept"
     declineButtonText="Decline"
     enableDeclineButton
     cookieName="studentshifts-consent"
     style={{ background: "#2B373B" }}
     buttonStyle={{ background: "#4CAF50", color: "#fff", fontSize: "13px" }}
     declineButtonStyle={{ background: "#f44336", color: "#fff", fontSize: "13px" }}
     expires={365}
   >
     This website uses cookies to enhance your experience. See our{" "}
     <a href="/privacy-policy.html" style={{ color: "#4CAF50" }}>Privacy Policy</a>.
   </CookieConsent>
   ```

3. Build and deploy:
   ```powershell
   npm run build
   git add .
   git commit -m "feat: add cookie consent banner"
   git push
   ```

**Test:** Visit site - banner should appear at bottom

---

## 🟡 MEDIUM PRIORITY - Monitoring & Analytics (2 hours)

### ☐ Task 7: Set Up Error Tracking with Sentry (30 minutes)

**Why:** Know when things break before users complain.

**Steps:**
1. Go to [Sentry.io](https://sentry.io/signup/) → Sign up (FREE tier)
2. Create new project:
   - **Platform:** Node.js (for backend)
   - **Project name:** studentshifts-api
   - Click "Create Project"
3. **COPY THE DSN** (looks like: `https://abc123@o123.ingest.sentry.io/456`)

4. Install Sentry:
   ```powershell
   npm install @sentry/node
   ```

5. Add to `server/index.ts` (at the very top):
   ```typescript
   import * as Sentry from "@sentry/node";
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV || 'development',
     tracesSampleRate: 1.0,
   });
   
   // After app creation
   app.use(Sentry.Handlers.requestHandler());
   
   // Before error handler
   app.use(Sentry.Handlers.errorHandler());
   ```

6. Add to Vercel Environment Variables:
   ```
   SENTRY_DSN = [paste your DSN here]
   ```

7. Deploy and test by triggering an error

**Free Tier:** 5,000 errors/month

---

### ☐ Task 8: Set Up Google Analytics (15 minutes)

**Why:** Understand user behavior and traffic.

**Steps:**
1. Go to [Google Analytics](https://analytics.google.com/) → Sign in
2. Click "Start measuring"
3. Fill in:
   - **Account name:** StudentShifts
   - **Property name:** StudentShifts.ie
   - **Time zone:** Ireland
   - **Currency:** EUR
4. Click "Create" → Accept terms
5. **COPY THE MEASUREMENT ID** (looks like: `G-XXXXXXXXXX`)

6. Add to `index.html` (in `<head>` section):
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

7. Deploy:
   ```powershell
   git add index.html
   git commit -m "feat: add Google Analytics"
   git push
   ```

**Test:** Visit Google Analytics dashboard - should see real-time visitors

---

### ☐ Task 9: Set Up Uptime Monitoring (5 minutes)

**Why:** Get alerted if your site goes down.

**Steps:**
1. Go to [UptimeRobot](https://uptimerobot.com/signUp) → Sign up (FREE)
2. Click "Add New Monitor"
3. Fill in:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** StudentShifts API
   - **URL:** https://studentshifts.vercel.app/api/health
   - **Monitoring Interval:** 5 minutes
4. Click "Create Monitor"
5. Add your email for alerts

**Free Tier:** 50 monitors, 5-minute checks

---

## 🔵 OPTIONAL - Nice to Have (2 hours)

### ☐ Task 10: Set Up Image Hosting with Cloudinary (1 hour)

**Why:** If you want users to upload profile pictures or job images.

**Steps:**
1. Go to [Cloudinary](https://cloudinary.com/users/register/free) → Sign up (FREE)
2. Dashboard → Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

3. Install package:
   ```powershell
   npm install cloudinary multer
   ```

4. Add to Vercel Environment Variables:
   ```
   CLOUDINARY_CLOUD_NAME = [your cloud name]
   CLOUDINARY_API_KEY = [your API key]
   CLOUDINARY_API_SECRET = [your API secret]
   ```

5. Create `server/utils/cloudinary.ts`:
   ```typescript
   import { v2 as cloudinary } from 'cloudinary';
   
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   });
   
   export default cloudinary;
   ```

**Free Tier:** 25GB storage, 25GB bandwidth/month

---

### ☐ Task 11: Set Up Redis Caching with Upstash (1 hour)

**Why:** Speed up your API by caching job listings.

**Steps:**
1. Go to [Upstash](https://upstash.com/) → Sign up (FREE)
2. Click "Create Database"
3. Fill in:
   - **Name:** studentshifts-cache
   - **Region:** Europe (Ireland)
   - **Type:** Regional
4. Click "Create"
5. **COPY THE REDIS URL**

6. Install package:
   ```powershell
   npm install ioredis
   ```

7. Add to Vercel Environment Variables:
   ```
   REDIS_URL = [your Redis URL]
   ```

8. Create `server/utils/cache.ts`:
   ```typescript
   import Redis from 'ioredis';
   
   const redis = process.env.REDIS_URL 
     ? new Redis(process.env.REDIS_URL)
     : null;
   
   export default redis;
   ```

**Free Tier:** 10,000 commands/day

---

## 📋 Final Pre-Launch Checklist

Before going live, verify:

- [ ] All environment variables set in Vercel
- [ ] MongoDB backups enabled
- [ ] Privacy Policy accessible
- [ ] Terms of Service accessible
- [ ] Cookie consent banner working
- [ ] Sentry receiving errors (test by breaking something)
- [ ] Google Analytics tracking visitors
- [ ] UptimeRobot monitoring API
- [ ] HTTPS redirect working (try http://studentshifts.ie)
- [ ] Rate limiting working (try 6 failed logins)
- [ ] Strong password validation working (try weak password)

---

## 🎯 Quick Reference - All Your Accounts

| Service | URL | Purpose | Cost |
|---------|-----|---------|------|
| MongoDB Atlas | cloud.mongodb.com | Database | $0-57/mo |
| Vercel | vercel.com | Hosting | $0-20/mo |
| Sentry | sentry.io | Error tracking | $0-26/mo |
| Google Analytics | analytics.google.com | Analytics | Free |
| UptimeRobot | uptimerobot.com | Monitoring | Free |
| Cloudinary | cloudinary.com | Images | Free |
| Upstash | upstash.com | Caching | Free |

---

## 💡 Pro Tips

1. **Do Tasks 1-3 TODAY** - These are critical security issues
2. **Do Tasks 4-6 THIS WEEK** - Legal requirements for GDPR
3. **Do Tasks 7-9 BEFORE LAUNCH** - You need monitoring
4. **Tasks 10-11 are OPTIONAL** - Only if you need those features

**Total Time:** 6-8 hours spread over 1 week  
**Total Cost:** $0-130/month (most services have free tiers)

---

**Need Help?** Each service has excellent documentation:
- MongoDB: docs.mongodb.com
- Vercel: vercel.com/docs
- Sentry: docs.sentry.io
