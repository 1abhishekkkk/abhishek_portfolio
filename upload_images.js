import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: 'de6kkxnqn',
  api_key: '639198366737851',
  api_secret: 'SEE1hB_CGi8_ejqPgbOStEz720w'
});

async function uploadImages() {
  const imgPath = './public/images/abhishek-about.jpg';
  
  if (!fs.existsSync(imgPath)) {
    console.log('File not found:', imgPath);
    return;
  }
  
  const stat = fs.statSync(imgPath);
  console.log('File size:', stat.size, 'bytes');
  
  try {
    const result = await cloudinary.uploader.upload(imgPath, {
      folder: 'images',
      public_id: 'abhishek-about',
      overwrite: true,
      resource_type: 'image'
    });
    const url = result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
    console.log('SUCCESS:', url);
  } catch (err) {
    console.log('FAILED:', err.message);
  }
}

uploadImages();
