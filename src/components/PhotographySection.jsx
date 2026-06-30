import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── PLACEHOLDER IMAGES ───────────────────────────────────────────────────────
// Replace with your actual photography URLs when ready
const PHOTO_IMAGES = [
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526779259212-939e64788e3c?w=500&h=700&fit=crop&q=80",
  "https://images.unsplash.com/photo-1495216875107-c6c043eb703f?w=500&h=700&fit=crop&q=80",
];

const CARD_W = 190;
const CARD_H = 265;
const DISTANCE_THRESHOLD = 72;
const DISMISS_DELAY = 1100;

// ─── SECTION-SCOPED MOUSE TRAIL ───────────────────────────────────────────────
function SectionMouseTrail({ containerRef }) {
  const [cards, setCards] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const imgIdx = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Keep cards away from edges so they never clip
      const safeX = Math.min(Math.max(x, CARD_W / 2 + 10), rect.width - CARD_W / 2 - 10);
      const safeY = Math.min(Math.max(y, CARD_H / 2 + 10), rect.height - CARD_H / 2 - 10);

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < DISTANCE_THRESHOLD) return;

      lastPos.current = { x, y };
      const tilt = (Math.random() - 0.5) * 18;

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

    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [containerRef]);

  return (
    <AnimatePresence>
      {cards.map((card) => (
        <motion.div
          key={card.id}
          initial={{ scale: 0, opacity: 0, rotate: card.tilt }}
          animate={{ scale: 1, opacity: 1, rotate: card.tilt }}
          exit={{ scale: 0.72, opacity: 0, y: 20, transition: { duration: 0.35, ease: "easeIn" } }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          style={{
            position: "absolute",
            left: card.x,
            top: card.y,
            translateX: "-50%",
            translateY: "-50%",
            width: CARD_W,
            height: CARD_H,
            borderRadius: 13,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 20,
            boxShadow:
              "0 28px 70px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)",
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
                "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.55) 100%)",
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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const move = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", move);
    return () => el.removeEventListener("mousemove", move);
  }, [containerRef]);

  return (
    <motion.div
      animate={{ x: pos.x - 20, y: pos.y - 20 }}
      transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.4 }}
      style={{
        position: "absolute",
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
const NEUTRAL_950 = "#0a0a0a"; // matches Tailwind neutral-950 / rest of the site

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
        // overflow MUST stay hidden to scope the trail, but safe positions prevent clipping
        overflow: "hidden",
        // Match the rest of the site exactly
        background: NEUTRAL_950,
        minHeight: "88vh",
        cursor: hovered ? "none" : "default",
      }}
      className="flex flex-col items-center justify-center py-28 px-6"
    >
      {/* ── Gradient fade from neutral-950 at TOP (seamless join with StatsSection) */}
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

      {/* ── Gradient fade to neutral-950 at BOTTOM (seamless join with About Me) */}
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

      {/* Trail cards — z-index 20, below fades (z10 fades only cover edges) */}
      <SectionMouseTrail containerRef={sectionRef} />

      {/* Content — z-index 30, always on top of cards */}
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
          Move your cursor to explore the photography.
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
