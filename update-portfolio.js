#!/usr/bin/env node

/**
 * Portfolio Content Updater Script
 * 
 * This script helps you quickly update your portfolio content.
 * Run: node update-portfolio.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to ask questions
function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Helper function to log with color
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

// Main portfolio update function
async function updatePortfolio() {
  log('🎨 Portfolio Content Updater', 'cyan');
  log('================================', 'cyan');
  
  const portfolioDataPath = './src/portfolioData.js';
  
  if (!fileExists(portfolioDataPath)) {
    log('❌ portfolioData.js not found!', 'red');
    return;
  }

  log('\n📝 What would you like to update?', 'yellow');
  log('1. Personal Information');
  log('2. Add New Project');
  log('3. Update Existing Project');
  log('4. Social Media Links');
  log('5. View Current Portfolio');
  log('6. Check File Structure');
  log('0. Exit');

  const choice = await ask('\nEnter your choice (0-6): ');

  switch (choice) {
    case '1':
      await updatePersonalInfo();
      break;
    case '2':
      await addNewProject();
      break;
    case '3':
      await updateExistingProject();
      break;
    case '4':
      await updateSocialLinks();
      break;
    case '5':
      await viewCurrentPortfolio();
      break;
    case '6':
      await checkFileStructure();
      break;
    case '0':
      log('👋 Goodbye!', 'cyan');
      rl.close();
      return;
    default:
      log('❌ Invalid choice!', 'red');
      await updatePortfolio();
      break;
  }
}

// Update personal information
async function updatePersonalInfo() {
  log('\n👤 Update Personal Information', 'blue');
  log('================================', 'blue');
  
  const name = await ask('Your name (e.g., ABHI): ');
  const tagline = await ask('Tagline (e.g., CLICKS): ');
  const fullName = await ask('Full name (e.g., Abhishek Kumar): ');
  const email = await ask('Email address: ');
  const phone = await ask('Phone number (e.g., +91 98765 43210): ');
  const whatsapp = await ask('WhatsApp number (e.g., 919876543210): ');
  
  log('\n✅ Personal information will be updated!', 'green');
  log('📝 Update src/portfolioData.js with these details manually or run this script to generate code.', 'yellow');
  
  await updatePortfolio();
}

// Add new project
async function addNewProject() {
  log('\n🎨 Add New Project', 'blue');
  log('==================', 'blue');
  
  const title = await ask('Project title: ');
  const category = await ask('Category (photography/video/color): ');
  const description = await ask('Project description: ');
  
  let filePath = '';
  if (category === 'photography') {
    filePath = await ask('Image file path (e.g., /portfolio/photos/my-photo.jpg): ');
  } else if (category === 'video') {
    filePath = await ask('Video file path (e.g., /portfolio/videos/my-video.mp4): ');
    const duration = await ask('Video duration (e.g., 0:30): ');
  }
  
  log('\n✅ New project details collected!', 'green');
  log('📝 Add this to your portfolioData.js projects array:', 'yellow');
  
  const projectCode = `
{
  id: ${Date.now()}, // Unique ID
  title: "${title}",
  category: "${category}",
  ${category === 'photography' ? `image: "${filePath}",` : `videoSrc: "${filePath}",`}
  desc: "${description}",
  ${category === 'video' ? 'duration: "0:30",' : ''}
  tags: ["Tag1", "Tag2", "Tag3"]
}`;
  
  log(projectCode, 'cyan');
  
  await updatePortfolio();
}

// View current portfolio
async function viewCurrentPortfolio() {
  log('\n📊 Current Portfolio Structure', 'blue');
  log('==============================', 'blue');
  
  try {
    const portfolioData = require('./src/portfolioData.js');
    
    log(`\n👤 Personal Info:`, 'yellow');
    log(`Name: ${portfolioData.portfolioConfig.personal.name}${portfolioData.portfolioConfig.personal.tagline}`);
    log(`Email: ${portfolioData.portfolioConfig.personal.email}`);
    log(`Phone: ${portfolioData.portfolioConfig.personal.phone}`);
    
    log(`\n🎨 Projects (${portfolioData.portfolioConfig.projects.length} total):`, 'yellow');
    portfolioData.portfolioConfig.projects.forEach((project, index) => {
      log(`${index + 1}. ${project.title} (${project.category})`);
    });
    
  } catch (error) {
    log('❌ Could not read portfolio data', 'red');
  }
  
  await updatePortfolio();
}

// Check file structure
async function checkFileStructure() {
  log('\n📁 Checking File Structure', 'blue');
  log('===========================', 'blue');
  
  const requiredFolders = [
    'public/portfolio',
    'public/portfolio/photos',
    'public/portfolio/videos', 
    'public/portfolio/thumbnails',
    'public/models'
  ];
  
  const requiredFiles = [
    'src/portfolioData.js',
    'src/Avatar3D.jsx',
    'src/App.jsx'
  ];
  
  log('\n📂 Folders:', 'yellow');
  requiredFolders.forEach(folder => {
    const exists = fileExists(folder);
    log(`${exists ? '✅' : '❌'} ${folder}`, exists ? 'green' : 'red');
  });
  
  log('\n📄 Files:', 'yellow');
  requiredFiles.forEach(file => {
    const exists = fileExists(file);
    log(`${exists ? '✅' : '❌'} ${file}`, exists ? 'green' : 'red');
  });
  
  log('\n💡 Missing folders can be created with:', 'cyan');
  log('mkdir -p public/portfolio/{photos,videos,thumbnails}', 'cyan');
  
  await updatePortfolio();
}

// Update social links
async function updateSocialLinks() {
  log('\n🔗 Update Social Media Links', 'blue');
  log('=============================', 'blue');
  
  const instagram = await ask('Instagram URL (https://instagram.com/your_handle): ');
  const linkedin = await ask('LinkedIn URL (https://linkedin.com/in/your_profile): ');
  const youtube = await ask('YouTube URL (optional): ');
  const behance = await ask('Behance URL (optional): ');
  
  log('\n✅ Social links collected!', 'green');
  log('📝 Update the social object in portfolioData.js', 'yellow');
  
  await updatePortfolio();
}

// Start the script
async function main() {
  try {
    await updatePortfolio();
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
}

// Handle script termination
process.on('SIGINT', () => {
  log('\n\n👋 Script terminated by user', 'yellow');
  rl.close();
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main();
}

module.exports = { updatePortfolio, log, colors };