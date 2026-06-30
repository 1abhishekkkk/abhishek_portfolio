import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

const GRAIN = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E`;

// Floating 3D-like glass objects (CSS-rendered, no library needed)
const FloatingObject = ({ style, children, delay = 0, duration = 6 }) => (
  <motion.div
    style={style}
    className="absolute pointer-events-none select-none"
    animate={{
      y: [0, -18, 6, -10, 0],
      rotateZ: [0, 4, -3, 2, 0],
      rotateX: [0, 8, -5, 3, 0],
    }}
    transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Chrome metallic blob
const ChromeBlob = ({ size = 120 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
      background: `
        radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.95) 0%, rgba(200,200,210,0.8) 20%, rgba(140,145,160,0.6) 45%, rgba(80,85,100,0.4) 70%, rgba(30,32,40,0.3) 100%)
      `,
      boxShadow: `
        inset -8px -8px 20px rgba(0,0,0,0.4),
        inset 6px 6px 15px rgba(255,255,255,0.3),
        0 20px 60px rgba(0,0,0,0.5),
        0 0 0 1px rgba(255,255,255,0.1)
      `,
      filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.6))',
    }}
  />
);

// Blue crystal gem
const CrystalGem = ({ size = 90 }) => (
  <div
    style={{
      width: size,
      height: size * 1.1,
      clipPath: 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
      background: `
        linear-gradient(135deg, 
          rgba(150,180,255,0.95) 0%, 
          rgba(80,120,255,0.85) 25%, 
          rgba(40,80,200,0.7) 50%, 
          rgba(20,40,140,0.6) 75%, 
          rgba(10,20,80,0.8) 100%
        )
      `,
      boxShadow: `
        inset -5px -5px 15px rgba(0,0,20,0.5),
        inset 4px 4px 12px rgba(180,200,255,0.4),
        0 15px 50px rgba(50,80,200,0.4),
        0 0 30px rgba(100,140,255,0.3)
      `,
      filter: 'drop-shadow(0 8px 25px rgba(60,100,255,0.5))',
    }}
  />
);

// Purple/lavender flower
const PurpleFlower = ({ size = 80 }) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          width: size * 0.45,
          height: size * 0.45,
          borderRadius: '50%',
          background: `radial-gradient(ellipse at 40% 40%, rgba(220,180,255,0.9), rgba(160,100,220,0.7), rgba(100,50,160,0.5))`,
          boxShadow: `0 4px 15px rgba(160,100,220,0.4), inset 2px 2px 8px rgba(255,220,255,0.3)`,
          top: '50%',
          left: '50%',
          transform: `rotate(${angle}deg) translate(${size * 0.27}px, -50%)`,
          transformOrigin: 'left center',
          filter: 'blur(0.5px)',
        }}
      />
    ))}
    <div
      style={{
        position: 'absolute',
        width: size * 0.3,
        height: size * 0.3,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 40% 40%, rgba(255,230,100,0.95), rgba(200,160,50,0.7))',
        boxShadow: '0 3px 12px rgba(200,160,50,0.5)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  </div>
);

// Red abstract organic shape
const RedShape = ({ size = 70 }) => (
  <div
    style={{
      width: size,
      height: size * 1.3,
      borderRadius: '30% 70% 60% 40% / 50% 40% 60% 50%',
      background: `
        radial-gradient(ellipse at 35% 30%, rgba(255,120,80,0.95), rgba(220,60,40,0.8), rgba(160,20,10,0.6))
      `,
      boxShadow: `
        inset -4px -4px 12px rgba(0,0,0,0.4),
        inset 3px 3px 8px rgba(255,150,120,0.3),
        0 12px 40px rgba(200,40,20,0.4)
      `,
      filter: 'drop-shadow(0 6px 20px rgba(200,50,30,0.5))',
    }}
  />
);

export default function LoadingScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);
  const [phase, setPhase] = useState(0); // 0=loading, 1=ready
  const containerRef = useRef(null);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  useEffect(() => {
    const timer = setTimeout(() => setPhase(1), 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);
      mouseY.set((e.clientY - cy) / cy);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onComplete, 900);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center"
          style={{ background: '#0a0a0c' }}
          exit={{
            clipPath: 'circle(0% at 50% 50%)',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Film grain */}
          <div
            className="absolute inset-0 z-50 pointer-events-none opacity-[0.04] mix-blend-screen"
            style={{ backgroundImage: `url("${GRAIN}")`, backgroundSize: '200px 200px' }}
          />

          {/* Dark vignette edges */}
          <div
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* Subtle ambient glow — very dark purple/blue tones */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 60% 50% at 70% 30%, rgba(60,40,120,0.18) 0%, transparent 70%),
                radial-gradient(ellipse 50% 50% at 30% 70%, rgba(20,40,90,0.14) 0%, transparent 70%)
              `,
            }}
          />

          {/* ─── Floating 3D Objects ─── */}

          {/* Chrome star-blob — top left */}
          <FloatingObject
            style={{ top: '18%', left: '10%' }}
            delay={0}
            duration={7}
          >
            <motion.div style={{ x: springX.get ? undefined : 0, rotateY: 15 }}>
              <ChromeBlob size={130} />
            </motion.div>
          </FloatingObject>

          {/* Blue crystal gem — top right */}
          <FloatingObject
            style={{ top: '12%', right: '12%' }}
            delay={1.2}
            duration={8.5}
          >
            <CrystalGem size={100} />
          </FloatingObject>

          {/* Purple flower — bottom left */}
          <FloatingObject
            style={{ bottom: '20%', left: '12%' }}
            delay={0.6}
            duration={9}
          >
            <PurpleFlower size={90} />
          </FloatingObject>

          {/* Red organic shape — bottom right */}
          <FloatingObject
            style={{ bottom: '25%', right: '15%' }}
            delay={1.8}
            duration={6.5}
          >
            <RedShape size={75} />
          </FloatingObject>

          {/* Small chrome blob extra — far right middle */}
          <FloatingObject
            style={{ top: '45%', right: '6%' }}
            delay={2.4}
            duration={10}
          >
            <ChromeBlob size={55} />
          </FloatingObject>

          {/* Small crystal — far left middle */}
          <FloatingObject
            style={{ top: '50%', left: '5%' }}
            delay={3}
            duration={7.5}
          >
            <CrystalGem size={50} />
          </FloatingObject>

          {/* ─── Center Content ─── */}
          <div className="relative z-10 text-center px-6 flex flex-col items-center">

            {/* Big editorial "ABOUT ME" style heading */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: phase === 1 ? 1 : 0, y: phase === 1 ? 0 : 40 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1
                className="select-none leading-none tracking-tight text-white"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 40px rgba(0,0,0,0.8)',
                }}
              >
                Hello!
              </h1>
              <h2
                className="select-none leading-none tracking-tight text-white mt-2"
                style={{
                  fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                  fontSize: 'clamp(2.2rem, 6.5vw, 5.5rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 40px rgba(0,0,0,0.8)',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                I'm Abhishek Kumar
              </h2>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="mt-5 select-none"
              style={{
                fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.28em',
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: phase === 1 ? 1 : 0, y: phase === 1 ? 0 : 15 }}
              transition={{ duration: 0.8, delay: 0.25, ease: 'easeOut' }}
            >
              Photographer &nbsp;·&nbsp; Video Editor &nbsp;·&nbsp; Colorist
            </motion.p>

            {/* Divider line */}
            <motion.div
              className="mt-6 h-px"
              style={{ background: 'rgba(255,255,255,0.12)', width: 0 }}
              animate={{ width: phase === 1 ? 180 : 0 }}
              transition={{ duration: 1.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* CTA Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: phase === 1 ? 1 : 0, y: phase === 1 ? 0 : 18 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              <motion.button
                onClick={handleEnter}
                className="relative overflow-hidden text-white border border-white/20 rounded-full"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  padding: '14px 36px',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                whileHover={{
                  background: 'rgba(255,255,255,1)',
                  color: '#000',
                  borderColor: 'rgba(255,255,255,1)',
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Enter Portfolio
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
