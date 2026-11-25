import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionCapability } from '../lib/motionSetup';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: '01',
    title: 'Brief',
    dockTitle: 'BRIEF',
    subtitle: 'Understanding your vision',
    tag: 'CLARITY',
    floatSub: 'Goals, brand identity & audience',
    w: 225,
    h: 148,
    description:
      'We start with a clear conversation — your goals, brand identity, target audience, and the feeling you want the final cut to leave behind. No assumptions, just clarity.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: '#f59e0b',
  },
  {
    number: '02',
    title: 'Creative Direction',
    dockTitle: 'DIRECTION',
    subtitle: 'Building the visual treatment',
    tag: 'TREATMENT',
    floatSub: 'Moodboards, music & pacing plan',
    w: 168,
    h: 212,
    description:
      'Reference boards, music mood, cut style, and pacing decisions are locked in before a single edit is made. This is where the creative vision becomes a concrete plan.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    color: '#818cf8',
  },
  {
    number: '03',
    title: 'Edit',
    dockTitle: 'EDIT',
    subtitle: 'Crafting the story',
    tag: 'TIMELINE',
    floatSub: 'Cut by cut, SFX & music sync',
    w: 232,
    h: 146,
    description:
      'Footage is organised, selects are pulled, and the story is built cut by cut — with music sync, sound design instincts, transitions, and pacing that keeps attention locked.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    color: '#34d399',
  },
  {
    number: '04',
    title: 'Color Grade',
    dockTitle: 'COLOR',
    subtitle: 'The cinematic finish',
    tag: 'DAVINCI',
    floatSub: 'Skin balance, contrast & look dev',
    w: 172,
    h: 206,
    description:
      'Every frame goes through a proper colour grade — skin tone balance, contrast sculpting, and look development that takes the footage from "good" to genuinely cinematic.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    color: '#f472b6',
  },
  {
    number: '05',
    title: 'Delivery',
    dockTitle: 'DELIVERY',
    subtitle: 'Platform-ready exports',
    tag: '4K EXPORTS',
    floatSub: 'Reels, YouTube & platform specs',
    w: 236,
    h: 146,
    description:
      'Final files are delivered in every format you need — Instagram Reels, YouTube, branded social cuts — all optimised for platform specs with a clean handoff and fast turnaround.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: '#38bdf8',
  },
];

function splitToChars(el) {
  if (!el) return [];
  const raw = el.dataset.rawText || el.textContent.trim();
  el.dataset.rawText = raw;
  const words = raw.split(/\s+/);
  const chars = [];
  el.innerHTML = '';
  words.forEach((word, wi) => {
    const wrap = document.createElement('span');
    wrap.className = 'inline-block whitespace-nowrap';
    for (const ch of word) {
      const mask = document.createElement('span');
      mask.className = 'inline-block overflow-hidden align-bottom px-[0.03em] -mx-[0.03em]';
      const inner = document.createElement('span');
      inner.className = 'inline-block will-change-transform';
      inner.textContent = ch;
      mask.appendChild(inner);
      wrap.appendChild(mask);
      chars.push(inner);
    }
    el.appendChild(wrap);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
  return chars;
}

function splitToWords(el) {
  if (!el) return [];
  const raw = el.dataset.rawText || el.textContent.trim();
  el.dataset.rawText = raw;
  const words = raw.split(/\s+/);
  const spans = [];
  el.innerHTML = '';
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'inline-block will-change-transform';
    span.textContent = word;
    el.appendChild(span);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    spans.push(span);
  });
  return spans;
}

