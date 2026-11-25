import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionCapability } from '../lib/motionSetup';

gsap.registerPlugin(ScrollTrigger);

export default function TseilyMotionLayer() {
  const dotRef = useRef(null);
  const { reducedMotion, enable3D } = useMotionCapability();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const bindDynamicAnimations = () => {
        // 1. Signature Tseily 3D Floor-Flip Scroll Unfold
        document.querySelectorAll('[data-tseily-flip]').forEach((el) => {
          if (el.dataset.tseilyBound === '1') return;
          el.dataset.tseilyBound = '1';

          if (enable3D) {
            gsap.fromTo(
              el,
              {
                rotateX: 36,
                y: 64,
                scale: 0.93,
                opacity: 0.2,
                transformPerspective: 1200,
                transformOrigin: '50% 0%',
              },
              {
                rotateX: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                ease: 'none',
                clearProps: 'transform',
                scrollTrigger: {
                  trigger: el,
                  start: 'top 96%',
                  end: 'top 50%',
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              }
            );
          } else {
            gsap.fromTo(
              el,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power3.out',
                clearProps: 'transform',
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
              }
            );
          }
        });

        // 2. Word-by-Word Scroll Scrub Reveal
        document.querySelectorAll('[data-word-reveal]').forEach((wordEl) => {
          if (wordEl.dataset.wordBound === '1') return;
          wordEl.dataset.wordBound = '1';

          const rawText = wordEl.dataset.rawText || wordEl.textContent.trim();
          wordEl.dataset.rawText = rawText;
          const words = rawText.split(/\s+/);
          wordEl.innerHTML = words
            .map(
              (w) =>
                `<span class="word-span inline-block opacity-20 will-change-transform">${w}&nbsp;</span>`
            )
            .join('');

          const spans = wordEl.querySelectorAll('.word-span');
          gsap.to(spans, {
            opacity: 1,
            stagger: 0.04,
            ease: 'none',
            scrollTrigger: {
              trigger: wordEl,
              start: 'top 88%',
              end: 'bottom 58%',
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });
        });

      };

      bindDynamicAnimations();
      ScrollTrigger.refresh();

      // Re-bind and refresh ScrollTrigger whenever React.lazy sections finish mounting
      let refreshTimer = null;
      const observer = new MutationObserver(() => {
        if (refreshTimer) clearTimeout(refreshTimer);
        refreshTimer = setTimeout(() => {
          ctx.add(() => {
            bindDynamicAnimations();
          });
          ScrollTrigger.refresh();
        }, 180);
      });
      observer.observe(document.body, { childList: true, subtree: true });

      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      return () => {
        observer.disconnect();
        if (refreshTimer) clearTimeout(refreshTimer);
      };
    });

    // 4. Smooth Trailing Amber Dot Cursor (Desktop only)
    let rafId = null;
    const dot = dotRef.current;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const smooth = { x: mouse.x, y: mouse.y };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (dot) dot.style.opacity = '1';
    };

    const onOver = (e) => {
      if (!dot) return;
      if (e.target.closest('a, button, [role="button"]')) {
        dot.classList.add('is-big');
      } else {
        dot.classList.remove('is-big');
      }
    };

    const onLeave = () => {
      if (dot) dot.style.opacity = '0';
    };

    if (enable3D && dot) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('mouseleave', onLeave);

      const tick = () => {
        smooth.x += (mouse.x - smooth.x) * 0.16;
        smooth.y += (mouse.y - smooth.y) * 0.16;
        dot.style.transform = `translate3d(${smooth.x.toFixed(1)}px, ${smooth.y.toFixed(1)}px, 0)`;
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      ctx.revert();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.querySelectorAll('[data-tseily-bound]').forEach((el) => {
        delete el.dataset.tseilyBound;
      });
      document.querySelectorAll('[data-word-bound]').forEach((el) => {
        delete el.dataset.wordBound;
      });
      document.querySelectorAll('[data-rail-bound]').forEach((el) => {
        delete el.dataset.railBound;
      });
    };
  }, [reducedMotion, enable3D]);

  return enable3D ? <div ref={dotRef} id="cursor-dot" aria-hidden="true" /> : null;
}
