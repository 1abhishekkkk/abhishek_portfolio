# Portfolio Upgrades & Motion System Guide

Complete breakdown of every section, animation, audio feature, and performance optimization added to **Abhi's Creative Studio** (`my-portfolio`).

---

## 1. Global Smooth Scroll & Motion Capabilities
- **Files**: `src/lib/motionSetup.js`, `src/components/TseilyMotionLayer.jsx`, `src/index.css`
- **What was added**:
  - **Lenis + GSAP ScrollTrigger**: Global smooth wheel scrolling synced to `ScrollTrigger.update` and `gsap.ticker`.
  - **Capability Detection (`useMotionCapability`)**: Automatically disables heavy 3D/hover transforms on touch devices (`pointer: coarse`), screens `< 768px`, and when `prefers-reduced-motion` is enabled.
  - **Trailing Amber Cursor Dot (`#cursor-dot`)**: Smooth spring-lerped desktop cursor dot that scales up over links and buttons.
  - **3D Floor-Flip Scroll Unfolds (`[data-tseily-flip]`)**: Scroll-scrubbed 3D perspective unfold (`rotateX: 36° → 0°`) with a `MutationObserver` that binds lazy-loaded sections as they mount.
  - **Word-by-Word Scroll Scrub (`[data-word-reveal]`)**: Smoothly illuminates the About bio paragraph word-by-word on scroll.

---

## 2. Short Form Showreel (`#showreel`)
- **File**: `src/components/ShowreelSection.jsx`
- **What was added**:
  - **Kinetic Header**:
    - `LATEST WORK` pill with REC pulse dot and timecode scramble decode.
    - `SHOWREEL` split-flap film-gate character roll on scroll + liquid 3D proximity wave on cursor hover.
    - Masked word-by-word subtitle reveal.
  - **13 Brand Filter Pills**: Opposing vertical slot-roll animations (`slot-up` / `slot-down`), magnetic cursor pull, elastic click bounce, and auto-linked glow when hovering matching reel cards.
  - **23 Color-Framed 9:16 Cards**:
    - Brand-colored outer frames (`--brand`), lazy-loaded video playback on hover, and a portaled 9:16 fullscreen modal.
    - Scoped hover choreography on the active card: 3D tilt, diagonal specular glass sheen, viewfinder corner brackets, bottom Cinema HUD with animated timeline scrub, ambient color wall bleed, and a morphing `▶ PLAY` lens cursor.

---

## 3. Long Form Content (`#longform`)
- **File**: `src/components/LongFormSection.jsx`
- **What was added**:
  - **Interactive Works List**: Bold uppercase film rows (`Nykaa Land Aftermovie`, `MuscleBlaze Campaign`, `OnePlus Campaign`, `Montage Trailer`) that shift right and highlight in amber on hover.
  - **Floating Velocity-Tilted Preview Card**: Desktop-only floating card that tracks the cursor, tilts dynamically (`±14°`) with mouse velocity, and plays a crisp 16:9 muted video thumbnail.
  - **Portaled Fullscreen Video Modal**: Rendered on `document.body` to prevent Safari `perspective` video blanking.

---

## 4. Case Studies (`#case-studies`)
- **File**: `src/components/CaseStudiesSection.jsx`
- **What was added**:
  - **Apple-Style Cursor Pop & Depth**: Hovered cards pop forward (`scale: 1.035`, `y: -10`) with a cursor-tracking radial glass sheen while sibling cards gently recede.
  - **Shared-Element Morph (`layoutId`)**: Clicking any case study smoothly morphs it into a frosted-glass detail modal (`Esc` or click outside to close).

---

## 5. Color Grading Suite (`#color-grading`)
- **File**: `src/components/ColorGradingSection.jsx`
- **What was added**:
  - **Live DaVinci LUT Switcher**: Switch between `STUDIO GRADE`, `KODAK 2383`, `TEAL & ORANGE`, and `WARM NOIR` to preview color grades in real time across the Before/After sliders.
  - **Animated Color Wheels (`LIFT`, `GAMMA`, `GAIN`)**: Conic-gradient color wheels rotate and shift indicator dots with spring physics.
  - **Centered 2-Column Grid + Portaled Fullscreen Slider**: Drag-to-compare `Raw / Log` vs. active LUT with fullscreen expansion.

---

## 6. How I Work (`#process`)
- **File**: `src/components/WorkProcessSection.jsx`
- **What was added**:
  - **Long Scrubbed Text Choreography**: `"HOW I WORK"` and all 5 step titles (`Brief`, `Creative Direction`, `Edit`, `Color Grade`, `Delivery`) flip up per-character while descriptions illuminate word-by-word on scroll.
  - **Floating Velocity-Tilted Color Card**: Portaled desktop hover card that morphs size and color (`#f59e0b`, `#818cf8`, `#34d399`, `#f472b6`, `#38bdf8`) per hovered step, with sibling dimming and icon tile pop.

---

## 7. Instagram Card (`#instagram`) & Packages (`#packages`)
- **Files**: `src/components/InstagramFeedLive.jsx`, `src/components/PackagesMotionShell.jsx`
- **What was added**:
  - **Instagram 3D Tilt Title Card**: Compact `@abhi_clicks._` card with 3D perspective tilt, lifted Z-depth text, and cursor-following amber spotlight.
  - **Packages Motion Shell**: GSAP ScrollTrigger reveal + desktop GPU 3D card tilt on package cards.

---

## 8. Q&A (`#qa`), Start a Project CTA (`#contact`) & Footer
- **Files**: `src/components/FaqSection.jsx`, `src/components/ContactSection.jsx`, `src/components/FooterSection.jsx`, `src/utils/sfx.js`
- **What was added**:
  - **Q&A Accordion (`#qa`)**: Smooth `grid-template-rows` expand/collapse with rotating `+` icon.
  - **3D Interactive Contact CTA (`#contact`)**:
    - Mouse-tracking `±10°` 3D perspective card with a dynamic `#FFA500` backing slab at `translateZ(-24px)` and layered Z-depth text/buttons.
    - 4 floating CSS 3D filmmaking props (`REC 24FPS` clapper, Play cube, Lens ring, `4K // COLOR` pill) with mouse parallax.
    - Arcade-style `YES` button with 14-spark burst, playful dodging `NO` button, clapperboard snap transition, Web Audio `sfx`, and full Project Brief form wired to `/api/submit`.
  - **Kinetic Footer**: Infinite studio marquee, cursor-following amber glow, live IST studio timecode, social pills, Back-to-Top button, and triple-click Admin trigger.

---

## 9. Background Music on Cloudflare R2
- **File**: `src/components/BackgroundSong.jsx`
- **Cloudflare R2 URL**: `https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/audio/song.m4a`
- **Behavior**:
  - Top-center `🔊 Sound On` / `🔇 Sound Off` toggle.
  - Plays across all scroll sections once unlocked by user interaction.
  - Automatically pauses whenever any Showreel or Long Form video is opened/played, and resumes when closed or paused.

---

## 10. Performance Safeguards
- All `requestAnimationFrame` hover loops (`ShowreelSection`, `LongFormSection`, `WorkProcessSection`) pause automatically when idle, offscreen, or when the browser tab is hidden.
- Only `transform` and `opacity` are animated on DOM elements; heavy 3D/hover effects are disabled on touch/mobile (`< 768px`) and `prefers-reduced-motion`.
- Video and audio assets stream from Cloudflare R2 (`preload="metadata"`).
