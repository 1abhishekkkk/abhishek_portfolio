import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';

const instagramUsername = 'abhi_clicks._';
const instagramUrl = `https://www.instagram.com/${instagramUsername}/`;

const InstagramFeedLive = () => {
  const cardRef = useRef(null);

  // Normalized cursor coordinates (-0.5 to 0.5) & pixel spotlight coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);

  const springConfig = { stiffness: 260, damping: 22, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D tilt + subtle magnetic pull toward cursor
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]);
  const translateX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const translateY = useTransform(smoothY, [-0.5, 0.5], [-8, 8]);

  const spotlightBg = useMotionTemplate`radial-gradient(280px circle at ${spotX}% ${spotY}%, rgba(245, 158, 11, 0.16), transparent 70%)`;

  const handlePointerMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(px - 0.5);
    mouseY.set(py - 0.5);
    spotX.set(px * 100);
    spotY.set(py * 100);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    spotX.set(50);
    spotY.set(50);
  };

  return (
    <section className="py-8 px-6 bg-neutral-950">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        <motion.p
          className="text-xs md:text-sm font-bold tracking-widest uppercase text-amber-500/90 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          @{instagramUsername} on Instagram
        </motion.p>

        <div className="perspective-1200 w-full flex justify-center">
          <motion.a
            ref={cardRef}
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            style={{
              rotateX,
              rotateY,
              x: translateX,
              y: translateY,
              transformStyle: 'preserve-3d',
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full max-w-[400px] rounded-2xl border border-amber-500/40 bg-white/[0.02] px-8 py-7 md:py-8 transition-colors duration-300 hover:border-amber-500 hover:shadow-[0_18px_50px_rgba(245,158,11,0.16)] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Cursor-following spotlight */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: spotlightBg }}
            />

            <div
              style={{ transform: 'translateZ(28px)' }}
              className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-amber-500"
            >
              @{instagramUsername}
            </div>
            <span
              style={{ transform: 'translateZ(18px)' }}
              className="relative z-10 mt-3 text-xs font-medium tracking-wide text-white/55 group-hover:text-white/85 transition-colors"
            >
              Follow on Instagram
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default InstagramFeedLive;
