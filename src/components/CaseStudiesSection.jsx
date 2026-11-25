import React, { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from 'framer-motion';
import { Sparkles, X, ArrowUpRight } from 'lucide-react';

const APPLE_SPRING = { type: 'spring', stiffness: 320, damping: 28, mass: 0.85 };

function CaseStudyCard({
  study,
  index,
  isHovered,
  anyHovered,
  onHoverStart,
  onHoverEnd,
  onSelect,
}) {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const smoothX = useSpring(mouseX, { stiffness: 250, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 250, damping: 25 });
  const sheen = useMotionTemplate`radial-gradient(320px circle at ${smoothX}% ${smoothY}%, rgba(245, 158, 11, 0.14), rgba(255, 255, 255, 0.04) 45%, transparent 75%)`;

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(((e.clientX - rect.left) / rect.width) * 100);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <motion.article
      layoutId={`study-card-${study.title}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ ...APPLE_SPRING, delay: index * 0.07 }}
      animate={{
        scale: isHovered ? 1.035 : anyHovered ? 0.985 : 1,
        y: isHovered ? -10 : 0,
        opacity: anyHovered && !isHovered ? 0.65 : 1,
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onPointerMove={handlePointerMove}
      onClick={onSelect}
      className={`group relative cursor-pointer rounded-[2rem] border p-8 flex flex-col min-h-[520px] overflow-hidden backdrop-blur-md transition-colors duration-300 ${
        isHovered
          ? 'border-amber-500/45 bg-white/[0.06] shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_40px_rgba(245,158,11,0.12)]'
          : 'border-white/5 bg-white/[0.03]'
      }`}
    >
      {/* Apple-style cursor-following glass sheen */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: sheen }}
      />

      <div className="relative z-10 flex items-center justify-between gap-4 mb-10">
        <motion.span
          layoutId={`study-client-${study.title}`}
          className="text-[10px] font-black tracking-[0.3em] text-amber-500 uppercase"
        >
          {study.client}
        </motion.span>
        <motion.span
          animate={{
            scale: isHovered ? 1.12 : 1,
            rotate: isHovered ? 12 : 0,
          }}
          transition={APPLE_SPRING}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 group-hover:border-amber-500/40 group-hover:bg-amber-500/15 flex items-center justify-center transition-colors"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
        </motion.span>
      </div>

      <motion.h3
        layoutId={`study-title-${study.title}`}
        className="relative z-10 text-3xl font-black tracking-tighter uppercase mb-6 text-white"
      >
        {study.title}
      </motion.h3>

      <div className="relative z-10 space-y-5 text-white/60 font-medium leading-relaxed">
        <p><span className="text-white font-black">Goal:</span> {study.goal}</p>
        <p><span className="text-white font-black">Role:</span> {study.role}</p>
        <p><span className="text-white font-black">Output:</span> {study.output}</p>
      </div>

      <div className="relative z-10 mt-auto pt-8">
        <p className="text-amber-500 font-bold mb-5 tracking-tight">{study.result}</p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/40 opacity-0 group-hover:opacity-100 group-hover:text-amber-500 transition-all">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function CaseStudiesSection({ caseStudies = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [selectedStudy, setSelectedStudy] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedStudy(null);
    };
    if (selectedStudy) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedStudy]);

  return (
    <section id="case-studies" className="py-32 px-6 bg-neutral-950">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <div className="sans-minimal text-amber-500 mb-4 font-black tracking-widest uppercase">
            Case Studies
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-white">
            Proof, not just pretty cuts
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <CaseStudyCard
              key={study.title}
              study={study}
              index={index}
              isHovered={hoveredIdx === index}
              anyHovered={hoveredIdx !== null}
              onHoverStart={() => setHoveredIdx(index)}
              onHoverEnd={() => setHoveredIdx(null)}
              onSelect={() => setSelectedStudy(study)}
            />
          ))}
        </div>
      </div>

      {/* Apple-style Shared-Element Morph Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedStudy(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xl p-4 sm:p-6"
          >
            <motion.article
              layoutId={`study-card-${selectedStudy.title}`}
              transition={APPLE_SPRING}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-[2.25rem] border border-amber-500/35 bg-neutral-900/95 p-8 sm:p-12 shadow-[0_32px_90px_rgba(0,0,0,0.85),0_0_60px_rgba(245,158,11,0.12)]"
            >
              <button
                type="button"
                onClick={() => setSelectedStudy(null)}
                aria-label="Close case study"
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <motion.span
                  layoutId={`study-client-${selectedStudy.title}`}
                  className="text-xs font-black tracking-[0.3em] text-amber-500 uppercase"
                >
                  {selectedStudy.client}
                </motion.span>
                <span className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </span>
              </div>

              <motion.h3
                layoutId={`study-title-${selectedStudy.title}`}
                className="text-3xl sm:text-5xl font-black tracking-tighter uppercase mb-8 text-white"
              >
                {selectedStudy.title}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.25 }}
                className="space-y-5 text-white/75 text-base sm:text-lg font-medium leading-relaxed"
              >
                <p><span className="text-white font-black">Goal:</span> {selectedStudy.goal}</p>
                <p><span className="text-white font-black">Role:</span> {selectedStudy.role}</p>
                <p><span className="text-white font-black">Output:</span> {selectedStudy.output}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.25 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-amber-500 font-bold text-lg mb-5 tracking-tight">
                  {selectedStudy.result}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedStudy.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3.5 py-1.5 rounded-full bg-white/5 border border-white/15 text-[11px] font-black uppercase tracking-widest text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
