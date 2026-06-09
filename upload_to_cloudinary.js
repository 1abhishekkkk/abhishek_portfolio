import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

const CLOUD_NAME = 'de6kkxnqn';
const API_KEY = '639198366737851';
const API_SECRET = 'SEE1hB_CGi8_ejqPgbOStEz720w';

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
});

const backupDir = './video_backups_high_res';
const portfolioFilePath = './src/portfolioData.js';
const showreelFilePath = './src/components/ShowreelSection.jsx';


function updatePortfolioData(urlMap) {
  console.log('Updating portfolioData.js with new URLs...');
  if (fs.existsSync(portfolioFilePath)) {
    let content = fs.readFileSync(portfolioFilePath, 'utf8');

    Object.entries(urlMap).forEach(([filename, url]) => {
      const regex = new RegExp(`videoSrc:\\s*["'][^"']*${filename}["']`, 'g');
      content = content.replace(regex, `videoSrc: "${url}"`);
    });

    fs.writeFileSync(portfolioFilePath, content);
    console.log('🚀 portfolioData.js updated successfully!');
  }
}

function updateShowreelSection(urlMap) {
  console.log('Updating ShowreelSection.jsx with new URLs...');
  if (!fs.existsSync(showreelFilePath)) {
    console.log('⚠️ ShowreelSection.jsx not found');
    return;
  }

  let content = fs.readFileSync(showreelFilePath, 'utf8');

  Object.entries(urlMap).forEach(([filename, url]) => {
    // Match src: "/reels/filename.mp4" pattern
    const baseName = path.parse(filename).name;
    const regex = new RegExp(`src:\\s*["']\\/reels\\/[^"']*${baseName}[^"']*\.mp4["']`, 'g');
    content = content.replace(regex, `src: "${url}"`);
  });

  fs.writeFileSync(showreelFilePath, content);
  console.log('🚀 ShowreelSection.jsx updated successfully!');
}

async function uploadVideos() {
  console.log('Starting Cloudinary upload process...');

  if (!fs.existsSync(backupDir)) {
    console.error('❌ Backup directory not found!');
    return;
  }

  const files = fs.readdirSync(backupDir).filter(file => file.endsWith('.mp4'));
  const urlMap = {};

  console.log(`Found ${files.length} videos to upload...\n`);

  for (const file of files) {
    const filePath = path.join(backupDir, file);
    console.log(`📤 Uploading ${file}...`);

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'video',
        folder: 'reels',
        public_id: path.parse(file).name,
        overwrite: true,
        chunk_size: 6000000
      });

      const optimizedUrl = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
      urlMap[file] = optimizedUrl;
      console.log(`✅ Success: ${file}`);
      console.log(`   URL: ${optimizedUrl}\n`);
    } catch (error) {
      console.error(`❌ Failed to upload ${file}:`, error.message);
    }
  }

  console.log('\n📋 Upload Summary:');
  console.log(`Total: ${files.length}, Success: ${Object.keys(urlMap).length}, Failed: ${files.length - Object.keys(urlMap).length}\n`);

  if (Object.keys(urlMap).length > 0) {
    updateShowreelSection(urlMap);
    updatePortfolioData(urlMap);
    console.log('\n🎉 All done! Your videos are now hosted on Cloudinary.');
  }
}

uploadVideos();
