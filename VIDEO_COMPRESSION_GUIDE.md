# 🎬 Video Compression Guide

Your portfolio videos are currently **1.2 GB total** which causes lag and slow loading. This guide will help you compress them to ~150-200 MB total (80-90% reduction) while maintaining excellent quality!

---

## 📋 Quick Start

### Step 1: Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt install ffmpeg
```

**Windows:**
- Download from: https://ffmpeg.org/download.html
- Or use Chocolatey: `choco install ffmpeg`

### Step 2: Run the Compression Script

**Option A: Compress ALL videos at once** ⭐ (Recommended)
```bash
./tmp_rovodev_compress_videos.sh
```

This will:
- ✅ Backup all originals to `public/reels/originals/`
- ✅ Compress all videos automatically
- ✅ Replace files with compressed versions
- ✅ Show you the size savings

**Option B: Compress ONE video at a time**
```bash
# Compress a single video
./tmp_rovodev_compress_single.sh public/reels/oneplus-final.mp4

# Or specify output filename
./tmp_rovodev_compress_single.sh public/reels/oneplus-final.mp4 public/reels/oneplus-final-web.mp4
```

---

## 📊 Expected Results

| Video | Before | After | Savings |
|-------|--------|-------|---------|
| oneplus-final.mp4 | 392 MB | ~40 MB | 90% |
| montage-trailer.mp4 | 179 MB | ~20 MB | 89% |
| realme-16pro-plus-launch.mp4 | 140 MB | ~15 MB | 89% |
| realme-16pro-plus.mp4 | 136 MB | ~15 MB | 89% |
| realme-16pro-launch.mp4 | 62 MB | ~7 MB | 89% |
| fuse-bts-final.mp4 | 13 MB | ~2 MB | 85% |
| realme-11pro.mp4 | 12 MB | ~2 MB | 83% |
| Others | 4-9 MB | ~1-2 MB | 80% |

**Total: 1.2 GB → ~150 MB** 🎉

---

## ⚙️ Compression Settings Explained

The script uses these optimized settings:

- **CRF 28**: Perfect balance of quality/size for web (lower = better quality but larger)
- **H.264 codec**: Best compatibility across all browsers/devices
- **AAC audio**: 128kbps (excellent quality for music/speech)
- **Max 1080p**: Scales down 4K/2K videos to 1080p (perfect for web)
- **Fast start**: Videos start playing while downloading
- **2-pass encoding**: Better quality distribution

---

## 🎯 Manual Compression (Advanced)

If you want to compress manually:

### High Quality (70-80% reduction):
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow \
  -vf "scale='min(1920,iw)':'min(1080,ih)'" \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### Balanced (80-90% reduction): ⭐ **Recommended**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset medium \
  -vf "scale='min(1920,iw)':'min(1080,ih)'" \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

### Maximum Compression (90-95% reduction):
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 32 -preset fast \
  -vf "scale='min(1280,iw)':'min(720,ih)'" \
  -c:a aac -b:a 96k -movflags +faststart output.mp4
```

---

## 🚀 After Compression

Once videos are compressed:

1. ✅ Test them locally: `npm run dev`
2. ✅ Videos should load 5-10x faster
3. ✅ Smooth playback even on mobile
4. ✅ Much less bandwidth usage

---

## 🔙 Restore Originals

If you need to restore original videos:

```bash
# Restore all
cp public/reels/originals/* public/reels/

# Restore one file
cp public/reels/originals/oneplus-final.mp4 public/reels/
```

---

## 💡 Pro Tips

1. **Quality Check**: Always preview compressed videos before deploying
2. **Mobile First**: Test on mobile - if it looks good there, it's perfect
3. **Batch Processing**: Compress all at once, saves time
4. **Keep Backups**: Originals are saved automatically
5. **Re-compression**: Don't compress already compressed videos (quality loss)

---

## ⚡ Quick Commands Reference

```bash
# Compress all videos
./tmp_rovodev_compress_videos.sh

# Compress one video
./tmp_rovodev_compress_single.sh public/reels/video.mp4

# Check FFmpeg installation
ffmpeg -version

# Check video info
ffmpeg -i public/reels/video.mp4

# Restore originals
cp public/reels/originals/* public/reels/
```

---

## 🆘 Troubleshooting

**"Command not found: ffmpeg"**
- Install FFmpeg (see Step 1)

**"Permission denied"**
```bash
chmod +x tmp_rovodev_compress_videos.sh
```

**"Quality is too low"**
- Edit script and change `crf 28` to `crf 23` (higher quality, larger size)

**"Taking too long"**
- Change `preset medium` to `preset fast` (faster but slightly larger files)

---

## 🎬 Ready to Compress?

Run this command now:

```bash
./tmp_rovodev_compress_videos.sh
```

It will take 10-20 minutes depending on your computer, but your portfolio will load **10x faster**! ⚡

---

**Need help?** Let me know if you run into any issues!
