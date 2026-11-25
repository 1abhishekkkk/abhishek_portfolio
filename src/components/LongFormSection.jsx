import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { useMotionCapability } from '../lib/motionSetup';

const VIDEOS = [
  {
    id: 1,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/nykaaland-aftermovie.mp4',
    title: 'Nykaa Land Aftermovie',
    tag: 'EVENT FILM',
    meta: 'Festival • Edit + Grade',
    description: 'High-energy festival aftermovie and brand experience for Nykaa Land',
    bg: '#f59e0b',
  },
  {
    id: 2,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/muscleblaze.mp4',
    title: 'MuscleBlaze Campaign',
    tag: 'COMMERCIAL',
    meta: 'Brand Film • Sound + Cut',
    description: 'Brand commercial for MuscleBlaze',
    bg: '#fbbf24',
  },
  {
    id: 3,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/oneplus-final.mp4',
    title: 'OnePlus Campaign',
    tag: 'PRODUCT LAUNCH',
    meta: 'Showcase • Edit + Color',
    description: 'A cinematic journey showcasing the flagship features',
    bg: '#ffffff',
  },
  {
    id: 4,
    src: 'https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/reels/montage-trailer.mp4',
    title: 'Montage Trailer',
    tag: 'SHOWCASE',
    meta: 'Compilation • Pacing + Grade',
    description: 'An epic compilation of creative moments',
    bg: '#d97706',
  },
];

