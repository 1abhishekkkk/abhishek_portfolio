import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GRAIN = `data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

// Horizontal static noise bars for signal phase
const SignalNoise = () => (
  <motion.div
    className="absolute inset-0 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.3 } }}
  >
    {Array.from({ length: 28 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute left-0 right-0"
        style={{ top: `${(i / 28) * 100}%`, height: `${100 / 28}%` }}
        animate={{
          backgroundColor: [
            'rgba(255,255,255,0)',
            `rgba(255,255,255,${Math.random() * 0.12})`,
            'rgba(255,255,255,0)',
            `rgba(255,255,255,${Math.random() * 0.08})`,
            'rgba(255,255,255,0)',
          ],
          x: [0, Math.random() * 10 - 5, 0],
        }}
        transition={{ duration: 0.45, delay: Math.random() * 0.25, ease: 'linear' }}
      />
    ))}
    {/* Bright flash bars */}
    {[0.18, 0.47, 0.73].map((pct, i) => (
      <motion.div
        key={`bright-${i}`}
        className="absolute left-0 right-0 bg-white/20"
        style={{ top: `${pct * 100}%`, height: '1px' }}
        animate={{ opacity: [0, 1, 0], scaleX: [0.5, 1, 0.7] }}
        transition={{ duration: 0.3, delay: i * 0.12 }}
      />
    ))}
    {/* SIGNAL ACQUIRING label */}
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.5, 1, 0] }}
      transition={{ duration: 0.5, times: [0, 0.2, 0.5, 0.7, 1] }}
    >
      <span className="text-[9px] font-black font-mono text-amber-500 tracking-[0.6em] uppercase">
        Signal Acquiring...
      </span>
    </motion.div>
  </motion.div>
);

// Loading Screen Component
const LoadingScreen = ({ onComplete }) => {
  // phases: init → signal → title → glitch → iris
  const [phase, setPhase] = useState('init');

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('signal'), 150),
      setTimeout(() => setPhase('title'), 680),
      setTimeout(() => setPhase('glitch'), 2300),
      setTimeout(() => setPhase('iris'), 2680),
      setTimeout(() => onComplete(), 3520),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const showContent = phase === 'title' || phase === 'glitch';
  const isGlitch = phase === 'glitch';
  const isIris = phase === 'iris';

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      initial={{ clipPath: 'circle(150% at 50% 50%)' }}
      animate={{
        clipPath: isIris
          ? 'circle(0% at 50% 50%)'
          : 'circle(150% at 50% 50%)',
      }}
      transition={
        isIris
          ? { duration: 0.84, ease: [0.87, 0, 0.13, 1] }
          : { duration: 0 }
      }
    >
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.055] mix-blend-screen pointer-events-none"
        style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '256px 256px' }}
      />

      {/* Signal noise - initial static */}
      <AnimatePresence>
        {phase === 'signal' && <SignalNoise />}
      </AnimatePresence>

      {/* ---- MAIN TITLE CONTENT ---- */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isGlitch ? 0 : 1 }}
            transition={{ duration: isGlitch ? 0.22 : 0.01 }}
          >
            {/* ABHI'S — crashes in from top */}
            <div className="overflow-hidden leading-none">
              <motion.h1
                className="text-[20vw] md:text-[14vw] font-black tracking-tighter leading-none text-white"
                style={
                  isGlitch
                    ? {
                        textShadow:
                          '10px 0 0 rgba(255,30,80,0.75), -10px 0 0 rgba(0,140,255,0.75)',
                      }
                    : {}
                }
                initial={{ y: '-110%' }}
                animate={{
                  y: '0%',
                  x: isGlitch ? [0, -10, 7, -5, 9, -3, 0] : 0,
                }}
                transition={
                  isGlitch
                    ? { x: { duration: 0.3, ease: 'linear' } }
                    : {
                        y: {
                          type: 'spring',
                          stiffness: 260,
                          damping: 22,
                          delay: 0.05,
                        },
                      }
                }
              >
                ABHI'S
              </motion.h1>
            </div>

            {/* Amber divider line */}
            <motion.div
              className="overflow-hidden my-1"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.55, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
            >
              <div
                className="h-[2px] w-[60vw] md:w-[48vw]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #f59e0b, #fbbf24, #f59e0b, transparent)',
                }}
              />
            </motion.div>

            {/* CREATIVE STUDIO — crashes in from bottom */}
            <div className="overflow-hidden leading-none">
              <motion.p
                className="text-[5.5vw] md:text-[3.8vw] font-extralight tracking-[0.55em] text-white/55 uppercase"
                style={
                  isGlitch
                    ? {
                        textShadow:
                          '10px 0 0 rgba(255,30,80,0.5), -10px 0 0 rgba(0,140,255,0.5)',
                      }
                    : {}
                }
                initial={{ y: '110%' }}
                animate={{
                  y: '0%',
                  x: isGlitch ? [0, 8, -6, 4, -8, 2, 0] : 0,
                }}
                transition={
                  isGlitch
                    ? { x: { duration: 0.3, ease: 'linear' } }
                    : {
                        y: {
                          type: 'spring',
                          stiffness: 260,
                          damping: 22,
                          delay: 0.1,
                        },
                      }
                }
              >
                Creative Studio
              </motion.p>
            </div>

            {/* Meta pill */}
            <motion.div
              className="flex items-center gap-3 mt-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.35em]">
                Photographer · Editor · Colorist
              </span>
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-amber-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- SCAN LINE (amber sweep) ---- */}
      <AnimatePresence>
        {phase === 'title' && (
          <motion.div
            className="absolute left-0 right-0 h-[1px] pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.0) 10%, rgba(245,158,11,0.8) 50%, rgba(245,158,11,0.0) 90%, transparent 100%)',
            }}
            initial={{ top: '-2px', opacity: 0 }}
            animate={{ top: '102%', opacity: [0, 1, 1, 0.4] }}
            transition={{ duration: 1.35, ease: 'linear', delay: 0.55 }}
          />
        )}
      </AnimatePresence>

      {/* ---- GLITCH NOISE BARS ---- */}
      <AnimatePresence>
        {isGlitch && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.7, 1, 0.5, 0] }}
            transition={{ duration: 0.38, times: [0, 0.1, 0.3, 0.55, 0.8, 1] }}
          >
            {[12, 34, 53, 67, 82].map((pct, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 bg-white/10"
                style={{ top: `${pct}%`, height: '2px' }}
                animate={{
                  x: [0, -30, 20, -15, 0],
                  opacity: [0.6, 1, 0.4, 0.8, 0],
                }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              />
            ))}
            {/* Bright flash pulse */}
            <motion.div
              className="absolute inset-0 bg-white"
              animate={{ opacity: [0, 0.07, 0, 0.05, 0] }}
              transition={{ duration: 0.35, ease: 'linear' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- BOTTOM TIMECODE STRIP ---- */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-center pointer-events-none">
        <motion.span
          className="text-[8px] font-mono text-white/12 tracking-wider"
          animate={{ opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          ABHI_PORTFOLIO_2025_FINAL_v3.prproj
        </motion.span>
        <motion.span
          className="text-[8px] font-mono text-amber-500/40 tracking-widest"
          animate={{ opacity: [1, 0.15, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        >
          ● REC
        </motion.span>
      </div>

      {/* ---- CORNER ACCENTS ---- */}
      {[
        'top-6 left-6 border-t border-l',
        'top-6 right-6 border-t border-r',
        'bottom-12 left-6 border-b border-l',
        'bottom-12 right-6 border-b border-r',
      ].map((cls, i) => (
        <motion.div
          key={i}
          className={`absolute w-5 h-5 border-white/15 ${cls}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
        />
      ))}
    </motion.div>
  );
};

export default LoadingScreen;
