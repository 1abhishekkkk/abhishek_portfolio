#!/usr/bin/env node
/**
 * Upload a single video to Cloudflare R2
 */
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';

const R2 = {
  account_id:        '9607afcb78c5b8828b31d341254367ee',
  access_key_id:     'fa36eb2b106f6d2e604cfe9ee8302693',
  secret_access_key: 'd8386fd64358ff6c1bf3c6411c86fb04a4077a641056abd35d4cd5a499c2cebd',
  bucket_name:       'abhishek-studio-portfolio',
  public_url:        'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev',
};

const filePath = process.argv[2] || 'r2_compressed/fuse-beetle-t.mp4';
const key = process.argv[3] || 'reels/fuse-beetle-t.mp4';

async function main() {
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2.account_id}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: R2.access_key_id, secretAccessKey: R2.secret_access_key },
  });

  // Check if already exists
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2.bucket_name, Key: key }));
    console.log(`⚠️  ${key} already exists in R2. Re-uploading...`);
  } catch {
    console.log(`📦 ${key} not found in R2, uploading fresh...`);
  }

  const body = fs.readFileSync(filePath);
  const sizeMB = (body.length / 1024 / 1024).toFixed(1);
  console.log(`☁️  Uploading ${sizeMB}MB to R2 as ${key}...`);

  await s3.send(new PutObjectCommand({
    Bucket: R2.bucket_name,
    Key: key,
    Body: body,
    ContentType: 'video/mp4',
    CacheControl: 'public, max-age=31536000',
  }));

  const publicUrl = `${R2.public_url}/${key}`;
  console.log(`✅ Uploaded successfully!`);
  console.log(`🔗 Public URL: ${publicUrl}`);
}

main().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
