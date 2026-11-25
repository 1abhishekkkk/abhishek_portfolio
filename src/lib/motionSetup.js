import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 1. Global Lenis smooth scroll synced to GSAP ScrollTrigger.
 *    Call once at the root of your App.
 */
export function useLenisGsap() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
    };
  }, []);
}

/**
 * 2. Detects reduced-motion preference & whether 3D should be enabled
 *    (disabled on touch devices or viewport width < 768px).
 */
export function useMotionCapability() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") {
      return { reducedMotion: false, enable3D: false };
    }
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    const isWide = window.innerWidth >= 768;

    return {
      reducedMotion,
      enable3D: !reducedMotion && !isTouch && isWide,
    };
  });

  useEffect(() => {
    const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touchQuery = window.matchMedia("(pointer: coarse)");

    const update = () => {
      const reducedMotion = rmQuery.matches;
      const isTouch = touchQuery.matches || navigator.maxTouchPoints > 0;
      const isWide = window.innerWidth >= 768;
      setState({
        reducedMotion,
        enable3D: !reducedMotion && !isTouch && isWide,
      });
    };

    rmQuery.addEventListener("change", update);
    touchQuery.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      rmQuery.removeEventListener("change", update);
      touchQuery.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return state;
}

/**
 * 3. Window-level normalized pointer (-1..1) stored in a ref (no re-renders).
 */
export function useWindowPointer(enabled) {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
      return;
    }

    const onPointerMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onPointerLeave = () => {
      pointerRef.current.x = 0;
      pointerRef.current.y = 0;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    document.addEventListener("mouseleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", onPointerLeave);
      document.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [enabled]);

  return pointerRef;
}

/**
 * 4. Pauses WebGL render loop when offscreen (IntersectionObserver) or tab hidden.
 */
export function useCanvasActive(containerRef, enabled) {
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(
    typeof document !== "undefined" ? !document.hidden : true
  );

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px 0px", threshold: 0.01 }
    );
    observer.observe(containerRef.current);

    const onVisibilityChange = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [containerRef, enabled]);

  return enabled && inView && tabVisible;
}
