#!/usr/bin/env node

/**
 * Avatar Integration Helper
 * This script helps you integrate your 3D avatar into the website
 */

const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function checkFile(filePath) {
  return fs.existsSync(filePath);
}

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / 1024 / 1024).toFixed(2); // Size in MB
}

async function integrateAvatar() {
  log('🎭 Avatar Integration Helper', 'cyan');
  log('============================', 'cyan');
  
  // Check for avatar files in models folder
  const modelsDir = './public/models';
  
  if (!checkFile(modelsDir)) {
    log('❌ Models directory not found. Creating it...', 'yellow');
    fs.mkdirSync(modelsDir, { recursive: true });
    log('✅ Created public/models/ directory', 'green');
  }
  
  // Look for avatar files
  const avatarFiles = [];
  if (fs.existsSync(modelsDir)) {
    const files = fs.readdirSync(modelsDir);
    files.forEach(file => {
      if (file.endsWith('.glb') || file.endsWith('.gltf')) {
        avatarFiles.push(file);
      }
    });
  }
  
  log('\n📁 Current Status:', 'blue');
  log('=================', 'blue');
  
  if (avatarFiles.length === 0) {
    log('❌ No avatar files found in public/models/', 'red');
    log('\n📝 Next Steps:', 'yellow');
    log('1. Create your avatar using one of these methods:', 'yellow');
    log('   • Ready Player Me: https://readyplayer.me/ (Recommended)', 'cyan');
    log('   • VRoid Studio: https://vroid.com/en/studio', 'cyan');
    log('   • Luma AI: https://lumalabs.ai/', 'cyan');
    log('');
    log('2. Save your avatar file as:', 'yellow');
    log('   • public/models/avatar.glb (recommended)', 'cyan');
    log('   • public/models/my-avatar.glb', 'cyan');
    log('');
    log('3. Run this script again to integrate it!', 'yellow');
    return;
  }
  
  log('✅ Avatar files found:', 'green');
  avatarFiles.forEach((file, index) => {
    const filePath = path.join(modelsDir, file);
    const size = getFileSize(filePath);
    const status = parseFloat(size) > 5 ? '⚠️  Large file' : '✅ Good size';
    log(`${index + 1}. ${file} (${size}MB) ${status}`, 'cyan');
  });
  
  // Check if Avatar3D.jsx needs updating
  const avatar3DPath = './src/Avatar3D.jsx';
  if (checkFile(avatar3DPath)) {
    log('\n🔧 Integration Options:', 'blue');
    log('======================', 'blue');
    
    const avatar3DContent = fs.readFileSync(avatar3DPath, 'utf8');
    
    if (avatar3DContent.includes('modelPath="/models/')) {
      log('✅ Avatar3D.jsx already configured for custom models', 'green');
    } else {
      log('🔄 Avatar3D.jsx needs update for custom models', 'yellow');
    }
    
    log('\n📝 To use your avatar:', 'yellow');
    log('1. Choose your preferred avatar file from above', 'cyan');
    log('2. Update src/Avatar3D.jsx or App.jsx with:', 'cyan');
    log('', 'cyan');
    log('   <HeroAvatar modelPath="/models/your-avatar.glb" />', 'bright');
    log('   <FloatingAvatar modelPath="/models/your-avatar.glb" />', 'bright');
    log('', 'cyan');
    
    // Provide specific integration code
    const recommendedFile = avatarFiles[0];
    log(`\n🚀 Quick Integration for "${recommendedFile}":`, 'green');
    log('='.repeat(40 + recommendedFile.length), 'green');
    
    const integrationCode = `
// Update your App.jsx with:

import { HeroAvatar, FloatingAvatar } from './Avatar3D';

// In your hero section:
<HeroAvatar 
  modelPath="/models/${recommendedFile}"
  className="w-full h-[500px]" 
/>

// For floating avatar:
<FloatingAvatar modelPath="/models/${recommendedFile}" />
`;
    
    log(integrationCode, 'cyan');
  }
  
  // Performance recommendations
  log('\n⚡ Performance Tips:', 'blue');
  log('===================', 'blue');
  
  avatarFiles.forEach(file => {
    const filePath = path.join(modelsDir, file);
    const size = parseFloat(getFileSize(filePath));
    
    if (size > 5) {
      log(`❌ ${file} is ${size}MB - consider optimizing`, 'red');
      log('   • Use glTF-Transform to compress: npm install -g @gltf-transform/cli', 'yellow');
      log(`   • Run: gltf-transform optimize ${filePath} ${filePath}`, 'yellow');
    } else if (size > 2) {
      log(`⚠️  ${file} is ${size}MB - acceptable but could be smaller`, 'yellow');
    } else {
      log(`✅ ${file} is ${size}MB - perfect size!`, 'green');
    }
  });
  
  log('\n🎯 Ready to Test?', 'blue');
  log('================', 'blue');
  log('Run: npm run dev', 'cyan');
  log('Visit: http://localhost:5173', 'cyan');
  log('Your avatar should appear in the hero section and floating corner!', 'green');
}

// Run the script
if (require.main === module) {
  integrateAvatar().catch(console.error);
}

module.exports = { integrateAvatar };