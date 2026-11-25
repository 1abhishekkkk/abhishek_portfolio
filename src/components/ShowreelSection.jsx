import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionCapability } from '../lib/motionSetup';

gsap.registerPlugin(ScrollTrigger);

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const TITLE_WORD = 'SHOWREEL';
const SUB_WORDS = ['Explore', 'commercial', 'edits,', 'brand', 'launch', 'edits,', 'and', 'behind', 'the', 'scenes.'];
const EMPHASIS_WORDS = new Set(['commercial', 'edits,', 'brand', 'launch', 'behind', 'scenes.']);

function scrambleText(el, target, ms = 540, reduced = false) {
  if (!el) return;
  if (reduced) {
    el.textContent = target;
    return;
  }
  if (el._raf) cancelAnimationFrame(el._raf);
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / ms);
    const done = Math.floor(p * target.length);
    let out = '';
    for (let i = 0; i < target.length; i++) {
      if (target[i] === ' ') out += ' ';
      else if (i < done) out += target[i];
      else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
    el.textContent = out;
    if (p < 1) el._raf = requestAnimationFrame(step);
    else {
      el.textContent = target;
      el._raf = null;
    }
  };
  el._raf = requestAnimationFrame(step);
}

function hexToRgb(hex) {
  const clean = (hex || '#f59e0b').replace('#', '');
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Full unified reels dataset with brand/category tags
const ALL_REELS = [
  {
    id: 27,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/chasmir-reel.mp4',
    title: 'Chasmir Reel',
    brand: 'chasmir',
    type: 'Brand Reel',
  },
  {
    id: 26,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/samsung-s26-fe-x-bachhu.mp4',
    title: 'Samsung S26 FE x Bachhu',
    brand: 'samsung',
    type: 'Gaming Campaign',
  },
  {
    id: 25,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/titan-x-flipcart.mp4',
    title: 'Titan x Flipkart Commercial',
    brand: 'titan',
    type: 'Brand Commercial',
  },
  {
    id: 0,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-2-render.mp4',
    title: 'Fuse Bangalore 2 Render',
    brand: 'fuse',
    type: 'Brand Event',
  },
  {
    id: 2,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-bangalore.mp4',
    title: 'Fuse Bangalore',
    brand: 'fuse',
    type: 'Brand Event',
  },
  {
    id: 3,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-bts-final.mp4',
    title: 'Fuse BTS Final',
    brand: 'fuse',
    type: 'Behind the Scenes',
  },
  {
    id: 10,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/ishan-kishan.mp4',
    title: 'Ishan Kishan - Cricket Edit',
    brand: 'sports',
    type: 'Sports Edit',
  },
  {
    id: 4,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-15pro-launch-new.mp4',
    title: 'Realme 15 Pro Launch',
    brand: 'realme',
    type: 'Launch Campaign',
  },
  {
    id: 5,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/honor-brand.mp4',
    title: 'Honor Brand Commercial',
    brand: 'honor',
    type: 'Brand Commercial',
  },
  {
    id: 15,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-black-t.mp4',
    title: 'FUSE Black T',
    brand: 'fuse',
    type: 'Product Showcase',
  },
  {
    id: 16,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-violet-t.mp4',
    title: 'FUSE Violet T',
    brand: 'fuse',
    type: 'Product Showcase',
  },
  {
    id: 17,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-tiger-t.mp4',
    title: 'FUSE Tiger T',
    brand: 'fuse',
    type: 'Product Showcase',
  },
  {
    id: 18,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-dragon-t.mp4',
    title: 'FUSE Dragon T',
    brand: 'fuse',
    type: 'Product Showcase',
  },
  {
    id: 19,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-beetle-t.mp4',
    title: 'FUSE Beetle T',
    brand: 'fuse',
    type: 'Product Showcase',
  },
  {
    id: 20,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fuse-white-t.mp4',
    title: 'FUSE White T',
    brand: 'fuse',
    type: 'Product Showcase',
  },
  {
    id: 1,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/shreyanka-x-duroflex.mp4',
    title: 'Shreyanka x Duroflex',
    brand: 'duroflex',
    type: 'Collaboration',
  },
  {
    id: 6,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-11pro.mp4',
    title: 'Realme 11 Pro',
    brand: 'realme',
    type: 'Product Launch',
  },
  {
    id: 7,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/fashion-gurav.mp4',
    title: 'Fashion Commercial',
    brand: 'fashion',
    type: 'Fashion Edit',
  },
  {
    id: 8,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-16pro-plus.mp4',
    title: 'Realme 16 Pro+',
    brand: 'realme',
    type: 'Product Launch',
  },
  {
    id: 9,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/realme-16pro-plus-launch.mp4',
    title: 'Realme 16 Pro+ Launch',
    brand: 'realme',
    type: 'Launch Campaign',
  },
  {
    id: 11,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/oneplus-final.mp4',
    title: 'OnePlus Campaign',
    brand: 'oneplus',
    type: 'Campaign',
  },
  {
    id: 13,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/muscleblaze.mp4',
    title: 'MuscleBlaze Commercial',
    brand: 'muscleblaze',
    type: 'Brand Commercial',
  },
  {
    id: 14,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/mono-podcast.mp4',
    title: 'Mono Podcast',
    brand: 'mono',
    type: 'Podcast Edit',
  },
];

const FILTERS = [
  { id: 'all',         label: 'All',         color: '#f59e0b' },
  { id: 'realme',      label: 'Realme',      color: '#FFD700' },
  { id: 'fuse',        label: 'Fuse',        color: '#FF6B35' },
  { id: 'duroflex',    label: 'Duroflex',    color: '#3b9eff' },
  { id: 'oneplus',     label: 'OnePlus',     color: '#EB0028' },
  { id: 'honor',       label: 'Honor',       color: '#c084fc' },
  { id: 'muscleblaze', label: 'MuscleBlaze', color: '#f97316' },
  { id: 'sports',      label: 'Sports',      color: '#34d399' },
  { id: 'fashion',     label: 'Fashion',     color: '#f472b6' },
  { id: 'mono',        label: 'Mono',        color: '#94a3b8' },
  { id: 'titan',       label: 'Titan',       color: '#a855f7' },
  { id: 'samsung',     label: 'Samsung',     color: '#3b82f6' },
  { id: 'chasmir',     label: 'Chasmir',     color: '#e11d48' },
];

const getBrandColor = (brandId) =>
  FILTERS.find((f) => f.id === brandId)?.color || '#f59e0b';

// ---------- Creative Hover Reel Card ----------
function ReelCard({
  reel,
  index,
  hoveredIdx,
  enable3D,
  onHoverStart,
  onHoverEnd,
  onOpenModal,
}) {
  const slotRef = useRef(null);
  const cardRef = useRef(null);
  const sheenRef = useRef(null);
  const videoRef = useRef(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const tiltRef = useRef({ rx: 0, ry: 0, trx: 0, try: 0, sx: -55, tsx: -55, rafId: null });

  const accentColor = getBrandColor(reel.brand);
  const isActive = hoveredIdx === index;
  const shiftClass = isActive ? 'is-active' : '';

  // Smart Viewport Lazy Loading
  useEffect(() => {
    const el = slotRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (entry.isIntersecting) setHasEnteredView(true);
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play on hover on desktop (or in view on touch)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasEnteredView) return;
    const isTouch =
      typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (isActive || (isTouch && isInView)) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, isInView, hasEnteredView]);

  // Smooth 3D tilt + diagonal glass sheen lerp (Desktop only)
  const startTiltLoop = () => {
    const st = tiltRef.current;
    if (st.rafId) return;

    const tick = () => {
      const card = cardRef.current;
      const sheen = sheenRef.current;
      st.rx += (st.trx - st.rx) * 0.1;
      st.ry += (st.try - st.ry) * 0.1;
      st.sx += (st.tsx - st.sx) * 0.1;

      if (card && sheen) {
        if (Math.abs(st.rx) > 0.03 || Math.abs(st.ry) > 0.03 || Math.abs(st.trx) > 0.01) {
          card.style.transform = `rotateX(${st.rx.toFixed(2)}deg) rotateY(${st.ry.toFixed(2)}deg)`;
          sheen.style.transform = `translate3d(${st.sx.toFixed(1)}%, 0, 0)`;
          st.rafId = requestAnimationFrame(tick);
        } else {
          card.style.transform = '';
          st.rafId = null;
        }
      } else {
        st.rafId = null;
      }
    };
    st.rafId = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const st = tiltRef.current;
    return () => {
      if (st.rafId) cancelAnimationFrame(st.rafId);
    };
  }, []);

  const handlePointerMove = (e) => {
    if (!enable3D || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    tiltRef.current.try = nx * 8.5;
    tiltRef.current.trx = -ny * 7.5;
    tiltRef.current.tsx = nx * 38;
    startTiltLoop();
  };

  const handlePointerLeave = () => {
    tiltRef.current.trx = 0;
    tiltRef.current.try = 0;
    tiltRef.current.tsx = -55;
    startTiltLoop();
    onHoverEnd();
  };

  return (
    <div
      ref={slotRef}
      onPointerEnter={() => onHoverStart(index, reel)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={() => onOpenModal(reel)}
      className={`reel-slot ${shiftClass}`}
    >
      <article
        ref={cardRef}
        className="reel-card shadow-2xl"
        style={{ '--brand': accentColor }}
      >
        <div className="relative aspect-[9/16] w-full overflow-hidden rounded-[18px] bg-[#141414]">
          {hasEnteredView && (
            <video
              ref={videoRef}
              src={`${reel.src}#t=0.5`}
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => {
                setVideoLoaded(true);
                const isTouch =
                  typeof window !== 'undefined' &&
                  window.matchMedia('(hover: none)').matches;
                if ((isActive || isTouch) && videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              className="reel-media h-full w-full object-cover pointer-events-none"
            />
          )}

          {/* Loading Spinner */}
          {(!hasEnteredView || !videoLoaded) && (
            <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/25 border-t-white/85 rounded-full animate-spin" />
            </div>
          )}

          {/* Specular Diagonal Glass Sheen */}
          <div ref={sheenRef} className="reel-sheen" />

          {/* Viewfinder Focus Corners */}
          <span className="vf-corner vf-tl" />
          <span className="vf-corner vf-tr" />
          <span className="vf-corner vf-bl" />
          <span className="vf-corner vf-br" />

          {/* Top Pills */}
          <div className="pointer-events-none absolute top-3 right-3 left-3 flex items-center justify-between font-mono text-[9px] font-bold tracking-wider z-10">
            <span className="rounded-full bg-black/75 px-2.5 py-1 text-white uppercase backdrop-blur-sm">
              {reel.brand}
            </span>
            <span className="rounded-full bg-black/75 px-2.5 py-1 text-neutral-200 backdrop-blur-sm">
              ▶ 9:16
            </span>
          </div>

          {/* Hover Cinema HUD Bar + Animated Timeline Scrub */}
          <div className="reel-hud pointer-events-none absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-3.5 pt-8 z-10">
            <p className="text-xs font-black tracking-tight text-white uppercase truncate mb-1">
              {reel.title}
            </p>
            <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.2em] text-white/80 uppercase">
              <span>{reel.type}</span>
              <span style={{ color: accentColor }}>HD</span>
            </div>
            <div className="mt-2 h-[2px] w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="hud-progress h-full w-full"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

// ---------- Main Showreel Section ----------
export default function ShowreelSection() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [hoveredReel, setHoveredReel] = useState(null);
  const [modalReel, setModalReel] = useState(null);

  const modalVideoRef = useRef(null);
  const smartCursorRef = useRef(null);
  const headerRef = useRef(null);
  const eyebrowPillRef = useRef(null);
  const eyebrowTextRef = useRef(null);
  const statusRef = useRef(null);
  const pillsGroupRef = useRef(null);
  const srReelRefs = useRef([]);
  const srCharRefs = useRef([]);
  const subWordRefs = useRef([]);
  const pillRefs = useRef([]);
  const activeColorRef = useRef('#f59e0b');

  const { reducedMotion, enable3D } = useMotionCapability();

  const filteredReels =
    activeFilter === 'all'
      ? ALL_REELS
      : ALL_REELS.filter((r) => r.brand === activeFilter);

  const activeFilterObj = FILTERS.find((f) => f.id === activeFilter) || FILTERS[0];
  activeColorRef.current = activeFilterObj.color;
  const hoveredColor = getBrandColor(hoveredReel?.brand);

  const openModal = (reel) => {
    setHoveredIdx(null);
    setHoveredReel(null);
    setModalReel(reel);
  };

  const closeModal = () => {
    if (modalVideoRef.current) modalVideoRef.current.pause();
    setModalReel(null);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };
    if (modalReel) {
      document.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
      const vid = modalVideoRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalReel]);

  // Morphing "▶ PLAY" Smart Cursor (Desktop only — runs RAF only while hovering a card)
  useEffect(() => {
    if (!enable3D) return;
    const cursor = smartCursorRef.current;
    if (!cursor || !hoveredReel || modalReel) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    let rafId = null;

    const onMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const tick = () => {
      if (document.hidden) {
        rafId = null;
        return;
      }
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
      if (Math.abs(mx - cx) > 0.3 || Math.abs(my - cy) > 0.3) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
    };
  }, [enable3D, hoveredReel, modalReel]);

  // Kinetic SHOWREEL Film-Gate Roll + Masked Word Reveal + Pill Entrance (on scroll into view)
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reels = srReelRefs.current.filter(Boolean);
    const words = subWordRefs.current.filter(Boolean);
    const pills = pillRefs.current.filter(Boolean);

    if (reducedMotion) {
      gsap.set(reels, { yPercent: -66.6667 });
      gsap.set([eyebrowPillRef.current, ...words, ...pills], {
        opacity: 1,
        clearProps: 'transform',
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        },
      });

      if (eyebrowPillRef.current) {
        tl.fromTo(
          eyebrowPillRef.current,
          { opacity: 0, y: 14, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out',
            onStart: () => scrambleText(eyebrowTextRef.current, 'LATEST WORK', 560, false),
          },
          0
        );
      }

      reels.forEach((reel, i) => {
        tl.fromTo(
          reel,
          { yPercent: i % 2 === 0 ? 0 : -15, opacity: 0 },
          {
            yPercent: -66.6667,
            opacity: 1,
            duration: 0.78,
            ease: 'expo.out',
          },
          0.08 + i * 0.045
        );
      });

      if (words.length) {
        tl.fromTo(
          words,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.55,
            stagger: 0.032,
            ease: 'power3.out',
            clearProps: 'transform',
          },
          0.34
        );
      }

      if (pills.length) {
        tl.fromTo(
          pills,
          { opacity: 0, y: 20, scale: 0.74 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.62,
            stagger: { each: 0.032, from: 'center' },
            ease: 'back.out(1.7)',
            clearProps: 'transform',
          },
          0.52
        );
      }
    }, headerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Desktop Liquid 3D Proximity Wave on "SHOWREEL" + Magnetic Brand Pills
  useEffect(() => {
    if (!enable3D) return;
    const titleEl = headerRef.current?.querySelector('[data-sr-title]');
    const pillsGroup = pillsGroupRef.current;
    const pills = pillRefs.current.filter(Boolean);
    if (!titleEl) return;

    const charStates = srCharRefs.current.filter(Boolean).map((el) => ({
      el,
      lift: 0,
      scaleY: 1,
      rotX: 0,
      mix: 0,
      tLift: 0,
      tScaleY: 1,
      tRotX: 0,
      tMix: 0,
    }));

    let titleHover = false;
    let waveRaf = null;

    const tickWave = () => {
      let moving = titleHover;
      const [ar, ag, ab] = hexToRgb(activeColorRef.current);

      for (let i = 0; i < charStates.length; i++) {
        const c = charStates[i];
        c.lift += (c.tLift - c.lift) * 0.16;
        c.scaleY += (c.tScaleY - c.scaleY) * 0.16;
        c.rotX += (c.tRotX - c.rotX) * 0.16;
        c.mix += (c.tMix - c.mix) * 0.16;

        c.el.style.transform = `translate3d(0, ${(-c.lift).toFixed(2)}px, 0) scaleY(${c.scaleY.toFixed(3)}) rotateX(${c.rotX.toFixed(2)}deg)`;

        if (c.mix > 0.02) {
          const r = Math.round(255 + (ar - 255) * c.mix);
          const g = Math.round(255 + (ag - 255) * c.mix);
          const b = Math.round(255 + (ab - 255) * c.mix);
          c.el.style.color = `rgb(${r}, ${g}, ${b})`;
          moving = true;
        } else {
          c.el.style.color = '#ffffff';
        }
        if (Math.abs(c.lift) > 0.05) moving = true;
      }

      if (moving) waveRaf = requestAnimationFrame(tickWave);
      else waveRaf = null;
    };

    const onTitleMove = (e) => {
      titleHover = true;
      const radius = 150;
      for (let i = 0; i < charStates.length; i++) {
        const c = charStates[i];
        const r = c.el.getBoundingClientRect();
        const dist = Math.abs(e.clientX - (r.left + r.width / 2));
        const norm = Math.max(0, 1 - dist / radius);
        const ease = norm * norm;
        c.tLift = ease * 9;
        c.tScaleY = 1 + ease * 0.16;
        c.tRotX = -ease * 16;
        c.tMix = ease;
      }
      if (!waveRaf) waveRaf = requestAnimationFrame(tickWave);
    };

    const onTitleLeave = () => {
      titleHover = false;
      for (let i = 0; i < charStates.length; i++) {
        charStates[i].tLift = 0;
        charStates[i].tScaleY = 1;
        charStates[i].tRotX = 0;
        charStates[i].tMix = 0;
      }
      if (!waveRaf) waveRaf = requestAnimationFrame(tickWave);
    };

    titleEl.addEventListener('pointermove', onTitleMove, { passive: true });
    titleEl.addEventListener('pointerleave', onTitleLeave);

    const pillCleanup = [];
    const onGroupEnter = () => pillsGroup?.classList.add('has-hover');
    const onGroupLeave = () => pillsGroup?.classList.remove('has-hover');
    pillsGroup?.addEventListener('pointerenter', onGroupEnter);
    pillsGroup?.addEventListener('pointerleave', onGroupLeave);

    pills.forEach((btn) => {
      const onMove = (e) => {
        const r = btn.getBoundingClientRect();
        const tx = ((e.clientX - (r.left + r.width / 2)) / r.width) * 10;
        const ty = ((e.clientY - (r.top + r.height / 2)) / r.height) * 8;
        btn.style.transition =
          'transform 0.14s ease-out, background-color 0.25s, border-color 0.25s, color 0.25s, opacity 0.25s';
        btn.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0)`;
      };
      const onLeave = () => {
        btn.style.transition =
          'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s, border-color 0.25s, color 0.25s, opacity 0.25s';
        btn.style.transform = 'translate3d(0, 0, 0)';
      };
      btn.addEventListener('pointermove', onMove, { passive: true });
      btn.addEventListener('pointerleave', onLeave);
      pillCleanup.push(() => {
        btn.removeEventListener('pointermove', onMove);
        btn.removeEventListener('pointerleave', onLeave);
      });
    });

    return () => {
      if (waveRaf) cancelAnimationFrame(waveRaf);
      titleEl.removeEventListener('pointermove', onTitleMove);
      titleEl.removeEventListener('pointerleave', onTitleLeave);
      pillsGroup?.removeEventListener('pointerenter', onGroupEnter);
      pillsGroup?.removeEventListener('pointerleave', onGroupLeave);
      pillCleanup.forEach((fn) => fn());
    };
  }, [enable3D]);

  const handleFilterClick = (f, count, idx) => {
    setActiveFilter(f.id);
    const btn = pillRefs.current[idx];
    if (btn && !reducedMotion) {
      gsap.fromTo(btn, { scale: 0.9 }, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.55)' });
    }
    const label =
      f.id === 'all'
        ? `ALL ${count} VIDEOS`
        : `${f.label.toUpperCase()} — ${count} VIDEO${count === 1 ? '' : 'S'}`;
    scrambleText(statusRef.current, label, 380, reducedMotion);
  };

  return (
    <section className="relative mx-auto w-full max-w-[1380px] overflow-hidden px-5 py-12 sm:px-10 sm:py-16 bg-neutral-950">
      {/* Portaled Morphing "▶ PLAY" Lens Cursor */}
      {enable3D &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={smartCursorRef}
            id="smart-cursor"
            aria-hidden="true"
            style={{
              opacity: hoveredReel && !modalReel ? 1 : 0,
              backgroundColor: hoveredColor,
            }}
          >
            <span>▶ PLAY</span>
          </div>,
          document.body
        )}

      {/* Dynamic Ambient Cinema Wall Projection */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '52%',
          left: '50%',
          width: 920,
          height: 540,
          margin: '-270px 0 0 -460px',
          borderRadius: 9999,
          pointerEvents: 'none',
          filter: 'blur(110px)',
          backgroundColor: hoveredColor,
          opacity: hoveredReel ? 0.22 : 0,
          transition: 'opacity 0.45s ease, background-color 0.45s ease',
          willChange: 'opacity',
        }}
      />

      {/* Kinetic Header + Brand Filter Pills */}
      <div ref={headerRef} className="relative z-10 flex flex-col items-center text-center">
        {/* 1. Eyebrow Pill: REC Pulse + Timecode Scramble */}
        <div
          ref={eyebrowPillRef}
          className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 font-mono text-[11px] font-bold tracking-[0.26em] text-amber-500 uppercase will-change-transform"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          <span ref={eyebrowTextRef}>LATEST WORK</span>
        </div>

        {/* 2. SHOWREEL: Film-Gate Split-Flap Roll + Interactive Proximity Wave */}
        <h2
          data-sr-title
          aria-label="SHOWREEL"
          className="sr-stage mt-5 cursor-default text-6xl font-black tracking-tighter uppercase text-white sm:text-7xl md:text-[84px] leading-[0.94]"
        >
          {TITLE_WORD.split('').map((ch, i) => (
            <span key={i} className="sr-mask">
              <span
                ref={(el) => {
                  srReelRefs.current[i] = el;
                }}
                className="sr-reel"
              >
                <span className="opacity-25 text-amber-500">{GLYPHS[(i * 7 + 3) % 26]}</span>
                <span className="opacity-45 text-white">{GLYPHS[(i * 11 + 9) % 26]}</span>
                <span
                  ref={(el) => {
                    srCharRefs.current[i] = el;
                  }}
                  className="sr-char"
                >
                  {ch}
                </span>
              </span>
            </span>
          ))}
        </h2>

        {/* 3. Subtitle: Masked Word-by-Word Reveal */}
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
          {SUB_WORDS.map((w, idx) => (
            <React.Fragment key={idx}>
              <span className="inline-block overflow-hidden align-bottom">
                <span
                  ref={(el) => {
                    subWordRefs.current[idx] = el;
                  }}
                  className={`inline-block will-change-transform ${
                    EMPHASIS_WORDS.has(w.toLowerCase()) ? 'text-neutral-200 font-medium' : ''
                  }`}
                >
                  {w}
                </span>
              </span>
              {idx < SUB_WORDS.length - 1 ? ' ' : ''}
            </React.Fragment>
          ))}
        </p>

        {/* 4. All 13 Interactive Brand Filter Pills with Opposing Slot-Roll */}
        <div
          ref={pillsGroupRef}
          className="pills-group mt-9 flex max-w-4xl flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {FILTERS.map((f, idx) => {
            const count =
              f.id === 'all'
                ? ALL_REELS.length
                : ALL_REELS.filter((r) => r.brand === f.id).length;
            if (count === 0) return null;
            const isSelected = activeFilter === f.id;
            const isLinked = hoveredReel?.brand === f.id;
            return (
              <button
                key={f.id}
                ref={(el) => {
                  pillRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => handleFilterClick(f, count, idx)}
                style={{ '--c': f.color }}
                className={`brand-pill ${isSelected ? 'is-active' : ''} ${
                  isLinked && !isSelected ? 'is-linked' : ''
                }`}
              >
                <span className="slot-box">
                  <span className="slot-up">
                    <span>{f.label}</span>
                    <span>{f.label}</span>
                  </span>
                </span>
                <span className="slot-box opacity-80 text-[11px]">
                  <span className="slot-down">
                    <span>{count}</span>
                    <span>{count}</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Selection Counter */}
        <div className="mt-8 flex items-center gap-4 font-mono text-[10px] tracking-[0.26em] uppercase">
          <span className="h-[1px] w-10 bg-white/15" />
          <span ref={statusRef} style={{ color: activeFilterObj.color }}>
            {activeFilter === 'all'
              ? `ALL ${ALL_REELS.length} VIDEOS`
              : `${activeFilterObj.label.toUpperCase()} — ${filteredReels.length} VIDEO${
                  filteredReels.length === 1 ? '' : 'S'
                }`}
          </span>
          <span className="h-[1px] w-10 bg-white/15" />
        </div>
      </div>

      {/* Color-Framed Vertical 9:16 Showreel Grid */}
      <div
        className={`reels-grid relative z-10 mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5 ${
          hoveredIdx !== null ? 'has-hover' : ''
        }`}
      >
        {filteredReels.map((reel, idx) => (
          <ReelCard
            key={reel.id}
            reel={reel}
            index={idx}
            hoveredIdx={hoveredIdx}
            enable3D={enable3D}
            onHoverStart={(i, r) => {
              setHoveredIdx(i);
              setHoveredReel(r);
            }}
            onHoverEnd={() => {
              setHoveredIdx(null);
              setHoveredReel(null);
            }}
            onOpenModal={openModal}
          />
        ))}
      </div>

      {/* Portaled 9:16 Video Modal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {modalReel && (
              <motion.div
                className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
              >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

                <div
                  className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto bg-black rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeModal}
                    aria-label="Close reel"
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/75 border border-white/25 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="aspect-[9/16] w-full bg-black">
                    <video
                      key={modalReel.src}
                      ref={modalVideoRef}
                      src={modalReel.src}
                      className="w-full h-full object-contain bg-black"
                      controls
                      autoPlay
                      loop
                      playsInline
                      preload="auto"
                      onCanPlay={() => {
                        if (modalVideoRef.current && modalVideoRef.current.paused) {
                          modalVideoRef.current.play().catch(() => {});
                        }
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
