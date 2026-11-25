import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Palette } from 'lucide-react';
import { sfx } from '../utils/sfx';

const LUT_PRESETS = [
  {
    id: 'studio',
    label: 'STUDIO GRADE',
    filter: 'contrast(1.12) saturate(1.25)',
    wheels: { lift: '#1d4ed8', gamma: '#f59e0b', gain: '#fef3c7' },
  },
  {
    id: 'kodak',
    label: 'KODAK 2383',
    filter: 'contrast(1.22) saturate(1.35) sepia(0.18) hue-rotate(-6deg)',
    wheels: { lift: '#0f766e', gamma: '#ea580c', gain: '#fde68a' },
  },
  {
    id: 'teal-orange',
    label: 'TEAL & ORANGE',
    filter: 'contrast(1.25) saturate(1.45) hue-rotate(-10deg)',
    wheels: { lift: '#06b6d4', gamma: '#f97316', gain: '#ffedd5' },
  },
  {
    id: 'noir-gold',
    label: 'WARM NOIR',
    filter: 'grayscale(0.72) contrast(1.35) sepia(0.28) brightness(0.96)',
    wheels: { lift: '#18181b', gamma: '#d97706', gain: '#fef08a' },
  },
];

const BEFORE_AFTER_SETS = [
  {
    id: 1,
    before: '/images/abhishek-about.jpg',
    after: '/images/abhishek-about.jpg',
    type: 'image',
    title: 'Cinematic Color Grading',
    description: 'From flat monochrome treatment to a warmer, polished portrait finish',
    beforeClass: 'grayscale contrast-75 brightness-110',
  },
  {
    id: 2,
    before: '/thumbnails/fuse-bangalore.jpg',
    after: '/thumbnails/fuse-bangalore.jpg',
    type: 'image',
    title: 'Professional Color Grade',
    description: 'Lifting event footage with cleaner contrast and stronger brand color',
    beforeClass: 'grayscale brightness-110 contrast-75',
  },
];