export default function WorkProcessSection() {
  const sectionRef = useRef(null);
  const floatCardRef = useRef(null);
  const activeStepRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(null);
  const [hoveredStep, setHoveredStep] = useState(null);
  const { reducedMotion, enable3D } = useMotionCapability();

  // Long, unhurried scroll-scrubbed text choreography (GSAP + ScrollTrigger)
  useEffect(() => {
    const section = sectionRef.current;
    if (reducedMotion || !section) return;

    const ctx = gsap.context(() => {
      const pill = section.querySelector('[data-wp-pill]');
      const hwWhite = section.querySelector('[data-wp-white]');
      const hwAmber = section.querySelector('[data-wp-amber]');
      const subEl = section.querySelector('[data-wp-sub]');
      const stepEls = Array.from(section.querySelectorAll('.process-step'));

      if (enable3D) {
        const headChars = [...splitToChars(hwWhite), ...splitToChars(hwAmber)];
        const subWords = splitToWords(subEl);

        if (pill) {
          gsap.fromTo(
            pill,
            { opacity: 0, y: 18, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 95%',
                end: 'top 68%',
                scrub: 1.0,
              },
            }
          );
        }

        if (headChars.length) {
          gsap.fromTo(
            headChars,
            {
              yPercent: 120,
              rotateX: 82,
              opacity: 0,
              transformPerspective: 1000,
              transformOrigin: '50% 100%',
            },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              stagger: 0.055,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 92%',
                end: 'top 36%',
                scrub: 1.25,
              },
            }
          );
        }

        if (subWords.length) {
          gsap.fromTo(
            subWords,
            { opacity: 0.12, y: 18, rotateX: 28, transformPerspective: 800 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              stagger: 0.075,
              ease: 'none',
              scrollTrigger: {
                trigger: subEl,
                start: 'top 94%',
                end: 'top 46%',
                scrub: 1.15,
              },
            }
          );
        }

        stepEls.forEach((step) => {
          const iconBox = step.querySelector('.step-icon-box');
          const eyebrow = step.querySelector('[data-step-eyebrow]');
          const titleChars = splitToChars(step.querySelector('[data-step-title]'));
          const bodyWords = splitToWords(step.querySelector('[data-step-body]'));

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: step,
              start: 'top 95%',
              end: 'top 34%',
              scrub: 1.2,
            },
          });

          if (iconBox) {
            tl.fromTo(
              iconBox,
              { scale: 0.72, opacity: 0, y: 24 },
              { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'none' },
              0
            );
          }

          if (eyebrow) {
            tl.fromTo(
              eyebrow,
              { x: -16, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.35, ease: 'none' },
              0.05
            );
          }

          if (titleChars.length) {
            tl.fromTo(
              titleChars,
              {
                yPercent: 115,
                rotateX: 78,
                opacity: 0,
                transformPerspective: 900,
                transformOrigin: '50% 100%',
              },
              {
                yPercent: 0,
                rotateX: 0,
                opacity: 1,
                stagger: 0.035,
                duration: 0.45,
                ease: 'none',
              },
              0.08
            );
          }

          if (bodyWords.length) {
            tl.fromTo(
              bodyWords,
              { opacity: 0.1, y: 12 },
              {
                opacity: 1,
                y: 0,
                stagger: 0.032,
                duration: 0.65,
                ease: 'none',
              },
              0.18
            );
          }
        });
      } else {
        gsap.fromTo(
          [pill, hwWhite, hwAmber, subEl, ...stepEls].filter(Boolean),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: { trigger: section, start: 'top 86%', once: true },
          }
        );
      }
    }, sectionRef);

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [reducedMotion, enable3D]);

  // Desktop floating velocity-tilted color card loop (pauses offscreen / hidden)
  useEffect(() => {
    if (!enable3D) return;
    const section = sectionRef.current;
    const floatCard = floatCardRef.current;
    if (!section || !floatCard) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0 };
    const smooth = { x: mouse.x, y: mouse.y, rot: 0, scale: 0.7 };
    let inView = false;
    let rafId = null;

    const tick = () => {
      if (!inView || document.hidden) {
        rafId = null;
        return;
      }

      const active = activeStepRef.current;
      const visible = Boolean(active);

      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      const targetRot = Math.max(-16, Math.min(16, mouse.vx * 0.55));
      mouse.vx *= 0.84;
      smooth.rot += (targetRot - smooth.rot) * 0.1;

      const targetScale = visible ? 1 : 0.7;
      smooth.scale += (targetScale - smooth.scale) * 0.14;

      floatCard.style.opacity = visible ? '1' : '0';
      const w = active?.w || 220;
      const h = active?.h || 148;
      floatCard.style.transform = `translate3d(${(smooth.x - w * 0.15).toFixed(1)}px, ${(smooth.y - h * 0.65).toFixed(1)}px, 0) rotate(${smooth.rot.toFixed(2)}deg) scale(${smooth.scale.toFixed(3)})`;

      const settled =
        !visible &&
        Math.abs(mouse.x - smooth.x) < 0.25 &&
        Math.abs(mouse.y - smooth.y) < 0.25 &&
        Math.abs(smooth.scale - 0.7) < 0.01;

      if (!settled) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const onPointerMove = (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (inView && !document.hidden && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !document.hidden && !rafId) {
          rafId = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.01 }
    );
    io.observe(section);

    const onVisibility = () => {
      if (!document.hidden && inView && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enable3D]);

  const handleStepEnter = (step, idx) => {
    setActiveIdx(idx);
    activeStepRef.current = step;
    setHoveredStep(step);
  };

  const handleStepLeave = () => {
    setActiveIdx(null);
    activeStepRef.current = null;
  };

  return (
    <section
      id="process"
      ref={sectionRef}
      className="persp-stage py-24 px-6 bg-[#0a0a0a] relative overflow-hidden"
    >
      {/* Portaled Tseily Floating Velocity-Tilted Color Card (Desktop Only) */}
      {enable3D &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={floatCardRef}
            aria-hidden="true"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: hoveredStep?.w || 220,
              height: hoveredStep?.h || 148,
              backgroundColor: hoveredStep?.color || '#f59e0b',
              pointerEvents: 'none',
              zIndex: 60,
              opacity: 0,
              borderRadius: '18px',
              willChange: 'transform, opacity',
              boxShadow: '0 24px 55px rgba(0, 0, 0, 0.65)',
              transition:
                'background-color 0.25s ease, width 0.28s cubic-bezier(0.22, 1, 0.36, 1), height 0.28s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.22s ease',
            }}
            className="flex flex-col justify-between p-5 text-black"
          >
            <div className="flex items-center justify-between font-mono text-[10px] font-bold tracking-widest uppercase text-black/75">
              <span>STEP {hoveredStep?.number || '01'}</span>
              <span>{hoveredStep?.tag || 'CLARITY'}</span>
            </div>
            <div>
              <p className="text-2xl font-black tracking-tighter uppercase leading-none text-black">
                {hoveredStep?.dockTitle || 'BRIEF'}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-black/75">
                {hoveredStep?.floatSub || ''}
              </p>
            </div>
          </div>,
          document.body
        )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <span
            data-wp-pill
            className="inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 font-mono text-[10px] font-bold tracking-[0.24em] text-amber-500 uppercase will-change-transform"
          >
            THE PROCESS
          </span>

          <h2 className="persp-stage mt-5 text-5xl sm:text-6xl lg:text-[64px] font-black tracking-tighter uppercase leading-[0.95]">
            <span data-wp-white className="text-white">
              HOW I
            </span>{' '}
            <span data-wp-amber className="text-amber-500">
              WORK
            </span>
          </h2>

          <p
            data-wp-sub
            className="persp-stage mt-4 max-w-md text-base leading-relaxed text-neutral-400 sm:text-lg"
          >
            A clear process means fewer surprises and a better end product — every time.
          </p>
        </div>

        {/* 5 Process Steps */}
        <div
          className={`steps-container grid grid-cols-1 gap-x-14 gap-y-16 md:grid-cols-2 ${
            activeIdx !== null ? 'has-hover' : ''
          }`}
        >
          {STEPS.map((step, idx) => (
            <article
              key={step.number}
              onPointerEnter={() => handleStepEnter(step, idx)}
              onPointerLeave={handleStepLeave}
              className={`process-step flex cursor-pointer items-start gap-5 will-change-transform ${
                idx === 4 ? 'md:col-span-2 md:max-w-md mx-auto w-full' : ''
              } ${activeIdx === idx ? 'is-active' : ''}`}
            >
              {/* Icon tile */}
              <div
                className="step-icon-box relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
                style={{
                  backgroundColor: `${step.color}14`,
                  borderColor: `${step.color}40`,
                  color: step.color,
                }}
              >
                <span
                  className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-extrabold text-black"
                  style={{ backgroundColor: step.color }}
                >
                  {idx + 1}
                </span>
                {step.icon}
              </div>

              <div className="min-w-0">
                <p
                  data-step-eyebrow
                  className="font-mono text-[10px] font-semibold tracking-[0.22em] uppercase"
                  style={{ color: step.color }}
                >
                  {step.number} / {step.subtitle}
                </p>
                <h3
                  data-step-title
                  className="mt-1.5 text-2xl sm:text-[26px] font-black tracking-tighter uppercase text-white leading-none"
                >
                  {step.title}
                </h3>
                <p
                  data-step-body
                  className="mt-3 text-sm leading-relaxed text-neutral-400"
                >
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
