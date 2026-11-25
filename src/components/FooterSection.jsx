import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Instagram, Linkedin, ArrowUp } from 'lucide-react';

export default function FooterSection({ personal, social, onAdminTrigger, onScrollTop }) {
  const [istTime, setIstTime] = useState('');
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 24 });
  const glow = useMotionTemplate`radial-gradient(500px circle at ${smoothX}% ${smoothY}%, rgba(245, 158, 11, 0.10), transparent 65%)`;

  useEffect(() => {
    const updateTime = () => {
      try {
        setIstTime(
          new Date().toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })
        );
      } catch {
        setIstTime('');
      }
    };
    updateTime();
    const id = setInterval(updateTime, 1000);
    return () => clearInterval(id);
  }, []);

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <footer
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden border-t border-white/10 bg-[#0a0a0a] pt-10 pb-12"
    >
      {/* Cursor-following warm amber glow */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: glow }}
      />

      {/* Giant Kinetic Studio Marquee */}
      <div className="marquee-container border-b border-white/5 pb-8 mb-10">
        <div className="animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-10 pr-10">
              <span className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white/90">
                {personal?.name?.toUpperCase() || "ABHI'S"}{' '}
                <span className="text-amber-500">CREATIVE STUDIO</span>
              </span>
              <span className="text-amber-500 text-2xl">✦</span>
              <span className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white/25">
                DIRECTOR • EDITOR • COLORIST
              </span>
              <span className="text-amber-500 text-2xl">✦</span>
              <span className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-white/90">
                LET&apos;S CREATE <span className="serif-italic lowercase text-amber-500 font-normal">something epic</span>
              </span>
              <span className="text-amber-500 text-2xl">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Bar */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand + Live Studio Timecode */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="text-xl font-black tracking-tighter">
            {personal?.name?.toUpperCase()}{' '}
            <span className="text-neutral-500 font-light">
              {personal?.tagline?.toUpperCase()}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[10px] tracking-widest text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" />
            <span>IN // {istTime || '24FPS'} IST</span>
          </div>
        </div>

        {/* Animated Social Pills + Back to Top */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <motion.a
            href={social?.instagram}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase text-white/85 hover:border-amber-500 hover:bg-amber-500 hover:text-black transition-colors"
          >
            <Instagram size={13} /> Instagram
          </motion.a>
          <motion.a
            href={social?.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase text-white/85 hover:border-amber-500 hover:bg-amber-500 hover:text-black transition-colors"
          >
            <Linkedin size={13} /> LinkedIn
          </motion.a>
          <motion.button
            type="button"
            onClick={onScrollTop}
            whileHover={{ y: -3, scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 text-[10px] font-bold tracking-widest uppercase text-amber-500 hover:bg-amber-500 hover:text-black transition-colors"
          >
            <ArrowUp size={13} /> Top
          </motion.button>
        </div>

        {/* Copyright (Triple-click for Admin) */}
        <div
          className="text-[10px] font-bold text-neutral-600 tracking-widest uppercase cursor-default select-none hover:text-neutral-400 transition-colors"
          onClick={(e) => {
            if (e.detail === 3 && onAdminTrigger) {
              onAdminTrigger();
            }
          }}
          title="Tip: Triple click for admin"
        >
          &copy; {new Date().getFullYear()} {personal?.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