function BeforeAfterCard({ set, activeLut, onExpand }) {
  const [splitPosition, setSplitPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      e.preventDefault();
      updatePosition(e.clientX);
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches?.[0]) updatePosition(e.touches[0].clientX);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
      className="group relative rounded-3xl overflow-hidden border border-white/10 bg-[#121212] shadow-2xl hover:border-amber-500/40 transition-colors"
    >
      {/* Top RGB spectrum accent */}
      <div
        className="h-[2px] w-full"
        style={{
          background:
            'linear-gradient(90deg, #ef4444, #f59e0b, #eab308, #22c55e, #3b82f6, #8b5cf6)',
        }}
      />

      {/* Expand button */}
      <button
        type="button"
        onClick={onExpand}
        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-amber-500 hover:text-black hover:scale-110"
        title="Expand to fullscreen"
      >
        <Maximize2 className="w-4 h-4" />
      </button>

      <div
        ref={containerRef}
        className="relative aspect-video cursor-ew-resize select-none touch-none slider-container"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
          updatePosition(e.clientX);
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsDragging(true);
          if (e.touches?.[0]) updatePosition(e.touches[0].clientX);
        }}
        onClick={(e) => updatePosition(e.clientX)}
      >
        {/* After (Full width, live LUT filter) */}
        <div className="absolute inset-0">
          <img
            src={set.after}
            alt="After color grading"
            style={{ filter: activeLut.filter }}
            className="w-full h-full object-cover transition-[filter] duration-500"
          />
          <div className="absolute top-4 right-16 px-3 py-1 bg-amber-500 rounded-full text-black text-xs font-black uppercase tracking-wider shadow-lg">
            {activeLut.label}
          </div>
        </div>

        {/* Before (Clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
        >
          <img
            src={set.before}
            alt="Before color grading"
            className={`w-full h-full object-cover ${set.beforeClass || ''}`}
          />
          <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 rounded-full text-black text-xs font-black uppercase tracking-wider shadow">
            Raw / Log
          </div>
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-10"
          style={{ left: `${splitPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center ring-4 ring-black/20">
            <div className="flex gap-1">
              <div className="w-0.5 h-4 bg-neutral-700" />
              <div className="w-0.5 h-4 bg-neutral-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-white/5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-white text-xl font-black uppercase tracking-tight">
            {set.title}
          </h3>
          <p className="text-white/50 text-xs font-medium mt-1">{set.description}</p>
        </div>
        <button
          type="button"
          onClick={onExpand}
          className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-amber-500 hover:bg-amber-500 hover:text-black transition-colors"
        >
          Expand ↗
        </button>
      </div>
    </motion.div>
  );
}

function ExpandedView({ set, activeLut, onClose }) {
  const [splitPosition, setSplitPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const updatePosition = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setSplitPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      e.preventDefault();
      updatePosition(e.clientX);
    };
    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches?.[0]) updatePosition(e.touches[0].clientX);
    };
    const onUp = () => setIsDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [isDragging]);

  return (
    <motion.div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close expanded view"
        className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="relative w-full max-w-5xl mx-auto rounded-2xl border border-white/15 bg-black overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={containerRef}
          className="relative aspect-video cursor-ew-resize select-none touch-none"
          onMouseDown={(e) => {
            e.preventDefault();
            setIsDragging(true);
            updatePosition(e.clientX);
          }}
          onTouchStart={(e) => {
            setIsDragging(true);
            if (e.touches?.[0]) updatePosition(e.touches[0].clientX);
          }}
          onClick={(e) => updatePosition(e.clientX)}
        >
          <img
            src={set.after}
            alt="After color grading"
            style={{ filter: activeLut.filter }}
            className="w-full h-full object-contain bg-black"
          />
          <div className="absolute top-5 right-5 px-4 py-1.5 bg-amber-500 rounded-full text-black text-xs font-black uppercase tracking-wider">
            {activeLut.label}
          </div>

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - splitPosition}% 0 0)` }}
          >
            <img
              src={set.before}
              alt="Before color grading"
              className={`w-full h-full object-contain bg-black ${set.beforeClass || ''}`}
            />
            <div className="absolute top-5 left-5 px-4 py-1.5 bg-white/90 rounded-full text-black text-xs font-black uppercase tracking-wider">
              Raw / Log
            </div>
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10"
            style={{ left: `${splitPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center">
              <div className="flex gap-1.5">
                <div className="w-0.5 h-5 bg-gray-700" />
                <div className="w-0.5 h-5 bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const ColorGradingSection = () => {
  const [expandedItem, setExpandedItem] = useState(null);
  const [activeLut, setActiveLut] = useState(LUT_PRESETS[0]);

  const openExpanded = (item) => {
    setExpandedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeExpanded = () => {
    setExpandedItem(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && expandedItem) closeExpanded();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [expandedItem]);

  return (
    <section className="py-14 px-6 bg-neutral-950 relative overflow-hidden">
      <div className="persp-stage">
        <div data-tseily-flip className="max-w-6xl mx-auto will-change-transform">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 mb-4 font-black tracking-widest uppercase">
              <Palette className="w-4 h-4" />
              Color Mastery
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-white uppercase">
              Color Grading
            </h2>
            <p className="text-base md:text-lg text-white/55 max-w-2xl mx-auto font-medium">
              Switch live DaVinci LUTs below and drag the slider to compare raw footage against the finished grade.
            </p>
          </div>

          {/* Interactive DaVinci Color Wheels + Live LUT Switcher */}
          <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-4">
            {/* Animated 3 Color Wheels */}
            <div className="flex items-center gap-5">
              {(['lift', 'gamma', 'gain']).map((wheel) => (
                <div key={wheel} className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: activeLut.id === 'studio' ? 0 : activeLut.id === 'kodak' ? 75 : activeLut.id === 'teal-orange' ? 145 : 220 }}
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                    className="relative h-8 w-8 rounded-full border border-white/20 p-1"
                    style={{
                      background:
                        'conic-gradient(#ef4444, #f59e0b, #22c55e, #06b6d4, #3b82f6, #ec4899, #ef4444)',
                    }}
                  >
                    <div className="h-full w-full rounded-full bg-[#111] flex items-center justify-center">
                      <span
                        className="h-2.5 w-2.5 rounded-full transition-colors duration-300"
                        style={{ backgroundColor: activeLut.wheels[wheel] }}
                      />
                    </div>
                  </motion.div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/50">
                    {wheel}
                  </span>
                </div>
              ))}
            </div>

            {/* LUT Look Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {LUT_PRESETS.map((lut) => {
                const isActive = lut.id === activeLut.id;
                return (
                  <button
                    key={lut.id}
                    type="button"
                    onClick={() => {
                      sfx.sliderTick();
                      setActiveLut(lut);
                    }}
                    className={`rounded-full border px-4 py-1.5 font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                      isActive
                        ? 'border-amber-500 bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.35)]'
                        : 'border-white/15 bg-white/5 text-white/65 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {lut.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Centered 2-Column Interactive Before/After Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {BEFORE_AFTER_SETS.map((set) => (
              <BeforeAfterCard
                key={set.id}
                set={set}
                activeLut={activeLut}
                onExpand={() => openExpanded(set)}
              />
            ))}
          </div>

          {/* CTA — Premium Banner */}
          <motion.div
            className="relative mt-14 rounded-2xl overflow-hidden border border-white/10"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{
                background:
                  'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6, #ec4899)',
              }}
            />
            <div className="bg-white/[0.03] px-8 py-9 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.4em] text-amber-500 mb-2">
                  Professional Service
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-2">
                  Get your footage graded
                </h3>
                <p className="text-white/45 text-sm font-medium max-w-sm">
                  Commercials, music videos, brand content — any format, any look.
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'].map((c) => (
                  <div
                    key={c}
                    className="w-4 h-4 rounded-full border-2 border-black/30"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex-shrink-0 px-8 py-4 bg-amber-500 text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all shadow-2xl shadow-amber-500/30"
              >
                Book a Grade →
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Expanded fullscreen modal portaled to body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {expandedItem && (
              <ExpandedView
                set={expandedItem}
                activeLut={activeLut}
                onClose={closeExpanded}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
};

export default ColorGradingSection;
