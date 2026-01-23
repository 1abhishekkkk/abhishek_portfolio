# 📸 Instagram Feed Setup Guide

Your portfolio now has a beautiful Instagram feed section! Here's how to customize and use it.

---

## ✅ What's Been Added

### **Instagram Feed Section Features:**
- 📱 **6-post grid** (2 columns mobile, 3 desktop)
- 💜 **Instagram gradient** theme (purple, pink, orange)
- ❤️ **Hover effects** showing likes and comments
- 🔗 **Click to view** on Instagram
- 📲 **Follow button** with your Instagram handle
- ✨ **Smooth animations** on scroll
- 📊 **Stats overlay** (likes, comments)

---

## 🎯 Quick Setup (5 Minutes)

### **Step 1: Update Your Instagram Username**

Edit `src/components/InstagramFeed.jsx` (line 10):

```jsx
// Change this:
const instagramUsername = 'your_instagram_username';

// To your actual username:
const instagramUsername = 'abhishek_photography';
```

### **Step 2: Add Your Instagram Post Images**

**Option A: Use Screenshots (Quick)**
1. Go to your Instagram profile
2. Screenshot your 6 latest posts
3. Crop each post to square
4. Save as: `ig-post-1.jpg`, `ig-post-2.jpg`, etc.
5. Place in: `public/images/`

**Option B: Download from Instagram (Better)**
1. Open each Instagram post in browser
2. Right-click image → "Save image as"
3. Rename to: `ig-post-1.jpg` through `ig-post-6.jpg`
4. Place in: `public/images/`

### **Step 3: Update Post Details**

Edit the `instagramPosts` array in `InstagramFeed.jsx` (lines 16-60):

```jsx
const instagramPosts = [
  {
    id: 1,
    image: '/images/ig-post-1.jpg',
    likes: 245,              // ← Update with real likes
    comments: 18,            // ← Update with real comments
    caption: 'Your caption here',  // ← Your actual caption
    link: 'https://instagram.com/p/YOUR_POST_ID'  // ← Real post link
  },
  // ... repeat for all 6 posts
];
```

---

## 🚀 How to Get Real Instagram Post Links

### **Method 1: From Instagram App**
1. Open post in Instagram app
2. Tap the three dots (•••)
3. Select "Copy Link"
4. Paste into the `link` field

### **Method 2: From Browser**
1. Open post in browser
2. Copy URL from address bar
3. Should look like: `https://instagram.com/p/ABC123xyz`

---

## 🎨 Customization Options

### **Change Number of Posts**

Want to show more or fewer posts? Just add/remove items from the array!

**Show 9 posts:**
```jsx
const instagramPosts = [
  // ... 9 posts instead of 6
];
```

**Show 3 posts:**
```jsx
const instagramPosts = [
  // ... just 3 posts
];
```

### **Change Grid Layout**

Edit the grid classes (line 84):

```jsx
// Current: 2 columns mobile, 3 desktop
className="grid grid-cols-2 md:grid-cols-3 gap-4"

// Option: 1 column mobile, 4 desktop
className="grid grid-cols-1 md:grid-cols-4 gap-4"

// Option: 3 columns mobile, 6 desktop
className="grid grid-cols-3 md:grid-cols-6 gap-4"
```

### **Change Colors**

The section uses Instagram's gradient theme. To customize:

```jsx
// Header gradient (line 59)
from-purple-400 via-pink-400 to-orange-400

// Change to:
from-amber-400 via-orange-400 to-red-400  // Warm
from-blue-400 via-cyan-400 to-teal-400    // Cool
from-red-400 via-pink-400 to-rose-400     // Pink theme
```

---

## 🔥 Live Instagram Feed Integration

Want **automatic updates** without manual work? Here are your options:

### **Option 1: Instagram Embed Widget** (Easiest)
Use Instagram's official embed widget.

**Services:**
- **EmbedSocial** - https://embedsocial.com/
- **SnapWidget** - https://snapwidget.com/
- **Juicer** - https://www.juicer.io/

**Setup:**
1. Create account
2. Connect Instagram
3. Get embed code
4. Add to your site

### **Option 2: Instagram API** (Most Powerful)
Official Instagram Graph API.

