import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2, Palette, Sparkles } from 'lucide-react';

const ColorGradingSection = () => {
  const [expandedItem, setExpandedItem] = useState(null);

  // Before/After comparison sets (can be videos or images)
  const beforeAfterSets = [
    {
      id: 1,
      before: "/images/color-before-1.jpg",
      after: "/images/color-after-1.jpg",
      type: "image",
      title: "Cinematic Color Grading",
      description: "From raw footage to cinematic color grade"
    },
    {
      id: 2,
      before: "/images/color-before-2.jpg",
      after: "/images/color-after-2.jpg",
      type: "image",
      title: "Professional Color Grade",
      description: "Transforming flat footage into vibrant cinematic visuals"
    },
    {
      id: 3,
      before: "/reels/before-3.mp4",
      after: "/reels/after-3.mp4",
      type: "video",
      title: "Brand Commercial",
      description: "Color transformation for maximum visual impact"
    }
  ];

  const openExpanded = (item) => {
    setExpandedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeExpanded = () => {
    setExpandedItem(null);
    document.body.style.overflow = 'unset';
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && expandedItem) {
        closeExpanded();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [expandedItem]);

  // Before/After comparison component
  const BeforeAfterCard = ({ set, onExpand }) => {
    const [splitPosition, setSplitPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const beforeVideoRef = useRef(null);
    const afterVideoRef = useRef(null);
    const isVideo = set.type === 'video';

    const updatePosition = (clientX) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSplitPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      updatePosition(e.clientX);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchStart = (e) => {
      e.stopPropagation();
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    // Handle click to move slider
    const handleClick = (e) => {
      if (e.target === containerRef.current || e.target.closest('.slider-container')) {
        updatePosition(e.clientX);
      }
    };

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [isDragging]);

    // Sync video playback
    useEffect(() => {
      if (!isVideo) return; // Skip for images
      
      const syncVideos = () => {
        if (beforeVideoRef.current && afterVideoRef.current) {
          afterVideoRef.current.currentTime = beforeVideoRef.current.currentTime;
        }
      };

      const beforeVid = beforeVideoRef.current;
      if (beforeVid) {
        beforeVid.addEventListener('timeupdate', syncVideos);
        return () => beforeVid.removeEventListener('timeupdate', syncVideos);
      }
    }, [isVideo]);

    return (
      <motion.div 
        className="relative rounded-xl overflow-hidden shadow-2xl group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ minWidth: '400px', maxWidth: '400px' }}
      >
        {/* Expand button */}
        <button
          onClick={onExpand}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-black/70 hover:scale-110"
          title="Expand to fullscreen"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        <div 
          ref={containerRef}
          className="relative aspect-video cursor-ew-resize select-none touch-none slider-container"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
        >
          {/* After (Full width) */}
          <div className="absolute inset-0">
            {isVideo ? (
              <video
                ref={afterVideoRef}
                src={set.after}
                className="w-full h-full object-cover"
                loop
                muted
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={set.after}
                alt="After color grading"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 rounded-full text-black text-sm font-semibold">
              After
            </div>
          </div>

          {/* Before (Clipped) */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
          >
            {isVideo ? (
              <video
                ref={beforeVideoRef}
                src={set.before}
                className="w-full h-full object-cover"
                loop
                muted
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={set.before}
                alt="Before color grading"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-black text-sm font-semibold">
              Before
            </div>
          </div>

          {/* Slider */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center">
              <div className="flex gap-1">
                <div className="w-0.5 h-4 bg-gray-600"></div>
                <div className="w-0.5 h-4 bg-gray-600"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="bg-neutral-900/80 backdrop-blur-sm p-4 border-t border-white/10">
          <h3 className="text-white text-lg font-bold mb-1">{set.title}</h3>
          <p className="text-gray-400 text-sm">{set.description}</p>
          <p className="text-amber-500 text-xs mt-2">← Drag slider · Tap to expand →</p>
        </div>
      </motion.div>
    );
  };

  // Expanded fullscreen view component
  const ExpandedView = ({ set, onClose }) => {
    const [splitPosition, setSplitPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const beforeVideoRef = useRef(null);
    const afterVideoRef = useRef(null);
    const isVideo = set.type === 'video';

    const updatePosition = (clientX) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSplitPosition(Math.max(0, Math.min(100, percentage)));
    };

    const handleMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      updatePosition(e.clientX);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchStart = (e) => {
      e.stopPropagation();
      setIsDragging(true);
      updatePosition(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      updatePosition(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    const handleClick = (e) => {
      if (e.target === containerRef.current || e.target.closest('.slider-container')) {
        updatePosition(e.clientX);
      }
    };

    useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);
        
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleTouchEnd);
        };
      }
    }, [isDragging]);

    // Sync video playback
    useEffect(() => {
      if (!isVideo) return;
      
      const syncVideos = () => {
        if (beforeVideoRef.current && afterVideoRef.current) {
          afterVideoRef.current.currentTime = beforeVideoRef.current.currentTime;
        }
      };

      const beforeVid = beforeVideoRef.current;
      if (beforeVid) {
        beforeVid.addEventListener('timeupdate', syncVideos);
        return () => beforeVid.removeEventListener('timeupdate', syncVideos);
      }
    }, [isVideo]);

    return (
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <motion.div
          className="relative w-full max-w-6xl mx-auto"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <div 
              ref={containerRef}
              className="relative aspect-video cursor-ew-resize select-none touch-none slider-container"
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onClick={handleClick}
            >
              {/* After (Full width) */}
              <div className="absolute inset-0">
                {isVideo ? (
                  <video
                    ref={afterVideoRef}
                    src={set.after}
                    className="w-full h-full object-contain bg-black"
                    loop
                    muted
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={set.after}
                    alt="After color grading"
                    className="w-full h-full object-contain bg-black"
                  />
                )}
                <div className="absolute top-6 right-6 px-4 py-2 bg-amber-500/90 rounded-full text-black text-base font-semibold shadow-lg">
                  After
                </div>
              </div>

              {/* Before (Clipped) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
              >
                {isVideo ? (
                  <video
                    ref={beforeVideoRef}
                    src={set.before}
                    className="w-full h-full object-contain bg-black"
                    loop
                    muted
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={set.before}
                    alt="Before color grading"
                    className="w-full h-full object-contain bg-black"
                  />
                )}
                <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 rounded-full text-black text-base font-semibold shadow-lg">
                  Before
                </div>
              </div>

              {/* Slider */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10"
                style={{ left: `${splitPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center">
                  <div className="flex gap-1">
                    <div className="w-0.5 h-5 bg-gray-600"></div>
                    <div className="w-0.5 h-5 bg-gray-600"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Title bar */}
            <div className="bg-black/50 backdrop-blur-sm p-6 border-t border-white/10">
              <h3 className="text-white text-2xl font-bold mb-2">{set.title}</h3>
              <p className="text-gray-300 text-base">{set.description}</p>
              <p className="text-amber-400 text-sm mt-3">← Drag slider to compare · Press ESC to close →</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <section id="color-grading" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-500 mb-4">
            <Palette className="w-4 h-4" />
            Color Mastery
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Color Grading
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            See the dramatic transformation from raw footage to cinematic masterpiece. Drag the slider to compare before and after.
          </p>
        </motion.div>

        {/* Horizontal Scroll Gallery */}
        <div className="relative">
          {/* Scroll hint */}
          <motion.div 
            className="text-center mb-4 text-neutral-500 text-sm flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Scroll horizontally or tap to expand
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>

          {/* Horizontal scrollable container */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto overflow-y-hidden pb-6 scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-neutral-800"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#f59e0b #262626'
            }}
          >
            <div className="flex gap-6 px-4 min-w-max">
              {beforeAfterSets.map((set) => (
                <BeforeAfterCard 
                  key={set.id} 
                  set={set} 
                  onExpand={() => openExpanded(set)}
                />
              ))}
            </div>
          </motion.div>

          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/80 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/80 to-transparent pointer-events-none"></div>
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-neutral-500 text-sm mb-6">
            Professional color grading services for commercials, music videos, and branded content
          </p>
          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-amber-500 text-black font-semibold rounded-full hover:bg-amber-400 transition-all"
          >
            Get Professional Color Grading
          </button>
        </motion.div>
      </div>

      {/* Expanded fullscreen modal */}
      <AnimatePresence>
        {expandedItem && (
          <ExpandedView 
            set={expandedItem} 
            onClose={closeExpanded}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ColorGradingSection;
