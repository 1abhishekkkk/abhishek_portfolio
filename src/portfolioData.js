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

  brandPartners: [
    { name: "Realme", detail: "Launch films + product campaigns" },
    { name: "OnePlus", detail: "Premium smartphone storytelling" },
    { name: "Honor", detail: "Brand campaign edits" },
    { name: "Duroflex", detail: "Lifestyle collaboration films" },
    { name: "Fuse", detail: "Event and BTS content" }
  ],

  caseStudies: [
    {
      client: "Realme",
      title: "Launch Campaign Visual System",
      goal: "Make product feature reveals feel cinematic, premium, and fast enough for social audiences.",
      role: "Video editing, pacing, transitions, sound-led cuts, final social exports.",
      output: "Launch reels, feature showcases, and extended campaign edits.",
      result: "A sharper campaign library that keeps the phone as the hero while still feeling lifestyle-led.",
      tags: ["Product Launch", "Commercial", "Social Reels"]
    },
    {
      client: "Fuse",
      title: "Bangalore Event Storytelling",
      goal: "Turn high-energy event footage into a polished brand story with atmosphere and momentum.",
      role: "Sequence building, music sync, BTS treatment, and color direction.",
      output: "Event recap, BTS edit, and short-form brand cuts.",
      result: "A stronger event identity with usable edits for Instagram, reels, and pitch decks.",
      tags: ["Event Film", "BTS", "Brand Content"]
    },
    {
      client: "Duroflex",
      title: "Athlete Collaboration Edit",
      goal: "Shape a lifestyle collaboration into a clean, premium, trustworthy brand film.",
      role: "Edit structure, commercial pacing, grade direction, and platform-ready exports.",
      output: "Hero collaboration film and social-first cutdowns.",
      result: "A polished brand asset built for both campaign recall and social performance.",
      tags: ["Lifestyle", "Collaboration", "Commercial"]
    }
  ],

  servicePackages: [
    {
      title: "Social Reel Sprint",
      bestFor: "Creators, launches, events, and fast campaign drops.",
      deliverables: ["3-5 vertical edits", "Hook-first pacing", "Music sync", "Platform-ready exports"]
    },
    {
      title: "Brand Film Package",
      bestFor: "Businesses that need a polished campaign or product story.",
      deliverables: ["Creative treatment", "Hero edit", "Cutdowns", "Commercial color pass"]
    },
    {
      title: "Color Grade Finish",
      bestFor: "Teams with footage that needs a more cinematic final look.",
      deliverables: ["Look development", "Skin tone balance", "Before/after review", "Final graded exports"]
    }
  ],

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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628884/reels/realme-11pro.mp4",
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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628901/reels/realme-15pro-launch.mp4",
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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628896/reels/realme-15pro-launch-new.mp4", 
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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628685/reels/fuse-brand-edit.mp4",
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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628710/reels/fuse-bts-final.mp4",
          thumbnail: "/thumbnails/fuse-bts.jpg",
          desc: "Behind-the-scenes footage showcasing the creative process and team collaboration",
          duration: "1:20",
          tags: ["BTS", "Process", "Team Work"],
          year: "2024",
          type: "Behind the Scenes"
        },
        {
          id: "fuse-3",
          title: "Fuse Bangalore",
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628645/reels/fuse-bangalore.mp4",
          thumbnail: "/thumbnails/fuse-bangalore.jpg",
          desc: "Bangalore edition of the brand's signature creative series",
          duration: "1:00",
          tags: ["Event", "Bangalore", "Brand Content"],
          year: "2024",
          type: "Brand Event"
        }
      ]
    },

    duroflex: {
      brandName: "Duroflex",
      brandColor: "#0054A6", // Duroflex Blue
      description: "Collaborative projects and lifestyle campaigns",
      videos: [
        {
          id: "duroflex-1",
          title: "Shreyanka x Duroflex",
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777739610/reels/shreyanka-x-duroflex.mp4",
          thumbnail: "/thumbnails/duroflex.jpg",
          desc: "Premium collaboration featuring Shreyanka Patil for Duroflex",
          duration: "0:45",
          tags: ["Collaboration", "Lifestyle", "Sports"],
          year: "2024",
          type: "Collaboration"
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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628879/reels/oneplus-final.mp4", // Update with your actual filename
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
          videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/v1/reels/oneplus-video2.mp4", // Update with your actual filename
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
      id: 10,
      title: "Ishan Kishan - Cricket Edit",
      category: "video",
      videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1780988936/reels/ishan-kishan.mp4",
      desc: "Dynamic cricket edit featuring Ishan Kishan with high-energy transitions",
      duration: "0:30",
      tags: ["Sports", "Cricket", "Dynamic Edit"],
      year: "2024"
    },
    {
      id: 1,
      title: "Fashion Gurav Reel",
      category: "video", 
      videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628375/reels/fashion-gurav.mp4",
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
      videoSrc: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628714/reels/honor-brand.mp4", 
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
