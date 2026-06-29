import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ---- Animated Counter Hook ----
function useCountUp(target, duration = 2000, inView = true) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return count;
}

// ---- Single Stat Card ----
const StatCard = ({ value, suffix, label, description, color, delay, inView }) => {
  const count = useCountUp(value, 1800, inView);

  return (
    <motion.div
      className="relative flex flex-col items-center text-center px-6 py-8 group"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {/* Vertical divider (except first) */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-16 bg-white/5 hidden lg:block" />

      {/* Glow blob behind number */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: `radial-gradient(ellipse at center, ${color}10, transparent 70%)` }}
      />

      {/* Number */}
      <div
        className="text-[72px] md:text-[88px] font-black leading-none tracking-tighter tabular-nums"
        style={{ color }}
      >
        {count}
        <span className="text-[44px] md:text-[56px]">{suffix}</span>
      </div>

      {/* Label */}
      <div className="mt-3 text-sm font-black uppercase tracking-[0.25em] text-white">
        {label}
      </div>

      {/* Description */}
      <p className="mt-2 text-xs text-white/35 font-medium leading-relaxed max-w-[160px]">
        {description}
      </p>
    </motion.div>
  );
};

// ---- Scrolling Ticker ----
const Ticker = () => {
  const items = [
    'Realme', '·', 'OnePlus', '·', 'Fuse', '·', 'Duroflex', '·',
    'Honor', '·', 'MuscleBlaze', '·', 'Ishan Kishan', '·',
    'Shreyanka Patil', '·', 'Realme', '·', 'OnePlus', '·', 'Fuse', '·',
    'Duroflex', '·', 'Honor', '·', 'MuscleBlaze', '·', 'Ishan Kishan', '·',
    'Shreyanka Patil', '·',
  ];

  return (
    <div className="relative overflow-hidden mt-14 py-4 border-t border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-neutral-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-neutral-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`text-xs font-black uppercase tracking-[0.3em] ${
              item === '·' ? 'text-amber-500/40' : 'text-white/20'
            }`}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// ---- Main Stats Section ----
const StatsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const stats = [
    {
      value: 5,
      suffix: '+',
      label: 'Major Brands',
      description: 'Realme, OnePlus, Honor, Duroflex & Fuse',
      color: '#f59e0b',
      delay: 0,
    },
    {
      value: 50,
      suffix: '+',
      label: 'Reels Delivered',
      description: 'Short-form vertical content for social',
      color: '#818cf8',
      delay: 0.1,
    },
    {
      value: 12,
      suffix: '+',
      label: 'Brand Campaigns',
      description: 'Launch films, events & product edits',
      color: '#34d399',
      delay: 0.2,
    },
    {
      value: 4,
      suffix: '+',
      label: 'Years Experience',
      description: 'Since 2021 — shooting, editing, grading',
      color: '#f472b6',
      delay: 0.3,
    },
  ];

  return (
    <section className="bg-neutral-950 py-20 px-6 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-[1400px] mx-auto" ref={ref}>
        {/* Label */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 mb-3 font-black uppercase tracking-widest">
            By The Numbers
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">
            Work that <span className="text-amber-500">speaks</span> for itself
          </h2>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 relative">
          {/* Horizontal border line */}
          <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />

          {stats.map((stat, i) => (
            <StatCard key={i} {...stat} inView={inView} />
          ))}
        </div>

        {/* Scrolling ticker */}
        <Ticker />
      </div>
    </section>
  );
};

export default StatsSection;
