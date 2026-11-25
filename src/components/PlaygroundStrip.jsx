import React, { useRef, useEffect, useCallback } from 'react';

/*
 * PlaygroundStrip — macOS-Dock magnification with full video controls overlay.
 *
 * Props
 *   items      – [{ src, color, title, description }]
 *   onExpand   – (item) => void  — called when user clicks the expand ↗ button
 */

const BASE_W    = 120;
const BASE_H    = 80;
const GAP       = 10;
const MAX_SCALE = 3.0;
const SPREAD    = 130;
const EASE      = 0.10;

/* ── SVG icon strings (no React, used in raw DOM) ───────────────────────── */
const ICON = {
  play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><polygon points="5,3 19,12 5,21"/></svg>`,
  pause: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
  muted: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>`,
  volume: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54,8.46a5,5,0,0,1,0,7.07"/><path d="M19.07,4.93a10,10,0,0,1,0,14.14"/></svg>`,
  expand: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polyline points="15,3 21,3 21,9"/><polyline points="9,21 3,21 3,15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
};

function makeBtn(icon) {
  const b = document.createElement('button');
  b.innerHTML = icon;
  b.style.cssText = `
    width:36px; height:36px; border-radius:50%; border:none;
    background:rgba(255,255,255,0.18); backdrop-filter:blur(6px);
    color:#fff; cursor:pointer; display:flex; align-items:center;
    justify-content:center; flex-shrink:0; transition:background .15s;
    padding:0;
  `;
  b.addEventListener('mouseenter', () => { b.style.background = 'rgba(255,255,255,0.32)'; });
  b.addEventListener('mouseleave', () => { b.style.background = 'rgba(255,255,255,0.18)'; });
  return b;
}

