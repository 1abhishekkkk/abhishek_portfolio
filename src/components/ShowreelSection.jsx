import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

// Full unified reels dataset with brand/category tags
const ALL_REELS = [
  {
    id: 10,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1780988936/reels/ishan-kishan.mp4",
    title: "Ishan Kishan - Cricket Edit",
    brand: "sports",
    type: "Sports Edit",
  },
  {
    id: 0,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777740056/reels/fuse-2-render.mp4",
    title: "Fuse Bangalore 2 Render",
    brand: "fuse",
    type: "Brand Event",
  },
  {
    id: 1,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777739610/reels/shreyanka-x-duroflex.mp4",
    title: "Shreyanka x Duroflex",
    brand: "duroflex",
    type: "Collaboration",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628645/reels/fuse-bangalore.mp4",
    title: "Fuse Bangalore",
    brand: "fuse",
    type: "Brand Event",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628710/reels/fuse-bts-final.mp4",
    title: "Fuse BTS Final",
    brand: "fuse",
    type: "Behind the Scenes",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628896/reels/realme-15pro-launch-new.mp4",
    title: "Realme 15 Pro Launch",
    brand: "realme",
    type: "Launch Campaign",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628714/reels/honor-brand.mp4",
    title: "Honor Brand Commercial",
    brand: "honor",
    type: "Brand Commercial",
  },
  {
    id: 6,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628884/reels/realme-11pro.mp4",
    title: "Realme 11 Pro",
    brand: "realme",
    type: "Product Launch",
  },
  {
    id: 7,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628375/reels/fashion-gurav.mp4",
    title: "Fashion Commercial",
    brand: "fashion",
    type: "Fashion Edit",
  },
  {
    id: 8,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628948/reels/realme-16pro-plus.mp4",
    title: "Realme 16 Pro+",
    brand: "realme",
    type: "Product Launch",
  },
  {
    id: 9,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628940/reels/realme-16pro-plus-launch.mp4",
    title: "Realme 16 Pro+ Launch",
    brand: "realme",
    type: "Launch Campaign",
  },
  {
    id: 11,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628879/reels/oneplus-final.mp4",
    title: "OnePlus Campaign",
    brand: "oneplus",
    type: "Campaign",
  },
  {
    id: 12,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1777628685/reels/fuse-brand-edit.mp4",
    title: "Fuse Brand Edit",
    brand: "fuse",
    type: "Brand Content",
  },
  {
    id: 13,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/v1782728618/reels/denovoo-final.mp4",
    title: "Denovoo Broadway Commercial",
    brand: "denovoo",
    type: "Brand Commercial",
  },
];

// Filter tabs config with brand accent colors
const FILTERS = [
  { id: "all",      label: "All",      color: "#f59e0b", count: ALL_REELS.length },
  { id: "realme",   label: "Realme",   color: "#FFD700", count: ALL_REELS.filter(r => r.brand === "realme").length },
  { id: "fuse",     label: "Fuse",     color: "#FF6B35", count: ALL_REELS.filter(r => r.brand === "fuse").length },
  { id: "duroflex", label: "Duroflex", color: "#3b9eff", count: ALL_REELS.filter(r => r.brand === "duroflex").length },
  { id: "oneplus",  label: "OnePlus",  color: "#EB0028", count: ALL_REELS.filter(r => r.brand === "oneplus").length },
  { id: "honor",    label: "Honor",    color: "#c084fc", count: ALL_REELS.filter(r => r.brand === "honor").length },
  { id: "denovoo",  label: "Denovoo",  color: "#60a5fa", count: ALL_REELS.filter(r => r.brand === "denovoo").length },
  { id: "sports",   label: "Sports",   color: "#34d399", count: ALL_REELS.filter(r => r.brand === "sports").length },
  { id: "fashion",  label: "Fashion",  color: "#f472b6", count: ALL_REELS.filter(r => r.brand === "fashion").length },
];

