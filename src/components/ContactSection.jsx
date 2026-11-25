import React, { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';
import { Mail, Phone } from 'lucide-react';
import { sfx } from '../utils/sfx';

const SERVICES = [
  'Commercial Direction',
  'Content Creation',
  'Editing & Color',
  'Creative Concepting',
  'Brand Campaign',
];
const TIMELINES = ['ASAP', '1–2 Months', '3+ Months', 'Flexible'];
const BUDGETS = ['₹25k–₹50k', '₹50k–₹1.5L', '$1k–$3k', '$3k+'];

const NO_MESSAGES = ['NO', 'ARE YOU SURE?', 'WRONG ONE 👀', 'TRY YES →', 'NICE TRY'];
const SPARKS = Array.from({ length: 14 }, (_, i) => ({
  angle: (i / 14) * Math.PI * 2,
  dist: 65 + (i % 3) * 24,
  size: 5 + (i % 4) * 1.5,
}));

export function ContactSection({ personal }) {
  const [mode, setMode] = useState('prompt'); // 'prompt' | 'no' | 'clapping' | 'yes'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [selectedServices, setSelectedServices] = useState(['Commercial Direction']);
  const [timeline, setTimeline] = useState('1–2 Months');
  const [budget, setBudget] = useState('₹50k–₹1.5L');
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tactile YES burst + NO playful dodge state
  const [sparkBurst, setSparkBurst] = useState(false);
  const [noIdx, setNoIdx] = useState(0);
  const [noTransform, setNoTransform] = useState({ x: 0, y: 0, rot: 0 });

  // Mouse tracking for 3D tilt, orange backing slab, spotlight, and floating props parallax
  const sectionRef = useRef(null);
  const normX = useMotionValue(0); // -0.5 to 0.5
  const normY = useMotionValue(0); // -0.5 to 0.5

  const springCfg = { stiffness: 180, damping: 20, mass: 0.7 };
  const curX = useSpring(normX, springCfg);
  const curY = useSpring(normY, springCfg);

  // ±10deg 3D tilt
  const rotateY = useTransform(curX, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(curY, [-0.5, 0.5], [10, -10]);

  // Orange backing slab shifts opposite to tilt at translateZ(-24px)
  const slabX = useTransform(curX, [-0.5, 0.5], [14, 2]);
  const slabY = useTransform(curY, [-0.5, 0.5], [14, 2]);
  const slabTransform = useMotionTemplate`translate3d(${slabX}px, ${slabY}px, -24px)`;

  // Cursor-following amber spotlight
  const spotX = useTransform(curX, [-0.5, 0.5], [10, 90]);
  const spotY = useTransform(curY, [-0.5, 0.5], [10, 90]);
  const sheenBg = useMotionTemplate`radial-gradient(520px circle at ${spotX}% ${spotY}%, rgba(255, 165, 0, 0.14), transparent 65%)`;

  // Parallax for the 4 floating 3D props
  const p1X = useTransform(curX, [-0.5, 0.5], [-24, 24]);
  const p1Y = useTransform(curY, [-0.5, 0.5], [-18, 18]);
  const p2X = useTransform(curX, [-0.5, 0.5], [20, -20]);
  const p2Y = useTransform(curY, [-0.5, 0.5], [16, -16]);
  const p3X = useTransform(curX, [-0.5, 0.5], [21, -21]);
  const p3Y = useTransform(curY, [-0.5, 0.5], [-19, 19]);
  const p4X = useTransform(curX, [-0.5, 0.5], [-23, 23]);
  const p4Y = useTransform(curY, [-0.5, 0.5], [17, -17]);

  const contactEmail = personal?.email || 'abhishek274kumar@gmail.com';
  const contactPhone = personal?.phone || '+91 89575 62928';

  const handleSectionPointerMove = (e) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set(Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5)));
    normY.set(Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5)));
  };

  const handleSectionPointerLeave = () => {
    normX.set(0);
    normY.set(0);
  };

  const dodgeNo = () => {
    sfx.sliderTick();
    const dx = (Math.random() > 0.5 ? 1 : -1) * (45 + Math.random() * 55);
    const dy = (Math.random() > 0.5 ? 1 : -1) * (18 + Math.random() * 32);
    const rot = (Math.random() - 0.5) * 16;
    setNoIdx((prev) => (prev + 1) % NO_MESSAGES.length);
    setNoTransform({ x: dx, y: dy, rot });
  };

  const toggleService = (s) => {
    sfx.sliderTick();
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleYes = () => {
    sfx.clapperSnap();
    setSparkBurst(true);
    window.setTimeout(() => {
      setSparkBurst(false);
      setMode('clapping');
      window.setTimeout(() => setMode('yes'), 620);
    }, 200);
  };

  const handleBackToPrompt = () => {
    setMode('prompt');
    setNoIdx(0);
    setNoTransform({ x: 0, y: 0, rot: 0 });
  };

  const briefText = `Name: ${name || '(not provided)'}\nEmail: ${email || '(not provided)'}\nCompany: ${company || '(not provided)'}\nServices: ${selectedServices.join(', ') || 'TBD'}\nTimeline: ${timeline}\nBudget: ${budget}\n\nProject Details:\n${message || '(no notes)'}`;

  const mailtoHref = `mailto:${contactEmail}?subject=${encodeURIComponent(
    `Project Inquiry from ${name || 'New Client'}`
  )}&body=${encodeURIComponent(briefText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = mailtoHref;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    sfx.clapperSnap();
    setSending(true);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message: briefText,
        }),
      });

      if (res.ok) {
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: { type: 'success', message: 'Brief received! I will reply within 24 hours.' },
          })
        );
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        window.dispatchEvent(
          new CustomEvent('toast', {
            detail: { type: 'error', message: data?.error || 'Could not send brief. Try Copy or Mail app.' },
          })
        );
      }
    } catch {
      window.dispatchEvent(
        new CustomEvent('toast', {
          detail: { type: 'error', message: 'Network error. You can still copy or open in Mail app.' },
        })
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      onPointerMove={handleSectionPointerMove}
      onPointerLeave={handleSectionPointerLeave}
      className="relative flex flex-col items-center justify-center overflow-hidden border-t border-white/10 bg-[#0A0A0A] px-5 py-24 md:py-32"
    >
      {/* Warm ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFA500]/[0.06] blur-[120px]" />

      {/* Section Label */}
      <p className="relative z-10 mb-8 font-mono text-xs uppercase tracking-[0.28em] text-[#F59E0B]">
        [ 03 // START A PROJECT ]
      </p>

      {/* 3D Stage */}
      {mode === 'prompt' && (
        <div className="perspective-1200 relative w-full max-w-[740px]">
          {/* Floating 3D Prop 1: Top-Left Cinema Clapper / REC */}
          <motion.div
            style={{ x: p1X, y: p1Y }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
            className="pointer-events-none absolute -top-10 -left-10 z-30 hidden md:block will-change-transform"
          >
            <div className="-rotate-12 rounded-2xl border border-white/20 bg-gradient-to-br from-[#262626] via-[#141414] to-[#0a0a0a] px-4 py-3 shadow-[6px_14px_28px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.25)]">
              <div className="mb-2 flex gap-1.5 overflow-hidden rounded-sm bg-black/60 p-1">
                <div className="h-2 w-4 -skew-x-[24deg] rounded-[1px] bg-[#FFA500]" />
                <div className="h-2 w-4 -skew-x-[24deg] rounded-[1px] bg-[#FFA500]" />
                <div className="h-2 w-4 -skew-x-[24deg] rounded-[1px] bg-[#FFA500]" />
                <div className="h-2 w-4 -skew-x-[24deg] rounded-[1px] bg-[#FFA500]" />
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-widest text-white">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
                REC 24FPS
              </div>
            </div>
          </motion.div>

          {/* Floating 3D Prop 2: Top-Right Glossy Amber Play Cube */}
          <motion.div
            style={{ x: p2X, y: p2Y }}
            animate={{ y: [0, 11, 0] }}
            transition={{ y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' } }}
            className="pointer-events-none absolute -top-9 -right-8 z-30 hidden md:block will-change-transform"
          >
            <div className="rotate-[14deg] flex h-16 w-16 items-center justify-center rounded-2xl border border-[#FFD27D]/50 bg-gradient-to-br from-[#FFB830] via-[#F59E0B] to-[#B45309] shadow-[0_14px_30px_rgba(245,158,11,0.35),inset_0_2px_4px_rgba(255,255,255,0.65)]">
              <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-black" />
            </div>
          </motion.div>

          {/* Floating 3D Prop 3: Bottom-Left Cinema Lens Ring */}
          <motion.div
            style={{ x: p3X, y: p3Y }}
            animate={{ y: [0, -10, 0] }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: 'easeInOut' } }}
            className="pointer-events-none absolute -bottom-10 -left-9 z-30 hidden md:block will-change-transform"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-gradient-to-br from-[#2a2a2a] to-[#0b0b0b] p-2 shadow-[0_18px_35px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.2)]">
              <div className="flex h-full w-full items-center justify-center rounded-full border border-[#FFA500]/40 bg-gradient-to-tr from-[#09090b] via-[#1c1917] to-[#292524] p-2.5">
                <div className="relative h-full w-full rounded-full bg-gradient-to-br from-amber-400/30 via-black to-cyan-500/20">
                  <div className="absolute top-1.5 left-2 h-2 w-3.5 -rotate-[25deg] rounded-full bg-white/40 blur-[1px]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating 3D Prop 4: Bottom-Right 4K Color Glass Pill */}
          <motion.div
            style={{ x: p4X, y: p4Y }}
            animate={{ y: [0, 11, 0] }}
            transition={{ y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' } }}
            className="pointer-events-none absolute -right-10 -bottom-7 z-30 hidden md:block will-change-transform"
          >
            <div className="-rotate-6 flex items-center gap-2.5 rounded-full border border-white/15 bg-[#161616]/90 px-4 py-2.5 backdrop-blur-md shadow-[0_15px_30px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-[#F59E0B] via-rose-500 to-cyan-400" />
              <span className="font-mono text-[11px] font-semibold tracking-wider text-neutral-200">
                4K // COLOR
              </span>
            </div>
          </motion.div>

          {/* Main 3D Tilting Card */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="preserve-3d relative w-full will-change-transform"
          >
            {/* Dynamic 3D Orange Backing Slab */}
            <motion.div
              style={{ transform: slabTransform }}
              className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#FFB01F] to-[#F59E0B] will-change-transform"
            />

            {/* Card Surface */}
            <div className="preserve-3d relative rounded-[28px] border border-white/15 bg-[#141414] px-8 py-14 text-center shadow-[0_24px_60px_rgba(0,0,0,0.75)] sm:px-14 sm:py-16">
              {/* Cursor-following amber sheen */}
              <motion.div
                aria-hidden="true"
                style={{ background: sheenBg }}
                className="pointer-events-none absolute inset-0 rounded-[28px]"
              />

              <div className="preserve-3d relative flex flex-col items-center">
                <h2
                  style={{ transform: 'translateZ(48px)' }}
                  className="text-4xl font-extrabold leading-[1.06] tracking-tight text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)] sm:text-6xl"
                >
                  so... wanna work
                  <br />
                  together?
                </h2>

                <p
                  style={{ transform: 'translateZ(26px)' }}
                  className="mt-5 max-w-[440px] text-sm leading-relaxed text-neutral-400 sm:text-base"
                >
                  Commercials, social campaigns, wild creative concepts, or
                  just something cool we haven&apos;t named yet.
                </p>

                <div
                  style={{ transform: 'translateZ(60px)' }}
                  className="relative mt-9 flex flex-wrap items-center justify-center gap-4"
                >
                  {/* Tactile 3D YES button + spark burst */}
                  <div className="relative">
                    <motion.button
                      type="button"
                      onClick={handleYes}
                      whileHover={{
                        y: -3,
                        boxShadow: '4px 6px 0px #ffffff, 0 0 28px rgba(245, 158, 11, 0.45)',
                      }}
                      whileTap={{
                        x: 3,
                        y: 4,
                        boxShadow: '0px 0px 0px #ffffff',
                      }}
                      transition={{ duration: 0.14 }}
                      style={{ boxShadow: '3px 4px 0px #ffffff' }}
                      className="cursor-pointer rounded-full border border-black/20 bg-[#FFA500] px-10 py-3.5 text-sm font-extrabold tracking-wide text-black sm:text-base"
                    >
                      YES
                    </motion.button>

                    <AnimatePresence>
                      {sparkBurst && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          {SPARKS.map((sp, i) => (
                            <motion.span
                              key={i}
                              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                              animate={{
                                x: Math.cos(sp.angle) * sp.dist,
                                y: Math.sin(sp.angle) * sp.dist,
                                scale: 0,
                                opacity: 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                              style={{ width: sp.size, height: sp.size }}
                              className="absolute rounded-full bg-[#FFA500]"
                            />
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Playful dodging NO button */}
                  <motion.button
                    type="button"
                    onMouseEnter={dodgeNo}
                    onClick={dodgeNo}
                    animate={{
                      x: noTransform.x,
                      y: noTransform.y,
                      rotate: noTransform.rot,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 16 }}
                    className="cursor-pointer rounded-full border border-white/20 bg-[#1F1F1F] px-9 py-3.5 text-sm font-bold tracking-wide text-white/90 transition-colors hover:border-white/40 hover:bg-[#272727] sm:text-base"
                  >
                    {NO_MESSAGES[noIdx]}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 3D Clapperboard Snap Transition */}
      {mode === 'clapping' && (
        <div className="perspective-1200 relative z-10 flex min-h-[340px] w-full max-w-[740px] flex-col items-center justify-center rounded-[28px] border border-white/15 bg-[#141414] p-10 text-white shadow-[8px_8px_0px_#FFA500]">
          <div className="w-64 overflow-hidden rounded-2xl border-2 border-white/25 bg-[#0A0A0A] shadow-2xl">
            <div
              style={{
                transformOrigin: 'left bottom',
                animation: 'clapper-snap 0.5s cubic-bezier(0.22, 1.4, 0.36, 1) forwards',
              }}
              className="h-7 w-full bg-[repeating-linear-gradient(125deg,#FFA500,#FFA500_14px,#111111_14px,#111111_28px)]"
            />
            <div className="p-4 text-center font-mono text-xs uppercase tracking-widest">
              <div className="text-[#FFA500]">SCENE 01 // TAKE 01</div>
              <div className="mt-1 text-xl font-black text-white">ACTION! 🎬</div>
            </div>
          </div>
          <style>{`
            @keyframes clapper-snap {
              0% { transform: rotate(-28deg); }
              60% { transform: rotate(2deg); }
              100% { transform: rotate(0deg); }
            }
          `}</style>
        </div>
      )}

      {/* YES -> Project Brief Form */}
      {mode === 'yes' && (
        <div className="relative z-10 w-full max-w-4xl rounded-[28px] border border-white/15 bg-[#141414] p-6 shadow-[8px_8px_0px_#FFA500] sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="inline-block rounded-full bg-[#FFA500] px-3 py-1 font-mono text-[11px] font-bold uppercase text-black">
                PROJECT BRIEF
              </span>
              <h2 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
                LET&apos;S DO IT!
              </h2>
            </div>
            <button
              type="button"
              onClick={handleBackToPrompt}
              className="font-mono text-xs text-white/50 underline underline-offset-4 hover:text-white"
            >
              ← back
            </button>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mt-8 space-y-7">
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="f-name" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                    Name *
                  </label>
                  <input
                    id="f-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FFA500] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="f-email" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                    Email *
                  </label>
                  <input
                    id="f-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@brand.com"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FFA500] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="f-company" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                    Company / Brand
                  </label>
                  <input
                    id="f-company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Studio / Agency"
                    className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#FFA500] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                  What are we making? (Pick all that apply)
                </span>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {SERVICES.map((s) => {
                    const on = selectedServices.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleService(s)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                          on
                            ? 'border-[#FFA500] bg-white text-black'
                            : 'border-white/15 bg-black/40 text-white/75 hover:border-white/50'
                        }`}
                      >
                        {on ? '✓ ' : '+ '}
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                    Timeline
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {TIMELINES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          sfx.sliderTick();
                          setTimeline(t);
                        }}
                        className={`rounded-full border px-3.5 py-2 font-mono text-xs font-semibold transition ${
                          timeline === t
                            ? 'border-[#FFA500] bg-[#FFA500] text-black'
                            : 'border-white/15 bg-black/40 text-white/70 hover:border-white/50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                    Estimated Budget
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => {
                          sfx.sliderTick();
                          setBudget(b);
                        }}
                        className={`rounded-full border px-3.5 py-2 font-mono text-xs font-semibold transition ${
                          budget === b
                            ? 'border-[#FFA500] bg-[#FFA500] text-black'
                            : 'border-white/15 bg-black/40 text-white/70 hover:border-white/50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="f-message" className="block font-mono text-xs font-semibold uppercase tracking-wider text-white/70">
                  Tell me about the project *
                </label>
                <textarea
                  id="f-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's the wild idea, deliverables, shoot dates, or reference links?"
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-black/50 p-4 text-sm text-white placeholder-white/30 focus:border-[#FFA500] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FFA500] px-8 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:scale-[1.02] hover:bg-amber-400 disabled:opacity-60"
                >
                  {sending ? 'Sending brief...' : 'Send Project Brief →'}
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-full border border-white/20 px-4 py-2.5 font-mono text-xs font-semibold text-white/80 transition hover:border-white hover:text-white"
                  >
                    {copied ? '✓ Copied!' : 'Copy request'}
                  </button>
                  <a
                    href={mailtoHref}
                    className="rounded-full border border-white/20 px-4 py-2.5 font-mono text-xs font-semibold text-white/80 transition hover:border-white hover:text-white"
                  >
                    Open in Mail app ↗
                  </a>
                </div>
              </div>
            </form>
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFA500] text-3xl font-black text-black">
                ✓
              </div>
              <h3 className="mt-5 text-3xl font-black text-white">Brief received — you&apos;re awesome.</h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-white/65">
                I personally read every inquiry and usually reply within 24 hours.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full border border-white/20 px-5 py-2.5 font-mono text-xs font-semibold text-white hover:border-white"
                >
                  {copied ? '✓ Copied!' : 'Copy brief to clipboard'}
                </button>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="rounded-full bg-[#FFA500] px-5 py-2.5 font-mono text-xs font-semibold text-black"
                >
                  Send another inquiry
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct Contact Strip */}
      <div className="relative z-10 mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 sm:gap-8 sm:text-sm">
        <a
          href={`mailto:${contactEmail}`}
          className="inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <Mail className="h-4 w-4 text-[#F59E0B]" />
          <span>{contactEmail}</span>
        </a>
        <a
          href={`tel:${contactPhone}`}
          className="inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <Phone className="h-4 w-4 text-[#F59E0B]" />
          <span>{contactPhone}</span>
        </a>
      </div>
    </section>
  );
}

export default ContactSection;
