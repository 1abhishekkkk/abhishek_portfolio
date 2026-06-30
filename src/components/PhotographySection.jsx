import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── PLACEHOLDER IMAGES ───────────────────────────────────────────────────────
// Replace these with your own photography URLs when ready.
// Tip: upload to Cloudinary and use: https://res.cloudinary.com/de6kkxnqn/image/upload/f_auto,q_auto,w_600/<your-id>
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

const DISTANCE_THRESHOLD = 70; // px before new image spawns
const DISMISS_DELAY = 1100;    // ms before card fades

// ─── SECTION-SCOPED MOUSE TRAIL ───────────────────────────────────────────────
function SectionMouseTrail({ containerRef }) {
  const [cards, setCards] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const imgIndex = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      // Coordinates relative to the section
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < DISTANCE_THRESHOLD) return;
      lastPos.current = { x, y };

      const tilt = (Math.random() - 0.5) * 20;
      const card = {
        id: Date.now() + Math.random(),
        src: PHOTO_IMAGES[imgIndex.current % PHOTO_IMAGES.length],
        x,
        y,
        tilt,
      };
      imgIndex.current++;
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
          exit={{ scale: 0.7, opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          style={{
            position: "absolute",
            left: card.x,
            top: card.y,
            translateX: "-50%",
            translateY: "-50%",
            width: 200,
            height: 280,
            borderRadius: 14,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 30,
            boxShadow: "0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)",
            willChange: "transform, opacity",
          }}
        >
          <img
            src={card.src}
            alt=""
            loading="eager"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* subtle bottom vignette */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// ─── MAIN PHOTOGRAPHY SECTION ─────────────────────────────────────────────────
export default function PhotographySection() {
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Category tags
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
        background: "#000",
        minHeight: "90vh",
        cursor: hovered ? "none" : "default",
      }}
      className="flex flex-col items-center justify-center py-24 px-6"
    >
      {/* Section-scoped mouse trail — only fires inside this section */}
      <SectionMouseTrail containerRef={sectionRef} />

      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* Faint horizontal rules top + bottom */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />

      {/* Content — z-index 10 so it sits above trail cards contextually but trail is still visible */}
      <div className="relative z-10 text-center max-w-4xl mx-auto pointer-events-none select-none">

        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[10px] font-black tracking-[0.35em] text-amber-500 uppercase mb-6"
        >
          Through the Lens
        </motion.p>

        {/* Big heading */}
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
          <span style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>
            tells a story
          </span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-white/40 text-sm md:text-base font-light leading-relaxed max-w-lg mx-auto mb-10"
        >
          Move your cursor to explore the photography.
        </motion.p>

        {/* Category pills */}
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
              className="px-4 py-1.5 rounded-full border border-white/10 text-white/40 text-[10px] font-bold tracking-widest uppercase"
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Hint cursor ring — follows mouse when hovered */}
      {hovered && <CursorRing containerRef={sectionRef} />}
    </section>
  );
}

// ─── CUSTOM CURSOR RING (replaces default cursor inside section) ──────────────
function CursorRing({ containerRef }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, [containerRef]);

  return (
    <motion.div
      animate={{ x: pos.x - 24, y: pos.y - 24 }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
      style={{
        position: "absolute",
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.5)",
        pointerEvents: "none",
        zIndex: 40,
        mixBlendMode: "difference",
      }}
    />
  );
}
