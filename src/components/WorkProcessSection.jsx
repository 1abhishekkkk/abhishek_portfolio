import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Brief',
    subtitle: 'Understanding your vision',
    description:
      'We start with a clear conversation — your goals, brand identity, target audience, and the feeling you want the final cut to leave behind. No assumptions, just clarity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: '#f59e0b',
    delay: 0,
  },
  {
    number: '02',
    title: 'Creative Direction',
    subtitle: 'Building the visual treatment',
    description:
      'Reference boards, music mood, cut style, and pacing decisions are locked in before a single edit is made. This is where the creative vision becomes a concrete plan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: '#818cf8',
    delay: 0.1,
  },
  {
    number: '03',
    title: 'Edit',
    subtitle: 'Crafting the story',
    description:
      'Footage is organised, selects are pulled, and the story is built cut by cut — with music sync, sound design instincts, transitions, and pacing that keeps attention locked.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: '#34d399',
    delay: 0.2,
  },
  {
    number: '04',
    title: 'Color Grade',
    subtitle: 'The cinematic finish',
    description:
      'Every frame goes through a proper colour grade — skin tone balance, contrast sculpting, and look development that takes the footage from "good" to genuinely cinematic.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    color: '#f472b6',
    delay: 0.3,
  },
  {
    number: '05',
    title: 'Delivery',
    subtitle: 'Platform-ready exports',
    description:
      'Final files are delivered in every format you need — Instagram Reels, YouTube, branded social cuts — all optimised for platform specs with a clean handoff and fast turnaround.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: '#38bdf8',
    delay: 0.4,
  },
];

// Single Step Card
const StepCard = ({ step, index, inView }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10 group"
      initial={{ opacity: 0, x: isEven ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.65, delay: step.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Step number + icon bubble */}
      <div className="flex-shrink-0 relative">
        {/* Outer ring (glow on hover) */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center border transition-all duration-500 group-hover:scale-105"
          style={{
            backgroundColor: `${step.color}12`,
            borderColor: `${step.color}30`,
          }}
        >
          <div style={{ color: step.color }}>
            {step.icon}
          </div>
        </div>

        {/* Step number pill */}
        <div
          className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-neutral-950"
          style={{ backgroundColor: step.color, color: '#000' }}
        >
          {index + 1}
        </div>
      </div>

      {/* Text content */}
      <div className="flex-1">
        <div
          className="text-[10px] font-black uppercase tracking-[0.3em] mb-1.5"
          style={{ color: step.color }}
        >
          {step.number} / {step.subtitle}
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-3">
          {step.title}
        </h3>
        <p className="text-white/50 font-medium leading-relaxed max-w-lg text-sm md:text-base">
          {step.description}
        </p>
      </div>

      {/* Right accent line (desktop only) */}
      <motion.div
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-[1px] opacity-20"
        style={{ backgroundColor: step.color }}
        initial={{ scaleY: 0 }}
        animate={inView ? { scaleY: 1 } : {}}
        transition={{ duration: 0.5, delay: step.delay + 0.3 }}
      />
    </motion.div>
  );
};

// Animated connector
const Connector = ({ color, inView, delay }) => (
  <div className="flex items-center gap-4 pl-10 my-1">
    <motion.div
      className="w-[1px] h-10 ml-9"
      style={{ backgroundColor: `${color}30` }}
      initial={{ scaleY: 0, originY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: 0.4, delay }}
    />
    <motion.div
      className="text-[9px] font-black uppercase tracking-[0.3em] opacity-0"
      animate={inView ? { opacity: 0.3 } : {}}
      transition={{ duration: 0.4, delay: delay + 0.1 }}
      style={{ color }}
    >
      then
    </motion.div>
  </div>
);

// ---- Main Section ----
const WorkProcessSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-28 px-6 bg-neutral-950 relative overflow-hidden">
      {/* Subtle side gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />

      <div className="max-w-3xl mx-auto" ref={ref}>
        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 mb-4 font-black uppercase tracking-widest">
            The Process
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none mb-4">
            How I <span className="text-amber-500">work</span>
          </h2>
          <p className="text-white/40 font-medium text-lg max-w-md">
            A clear process means fewer surprises and a better end product — every time.
          </p>
        </motion.div>

        {/* Steps with connectors */}
        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.number}>
              <StepCard step={step} index={i} inView={inView} />
              {i < steps.length - 1 && (
                <Connector
                  color={step.color}
                  inView={inView}
                  delay={step.delay + 0.2}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* CTA strip */}
        <motion.div
          className="mt-16 p-8 rounded-2xl border border-amber-500/15 bg-amber-500/5 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-500 mb-1">
              Ready to start?
            </div>
            <p className="text-white font-bold text-xl tracking-tight">
              Let's build something great together.
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
          >
            Start a Project
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WorkProcessSection;
