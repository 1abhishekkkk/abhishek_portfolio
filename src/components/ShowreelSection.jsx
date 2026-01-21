import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, X, Maximize2 } from 'lucide-react';

// Your actual showreel videos - add your Fuse brand edit here
const reels = [
  { 
    id: 1, 
    src: "/reels/fuse-bts-final.mp4", 
    title: "Fuse BTS Final",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-32297-large.mp4"
  },
  { 
    id: 2, 
    src: "/reels/realme-15pro-launch-new.mp4", 
    title: "Realme 15 Pro Launch Event",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4"
  },
  { 
    id: 3, 
    src: "/reels/honor-brand.mp4", 
    title: "Honor Brand Commercial",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4"
  },
  { 
    id: 4, 
    src: "/reels/realme-11pro.mp4", 
    title: "Realme 11 Pro",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-slowly-41573-large.mp4"
  },
  { 
    id: 5, 
    src: "/reels/fashion-gurav.mp4", 
    title: "Fashion Commercial",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-32297-large.mp4"
  },
  { 
    id: 6, 
    src: "/reels/realme-16pro-plus.mp4", 
    title: "Realme 16 Pro+",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4"
  },
  { 
    id: 7, 
    src: "/reels/realme-16pro-plus-launch.mp4", 
    title: "Realme 16 Pro+ Launch",
    fallback: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4"
  }

];

// Individual Reel Card Component
const ReelCard = ({ reel, isActive, onClick, onVideoEnd, onOpenModal }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // When clicked: unmute, show controls, restart
      video.muted = false;
      video.currentTime = 0;
      video.play();
      setIsPlaying(true);
      setShowControls(true);
    } else {
      // Default state: muted loop
      video.muted = true;
      video.currentTime = 0;
      video.play();
      setIsPlaying(true);
      setShowControls(false);
    }
  }, [isActive]);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    onClick(reel.id);
  };

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    const video = videoRef.current;
    if (video && !isActive) {
      video.muted = true;
      video.play();
      setIsPlaying(true);
    }
  };

  return (
    <motion.div
      className={`relative group cursor-pointer overflow-hidden rounded-xl bg-neutral-900/50 border border-white/10 hover:border-white/20 transition-all ${
        isActive ? 'ring-2 ring-amber-500' : ''
      }`}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleVideoClick}
      layout
    >
      {/* Video Element */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="none"
          onEnded={onVideoEnd}
          onLoadedData={handleVideoLoaded}
          onError={() => console.log('Video failed to load:', reel.src)}
        >
          <source src={reel.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Loading Placeholder */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
            <div className="text-neutral-400 text-sm">Loading...</div>
          </div>
        )}

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent opacity-0"
          animate={{ opacity: isHovered || isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Video Title Overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered || isActive ? 1 : 0, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-white font-medium text-sm">{reel.title}</h3>
        </motion.div>

        {/* Play/Pause Button - Only visible when active */}
        <AnimatePresence>
          {isActive && showControls && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.button
                className="bg-black/60 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/80 transition-colors"
                onClick={handlePlayPause}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>
              <motion.button
                className="bg-black/60 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(reel);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Open in fullscreen"
              >
                <Maximize2 size={24} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Volume Indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 text-white">
                <Volume2 size={16} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Muted Indicator for non-active videos */}
        <AnimatePresence>
          {!isActive && isHovered && (
            <motion.div
              className="absolute top-4 right-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 text-white/60">
                <VolumeX size={16} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click to unmute hint */}
        <AnimatePresence>
          {!isActive && isHovered && (
            <motion.div
              className="absolute bottom-4 right-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 text-white/80 text-xs">
                Click to unmute
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Main Showreel Section Component
const ShowreelSection = () => {
  const [activeReel, setActiveReel] = useState(null);
  const [modalReel, setModalReel] = useState(null);
  const sectionRef = useRef(null);
  const modalVideoRef = useRef(null);

  const openModal = (reel) => {
    setModalReel(reel);
  };

  const closeModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setModalReel(null);
  };

  // Handle clicking outside or scrolling away
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setActiveReel(null);
      }
    };

    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (!isVisible) {
        setActiveReel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleReelClick = (reelId) => {
    const reel = reels.find(r => r.id === reelId);
    setModalReel(reel);
  };

  const handleVideoEnd = () => {
    // Video ended, return to muted loop mode
    setActiveReel(null);
  };


  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    if (modalReel) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalReel]);

  return (
    <section 
      ref={sectionRef}
      id="showreel" 
      className="py-24 px-6"
    >

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 mb-4">
            <motion.div
              className="w-2 h-2 bg-amber-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Latest Work
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Showreel
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            A collection of my latest video editing work showcasing different styles, 
            techniques, and creative approaches.
          </p>
        </motion.div>

        {/* Reels Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {reels.map((reel) => (
            <motion.div
              key={reel.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.5 }}
            >
              <ReelCard
                reel={reel}
                isActive={activeReel === reel.id}
                onClick={handleReelClick}
                onVideoEnd={handleVideoEnd}
                onOpenModal={openModal}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Instructions */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-sm text-neutral-500">
            Click any video to view in fullscreen • Hover to preview • Press ESC to close
          </p>
        </motion.div>
      </div>

      {/* Glassmorphism Video Modal */}
      <AnimatePresence>
        {modalReel && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Backdrop with glassmorphism */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
            
            {/* Animated glass orbs for ambient effect */}
            <motion.div 
              className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-xl"
              animate={{
                x: [0, -80, 0],
                y: [0, -40, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-md mx-auto"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism container */}
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Video container */}
                <div className="aspect-[9/16] w-full">
                  <video
                    ref={modalVideoRef}
                    className="w-full h-full object-cover rounded-3xl"
                    controls
                    autoPlay
                    loop
                    playsInline
                    muted={false}
                    onLoadedData={() => {
                      if (modalVideoRef.current) {
                        modalVideoRef.current.currentTime = 0;
                        modalVideoRef.current.muted = false;
                        modalVideoRef.current.volume = 0.8;
                      }
                    }}
                  >
                    <source src={modalReel.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Video info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-3xl">
                  <h3 className="text-2xl font-bold text-white mb-2">{modalReel.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-300">
                    <span className="flex items-center gap-1">
                      <Play size={16} />
                      Video Reel
                    </span>
                    <span className="flex items-center gap-1">
                      <Volume2 size={16} />
                      Sound Enabled
                    </span>
                  </div>
                </div>

                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/20 via-transparent to-blue-500/20 pointer-events-none"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ShowreelSection;