import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── PHOTOBOOTH IMAGES FROM LOCAL DIRECTORY ─────────────────────────────────
const PHOTO_IMAGES = [
  "/images/photobooth/1111.jpg",
  "/images/photobooth/2222.jpg",
  "/images/photobooth/1769481287074.jpg",
  "/images/photobooth/1769481313631.jpg",
  "/images/photobooth/1769481339393.jpg",
  "/images/photobooth/1769481441320.jpg",
  "/images/photobooth/1769481445154.jpg",
  "/images/photobooth/1769481446115.jpg",
  "/images/photobooth/1769481526115.jpg",
  "/images/photobooth/1769481651875.jpg",
  "/images/photobooth/IMG_20251027_211512.jpg",
  "/images/photobooth/IMG_20260119_100707.jpg",
  "/images/photobooth/IMG_20260119_100720.jpg",
  "/images/photobooth/IMG_20260119_100742.jpg",
  "/images/photobooth/IMG_20260119_101302.jpg",
  "/images/photobooth/IMG_20260119_143858.jpg",
  "/images/photobooth/IMG_20260119_143939.jpg",
  "/images/photobooth/IMG_20260119_144213.jpg",
  "/images/photobooth/IMG_20260119_144305.jpg",
  "/images/photobooth/IMG_20260119_160556.jpg",
  "/images/photobooth/IMG_20260119_160927.jpg",
  "/images/photobooth/IMG_20260119_215945.jpg",
  "/images/photobooth/IMG_20260119_221452.jpg",
  "/images/photobooth/IMG_20260225_230857.jpg",
  "/images/photobooth/IMG_20260225_232153.jpg",
  "/images/photobooth/IMG_20260225_232524.jpg",
  "/images/photobooth/IMG_20260301_083411.jpg",
  "/images/photobooth/IMG_20260303_111810.jpg",
  "/images/photobooth/IMG_20260311_005148.jpg",
  "/images/photobooth/IMG_20260311_005947.jpg",
  "/images/photobooth/IMG_20260313_205105.jpg",
  "/images/photobooth/IMG_20260313_205119.jpg",
  "/images/photobooth/IMG_20260315_014838.jpg",
  "/images/photobooth/IMG_20260315_021133.jpg"
];

const CARD_W = 190;
const CARD_H = 265;
const DISTANCE_THRESHOLD = 60;
const DISMISS_DELAY = 1000;

// ─── SECTION-SCOPED MOUSE & TOUCH TRAIL ──────────────────────────────────────
function SectionMouseTrail({ containerRef }) {
  const [cards, setCards] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const imgIdx = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Keep cards away from edges so they never clip
      const safeX = Math.min(Math.max(x, CARD_W / 2 + 10), rect.width - CARD_W / 2 - 10);
      const safeY = Math.min(Math.max(y, CARD_H / 2 + 10), rect.height - CARD_H / 2 - 10);

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < DISTANCE_THRESHOLD) return;

      lastPos.current = { x, y };
      const tilt = (Math.random() - 0.5) * 16;

      const card = {
        id: Date.now() + Math.random(),
        src: PHOTO_IMAGES[imgIdx.current % PHOTO_IMAGES.length],
        x: safeX,
        y: safeY,
        tilt,
      };
      imgIdx.current++;
      setCards((prev) => [...prev, card]);
      setTimeout(() => {
        setCards((prev) => prev.filter((c) => c.id !== card.id));
      }, DISMISS_DELAY);
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchstart", onTouchMove, { passive: true });

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchstart", onTouchMove);
    };
  }, [containerRef]);

  return (
    <AnimatePresence>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ scale: 0, opacity: 0, rotate: card.tilt, x: card.x, y: card.y }}
          animate={{ scale: 1, opacity: 1, rotate: card.tilt, x: card.x, y: card.y }}
          exit={{ scale: 0.72, opacity: 0, y: card.y + 20, transition: { duration: 0.3, ease: "easeIn" } }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            translateX: "-50%",
            translateY: "-50%",
            width: CARD_W,
            height: CARD_H,
            borderRadius: 13,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 20,
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            willChange: "transform, opacity",
          }}
        >
          <img
            src={card.src}
            alt=""
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          {/* Bottom vignette on the card itself */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// ─── CUSTOM CURSOR RING ───────────────────────────────────────────────────────
function CursorRing({ containerRef }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const move = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const detectTouch = () => {
      setIsTouch(true);
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("touchstart", detectTouch, { passive: true });

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("touchstart", detectTouch);
    };
  }, [containerRef]);

  if (isTouch) return null; // Don't show custom cursor on mobile touch screens

  return (
    <motion.div
      animate={{ x: pos.x - 20, y: pos.y - 20 }}
      transition={{ type: "spring", stiffness: 600, damping: 35, mass: 0.3 }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 40,
        height: 40,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.45)",
        pointerEvents: "none",
        zIndex: 40,
        mixBlendMode: "difference",
      }}
    />
  );
}

// ─── MAIN PHOTOGRAPHY SECTION ─────────────────────────────────────────────────
const NEUTRAL_950 = "#0a0a0a"; // matches Tailwind neutral-950

export default function PhotographySection() {
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  const tags = ["Portrait", "Editorial", "Street", "Product", "Events", "Lifestyle"];

  return (
    <section
      id="photography"
      ref={sectionRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: NEUTRAL_950,
        minHeight: "88vh",
        cursor: hovered ? "none" : "default",
      }}
      className="flex flex-col items-center justify-center py-28 px-6"
    >
      {/* Gradient fade from neutral-950 at TOP */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 140,
          background: `linear-gradient(to bottom, ${NEUTRAL_950} 0%, transparent 100%)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Gradient fade to neutral-950 at BOTTOM */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          background: `linear-gradient(to top, ${NEUTRAL_950} 0%, transparent 100%)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Film grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Trail cards */}
      <SectionMouseTrail containerRef={sectionRef} />

      {/* Content */}
      <div className="relative z-30 text-center max-w-4xl mx-auto pointer-events-none select-none">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[10px] font-black tracking-[0.35em] text-amber-500 uppercase mb-6"
        >
          Through the Lens
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-white leading-none tracking-tight mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
            fontWeight: 700,
          }}
        >
          Every Frame
          <br />
          <span style={{ color: "rgba(255,255,255,0.28)", fontStyle: "italic" }}>
            tells a story
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-white/35 text-sm font-light tracking-wide mb-10"
        >
          Move your cursor or touch to explore the photography.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 justify-center pointer-events-auto"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full border border-white/10 text-white/35 text-[10px] font-bold tracking-widest uppercase"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Custom cursor ring */}
      {hovered && <CursorRing containerRef={sectionRef} />}
    </section>
  );
}
