# 🚀 Deploy to GitHub & Netlify

Complete guide to deploy your portfolio with all the new features!

---

## 📦 What's New in This Update

✅ Particle effects (mobile-optimized)
✅ Color grading section (before/after slider)
✅ Live Instagram feed (@abhi_clicks._)
✅ Contact form with database
✅ Mobile responsive improvements
✅ All features working!

---

## 🔧 Step 1: Commit to GitHub

### **If you already have a GitHub repo:**

```bash
# 1. Check current status
git status

# 2. Add all new changes
git add .

# 3. Commit with message
git commit -m "Added Instagram live feed, color grading section, mobile optimizations"

# 4. Push to GitHub
git push origin main
```

### **If you DON'T have a GitHub repo yet:**

```bash
# 1. Initialize git (if not already)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Portfolio with Instagram feed and color grading"

# 4. Create repo on GitHub
# Go to: https://github.com/new
# Create a new repository (e.g., "my-portfolio")

# 5. Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Netlify

### **Method 1: Connect GitHub Repo** ⭐ (Recommended)

1. **Go to Netlify:**
   - Visit: https://app.netlify.com/
   - Login or Sign up

2. **Import from GitHub:**
   - Click "Add new site" → "Import an existing project"
   - Click "GitHub"
   - Authorize Netlify
   - Select your repository

3. **Build Settings:**
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment Variables:**
   Click "Add environment variables" and add:
   ```
   DATABASE_URL = your_database_connection_string
   ADMIN_PASSWORD = your_admin_password
   ```

5. **Deploy!**
   - Click "Deploy site"
   - Wait 2-3 minutes
   - Done! ✅

### **Method 2: Netlify CLI** (Quick)

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Initialize
netlify init

# 4. Deploy
netlify deploy --prod
```

---

## ⚙️ Step 3: Configure Environment Variables

Your portfolio needs these for the contact form:

### **In Netlify Dashboard:**

1. Go to: **Site settings** → **Environment variables**
2. Add these variables:

```
DATABASE_URL = postgresql://YOUR_CONNECTION_STRING
ADMIN_PASSWORD = your_secure_password_here
```

3. Click **Save**
4. Redeploy: **Deploys** → **Trigger deploy** → **Deploy site**

---

## 🔍 Step 4: Verify Deployment

After deployment, check:

- [ ] Instagram feed loads (@abhi_clicks._)
- [ ] Color grading slider works
- [ ] Particle effects visible (test on mobile)
- [ ] Contact form submits
- [ ] Showreel videos play
- [ ] 3D avatar loads (if added)
- [ ] Mobile responsive
- [ ] All links work

---

## 🌍 Your Live URLs

After deployment:

- **Netlify:** `https://your-site-name.netlify.app`
- **Custom Domain:** (if you added one)
- **Admin Dashboard:** `https://your-site.com/admin.html`

---

## 📝 Quick Commands Reference

```bash
# Commit and push to GitHub
git add .
git commit -m "Update: Instagram feed and color grading"
git push origin main

# Deploy to Netlify (if using CLI)
netlify deploy --prod

# Check build locally before deploying
npm run build
npm run preview
```

---

## 🐛 Troubleshooting

### **Build fails on Netlify:**
- Check Node version (needs 18+)
- Verify `package.json` has all dependencies
- Check build logs for errors

### **Instagram feed not showing:**
- Elfsight script might be blocked
- Check browser console for errors
- Verify widget ID is correct

### **Contact form not working:**
- Add `DATABASE_URL` environment variable
- Verify database is accessible
- Check Netlify function logs

### **Videos not playing:**
- Compress videos first (use compression script)
- Check file paths are correct
- Verify videos are in `public/reels/`

---

## ✅ Deployment Checklist

Before deploying:

- [ ] All temporary files cleaned up
- [ ] Environment variables documented
- [ ] Videos compressed
- [ ] Instagram feed tested
- [ ] Mobile tested
- [ ] Contact form tested
- [ ] Database connected
- [ ] Git repository up to date

---

## 🎯 Post-Deployment

After going live:

1. **Test everything** on actual site
2. **Share your link** on social media
3. **Update Instagram bio** with portfolio link
4. **Test on multiple devices**
5. **Monitor analytics**
6. **Gather feedback**

---

## 🔄 Future Updates

To update your live site:

```bash
# 1. Make changes
# 2. Commit
git add .
git commit -m "Description of changes"

# 3. Push to GitHub
git push origin main

# 4. Netlify auto-deploys! ✅
```

Netlify will automatically rebuild and deploy when you push to GitHub!

---

## 🆘 Need Help?

If you encounter issues:
1. Check Netlify deploy logs
2. Verify environment variables
3. Test build locally first
4. Check browser console for errors

---

**Ready to deploy?** Follow Step 1 above to commit to GitHub! 🚀
