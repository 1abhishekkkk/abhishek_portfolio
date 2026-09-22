#!/usr/bin/env node
/**
 * 🚀 Cloudinary → Cloudflare R2 Migration v3
 * - Prefers video_backups_high_res (compressed) over public/reels
 * - Skips originals subfolder (too large)
 * - Compresses files >8MB with ffmpeg before upload
 * - Uses Cloudinary signed URLs for missing videos
 */

import { v2 as cloudinary } from 'cloudinary';
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { execSync, exec } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cloudinary config
cloudinary.config({
  cloud_name: 'de6kkxnqn',
  api_key: '515117128725622',
  api_secret: 'eMV3kFt_kZiQz6PWM21o45Z0yNk',
});

// R2 config (hardcoded)
const R2 = {
  account_id:        '9607afcb78c5b8828b31d341254367ee',
  access_key_id:     'fa36eb2b106f6d2e604cfe9ee8302693',
  secret_access_key: 'd8386fd64358ff6c1bf3c6411c86fb04a4077a641056abd35d4cd5a499c2cebd',
  bucket_name:       'abhishek-studio-portfolio',
  public_url:        'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev',
};

// Source priority order (NEVER use originals subfolder)
const SOURCE_DIRS = [
  path.join(__dirname, 'video_backups_high_res'),  // primary - compressed backups
  path.join(__dirname, 'public/reels'),             // fallback
  path.join(__dirname, 'r2_downloads'),             // cloudinary downloads
];

const COMPRESS_DIR = path.join(__dirname, 'r2_compressed');
const DOWNLOAD_DIR = path.join(__dirname, 'r2_downloads');
const COMPRESS_THRESHOLD_MB = 8; // compress if > 8MB

// Videos that need re-uploading (were uploaded with wrong large version)
const FORCE_REUPLOAD = ['fuse-2-render.mp4', 'ishan-kishan.mp4'];

// All video filenames needed
const VIDEOS = [
  'fuse-2-render.mp4', 'fuse-bangalore.mp4', 'fuse-bts-final.mp4', 'ishan-kishan.mp4',
  'realme-15pro-launch-new.mp4', 'honor-brand.mp4', 'fuse-brand-edit.mp4', 'fuse-black-t.mp4',
  'fuse-violet-t.mp4', 'fuse-tiger-t.mp4', 'fuse-dragon-t.mp4', 'fuse-beetle-t.mp4',
  'fuse-white-t.mp4', 'shreyanka-x-duroflex.mp4', 'realme-11pro.mp4', 'fashion-gurav.mp4',
  'realme-16pro-plus.mp4', 'realme-16pro-plus-launch.mp4', 'oneplus-final.mp4',
  'denovoo-final.mp4', 'mono-podcast.mp4', 'muscleblaze.mp4', 'montage-trailer.mp4',
  'denovoo-longform.mp4', 'anshika-montage.mp4', 'realme-15pro-launch.mp4',
];

const SOURCE_FILES_TO_UPDATE = [
  'src/components/VideoBackground.jsx',
  'src/components/LongFormSection.jsx',
  'src/components/ShowreelSection.jsx',
  'src/portfolioData.js',
  'src/App.jsx',
].map(f => path.join(__dirname, f));

// Find local file (skip originals subfolder)
function findLocal(filename) {
  for (const dir of SOURCE_DIRS) {
    const fp = path.join(dir, filename);
    if (fs.existsSync(fp) && fs.statSync(fp).size > 50000) return fp;
  }
  return null;
}

// Compress with ffmpeg
function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const sizeBytes = fs.statSync(inputPath).size;
    const sizeMB = sizeBytes / 1024 / 1024;
    if (sizeMB <= COMPRESS_THRESHOLD_MB) {
      // Small enough, just copy
      fs.copyFileSync(inputPath, outputPath);
      return resolve({ compressed: false, sizeMB });
    }
    const cmd = `ffmpeg -y -i "${inputPath}" -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 128k -movflags +faststart "${outputPath}" 2>/dev/null`;
    exec(cmd, (err) => {
      if (err) return reject(new Error('ffmpeg failed: ' + err.message));
      const newSize = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(1);
      resolve({ compressed: true, sizeMB, newSizeMB: newSize });
    });
  });
}

// Download from URL
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        file.close(); fs.existsSync(dest) && fs.unlinkSync(dest);
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close(); fs.existsSync(dest) && fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const total = parseInt(res.headers['content-length'] || '0');
      let done = 0, lastPct = 0;
      res.on('data', c => {
        done += c.length;
        const pct = total ? Math.floor(done / total * 100) : 0;
        if (pct !== lastPct && pct % 25 === 0) {
          process.stdout.write(`\r      📥 ${pct}% (${(done/1024/1024).toFixed(1)}MB)`);
          lastPct = pct;
        }
      });
      res.pipe(file);
      file.on('finish', () => { file.close(); process.stdout.write('\r                                              \r'); resolve(dest); });
    });
    req.on('error', e => { file.close(); fs.existsSync(dest) && fs.unlinkSync(dest); reject(e); });
  });
}

// Upload to R2
async function uploadToR2(s3, filePath, key) {
  const body = fs.readFileSync(filePath);
  await s3.send(new PutObjectCommand({
    Bucket: R2.bucket_name, Key: key, Body: body,
    ContentType: 'video/mp4', CacheControl: 'public, max-age=31536000',
  }));
}

async function existsInR2(s3, key) {
  try { await s3.send(new HeadObjectCommand({ Bucket: R2.bucket_name, Key: key })); return true; }
  catch { return false; }
}