// ---------- Reel Card ----------
const ReelCard = ({ reel, isActive, isFacingFront, onClick, onVideoEnd, onOpenModal }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && isFacingFront) {
      // Auto play muted when in center front
      video.muted = true;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Autoplay blocked:', err));
      setShowControls(true);
    } else {
      video.pause();
      setIsPlaying(false);
      setShowControls(false);
    }
  }, [isActive, isFacingFront]);

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

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    const video = videoRef.current;
    if (video && isActive && isFacingFront) {
      video.muted = true;
      video.play().then(() => {
        setIsPlaying(true);
      }).catch(err => console.log('Autoplay blocked:', err));
    }
  };

  const brandFilter = FILTERS.find(f => f.id === reel.brand);
  const accentColor = brandFilter?.color || '#f59e0b';

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-white/20 transition-colors shadow-2xl flex flex-col justify-between"
      style={isActive && isFacingFront ? { boxShadow: `0 0 24px -4px ${accentColor}40`, border: `2px solid ${accentColor}` } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Video Container */}
      <div className="relative w-full h-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover pointer-events-none"
          loop
          muted
          playsInline
          preload="metadata"
          onEnded={onVideoEnd}
          onLoadedData={handleVideoLoaded}
          onError={() => console.log('Video failed to load:', reel.src)}
        >
          <source src={reel.src} type="video/mp4" />
        </video>

        {/* Loading Placeholder */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/25 border-t-white/85 rounded-full animate-spin" />
          </div>
        )}

        {/* Overlay Darkener */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Brand type badge */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <span
            className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor, border: `1.5px solid ${accentColor}35` }}
          >
            {reel.type}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none flex flex-col justify-end">
          <h3 className="text-white font-black text-sm leading-tight tracking-tight uppercase mb-1">{reel.title}</h3>
          <p className="text-[10px] text-white/50 tracking-wider font-semibold uppercase">{reel.brand}</p>
        </div>

        {/* Play/Pause & Maximize button */}
        <AnimatePresence>
          {isActive && isFacingFront && showControls && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-3 bg-black/35 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3.5 text-white hover:scale-110 active:scale-95 transition-transform"
                onClick={handlePlayPause}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3.5 text-white hover:scale-110 active:scale-95 transition-transform"
                onClick={(e) => { e.stopPropagation(); onOpenModal(reel); }}
              >
                <Maximize2 size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unmute Indicator hint */}
        <AnimatePresence>
          {isFacingFront && isHovered && !isActive && (
            <motion.div
              className="absolute bottom-4 right-4 z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="bg-black/85 backdrop-blur-md rounded-full px-3 py-1 text-[8px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5 border border-white/15">
                <VolumeX size={10} /> Play Fullscreen
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ---------- Main Section ----------
const ShowreelSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeReel, setActiveReel] = useState(null);
  const [modalReel, setModalReel] = useState(null);
  const sectionRef = useRef(null);
  const modalVideoRef = useRef(null);
  const filterRef = useRef(null);

  // 3D Carousel State
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const dragDistance = useRef(0);
  const dragVelocity = useRef(0);
  const lastTime = useRef(0);
  const lastX = useRef(0);

  // Responsive sizes
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const cardWidth = isMobile ? 180 : 230;
  const cardHeight = isMobile ? 280 : 365;

  const filteredReels = activeFilter === 'all'
    ? ALL_REELS
    : ALL_REELS.filter(r => r.brand === activeFilter);

  const activeFilterConfig = FILTERS.find(f => f.id === activeFilter) || FILTERS[0];

  const openModal = (reel) => setModalReel(reel);

  const closeModal = () => {
    if (modalVideoRef.current) modalVideoRef.current.pause();
    setModalReel(null);
  };

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setRotation(0); // Reset wheel rotation on filter change
    setActiveReel(null);
  };

  // Drag Gesture Handlers
  const startDrag = (clientX) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    dragStartRotation.current = rotation;
    dragDistance.current = 0;
    dragVelocity.current = 0;
    lastX.current = clientX;
    lastTime.current = performance.now();
  };

  const moveDrag = (clientX) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartX.current;
    dragDistance.current = deltaX;

    const now = performance.now();
    const dt = now - lastTime.current;
    if (dt > 0) {
      const dx = clientX - lastX.current;
      dragVelocity.current = dx / dt;
    }
    lastX.current = clientX;
    lastTime.current = now;

    // Apply drag rotation (1px drag = 0.35 deg rotation)
    setRotation(dragStartRotation.current + deltaX * 0.35);
  };

  const endDrag = () => {
    setIsDragging(false);

    // Apply smooth inertia spin
    if (Math.abs(dragVelocity.current) > 0.1) {
      let speed = dragVelocity.current * 10;
      const decay = 0.94;

      const spin = () => {
        if (isDragging) return; // Interrupt if user starts dragging again
        setRotation(prev => prev + speed);
        speed *= decay;
        if (Math.abs(speed) > 0.05) {
          requestAnimationFrame(spin);
        }
      };
      requestAnimationFrame(spin);
    }
  };

  // Global mouse event listener for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) moveDrag(e.clientX);
    };
    const handleGlobalMouseUp = () => {
      if (isDragging) endDrag();
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // Auto-rotation when idle
  useEffect(() => {
    let animationId;
    let lastTick = performance.now();

    const tick = (now) => {
      const dt = now - lastTick;
      lastTick = now;

      if (!isDragging) {
        // Slow constant rotate (2.5 degrees per second)
        setRotation(prev => (prev - 0.012 * dt) % 360);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [isDragging]);

  // Identify active (centered) card
  useEffect(() => {
    if (filteredReels.length === 0) return;

    let closestReelId = null;
    let maxCos = -2;

    filteredReels.forEach((reel, index) => {
      const angle = index * (360 / filteredReels.length);
      const relativeAngle = ((angle + rotation) % 360 + 360) % 360;
      const rad = (relativeAngle * Math.PI) / 180;
      const cosAngle = Math.cos(rad);

      // Card closest to front (cosAngle = 1)
      if (cosAngle > maxCos) {
        maxCos = cosAngle;
        closestReelId = reel.id;
      }
    });

    setActiveReel(closestReelId);
  }, [rotation, filteredReels, activeFilter]);

  // Card click handler
  const handleCardClick = (reel, cosAngle) => {
    // Only trigger modal if not a drag action
    if (Math.abs(dragDistance.current) < 5) {
      // If it's facing away, spin the wheel to bring it to front
      if (cosAngle < 0.8) {
        const index = filteredReels.findIndex(r => r.id === reel.id);
        const cardAngle = index * (360 / filteredReels.length);
        
        // Find shortest path rotation
        const currentMod = rotation % 360;
        const targetRotation = -cardAngle;
        let diff = (targetRotation - currentMod) % 360;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        setRotation(prev => prev + diff);
      } else {
        openModal(reel);
      }
    }
  };

  // Nav Button handlers
  const handlePrev = (e) => {
    e.stopPropagation();
    const step = 360 / (filteredReels.length || 1);
    setRotation(prev => prev + step);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    const step = 360 / (filteredReels.length || 1);
    setRotation(prev => prev - step);
  };

  // ESC key listener
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') closeModal(); };
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
    <section ref={sectionRef} id="showreel" className="py-24 px-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 mb-4 font-bold tracking-widest uppercase">
            <motion.div
              className="w-2 h-2 bg-amber-500 rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Latest Work
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
            Showreel
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto font-medium">
            Drag to rotate and explore commercial edits, brand launch edits, and behind the scenes.
          </p>
        </motion.div>

        {/* ---- Filter Tabs ---- */}
        <motion.div
          ref={filterRef}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <motion.button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className="relative px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2"
                style={{
                  color: isActive ? '#000' : filter.color,
                  backgroundColor: isActive ? filter.color : `${filter.color}15`,
                  border: `1.5px solid ${isActive ? filter.color : `${filter.color}40`}`,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                layout
              >
                {filter.label}
                <span
                  className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black"
                  style={{
                    backgroundColor: isActive ? 'rgba(0,0,0,0.25)' : `${filter.color}30`,
                    color: isActive ? '#000' : filter.color,
                  }}
                >
                  {filter.count}
                </span>

                {isActive && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    layoutId="active-filter-pill"
                    style={{ backgroundColor: filter.color, zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Active brand label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="flex items-center justify-center gap-3 mb-4"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <div
              className="h-[1px] w-16"
              style={{ backgroundColor: `${activeFilterConfig.color}50` }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.3em]"
              style={{ color: activeFilterConfig.color }}
            >
              {activeFilter === 'all'
                ? `All ${ALL_REELS.length} videos`
                : `${filteredReels.length} video${filteredReels.length !== 1 ? 's' : ''} · ${activeFilterConfig.label}`}
            </span>
            <div
              className="h-[1px] w-16"
              style={{ backgroundColor: `${activeFilterConfig.color}50` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* ---- 3D Draggable Wheel Viewport ---- */}
        <div className="relative w-full h-[450px] md:h-[520px] flex items-center justify-center overflow-visible select-none my-6">
          
          {/* 3D Perspective container */}
          <div 
            className="w-full h-full flex items-center justify-center overflow-visible relative"
            style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
            onMouseDown={(e) => startDrag(e.clientX)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Carousel Wheel Ring */}
            <div
              className="relative flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible"
              style={{
                width: cardWidth,
                height: cardHeight,
                transformStyle: 'preserve-3d',
              }}
            >
              {filteredReels.map((reel, index) => {
                const angle = index * (360 / filteredReels.length);
                const relativeAngle = ((angle + rotation) % 360 + 360) % 360;
                
                // Normalise relative angle to find front factor
                const rad = (relativeAngle * Math.PI) / 180;
                const cosAngle = Math.cos(rad);
                const isFacingFront = cosAngle > 0;

                // Mathematics for radius (distance from center)
                const count = filteredReels.length;
                const radius = count > 3 
                  ? Math.max(340, (cardWidth / 2) / Math.tan(Math.PI / count)) 
                  : (isMobile ? 180 : 240);

                // Depth effects (opacity, scale, blur, zIndex) based on angle
                const opacity = 0.25 + 0.75 * ((cosAngle + 1) / 2);
                const scale = 0.85 + 0.15 * ((cosAngle + 1) / 2);
                const blur = (1 - (cosAngle + 1) / 2) * 5.5;
                const zIndex = Math.round((cosAngle + 1) * 50);

                return (
                  <div
                    key={reel.id}
                    className="absolute inset-0 origin-center"
                    style={{
                      width: cardWidth,
                      height: cardHeight,
                      transform: `rotateY(${angle + rotation}deg) translateZ(${radius}px) scale(${scale})`,
                      backfaceVisibility: 'visible',
                      transformStyle: 'preserve-3d',
                      zIndex,
                      opacity,
                      filter: `blur(${blur}px)`,
                      pointerEvents: cosAngle > 0.35 ? 'auto' : 'none', // Disable interactions for background cards
                      transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.45s, filter 0.45s',
                    }}
                  >
                    <ReelCard
                      reel={reel}
                      isActive={activeReel === reel.id}
                      isFacingFront={isFacingFront}
                      onClick={() => handleCardClick(reel, cosAngle)}
                      onVideoEnd={() => setActiveReel(null)}
                      onOpenModal={openModal}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Left/Right manual click triggers */}
          {filteredReels.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-10 z-30 w-12 h-12 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 hover:border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-10 z-30 w-12 h-12 rounded-full bg-neutral-900/80 backdrop-blur-md border border-white/10 hover:border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>

        {/* Empty state */}
        <AnimatePresence>
          {filteredReels.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/20 font-bold uppercase tracking-widest text-sm">
                No videos in this category yet
              </p>
            </div>
          )}
        </AnimatePresence>

        {/* Hint */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-[10px] text-white/25 uppercase tracking-widest font-bold">
            DRAG LEFT OR RIGHT TO SPIN THE WHEEL · CLICK FRONT VIDEO TO VIEW FULLSCREEN · PRESS ESC TO CLOSE
          </p>
        </motion.div>
      </div>

      {/* ---- Fullscreen Modal ---- */}
      <AnimatePresence>
        {modalReel && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/65 backdrop-blur-lg" />

            {/* Ambient orbs */}
            <motion.div
              className="absolute top-20 left-20 w-40 h-40 rounded-full blur-2xl"
              style={{ background: `radial-gradient(circle, ${FILTERS.find(f => f.id === modalReel?.brand)?.color || '#f59e0b'}30, transparent)` }}
              animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-24 right-24 w-48 h-48 rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)' }}
              animate={{ x: [0, -60, 0], y: [0, -30, 0], scale: [1, 0.85, 1] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Modal card */}
            <motion.div
              className="relative w-full max-w-md mx-auto"
              initial={{ scale: 0.85, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                {/* Close */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Brand label */}
                {modalReel.brand && (
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: `${FILTERS.find(f => f.id === modalReel.brand)?.color || '#f59e0b'}25`,
                        color: FILTERS.find(f => f.id === modalReel.brand)?.color || '#f59e0b',
                        border: `1px solid ${FILTERS.find(f => f.id === modalReel.brand)?.color || '#f59e0b'}50`,
                      }}
                    >
                      {modalReel.type}
                    </span>
                  </div>
                )}

                {/* Video */}
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
                  </video>
                </div>

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent rounded-b-3xl">
                  <h3 className="text-xl font-black text-white mb-1 tracking-tighter">{modalReel.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <span className="flex items-center gap-1"><Play size={12} /> Video Reel</span>
                    <span className="flex items-center gap-1"><Volume2 size={12} /> Sound On</span>
                  </div>
                </div>

                {/* Gradient border shimmer */}
                <div
                  className="absolute inset-0 rounded-3xl pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${FILTERS.find(f => f.id === modalReel?.brand)?.color || '#f59e0b'}20, transparent, rgba(99,102,241,0.15))`,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </section>
    );
  };

export default ShowreelSection;
