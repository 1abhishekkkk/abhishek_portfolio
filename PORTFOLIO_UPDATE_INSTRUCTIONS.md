# 🚀 Portfolio Content Update Instructions

## ✅ What's Been Set Up

Your portfolio now uses a **centralized configuration system**! All your content is managed from one place: `src/portfolioData.js`

### 📁 New File Structure:
```
src/
├── portfolioData.js          # ← All your content here!
├── App.jsx                   # ← Now uses portfolioData
├── Avatar3D.jsx             # ← Your 3D avatar system
└── ...

public/
├── portfolio/
│   ├── photos/              # ← Put your photos here
│   ├── videos/              # ← Put your videos here
│   └── thumbnails/          # ← Put video thumbnails here
└── models/                  # ← Put 3D avatar files here

update-portfolio.js          # ← Interactive update script
```

---

## 🎯 How to Replace Content

### **Method 1: Quick Manual Update**
1. Open `src/portfolioData.js`
2. Update the `projects` array with your content:

```javascript
{
  id: 1,
  title: "Your Amazing Photo",           // ← Change this
  category: "photography",               // photography/video/color
  image: "/portfolio/photos/photo1.jpg", // ← Your image path
  desc: "Description of your work",      // ← Your description
  tags: ["Portrait", "Studio", "Art"]    // ← Your tags
}
```

### **Method 2: Interactive Script**
```bash
node update-portfolio.js
```
This script helps you:
- Update personal information
- Add new projects
- Check file structure
- View current portfolio
- Update social media links

---

## 📸 Adding Your Content

### **Step 1: Prepare Your Files**
```bash
# Create folders if they don't exist
mkdir -p public/portfolio/{photos,videos,thumbnails}

# Add your files
cp your-photo1.jpg public/portfolio/photos/
cp your-video1.mp4 public/portfolio/videos/
cp your-thumb1.jpg public/portfolio/thumbnails/
```

### **Step 2: Update portfolioData.js**
Replace the projects array with your content:

```javascript
projects: [
  {
    id: 1,
    title: "My Awesome Portrait Session",
    category: "photography", 
    image: "/portfolio/photos/your-photo1.jpg",
    desc: "Beautiful natural light portraits for a local model",
    tags: ["Portrait", "Natural Light", "Studio"],
    client: "Model Agency XYZ",
    location: "Mumbai, India",
    camera: "Sony A7IV"
  },
  {
    id: 2,
    title: "Wedding Highlight Reel",
    category: "video",
    videoSrc: "/portfolio/videos/your-video1.mp4",
    thumbnail: "/portfolio/thumbnails/your-thumb1.jpg",
    desc: "Emotional wedding highlight showcasing the couple's special day",
    duration: "2:30",
    tags: ["Wedding", "Cinematic", "Love Story"],
    client: "Raj & Priya",
    location: "Goa, India"
  }
]
```

### **Step 3: Update Personal Info**
```javascript
personal: {
  name: "YOUR NAME",                    // ← Your name
  tagline: "YOUR TAGLINE",              // ← Your tagline  
  fullName: "Your Full Name",           // ← Full name
  profession: "Your profession title",   // ← What you do
  description: "Your bio description",   // ← About you
  email: "your@email.com",              // ← Your email
  phone: "+91 your number",             // ← Your phone
  whatsapp: "91xxxxxxxxxx",             // ← WhatsApp number
  availability: "Available for work"     // ← Your status
}
```

---

## 🎨 Content Categories

### **Photography Projects**
```javascript
{
  id: 1,
  title: "Project Name",
  category: "photography",
  image: "/portfolio/photos/image.jpg",  // Required
  desc: "Project description",
  tags: ["Style", "Type", "Mood"],
  // Optional fields:
  client: "Client Name",
  location: "Location",
  camera: "Camera Used",
  lens: "Lens Used"
}
```

### **Video Projects**
```javascript
{
  id: 2, 
  title: "Video Project",
  category: "video",
  videoSrc: "/portfolio/videos/video.mp4",     // Required
  thumbnail: "/portfolio/thumbnails/thumb.jpg", // Required
  desc: "Video description", 
  duration: "1:30",                            // Required
  tags: ["Style", "Type", "Mood"],
  // Optional fields:
  client: "Client Name",
  location: "Location"
}
```

### **Color Grading Projects**  
```javascript
{
  id: 3,
  title: "Color Grading Project",
  category: "color",
  videoSrc: "/portfolio/videos/graded.mp4",
  thumbnail: "/portfolio/thumbnails/thumb.jpg", 
  desc: "Color grading description",
  duration: "0:45",
  palette: ['#color1', '#color2', '#color3'],  // Color swatches
  tags: ["Cinematic", "Moody", "Commercial"],
  software: "DaVinci Resolve"                  // Optional
}
```

---

## 🛠️ Quick Commands

```bash
# Run the interactive updater
node update-portfolio.js

# Start development server
npm run dev

# Check if everything works
npm run lint

# Build for production  
npm run build
```

---

## ✨ Pro Tips

1. **Optimize Images**: Keep photos under 2MB, use WebP format if possible
2. **Optimize Videos**: Compress videos for web, keep under 10MB for previews
3. **Consistent Naming**: Use descriptive filenames like `portrait-session-2024.jpg`
4. **Backup Originals**: Keep high-res originals separately
5. **Test Loading**: Check how fast your content loads on different devices

---

## 🔧 Troubleshooting

**Images not showing?**
- Check file paths are correct
- Ensure files are in `public/portfolio/` folders
- Check browser developer tools for 404 errors

**Videos not playing?**
- Use MP4 format with H.264 codec
- Check file size (under 10MB recommended)
- Ensure browser supports the video format

**Need Help?**
- Run `node update-portfolio.js` and choose option 6 to check file structure
- Check the browser console for any error messages
- Verify all file paths in `portfolioData.js` are correct

---

## 🎉 You're All Set!

Your portfolio now has a professional content management system. Simply update `portfolioData.js` and your entire website updates automatically!

**Ready to add your content?** Start with 2-3 of your best projects and expand from there. Quality over quantity! 🚀