// Update source code files
function updateSourceFiles(urlMap) {
  console.log('\n📝 Updating source code...\n');
  for (const fp of SOURCE_FILES_TO_UPDATE) {
    if (!fs.existsSync(fp)) continue;
    let content = fs.readFileSync(fp, 'utf8'), changed = false;
    for (const [fn, r2url] of Object.entries(urlMap)) {
      const esc = fn.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(`https://res\\.cloudinary\\.com/[^"'\\s]*${esc}`, 'g');
      if (re.test(content)) { content = content.replace(re, r2url); changed = true; }
    }
    if (changed) { fs.writeFileSync(fp, content, 'utf8'); console.log(`   ✅ ${path.relative(__dirname, fp)}`); }
    else console.log(`   ⏭️  No changes: ${path.relative(__dirname, fp)}`);
  }
}

async function main() {
  console.log('🚀 Cloudinary → R2 Migration v3 (with compression)\n' + '='.repeat(55));

  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2.account_id}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2.access_key_id, secretAccessKey: R2.secret_access_key },
  });

  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
  fs.mkdirSync(COMPRESS_DIR, { recursive: true });

  console.log(`\n📊 Total videos: ${VIDEOS.length} | Compress threshold: ${COMPRESS_THRESHOLD_MB}MB\n`);

  const urlMap = {}, failures = [], cloudinaryOnly = [];

  for (let i = 0; i < VIDEOS.length; i++) {
    const filename = VIDEOS[i];
    const key = `reels/${filename}`;
    const r2url = `${R2.public_url}/reels/${filename}`;
    const compressedPath = path.join(COMPRESS_DIR, filename);

    console.log(`\n[${i+1}/${VIDEOS.length}] ${filename}`);

    // Check if already in R2 (skip force-reupload ones)
    const needsReupload = FORCE_REUPLOAD.includes(filename);
    if (!needsReupload && await existsInR2(s3, key)) {
      console.log(`   ⏭️  Already in R2`);
      urlMap[filename] = r2url;
      continue;
    }
    if (needsReupload) console.log(`   🔄 Force re-uploading (wrong version was uploaded)`);

    // Find local file
    let localPath = findLocal(filename);

    // If not local, try Cloudinary signed URL
    if (!localPath) {
      console.log(`   ☁️  Not local — trying Cloudinary signed URL...`);
      const dlPath = path.join(DOWNLOAD_DIR, filename);
      const publicId = `reels/${filename.replace('.mp4', '')}`;
      
      // Generate signed URL
      let signedUrl;
      try {
        signedUrl = cloudinary.url(publicId, {
          resource_type: 'video',
          sign_url: true,
          type: 'upload',
          format: 'mp4',
        });
        console.log(`   🔗 Signed URL: ${signedUrl.substring(0, 65)}...`);
        await downloadFile(signedUrl, dlPath);
        const mb = (fs.statSync(dlPath).size/1024/1024).toFixed(1);
        console.log(`   ✅ Downloaded: ${mb}MB`);
        localPath = dlPath;
      } catch(e) {
        console.log(`   ❌ Cloudinary download failed: ${e.message}`);
        cloudinaryOnly.push(filename);
        failures.push(filename);
        continue;
      }
    }

    // Compress if needed
    const sizeMB = fs.statSync(localPath).size / 1024 / 1024;
    let uploadPath = localPath;

    if (sizeMB > COMPRESS_THRESHOLD_MB) {
      process.stdout.write(`   🗜️  Compressing ${sizeMB.toFixed(1)}MB with ffmpeg...`);
      try {
        const result = await compressVideo(localPath, compressedPath);
        process.stdout.write(`\r   ✅ Compressed: ${sizeMB.toFixed(1)}MB → ${result.newSizeMB}MB          \n`);
        uploadPath = compressedPath;
      } catch(e) {
        process.stdout.write('\n');
        console.log(`   ⚠️  Compression failed, using original: ${e.message}`);
      }
    } else {
      console.log(`   📦 Size OK (${sizeMB.toFixed(1)}MB), no compression needed`);
    }

    // Upload to R2
    try {
      const finalMB = (fs.statSync(uploadPath).size/1024/1024).toFixed(1);
      process.stdout.write(`   ☁️  Uploading ${finalMB}MB to R2...`);
      await uploadToR2(s3, uploadPath, key);
      urlMap[filename] = r2url;
      process.stdout.write(`\r   ✅ Uploaded to R2! (${finalMB}MB)              \n`);
    } catch(e) {
      process.stdout.write('\n');
      console.log(`   ❌ Upload failed: ${e.message}`);
      failures.push(filename);
    }
  }

  // Update source code
  if (Object.keys(urlMap).length > 0) {
    console.log('\n' + '='.repeat(55));
    updateSourceFiles(urlMap);
  }

  // Summary
  console.log('\n' + '='.repeat(55));
  console.log(`\n📋 RESULT: ${Object.keys(urlMap).length}/${VIDEOS.length} videos on R2`);
  
  if (cloudinaryOnly.length) {
    console.log(`\n⚠️  These ${cloudinaryOnly.length} videos need MANUAL upload to R2:`);
    cloudinaryOnly.forEach(f => console.log(`   - ${f}`));
    console.log(`\n   Upload them via: Cloudflare Dashboard → R2 → ${R2.bucket_name} → Objects → Upload`);
  }

  if (Object.keys(urlMap).length > 0) {
    console.log('\n🎉 Next steps:');
    console.log('   git add -A && git commit -m "chore: migrate Cloudinary to Cloudflare R2"');
    console.log('   git push origin main');
    console.log(`\n🔗 R2 Public URL: ${R2.public_url}`);
  }
}

main().catch(console.error);
