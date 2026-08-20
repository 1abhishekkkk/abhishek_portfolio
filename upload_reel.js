#!/usr/bin/env node
/**
 * Utility to compress video reel via FFmpeg, upload to Cloudflare R2, and update ShowreelSection.jsx
 * Usage:
 *   node upload_reel.js "/path/to/video.mp4" "Video Title" "brand_name" "Content Type"
 * Example:
 *   node upload_reel.js "/Users/abhishekkumar/Downloads/titan X Flipcart.mp4" "Titan X Flipkart Commercial" "titan" "Commercial"
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const R2 = {
  account_id:        '9607afcb78c5b8828b31d341254367ee',
  access_key_id:     'fa36eb2b106f6d2e604cfe9ee8302693',
  secret_access_key: 'd8386fd64358ff6c1bf3c6411c86fb04a4077a641056abd35d4cd5a499c2cebd',
  bucket_name:       'abhishek-studio-portfolio',
  public_url:        'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev',
};

// Help menu
if (process.argv.includes('--help') || process.argv.length < 3) {
  console.log(`
🎬 Abhi Clicks Studio - Reel Upload & Compression Utility
---------------------------------------------------------
Usage:
  node upload_reel.js <video_file_path> [title] [brand] [type]

Arguments:
  video_file_path : Path to the local .mp4 video file (Required)
  title           : Display title of the reel (Default: derived from filename)
  brand           : Brand category (Default: 'custom' - e.g., realme, fuse, titan, etc.)
  type            : Content type tag (Default: 'Commercial')

Example:
  node upload_reel.js "/Users/abhishekkumar/Downloads/titan X Flipcart.mp4" "Titan X Flipkart Commercial" "titan" "Commercial"
`);
  process.exit(0);
}

const inputPath = process.argv[2];
const inputTitle = process.argv[3];
const inputBrand = (process.argv[4] || 'custom').toLowerCase().replace(/\s+/g, '-');
const inputType = process.argv[5] || 'Commercial';

if (!fs.existsSync(inputPath)) {
  console.error(`❌ Error: File not found at path: ${inputPath}`);
  process.exit(1);
}

const fileBaseName = path.basename(inputPath);
const sanitizedFileName = fileBaseName.toLowerCase().replace(/[^a-z0-9._-]/g, '-');
const key = `reels/${sanitizedFileName}`;

const displayTitle = inputTitle || fileBaseName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Ensure output directory for compressed files exists
const compressedDir = path.join(__dirname, 'r2_compressed');
if (!fs.existsSync(compressedDir)) {
  fs.mkdirSync(compressedDir, { recursive: true });
}
const compressedFilePath = path.join(compressedDir, sanitizedFileName);

function compressVideo() {
  console.log(`\n🎬 Step 1: Web-Optimized FFmpeg Video Compression`);
  const origStats = fs.statSync(inputPath);
  const origMB = (origStats.size / 1024 / 1024).toFixed(2);
  console.log(`📦 Original file size: ${origMB} MB`);

  let hasFfmpeg = false;
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    hasFfmpeg = true;
  } catch {
    hasFfmpeg = false;
  }

  if (hasFfmpeg) {
    console.log(`🔄 Compressing with H.264 CRF 28, 1080p max, AAC audio...`);
    const ffmpegCmd = `ffmpeg -i "${inputPath}" -c:v libx264 -crf 28 -preset medium -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" -c:a aac -b:a 128k -movflags +faststart -y "${compressedFilePath}"`;
    try {
      execSync(ffmpegCmd, { stdio: 'inherit' });
      const compStats = fs.statSync(compressedFilePath);
      const compMB = (compStats.size / 1024 / 1024).toFixed(2);
      const savings = (100 - (compStats.size * 100 / origStats.size)).toFixed(1);
      console.log(`✅ Compression complete! Compressed size: ${compMB} MB (${savings}% reduction)`);
      return compressedFilePath;
    } catch (err) {
      console.warn(`⚠️ FFmpeg compression encountered an error. Using original file for upload.`);
      return inputPath;
    }
  } else {
    console.log(`⚠️ FFmpeg not detected. Using original file for upload.`);
    return inputPath;
  }
}

async function uploadToR2(filePathToUpload) {
  console.log(`\n☁️ Step 2: Uploading to Cloudflare R2 CDN`);
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2.account_id}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2.access_key_id, secretAccessKey: R2.secret_access_key },
  });

  const body = fs.readFileSync(filePathToUpload);
  const sizeMB = (body.length / 1024 / 1024).toFixed(2);

  console.log(`📦 Uploading '${sanitizedFileName}' (${sizeMB} MB)...`);

  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2.bucket_name, Key: key }));
    console.log(`⚠️ Note: '${key}' already exists in R2 bucket. Overwriting...`);
  } catch {
    console.log(`🚀 Uploading fresh video asset to R2 bucket...`);
  }

  await s3.send(new PutObjectCommand({
    Bucket: R2.bucket_name,
    Key: key,
    Body: body,
    ContentType: 'video/mp4',
    CacheControl: 'public, max-age=31536000',
  }));

  const publicUrl = `${R2.public_url}/${key}`;
  console.log(`✅ Upload successful! CDN URL: ${publicUrl}`);
  return publicUrl;
}

function updateShowreelSection(publicUrl) {
  console.log(`\n⚙️ Step 3: Updating Portfolio Codebase (ShowreelSection.jsx)`);
  const showreelPath = path.join(__dirname, 'src/components/ShowreelSection.jsx');
  let content = fs.readFileSync(showreelPath, 'utf8');

  // Regex to extract ALL_REELS array content
  const reelsMatch = content.match(/const ALL_REELS = \[([\s\S]*?)\];/);
  if (!reelsMatch) {
    console.error('❌ Could not parse ALL_REELS in ShowreelSection.jsx');
    return;
  }

  // Find max id
  const ids = [];
  const idRegex = /id:\s*(\d+)/g;
  let match;
  while ((match = idRegex.exec(reelsMatch[1])) !== null) {
    ids.push(parseInt(match[1], 10));
  }
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 100;

  const newReelEntry = `  {\n    id: ${nextId},\n    src: "${publicUrl}",\n    title: "${displayTitle}",\n    brand: "${inputBrand}",\n    type: "${inputType}",\n  },\n`;

  // Insert at top of ALL_REELS
  const updatedReelsArray = `const ALL_REELS = [\n${newReelEntry}${reelsMatch[1]}`;
  content = content.replace(/const ALL_REELS = \[[\s\S]*?\];/, `${updatedReelsArray}];`);

  // Check if brand is in FILTERS
  if (!content.includes(`id: "${inputBrand}"`)) {
    const filtersMatch = content.match(/const FILTERS = \[([\s\S]*?)\];/);
    if (filtersMatch) {
      const colors = ['#f59e0b', '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#06b6d4', '#f97316', '#a855f7'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const capitalizedLabel = inputBrand.charAt(0).toUpperCase() + inputBrand.slice(1);
      const newFilterEntry = `  { id: "${inputBrand}", label: "${capitalizedLabel}", color: "${randomColor}", count: ALL_REELS.filter(r => r.brand === "${inputBrand}").length },\n`;
      const updatedFiltersArray = filtersMatch[1] + newFilterEntry;
      content = content.replace(/const FILTERS = \[[\s\S]*?\];/, `const FILTERS = [${updatedFiltersArray}];`);
    }
  }

  fs.writeFileSync(showreelPath, content, 'utf8');
  console.log(`🎉 ShowreelSection.jsx updated with new reel ID ${nextId}!`);
}

async function main() {
  const uploadPath = compressVideo();
  const cdnUrl = await uploadToR2(uploadPath);
  updateShowreelSection(cdnUrl);
  console.log(`\n✨ Successfully compressed, uploaded, and integrated '${displayTitle}'!`);
}

main().catch(err => {
  console.error('❌ Pipeline failed:', err.message);
  process.exit(1);
});