export default function PlaygroundStrip({ items, onExpand }) {
  const stripRef  = useRef(null);
  const dotRef    = useRef(null);
  const stateRef  = useRef({ target: 0.5, cur: 0.5, rafId: null });
  const elsRef    = useRef([]);        // { el, video, overlay, btnPlay, btnMute, btnExpand, titleEl }
  const prevActive = useRef(-1);

  /* ── Build DOM ─────────────────────────────────────────────────────────── */
  const buildEls = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    while (strip.firstChild) strip.removeChild(strip.firstChild);
    elsRef.current = [];

    items.forEach((it, i) => {
      /* wrapper */
      const d = document.createElement('div');
      d.style.cssText = `
        position:absolute; left:0; top:50%;
        border:2px solid ${it.color}; border-radius:8px; overflow:hidden;
        background:#111; will-change:transform,width,height;
        cursor:pointer;
      `;

      /* video or gradient */
      let video = null;
      if (it.src) {
        video = document.createElement('video');
        video.src        = it.src;
        video.muted      = true;
        video.loop       = true;
        video.playsInline = true;
        video.preload    = 'metadata';
        video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
        d.appendChild(video);
      } else {
        d.style.background = `linear-gradient(135deg,hsl(${i*37} 40% 25%),hsl(${i*37+40} 50% 50%))`;
      }

      /* ── Overlay (title + buttons) — hidden until item is focused ── */
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:absolute; inset:0;
        background:linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%);
        display:flex; flex-direction:column; justify-content:flex-end;
        padding:10px; opacity:0; transition:opacity .25s; pointer-events:none;
        box-sizing:border-box;
      `;

      /* title */
      const titleEl = document.createElement('div');
      titleEl.textContent = it.title || '';
      titleEl.style.cssText = `
        color:#fff; font-weight:700; font-size:13px; line-height:1.2;
        margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      `;

      /* description */
      const descEl = document.createElement('div');
      descEl.textContent = it.description || '';
      descEl.style.cssText = `
        color:rgba(255,255,255,0.65); font-size:10px; line-height:1.3;
        margin-bottom:8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      `;

      /* buttons row */
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; gap:6px; align-items:center;';

      const btnPlay  = makeBtn(video ? ICON.pause : ICON.play);
      const btnMute  = makeBtn(ICON.muted);
      const btnExp   = makeBtn(ICON.expand);

      /* play/pause toggle */
      if (video) {
        btnPlay.addEventListener('click', (e) => {
          e.stopPropagation();
          if (video.paused) {
            video.play().catch(() => {});
            btnPlay.innerHTML = ICON.pause;
          } else {
            video.pause();
            btnPlay.innerHTML = ICON.play;
          }
        });

        /* mute toggle */
        btnMute.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          btnMute.innerHTML = video.muted ? ICON.muted : ICON.volume;
        });
      }

      /* expand → open modal */
      btnExp.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onExpand && it.src) onExpand(it);
      });

      /* clicking the card itself also opens modal */
      d.addEventListener('click', () => {
        if (onExpand && it.src) onExpand(it);
      });

      row.appendChild(btnPlay);
      row.appendChild(btnMute);
      row.appendChild(btnExp);

      overlay.appendChild(titleEl);
      overlay.appendChild(descEl);
      overlay.appendChild(row);
      d.appendChild(overlay);
      strip.appendChild(d);

      elsRef.current.push({ el: d, video, overlay, btnPlay, btnMute, btnExp, titleEl });
    });
  }, [items, onExpand]);

  /* ── RAF loop ──────────────────────────────────────────────────────────── */
  const startLoop = useCallback(() => {
    const strip = stripRef.current;
    const records = elsRef.current;
    const state = stateRef.current;
    const n = records.length;
    if (!strip || n === 0) return;

    const step      = BASE_W + GAP;
    const baseTotal = n * step - GAP;

    function frame() {
      const W = strip.clientWidth;
      state.cur += (state.target - state.cur) * EASE;
      const fx = state.cur * baseTotal;

      /* scales */
      const scales = records.map((_, i) => {
        const c = i * step + BASE_W / 2;
        const d = (c - fx) / SPREAD;
        return 1 + (MAX_SCALE - 1) * Math.exp(-d * d);
      });

      /* left positions */
      const lefts = [];
      let x = 0;
      scales.forEach(s => { lefts.push(x); x += BASE_W * s + GAP; });
      const totalW = x - GAP;

      /* shift */
      const iClamp = Math.max(0, Math.min(n - 2, Math.floor((fx - BASE_W / 2) / step)));
      const c0 = lefts[iClamp]     + BASE_W * scales[iClamp]     / 2;
      const c1 = lefts[iClamp + 1] + BASE_W * scales[iClamp + 1] / 2;
      const t  = (fx - (iClamp * step + BASE_W / 2)) / step;
      const sx = c0 + t * (c1 - c0);
      let shift = state.cur * W - sx;
      shift = Math.min(0, Math.max(W - totalW, shift));

      /* find active (highest scale) */
      let activeIdx = 0;
      scales.forEach((s, i) => { if (s > scales[activeIdx]) activeIdx = i; });

      records.forEach(({ el, video, overlay, btnPlay }, k) => {
        const w = BASE_W * scales[k];
        const h = BASE_H * scales[k];
        el.style.width     = w + 'px';
        el.style.height    = h + 'px';
        el.style.transform = `translateX(${lefts[k] + shift}px) translateY(-50%)`;

        const isFocused = k === activeIdx && scales[k] > MAX_SCALE * 0.75;

        /* overlay visibility + pointer events */
        overlay.style.opacity        = isFocused ? '1' : '0';
        overlay.style.pointerEvents  = isFocused ? 'auto' : 'none';

        /* font size scaling with item */
        const fScale = Math.max(0.7, Math.min(1, (scales[k] - 1) / (MAX_SCALE - 1)));
        overlay.style.padding        = `${8 * fScale + 4}px`;

        /* video play logic */
        if (video) {
          if (isFocused) {
            video.paused && video.play().catch(() => {});
            if (btnPlay) btnPlay.innerHTML = ICON.pause;
          } else {
            !video.paused && video.pause();
            if (btnPlay) btnPlay.innerHTML = ICON.play;
          }
        }
      });

      prevActive.current = activeIdx;
      state.rafId = requestAnimationFrame(frame);
    }

    state.rafId = requestAnimationFrame(frame);
  }, []);

  const stopLoop = useCallback(() => {
    if (stateRef.current.rafId) {
      cancelAnimationFrame(stateRef.current.rafId);
      stateRef.current.rafId = null;
    }
  }, []);

  /* ── Pointer events ────────────────────────────────────────────────────── */
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onMove = (e) => {
      const r = strip.getBoundingClientRect();
      stateRef.current.target = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
        dotRef.current.style.opacity = '1';
      }
    };
    const onLeave = () => {
      stateRef.current.target = 0.5;
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    strip.addEventListener('pointermove', onMove);
    strip.addEventListener('pointerleave', onLeave);
    return () => {
      strip.removeEventListener('pointermove', onMove);
      strip.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  /* ── Mount / items change ──────────────────────────────────────────────── */
  useEffect(() => {
    stopLoop();
    buildEls();
    startLoop();
    return stopLoop;
  }, [buildEls, startLoop, stopLoop]);

  return (
    <div style={{ position: 'relative' }}>
      {/*
        Outer clip wrapper — clips x so the page never scrolls horizontally,
        but we give generous top/bottom padding so magnified items aren't
        vertically clipped either.
      */}
      <div style={{
        overflow: 'visible',
        paddingTop: 12,
        paddingBottom: 16,
      }}>
        <div
          ref={stripRef}
          style={{
            position: 'relative',
            height: `${BASE_H * MAX_SCALE + 20}px`,
            overflow: 'visible',
            cursor: 'none',
          }}
        />
      </div>
      {/* Amber cursor dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 8, height: 8, marginTop: -4, marginLeft: -4,
          borderRadius: '50%', background: '#f59e0b',
          pointerEvents: 'none', zIndex: 9999,
          opacity: 0, transition: 'opacity .2s',
        }}
      />
    </div>
  );
}
