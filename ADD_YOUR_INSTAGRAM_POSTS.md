# 📸 Add Your Instagram Posts - Quick Guide

Your Instagram username is now set to: **@abhi_clicks._**

The follow button and all links now point to your actual Instagram profile! 🎉

---

## 🚀 Next Step: Add Your 6 Post Images

### **Method 1: Download from Instagram** ⭐ (Recommended)

1. **Open Instagram in your browser**
   - Go to: https://instagram.com/abhi_clicks._
   - Login if needed

2. **For each post you want to show:**
   - Click on the post to open it full size
   - Right-click on the image
   - Select "Save Image As..."
   - Save with these exact names:
     ```
     ig-post-1.jpg
     ig-post-2.jpg
     ig-post-3.jpg
     ig-post-4.jpg
     ig-post-5.jpg
     ig-post-6.jpg
     ```

3. **Place all 6 images in:**
   ```
   public/images/
   ```

### **Method 2: Screenshot Your Posts** (Quick)

1. Open Instagram app on your phone
2. Go to your profile
3. Screenshot each post (crop to square)
4. Transfer to your computer
5. Rename as above
6. Place in `public/images/`

---

## 📝 Optional: Update Post Details

If you want to show real likes, comments, and captions:

Edit `src/components/InstagramFeed.jsx` (lines 16-60)

**For each post, update:**

```jsx
{
  id: 1,
  image: '/images/ig-post-1.jpg',
  likes: 245,  // ← Change to real number
  comments: 18,  // ← Change to real number
  caption: 'Your actual caption from Instagram',  // ← Your real caption
  link: 'https://instagram.com/p/POST_ID'  // ← Get from Instagram post URL
}
```

**To get post link:**
- Open post in browser
- Copy URL from address bar
- Example: `https://instagram.com/p/ABC123xyz/`

---

## ✅ Quick Checklist

- [x] Instagram username updated (@abhi_clicks._)
- [x] Follow button links to your profile
- [ ] Add 6 images to `public/images/`
- [ ] (Optional) Update likes/comments
- [ ] (Optional) Update captions
- [ ] (Optional) Update post links

---

## 🎯 File Structure

After adding images, your folder should look like:

```
public/
└── images/
    ├── color-after-1.jpg  ✅ (already there)
    ├── color-before-1.jpg  ✅ (already there)
    ├── color-after-2.jpg  ✅ (already there)
    ├── color-before-2.jpg  ✅ (already there)
    ├── ig-post-1.jpg  ← Add this
    ├── ig-post-2.jpg  ← Add this
    ├── ig-post-3.jpg  ← Add this
    ├── ig-post-4.jpg  ← Add this
    ├── ig-post-5.jpg  ← Add this
    └── ig-post-6.jpg  ← Add this
```

---

## 🔥 Test It

After adding images:

1. Go to: http://localhost:5173
2. Scroll to Instagram section
3. See your real posts!
4. Click "Follow @abhi_clicks._" button
5. Test clicking on posts

---

## 💡 Pro Tip

**Choose your best 6 posts:**
- Mix of content types (BTS, work, results)
- High engagement posts
- Show variety of your work
- Recent posts (shows you're active)

---

## 🆘 Need Help?

If you need me to:
- Help choose which posts to feature
- Download the images for you (send me screenshots)
- Update the post details
- Add more or fewer posts

Just let me know! 📸