const LongFormSection = () => {
  const [modalVideo, setModalVideo] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const modalVideoRef = useRef(null);
  const previewRef = useRef(null);
  const previewVideoRefs = useRef({});
  const hoveredRef = useRef(null);
  const startRafRef = useRef(null);

  const { enable3D } = useMotionCapability();

  const openModal = (video) => {
    setHoveredVideo(null);
    hoveredRef.current = null;
    setModalVideo(video);
  };

  const closeModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setModalVideo(null);
  };

  // Close modal on escape key and handle body overflow
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    if (modalVideo) {
      document.addEventListener('keydown', handleEscape);
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
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalVideo]);

  // Desktop velocity-tilted floating preview card loop (transform + opacity only)
  useEffect(() => {
    if (!enable3D) return;
    const preview = previewRef.current;
    if (!preview) return;

    let rafId = null;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0 };
    const smooth = { px: mouse.x, py: mouse.y, rot: 0, scale: 0.72 };

    const onPointerMove = (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (hoveredRef.current && !document.hidden && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const tick = () => {
      if (document.hidden) {
        rafId = null;
        return;
      }
      const visible = Boolean(hoveredRef.current);
      smooth.px += (mouse.x - smooth.px) * 0.11;
      smooth.py += (mouse.y - smooth.py) * 0.11;

      const targetRot = Math.max(-14, Math.min(14, mouse.vx * 0.55));
      mouse.vx *= 0.85;
      smooth.rot += (targetRot - smooth.rot) * 0.1;
      smooth.scale += ((visible ? 1 : 0.72) - smooth.scale) * 0.14;

      preview.style.opacity = visible ? '1' : '0';
      preview.style.transform = `translate3d(${(smooth.px + 125).toFixed(1)}px, ${(smooth.py - 20).toFixed(1)}px, 0) rotate(${smooth.rot.toFixed(2)}deg) scale(${smooth.scale.toFixed(3)})`;

      const settled =
        !visible &&
        Math.abs(smooth.scale - 0.72) < 0.01 &&
        Math.abs(smooth.rot) < 0.1;

      if (!settled) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    startRafRef.current = () => {
      if (!document.hidden && !rafId) {
        rafId = requestAnimationFrame(tick);
      }
    };

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      startRafRef.current = null;
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [enable3D]);

  // Sync preview video playback on hover change
  useEffect(() => {
    VIDEOS.forEach((v) => {
      const vid = previewVideoRefs.current[v.id];
      if (!vid) return;
      if (hoveredVideo && hoveredVideo.id === v.id) {
        vid.play().catch(() => {});
      } else {
        vid.pause();
      }
    });
  }, [hoveredVideo]);

  const handleRowEnter = (video) => {
    hoveredRef.current = video;
    setHoveredVideo(video);
    startRafRef.current?.();
  };

  const handleRowLeave = () => {
    hoveredRef.current = null;
    setHoveredVideo(null);
  };

  return (
    <section className="py-24 px-6 bg-neutral-950">
      {/* Floating Velocity-Tilted Preview Card (Desktop Only) */}
      {enable3D && (
        <div
          ref={previewRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: 280,
            height: 215,
            margin: '-107px 0 0 -140px',
            pointerEvents: 'none',
            zIndex: 60,
            opacity: 0,
            willChange: 'transform, opacity',
            backgroundColor: hoveredVideo?.bg || '#f59e0b',
          }}
          className="rounded-2xl border-2 border-white/25 p-2 flex flex-col justify-between shadow-2xl overflow-hidden transition-colors duration-200"
        >
          {/* Pre-loaded 16:9 video thumbnail area */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
            {VIDEOS.map((v) => (
              <video
                key={v.id}
                ref={(el) => {
                  if (el) previewVideoRefs.current[v.id] = el;
                }}
                src={`${v.src}#t=1`}
                muted
                loop
                playsInline
                preload="metadata"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ${
                  hoveredVideo?.id === v.id ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            <div className="absolute top-2 left-2 right-2 flex items-center justify-between font-mono text-[9px] tracking-widest uppercase font-bold">
              <span className="rounded-full bg-black/70 px-2 py-0.5 text-amber-400 backdrop-blur-sm">
                {hoveredVideo?.tag || 'COMMERCIAL'}
              </span>
              <span className="rounded-full bg-black/70 px-2 py-0.5 text-white backdrop-blur-sm">
                ▶ 4K
              </span>
            </div>
          </div>

          <div className="px-1.5 pt-1.5 pb-0.5">
            <p className="text-lg font-black tracking-tighter uppercase leading-none text-black truncate">
              {hoveredVideo?.title || ''}
            </p>
            <p className="text-[10px] font-semibold text-black/75 mt-0.5 truncate">
              {hoveredVideo?.meta || ''}
            </p>
          </div>
        </div>
      )}

      <div className="persp-stage">
        <div data-tseily-flip className="max-w-6xl mx-auto will-change-transform">
        {/* Section Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.26em] text-amber-500 uppercase font-bold mb-2">
              Extended Cuts
            </p>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter text-white uppercase leading-[0.92]">
              Long Form <span className="text-amber-500">Content</span>
            </h2>
            <p className="mt-2 text-xs text-neutral-500">
              Hover rows to preview • Click any film to watch fullscreen
            </p>
          </div>
          <span className="font-mono text-[11px] text-neutral-500 uppercase hidden sm:block">
            4 Films • 2025 — 2026
          </span>
        </div>

        {/* Tseily-Style Interactive Works List */}
        <div className="divide-y divide-white/10 border-y border-white/10">
          {VIDEOS.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => openModal(video)}
              onPointerEnter={() => handleRowEnter(video)}
              onPointerLeave={handleRowLeave}
              className="group flex w-full cursor-pointer flex-col md:flex-row md:items-center md:justify-between gap-4 py-6 text-left transition-colors"
            >
              {/* Mobile Inline Video Thumbnail Card (visible on phone/tablet where hover doesn't exist) */}
              <div
                style={{ backgroundColor: video.bg }}
                className="md:hidden w-full rounded-2xl border border-white/20 p-2 shadow-xl overflow-hidden"
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
                  <video
                    src={`${video.src}#t=1`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between font-mono text-[9px] tracking-widest uppercase font-bold">
                    <span className="rounded-full bg-black/75 px-2.5 py-0.5 text-amber-400 backdrop-blur-sm">
                      {video.tag}
                    </span>
                    <span className="rounded-full bg-black/75 px-2.5 py-0.5 text-white backdrop-blur-sm">
                      ▶ WATCH 4K
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center justify-between">
                <span className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase text-white transition-all duration-200 group-hover:translate-x-3 group-hover:text-amber-500 leading-[0.95]">
                  {video.title}
                </span>
                <span className="ml-4 flex items-center gap-3 shrink-0 font-mono text-[11px] text-neutral-500 group-hover:text-neutral-300 transition-colors">
                  <span className="hidden sm:inline">{video.meta}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                    <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </div>
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Video Modal Portaled to document.body (avoids Safari perspective/transform video blanking) */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {modalVideo && (
              <motion.div
                className="fixed inset-0 z-[9990] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeModal}
              >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

                <div
                  className="relative z-10 w-full max-w-4xl mx-auto bg-black rounded-3xl border border-white/20 overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={closeModal}
                    aria-label="Close video"
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/75 border border-white/25 flex items-center justify-center text-white hover:bg-amber-500 hover:text-black transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="aspect-video w-full bg-black">
                    <video
                      key={modalVideo.src}
                      ref={modalVideoRef}
                      src={modalVideo.src}
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
};

export default LongFormSection;
