# 📱 Mobile/Tablet Testing Guide

Quick guide to test your portfolio on mobile and tablet devices.

---

## 🚀 Method 1: Test on Real Device (Best)

### **Step 1: Get Your Local IP**

Run this command to find your computer's IP address:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
```

Or check manually:
- **Mac:** System Preferences → Network → Your IP (e.g., 192.168.1.5)
- **Windows:** `ipconfig` in Command Prompt
- **Linux:** `ip addr show`

### **Step 2: Start Vite with Host Exposure**

Stop the current server and restart with network access:
```bash
npm run dev -- --host
```

### **Step 3: Access on Mobile/Tablet**

1. **Connect your phone/tablet to the SAME WiFi** as your computer
2. **Open browser** on your mobile device
3. **Go to:** `http://YOUR_IP:5173`
   - Example: `http://192.168.1.5:5173`

---

## 🌐 Method 2: Browser DevTools (Quick & Easy)

### **Chrome DevTools:**

1. Open your site: `http://localhost:5173`
2. Press `F12` or right-click → Inspect
3. Click the **device toggle** icon (📱) or press `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
4. Select device:
   - iPhone 14 Pro
   - iPad Pro
   - Samsung Galaxy S20
   - Or custom size

### **Test the Slider:**
- Click and drag (simulates touch)
- Rotate device (portrait/landscape)
- Check particle effects
- Test navigation menu

---

## 🔧 Method 3: Ngrok (Share with Anyone)

Perfect for testing on devices not on your network or sharing with clients.

### **Install Ngrok:**
```bash
# Mac (via Homebrew)
brew install ngrok

# Or download from https://ngrok.com/download
```

### **Create Tunnel:**
```bash
# In a new terminal (keep dev server running)
ngrok http 5173
```

### **Access:**
- You'll get a public URL like: `https://abc123.ngrok.io`
- Open this URL on ANY device (even 4G/5G)
- Share with others for feedback!

---

## 📊 What to Test on Mobile/Tablet

### **✅ Essential Checks:**

1. **Color Grading Slider:**
   - [ ] Touch and drag works smoothly
   - [ ] Slider responds immediately
   - [ ] Videos stay synced
   - [ ] "Before" and "After" labels visible
   - [ ] No lag when dragging

2. **Particle Background:**
   - [ ] Particles are visible
   - [ ] Animations run smoothly
   - [ ] No lag or stuttering
   - [ ] Proper size (not too small)

3. **Videos:**
   - [ ] Showreel videos load
   - [ ] Long-form videos play
   - [ ] No excessive lag
   - [ ] Controls work properly

4. **Navigation:**
   - [ ] Mobile menu opens/closes
   - [ ] Smooth scroll to sections
   - [ ] All buttons responsive
   - [ ] Color Grading link works

5. **Contact Form:**
   - [ ] Form fields easy to tap
   - [ ] Keyboard doesn't break layout
   - [ ] Submit button works
   - [ ] Toast notifications appear

6. **3D Avatar:**
   - [ ] Loads properly
   - [ ] Rotates smoothly
   - [ ] Not too heavy (loads fast)

7. **Performance:**
   - [ ] Page loads in under 3 seconds
   - [ ] Smooth scrolling
   - [ ] No janky animations
   - [ ] Battery usage reasonable

---

## 📱 Device-Specific Testing

### **iPhone (Safari):**
- Test portrait AND landscape
- Check notch compatibility
- Test touch gestures
- Verify video autoplay works

### **Android (Chrome):**
- Test various screen sizes
- Check video playback
- Test hardware back button
- Verify forms work

### **iPad/Tablet:**
- Test landscape mode
- Check spacing/layout
- Verify hover states work (stylus)
- Test split-screen mode

---

## 🐛 Common Mobile Issues & Fixes

### **Issue: Slider doesn't work on mobile**
**Fix:** Already fixed with `touch-none` and proper touch events!

### **Issue: Videos don't autoplay**
**Fix:** Videos need to be muted for autoplay. Already set up correctly.

### **Issue: Particles not visible**
**Fix:** Already optimized particle size for mobile (0.25 vs 0.1)

### **Issue: Page loads slowly**
**Fix:** Compress videos using `./tmp_rovodev_compress_videos.sh`

### **Issue: Form fields hard to tap**
**Fix:** Already using proper touch targets (minimum 44x44px)

---

## 🎯 Performance Testing

### **Lighthouse Mobile Audit:**

1. Open site in Chrome
2. Press F12 → Lighthouse tab
3. Select "Mobile" device
4. Click "Analyze page load"
5. Check scores:
   - **Performance:** Aim for 90+
   - **Accessibility:** Aim for 100
   - **Best Practices:** Aim for 95+
   - **SEO:** Aim for 100

---

## 📸 Screenshot Testing

### **Take Screenshots on Different Devices:**

```bash
# Using Chrome DevTools
# 1. Open DevTools (F12)
# 2. Device toolbar (Cmd+Shift+M)
# 3. Cmd+Shift+P → "Capture screenshot"
```

Test these breakpoints:
- 320px (iPhone SE)
- 375px (iPhone 13)
- 390px (iPhone 14 Pro)
- 768px (iPad Mini)
- 820px (iPad Air)
- 1024px (iPad Pro)

---

## ⚡ Quick Mobile Test Checklist

```
Viewport & Layout:
[ ] No horizontal scrolling
[ ] Text readable without zooming
[ ] Buttons/links easy to tap (44px minimum)
[ ] Images/videos don't overflow

Interactions:
[ ] Touch targets work (not too small)
[ ] Sliders drag smoothly
[ ] Forms keyboard-friendly
[ ] Modals close properly

Performance:
[ ] Page loads < 3 seconds
[ ] Videos compressed
[ ] Smooth animations (60fps)
[ ] No layout shifts

Visual:
[ ] Particle effects visible
[ ] Colors look good
[ ] Typography readable
[ ] Spacing consistent
```

---

## 🌟 Pro Tips

1. **Test on Real Devices:** DevTools is good, but real devices reveal actual issues
2. **Test on WiFi AND 4G:** Slow connections expose performance issues
3. **Test Portrait AND Landscape:** Layout should work both ways
4. **Test Different Browsers:** Safari, Chrome, Firefox mobile
5. **Test with Low Battery:** Some devices throttle performance when battery is low

---

## 🚀 Ready to Test?

### **Quick Start:**

```bash
# 1. Stop current server (Ctrl+C)

# 2. Start with network access
npm run dev -- --host

# 3. Note the Network URL shown
# Example: Network: http://192.168.1.5:5173

# 4. Open that URL on your phone/tablet
```

---

## 📞 Need Help?

If you encounter issues:
1. Check that both devices are on the same WiFi
2. Check firewall isn't blocking port 5173
3. Try `http://` (not `https://`)
4. Restart your dev server
5. Clear mobile browser cache

---

**Happy Testing!** 🎉