**Requirements:**
- Facebook Developer account
- Instagram Business account
- API access token

**Steps:**
1. Create Facebook App
2. Get Instagram Basic Display API access
3. Generate access token
4. Fetch posts via API
5. Display in your component

### **Option 3: Third-Party Services** (Recommended)
Services that handle the complexity:

**Best Options:**
- **Behold** - https://behold.so/ (Simple, works great)
- **Curator** - https://curator.io/
- **Flockler** - https://flockler.com/

**Pros:**
- No coding needed
- Auto-updates
- Handles Instagram API changes
- Multiple social platforms

---

## 📱 Current Features

### **Hover Effects:**
- Show likes and comments
- Display caption
- Instagram icon appears
- "View on Instagram" link

### **Responsive:**
- 2 columns on mobile
- 3 columns on tablet/desktop
- Square aspect ratio maintained
- Touch-friendly

### **Animations:**
- Fade in on scroll
- Staggered entry (one by one)
- Hover scale effect
- Smooth transitions

---

## 💡 Pro Tips

### **1. Use High-Quality Images**
- Square format (1080x1080)
- Clear, well-lit photos
- Consistent style

### **2. Keep Posts Fresh**
- Update every week or two
- Show variety (BTS, work, process)
- Mix video thumbnails with photos

### **3. Match Your Brand**
- Consistent color grading
- Similar editing style
- On-brand content

### **4. Optimize Images**
- Compress images (use TinyPNG)
- Aim for under 200KB each
- Faster loading = better UX

---

## 🎯 Best Practices

### **What to Show:**
- ✅ Behind-the-scenes content
- ✅ Latest projects
- ✅ Client work
- ✅ Process videos
- ✅ Equipment shots
- ✅ Before/after comparisons

### **What to Avoid:**
- ❌ Low-quality screenshots
- ❌ Irrelevant personal photos
- ❌ Inconsistent style
- ❌ Too much text on images

---

## 🔗 Add to Navigation (Optional)

Want a menu link to Instagram section? Edit `src/App.jsx`:

```jsx
<button 
  onClick={() => scrollToSection('instagram')} 
  className="px-4 py-2 text-neutral-300 hover:text-purple-400..."
>
  <Instagram size={14} /> Instagram
</button>
```

And add ID to the section in `InstagramFeed.jsx`:

```jsx
<section id="instagram" className="py-24 px-6...">
```

---

## 📊 Track Engagement

### **Benefits of Instagram Section:**
- Increases Instagram followers
- Shows you're active
- Provides social proof
- Fresh content always
- Drives traffic both ways

### **Track Results:**
- Instagram insights (follower growth)
- Click-through rate from portfolio
- Time on page
- Scroll depth

---

## 🚨 Troubleshooting

### **Images Not Showing:**
- Check file paths are correct
- Ensure images are in `public/images/`
- Check console for errors
- Verify image names match exactly

### **Links Not Working:**
- Ensure Instagram username is correct
- Check post links are valid
- Test links in browser first

### **Layout Issues:**
- Clear browser cache
- Check responsive design
- Test on multiple devices

---

## 🎨 Example Setup

Here's a complete example for one post:

```jsx
{
  id: 1,
  image: '/images/ig-post-1.jpg',
  likes: 1247,
  comments: 89,
  caption: 'Behind the scenes of our latest commercial shoot! 🎬✨ #cinematography #bts',
  link: 'https://instagram.com/p/ABC123xyz'
}
```

---

## ✅ Quick Checklist

Before going live:

- [ ] Updated Instagram username
- [ ] Added 6 post images to `public/images/`
- [ ] Updated likes, comments for each post
- [ ] Added real captions
- [ ] Added correct Instagram post links
- [ ] Tested all links work
- [ ] Images load properly
- [ ] Hover effects work
- [ ] Mobile responsive
- [ ] Follow button works

---

## 🚀 Next Steps

After setup:

1. **Test on mobile** - Ensure touch works
2. **Check loading speed** - Compress images if needed
3. **Update regularly** - Keep content fresh
4. **Monitor clicks** - See engagement
5. **Consider live feed** - Automatic updates

---

**Need help?** Let me know if you want to:
- Set up automatic live feed
- Add more posts
- Customize design
- Add video support
- Integrate with API
