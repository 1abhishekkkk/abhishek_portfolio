// Portfolio Data Configuration
// Update this file to change all your portfolio content

export const portfolioConfig = {
  // Your personal information
  personal: {
    name: "Abhi's",
    tagline: "creative studio",
    fullName: "Abhishek Kumar",
    profession: "Photographer, Video Editor, and Colorist",
    description: "Professional Photographer, Video Editor, and Colorist helping brands and creatives achieve the perfect cinematic look.",
    email: "abhishek274kumar@gmail.com",
    phone: "+91 89575 62928",
    phone2: "+91 73806 82181",
    whatsapp: "918957562928",
    location: "India",
    availability: "Available for freelance"
  },

  // Social media links
  social: {
    instagram: "https://www.instagram.com/abhi_clicks._/", // Your Instagram handle
    linkedin: "https://linkedin.com/in/abhishek-kumar", // Update with your profile
    youtube: "https://youtube.com/@abhiclicks", // Add if you have one
    behance: "https://behance.net/abhiclicks" // Add if you have one
  },

  // Brand Showreels - Organized by Brand Categories
  brandShowreels: {
    realme: {
      brandName: "Realme",
      brandColor: "#FFD700", // Realme yellow/gold
      brandLogo: "/brands/realme-logo.png", // Add logo if available
      description: "Professional smartphone launch campaigns and product showcases",
      videos: [
        {
          id: "realme-1",
          title: "Realme 11 Pro Campaign",
          videoSrc: "/reels/realme-11pro.mp4",
          thumbnail: "/thumbnails/realme-11pro.jpg", // Add if available
          desc: "Professional product showcase highlighting camera capabilities and design aesthetics",
          duration: "0:45",
          tags: ["Product Launch", "Commercial", "Smartphone"],
          year: "2024",
          type: "Product Launch"
        },
        {
          id: "realme-2", 
          title: "Realme 15 Pro Launch Video",
          videoSrc: "/reels/realme-15pro-launch.mp4",
          thumbnail: "/thumbnails/realme-15pro.jpg",
          desc: "Dynamic launch campaign video showcasing premium features and capabilities",
          duration: "0:50",
          tags: ["Launch Campaign", "Premium", "Commercial"],
          year: "2024",
          type: "Launch Campaign"
        },
        {
          id: "realme-3",
          title: "Realme 15 Pro - Extended Cut",
          videoSrc: "/reels/realme-15pro-launch-new.mp4", 
          thumbnail: "/thumbnails/realme-15pro-new.jpg",
          desc: "Extended version with detailed feature highlights and lifestyle integration",
          duration: "1:15",
          tags: ["Extended Cut", "Features", "Lifestyle"],
          year: "2024", 
          type: "Feature Showcase"
        }
      ]
    },
    
    fuse: {
      brandName: "Fuse",
      brandColor: "#FF6B35", // Vibrant orange/red
      brandLogo: "/brands/fuse-logo.png",
      description: "Creative brand content and behind-the-scenes production",
      videos: [
        {
          id: "fuse-1",
          title: "Fuse Brand Edit",
          videoSrc: "/reels/fuse-brand-edit.mp4",
          thumbnail: "/thumbnails/fuse-brand.jpg",
          desc: "Creative brand storytelling with dynamic editing and visual effects",
          duration: "0:35",
          tags: ["Brand Story", "Creative Edit", "Visual Effects"],
          year: "2024",
          type: "Brand Content"
        },
        {
          id: "fuse-2",
          title: "Fuse BTS Final Cut", 
          videoSrc: "/reels/fuse-bts-final.mp4",
          thumbnail: "/thumbnails/fuse-bts.jpg",
          desc: "Behind-the-scenes footage showcasing the creative process and team collaboration",
          duration: "1:20",
          tags: ["BTS", "Process", "Team Work"],
          year: "2024",
          type: "Behind the Scenes"
        }
      ]
    },

    oneplus: {
      brandName: "OnePlus", 
      brandColor: "#EB0028", // OnePlus red
      brandLogo: "/brands/oneplus-logo.png",
      description: "Premium smartphone campaigns and lifestyle integration videos",
      videos: [
        // Placeholder for your OnePlus videos - add your actual OnePlus content here
        {
          id: "oneplus-1",
          title: "OnePlus Campaign Coming Soon",
          videoSrc: "/reels/oneplus-video1.mp4", // Update with your actual filename
          thumbnail: "/thumbnails/oneplus-thumb1.jpg",
          desc: "Professional OnePlus campaign video showcasing premium design and performance",
          duration: "0:40",
          tags: ["Premium", "Performance", "Design"],
          year: "2024",
          type: "Campaign"
        },
        {
          id: "oneplus-2", 
          title: "OnePlus Lifestyle Video",
          videoSrc: "/reels/oneplus-video2.mp4", // Update with your actual filename
          thumbnail: "/thumbnails/oneplus-thumb2.jpg", 
          desc: "Lifestyle integration video showing OnePlus in everyday scenarios",
          duration: "0:55",
          tags: ["Lifestyle", "Integration", "Daily Use"],
          year: "2024",
          type: "Lifestyle"
        }
      ]
    }
  },

  // Regular portfolio projects (keeping existing structure for other content)
  projects: [
    {
      id: 1,
      title: "Fashion Gurav Reel",
      category: "video", 
      videoSrc: "/reels/fashion-gurav.mp4",
      thumbnail: "/thumbnails/fashion-gurav.jpg",
      desc: "High-energy fashion reel with dynamic editing and color grading",
      duration: "0:30",
      tags: ["Fashion", "Creative Edit", "Color Grading"],
      year: "2024"
    },
    {
      id: 2,
      title: "Honor Brand Campaign",
      category: "video",
      videoSrc: "/reels/honor-brand.mp4", 
      thumbnail: "/thumbnails/honor-brand.jpg",
      desc: "Professional brand campaign video for Honor smartphone series",
      duration: "0:45",
      tags: ["Brand Campaign", "Commercial", "Product"],
      client: "Honor",
      year: "2024"
    }
  ]
};

