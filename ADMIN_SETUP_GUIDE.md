# 🚀 Portfolio System & Admin Guide

This guide explains how your portfolio's backend systems work, how videos are hosted, and how to access and manage client contact form submissions.

---

## 📌 Quick Summary of Your Setup

| Feature | Provider / Method | Details |
| :--- | :--- | :--- |
| **Website Hosting** | Vercel | Live at `https://abhiclicks-studio.vercel.app` |
| **Video CDN** | Cloudflare R2 | High-speed, compressed MP4s in `reels/` |
| **Database** | Neon PostgreSQL | Stores contact form submissions safely |
| **Email Alerts** | Resend API | Sends instant email notifications to `abhishek274kumar@gmail.com` |
| **Secret Admin Dashboard** | Built-in React Modal | Hidden access via `Cmd + Shift + A` |

---

## 🤫 Secret Admin Dashboard Access

There are **NO public links** to the admin dashboard on your website. Only you can open it using any of these secret triggers:

### How to Open:
1. **Keyboard Shortcut (Fastest)**:
   - Press **`Cmd + Shift + A`** (Mac) or **`Ctrl + Shift + A`** (Windows) anywhere on `abhiclicks-studio.vercel.app`.
2. **Footer Triple-Click**:
   - Scroll to the bottom of the page and **triple-click** the copyright text: `© 2026 ABHISHEK KUMAR. ALL RIGHTS RESERVED.`
3. **Direct Secret URL**:
   - Navigate to: `https://abhiclicks-studio.vercel.app/?admin=true`
4. **Standalone Admin Page** (Backup):
   - Navigate to: `https://abhiclicks-studio.vercel.app/admin.html`

### Admin Credentials:
* **Password**: `AbhiStudio2026!`

---

## 📬 Contact Form & Email Notifications Flow

When a client submits a message on your contact form:

1. **Saved in Database**:
   - The message (Name, Email, Message, Timestamp) is inserted into your Neon PostgreSQL database table (`contacts`).
2. **Instant Email Alert**:
   - Resend automatically emails `abhishek274kumar@gmail.com` with the subject `📬 New Message from [Name]`.
   - Includes a direct **"Reply to [Name]"** button so you can reply immediately from your inbox.
3. **Viewable in Admin Modal**:
   - Open your secret Admin Dashboard to review all past and new messages in one clean list.

---

## 🎬 Video CDN & Backup Workflow (Cloudflare R2)

All high-resolution FUSE T-shirt videos are compressed using `ffmpeg` and hosted on Cloudflare R2 to ensure ultra-fast loading without heavy bandwidth costs.

### Video Directory Structure:
- Original high-res backups: `video_backups_high_res/`
- Compressed web versions: `r2_compressed/`
- Upload script: `upload_single_to_r2.js`

### Cloudflare R2 Details:
- **Bucket**: `abhishek-studio-portfolio`
- **Public Domain**: `https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev`

### How to Upload a New Video to R2:
```bash
# 1. Compress original video with ffmpeg
ffmpeg -y -i "video_backups_high_res/your-video.mp4" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart "r2_compressed/your-video.mp4"

# 2. Upload to Cloudflare R2
node upload_single_to_r2.js r2_compressed/your-video.mp4 reels/your-video.mp4
```

---

## 🔑 Environment Variables Reference (Vercel)

These environment variables are set in your Vercel project (**Settings → Environment Variables**):

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `ADMIN_PASSWORD` | Password for Admin Dashboard (`AbhiStudio2026!`) |
| `RESEND_API_KEY` | Resend API key for sending email notifications |
| `CLOUDINARY_API_KEY` | Cloudinary legacy storage API key |

---

## 🛠️ Maintenance & Troubleshooting

- **Updating the Admin Password**:
  Run this in your terminal to change the password:
  ```bash
  printf 'YourNewPasswordHere' | npx vercel env add ADMIN_PASSWORD production
  npx vercel --prod
  ```
- **Checking Live Logs**:
  Run `npx vercel logs` or check your Vercel dashboard for real-time API logs.
