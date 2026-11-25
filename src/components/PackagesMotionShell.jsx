import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionCapability } from "../lib/motionSetup";

gsap.registerPlugin(ScrollTrigger);

export default function PackagesMotionShell({ children, className = "" }) {
  const sectionRef = useRef(null);
  const { reducedMotion, enable3D } = useMotionCapability();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const headings = sectionRef.current.querySelectorAll("[data-pkg-reveal]");
      const cards = sectionRef.current.querySelectorAll("[data-pkg-card]");

      // Simple GPU-only fade-up (used on both desktop & mobile fallback)
      if (headings.length) {
        gsap.fromTo(
          headings,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: enable3D ? 36 : 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    // Desktop-only subtle GPU transform tilt on package cards (transform only)
    let rafId = null;
    let activeCard = null;
    const cardTilt = { rx: 0, ry: 0, tx: 0, ty: 0 };
    const cardEls = enable3D
      ? Array.from(sectionRef.current.querySelectorAll("[data-pkg-card]"))
      : [];

    const handlers = [];

    if (enable3D && cardEls.length) {
      const tickCard = () => {
        cardTilt.rx += (cardTilt.tx - cardTilt.rx) * 0.08;
        cardTilt.ry += (cardTilt.ty - cardTilt.ry) * 0.08;

        if (activeCard) {
          activeCard.style.transform = `perspective(900px) rotateX(${cardTilt.rx.toFixed(
            2
          )}deg) rotateY(${cardTilt.ry.toFixed(2)}deg) translate3d(0, -4px, 0)`;
        }

        if (
          activeCard ||
          Math.abs(cardTilt.rx) > 0.05 ||
          Math.abs(cardTilt.ry) > 0.05
        ) {
          rafId = requestAnimationFrame(tickCard);
        } else {
          rafId = null;
        }
      };

      cardEls.forEach((card) => {
        const onMove = (e) => {
          const rect = card.getBoundingClientRect();
          const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
          activeCard = card;
          cardTilt.ty = nx * 5;
          cardTilt.tx = -ny * 5;
          if (!rafId) rafId = requestAnimationFrame(tickCard);
        };

        const onLeave = () => {
          card.style.transition = "transform 0.35s cubic-bezier(0.22,1,0.36,1)";
          card.style.transform =
            "perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)";
          setTimeout(() => {
            card.style.transition = "";
          }, 360);
          if (activeCard === card) {
            activeCard = null;
            cardTilt.tx = 0;
            cardTilt.ty = 0;
          }
        };

        card.addEventListener("pointermove", onMove, { passive: true });
        card.addEventListener("pointerleave", onLeave);
        handlers.push({ card, onMove, onLeave });
      });
    }

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      handlers.forEach(({ card, onMove, onLeave }) => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
        card.style.transform = "";
        card.style.transition = "";
      });
    };
  }, [reducedMotion, enable3D]);

  return (
    <div ref={sectionRef} className={`relative bg-[#0a0a0a] ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