// Template for adding new projects
export const projectTemplate = {
  id: 7, // Increment this
  title: "Your Project Title",
  category: "photography", // photography, video, or color
  image: "/portfolio/photos/your-image.jpg", // For photos
  videoSrc: "/portfolio/videos/your-video.mp4", // For videos
  thumbnail: "/portfolio/thumbnails/your-thumb.jpg", // For videos
  desc: "Brief description of your project",
  duration: "0:30", // For videos only
  palette: ['#color1', '#color2', '#color3'], // For color grading
  tags: ["Tag1", "Tag2", "Tag3"],
  // Optional fields:
  client: "Client Name",
  location: "Location",
  year: "2024",
  camera: "Camera Used",
  software: "Software Used"
};

// Services configuration
export const services = [
  {
    icon: "Aperture",
    title: "Photography",
    description: "Capturing moments with an eye for detail and composition.",
    features: [
      "Portrait Photography",
      "Event Photography", 
      "Product Photography",
      "Street Photography",
      "Architecture Photography"
    ]
  },
  {
    icon: "Video", 
    title: "Video Editing",
    description: "Creating compelling visual stories through motion.",
    features: [
      "Social Media Content",
      "Event Documentation",
      "Commercial Videos",
      "Music Videos",
      "Corporate Videos"
    ]
  },
  {
    icon: "Palette",
    title: "Color Grading", 
    description: "Enhancing mood and style through expert color correction.",
    features: [
      "Cinematic Color Grading",
      "Commercial Color Correction", 
      "Creative Color Styling",
      "Skin Tone Correction",
      "Mood Enhancement"
    ]
  }
];

export { portfolioConfig as default };