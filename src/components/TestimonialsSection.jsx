import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      "The Bangalore event reel was fire. We handed over hours of rough footage and got back something that told a real story — with atmosphere, rhythm, and moments we didn't even know we captured. Abhi just gets the vibe.",
    name: "Kisen",
    role: "Brand Owner",
    company: "Fuse",
    initial: "K",
    color: "#FF6B35",
    bg: "from-orange-500/10 to-orange-500/0",
    border: "border-orange-500/20",
  },
  {
    id: 2,
    quote:
      "Working with Abhishek on the Shreyanka collaboration was seamless. He understood the brand brief immediately and delivered a film that was polished, energetic, and completely on-brand. Turnaround was fast, quality was high.",
    name: "Jai Monga",
    role: "Agency Owner",
    company: "BENAAM.in",
    initial: "J",
    color: "#3b9eff",
    bg: "from-blue-500/10 to-blue-500/0",
    border: "border-blue-500/20",
  },
];

// Star rating component
const Stars = ({ color }) => (
  <div className="flex gap-1">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className="w-3.5 h-3.5" fill={color} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Avatar circle
const Avatar = ({ initial, color }) => (
  <div
    className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0 border-2"
    style={{
      background: `${color}20`,
      borderColor: `${color}40`,
      color,
    }}
  >
    {initial}
  </div>
);

// ---- Main Section ----
const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const total = testimonials.length;
  const current = testimonials[active];

  const go = useCallback(
    (nextIdx, dir) => {
      setDirection(dir);
      setActive(nextIdx);
    },
    []
  );

  const next = useCallback(() => go((active + 1) % total, 1), [active, go, total]);
  const prev = useCallback(() => go((active - 1 + total) % total, -1), [active, go, total]);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, 4500);
    return () => clearTimeout(timerRef.current);
  }, [active, paused, next]);

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir * 48, filter: 'blur(4px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: (dir) => ({ opacity: 0, x: dir * -48, filter: 'blur(4px)' }),
  };

  return (
    <section className="py-28 px-6 bg-neutral-950 relative overflow-hidden">
      {/* Background radial glow that shifts per testimonial */}
      <AnimatePresence>
        <motion.div
          key={active}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 80%, ${current.color}08, transparent)`,
          }}
        />
      </AnimatePresence>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 mb-4 font-black uppercase tracking-widest">
            Client Voices
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase">
            What brands <span className="text-amber-500">say</span>
          </h2>
        </motion.div>

        {/* Card */}
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={active}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative rounded-[2rem] border bg-gradient-to-br ${current.bg} ${current.border} p-8 md:p-12 backdrop-blur-sm overflow-hidden`}
            >
              {/* Decorative large quote mark */}
              <div
                className="absolute top-6 right-8 opacity-10 pointer-events-none"
                style={{ color: current.color }}
              >
                <Quote size={96} strokeWidth={1} />
              </div>

              {/* Stars */}
              <div className="mb-8">
                <Stars color={current.color} />
              </div>

              {/* Quote text */}
              <blockquote
                className="text-xl md:text-2xl font-light text-white/85 leading-relaxed mb-10 relative z-10"
                style={{ fontStyle: 'italic' }}
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Divider */}
              <div
                className="h-[1px] w-16 mb-8"
                style={{ backgroundColor: `${current.color}60` }}
              />

              {/* Author */}
              <div className="flex items-center gap-4">
                <Avatar initial={current.initial} color={current.color} />
                <div>
                  <div className="font-black text-white tracking-tight">{current.name}</div>
                  <div className="text-sm text-white/50 font-medium">{current.role}</div>
                  <div
                    className="text-xs font-black uppercase tracking-widest mt-0.5"
                    style={{ color: current.color }}
                  >
                    {current.company}
                  </div>
                </div>
              </div>

              {/* Bottom left accent line */}
              <div
                className="absolute bottom-0 left-0 w-32 h-1 rounded-full"
                style={{ backgroundColor: current.color, opacity: 0.5 }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next Arrows */}
          <button
            onClick={prev}
            className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:bg-neutral-800 transition-all z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:bg-neutral-800 transition-all z-20"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2.5 mt-10">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              onClick={() => go(i, i > active ? 1 : -1)}
              className="relative h-2 rounded-full transition-all duration-400 overflow-hidden"
              style={{
                width: i === active ? 28 : 8,
                backgroundColor: i === active ? current.color : 'rgba(255,255,255,0.15)',
              }}
            >
              {/* Auto-progress fill */}
              {i === active && !paused && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.4)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4.5, ease: 'linear' }}
                  key={active}
                />
              )}
            </button>
          ))}
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {paused && (
            <motion.p
              className="text-center text-[10px] font-black uppercase tracking-widest text-white/20 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Paused · Click arrows or dots to navigate
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TestimonialsSection;
