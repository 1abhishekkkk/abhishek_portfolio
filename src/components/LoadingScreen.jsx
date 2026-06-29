import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const GRAIN = `data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

const LoadingScreen = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    const hideSplineLogo = () => {
      // 1. Target <spline-viewer> shadow DOM
      const viewer = document.querySelector('spline-viewer');
      if (viewer && viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo');
        if (logo) {
          logo.style.display = 'none';
          logo.style.opacity = '0';
          logo.style.visibility = 'hidden';
          logo.style.pointerEvents = 'none';
        }
      }
      // 2. Target regular DOM elements just in case
      const logos = document.querySelectorAll('#logo, a[href*="spline.design"]');
      logos.forEach(logo => {
        logo.style.display = 'none';
        logo.style.opacity = '0';
        logo.style.visibility = 'hidden';
        logo.style.pointerEvents = 'none';
      });
    };

    const interval = setInterval(hideSplineLogo, 100);
    const timeout = setTimeout(() => clearInterval(interval), 6000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

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

          {/* ---- Spline 3D Scene Background ---- */}
          <motion.div 
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: splineLoaded ? 0.75 : 0 }}
            transition={{ duration: 1.5 }}
          >
            <Spline 
              scene="https://prod.spline.design/wqZi1zWIwZIpnXEL/scene.splinecode" 
              onLoad={() => setSplineLoaded(true)}
            />
          </motion.div>

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
              Photographer, Video Editor & Colorist
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
