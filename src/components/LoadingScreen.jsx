import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRAIN = `data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

// Floating orb configs — mimic the Spline aesthetic with pure CSS
const ORBS = [
  {
    id: 1,
    size: 420,
    x: '50%',
    y: '50%',
    tx: '-50%',
    ty: '-50%',
    colors: ['#c97c3a', '#4a6fa5', '#7a4a8a'],
    blur: 60,
    duration: 8,
    delay: 0,
  },
  {
    id: 2,
    size: 220,
    x: '70%',
    y: '25%',
    tx: '-50%',
    ty: '-50%',
    colors: ['#6b6b6b', '#4a4a4a', '#888'],
    blur: 40,
    duration: 10,
    delay: 1,
  },
  {
    id: 3,
    size: 200,
    x: '30%',
    y: '68%',
    tx: '-50%',
    ty: '-50%',
    colors: ['#555', '#3a3a3a', '#777'],
    blur: 35,
    duration: 12,
    delay: 0.5,
  },
];

const LoadingScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 850);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-neutral-950 overflow-hidden flex flex-col items-center justify-center"
          exit={{ 
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* Subtle film grain texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none z-30"
            style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '256px 256px' }}
          />

          {/* ---- Animated CSS Orbs (replaces Spline) ---- */}
          <div className="absolute inset-0 z-0">
            {ORBS.map((orb) => (
              <motion.div
                key={orb.id}
                className="absolute rounded-full"
                style={{
                  width: orb.size,
                  height: orb.size,
                  left: orb.x,
                  top: orb.y,
                  translateX: orb.tx,
                  translateY: orb.ty,
                  background: `radial-gradient(ellipse at 35% 35%, ${orb.colors[0]}, ${orb.colors[1]} 50%, ${orb.colors[2]} 100%)`,
                  filter: `blur(${orb.blur}px)`,
                  opacity: 0.75,
                }}
                animate={{
                  scale: [1, 1.06, 0.97, 1.04, 1],
                  x: [0, 12, -8, 6, 0],
                  y: [0, -10, 8, -4, 0],
                  rotate: [0, 8, -5, 3, 0],
                }}
                transition={{
                  duration: orb.duration,
                  delay: orb.delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* ---- Center Typography (Serif Style) ---- */}
          <motion.div
            className="relative z-10 text-center max-w-2xl px-6 pointer-events-none select-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            <h1 
              className="text-4xl md:text-6xl text-white font-serif tracking-tight leading-tight mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Hello!<br />I'm Abhishek Kumar
            </h1>
            <p className="text-[10px] md:text-xs text-neutral-400 font-bold tracking-[0.25em] uppercase">
              Photographer, Video Editor &amp; Colorist
            </p>
          </motion.div>

          {/* ---- Enter Portfolio Button ---- */}
          <motion.div
            className="absolute bottom-16 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <button 
              onClick={handleEnter}
              className="px-8 py-3.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:border-white transition-all duration-300 shadow-2xl"
            >
              Enter Portfolio
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
