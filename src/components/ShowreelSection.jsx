import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';

// Full unified reels dataset with brand/category tags
const ALL_REELS = [
  {
    id: 25,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/titan-x-flipcart.mp4",
    title: "Titan x Flipkart Commercial",
    brand: "titan",
    type: "Brand Commercial",
  },

  {
    id: 0,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-2-render.mp4",
    title: "Fuse Bangalore 2 Render",
    brand: "fuse",
    type: "Brand Event",
  },
  {
    id: 2,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-bangalore.mp4",
    title: "Fuse Bangalore",
    brand: "fuse",
    type: "Brand Event",
  },
  {
    id: 3,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-bts-final.mp4",
    title: "Fuse BTS Final",
    brand: "fuse",
    type: "Behind the Scenes",
  },
  {
    id: 10,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/ishan-kishan.mp4",
    title: "Ishan Kishan - Cricket Edit",
    brand: "sports",
    type: "Sports Edit",
  },
  {
    id: 4,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-15pro-launch-new.mp4",
    title: "Realme 15 Pro Launch",
    brand: "realme",
    type: "Launch Campaign",
  },
  {
    id: 5,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/honor-brand.mp4",
    title: "Honor Brand Commercial",
    brand: "honor",
    type: "Brand Commercial",
  },
  {
    id: 15,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-black-t.mp4",
    title: "FUSE Black T",
    brand: "fuse",
    type: "Product Showcase",
  },
  {
    id: 16,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-violet-t.mp4",
    title: "FUSE Violet T",
    brand: "fuse",
    type: "Product Showcase",
  },
  {
    id: 17,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-tiger-t.mp4",
    title: "FUSE Tiger T",
    brand: "fuse",
    type: "Product Showcase",
  },
  {
    id: 18,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-dragon-t.mp4",
    title: "FUSE Dragon T",
    brand: "fuse",
    type: "Product Showcase",
  },
  {
    id: 19,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-beetle-t.mp4",
    title: "FUSE Beetle T",
    brand: "fuse",
    type: "Product Showcase",
  },
  {
    id: 20,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-white-t.mp4",
    title: "FUSE White T",
    brand: "fuse",
    type: "Product Showcase",
  },
  {
    id: 1,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/shreyanka-x-duroflex.mp4",
    title: "Shreyanka x Duroflex",
    brand: "duroflex",
    type: "Collaboration",
  },
  {
    id: 6,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-11pro.mp4",
    title: "Realme 11 Pro",
    brand: "realme",
    type: "Product Launch",
  },
  {
    id: 7,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fashion-gurav.mp4",
    title: "Fashion Commercial",
    brand: "fashion",
    type: "Fashion Edit",
  },
  {
    id: 8,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-16pro-plus.mp4",
    title: "Realme 16 Pro+",
    brand: "realme",
    type: "Product Launch",
  },
  {
    id: 9,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-16pro-plus-launch.mp4",
    title: "Realme 16 Pro+ Launch",
    brand: "realme",
    type: "Launch Campaign",
  },
  {
    id: 11,
    src: "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/oneplus-final.mp4",
    title: "OnePlus Campaign",
    brand: "oneplus",
    type: "Campaign",
  },
  {
    id: 13,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/v1782728618/reels/denovoo-final.mp4",
    title: "Denovoo Broadway Commercial",
    brand: "denovoo",
    type: "Brand Commercial",
  },
  {
    id: 14,
    src: "https://res.cloudinary.com/de6kkxnqn/video/upload/f_auto,q_auto/v1782736694/reels/mono-podcast.mp4",
    title: "Mono Podcast",
    brand: "mono",
    type: "Podcast Edit",
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
  { id: "mono",     label: "Mono",     color: "#94a3b8", count: ALL_REELS.filter(r => r.brand === "mono").length },
  { id: "custom", label: "Custom", color: "#f59e0b", count: ALL_REELS.filter(r => r.brand === "custom").length },
  { id: "titan", label: "Titan", color: "#a855f7", count: ALL_REELS.filter(r => r.brand === "titan").length },
];

// ---------- Reel Card ----------
const ReelCard = ({ reel, onOpenModal }) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const brandFilter = FILTERS.find(f => f.id === reel.brand);
  const accentColor = brandFilter?.color || '#f59e0b';

  return (
    <motion.div
      className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer group shadow-2xl"
      style={{
        borderColor: isHovered ? accentColor : 'rgba(255,255,255,0.05)',
        boxShadow: isHovered ? `0 0 20px -2px ${accentColor}30` : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(reel)}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="relative w-full h-full bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover pointer-events-none"
          loop
          muted
          playsInline
          autoPlay
          preload="metadata"
          onLoadedData={(e) => {
            setVideoLoaded(true);
            e.target.play().catch(err => console.log('Autoplay blocked:', err));
          }}
          src={reel.src}
        />

        {/* Loading Placeholder */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/25 border-t-white/85 rounded-full animate-spin" />
          </div>
        )}

        {/* Overlay Darkener */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/95" />

        {/* Play indicator overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/25 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Brand type badge */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span
            className="text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full backdrop-blur-md"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor, border: `1.5px solid ${accentColor}35` }}
          >
            {reel.type}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none z-10 flex flex-col justify-end">
          <h3 className="text-white font-black text-xs md:text-sm leading-tight tracking-tight uppercase mb-0.5">{reel.title}</h3>
          <p className="text-[9px] text-white/50 tracking-wider font-semibold uppercase">{reel.brand}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ---------- Main Section ----------
const ShowreelSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalReel, setModalReel] = useState(null);
  const modalVideoRef = useRef(null);

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
    <section id="showreel" className="py-24 px-6 bg-transparent overflow-hidden">
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
            Explore commercial edits, brand launch edits, and behind the scenes.
          </p>
        </motion.div>

        {/* ---- Filter Tabs ---- */}
        <motion.div
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
            className="flex items-center justify-center gap-3 mb-8"
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

        {/* ---- Video Grid ---- */}
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredReels.map((reel) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <ReelCard reel={reel} onOpenModal={openModal} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

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
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <p className="text-[10px] text-white/25 uppercase tracking-widest font-bold">
            HOVER OVER A CARD TO PREVIEW · CLICK TO PLAY FULLSCREEN WITH SOUND · PRESS ESC TO CLOSE
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
