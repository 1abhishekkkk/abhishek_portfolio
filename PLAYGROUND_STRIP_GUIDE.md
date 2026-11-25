# PlaygroundStrip — macOS Dock-Style Video Strip

A horizontal interactive strip where the video closest to the cursor magnifies like a macOS Dock icon.  
Videos have hover overlays with **title**, **description**, **play/pause**, **mute**, and **expand-to-modal** controls.

---

## Files

| File | Purpose |
|------|---------|
| `src/components/PlaygroundStrip.jsx` | The self-contained React component |
| `src/components/LongFormSection.jsx` | Where to drop it in (or any other section) |

---

## How to Use

### 1. Import the component

```jsx
import PlaygroundStrip from './PlaygroundStrip';
```

### 2. Define your items array

Each item needs `src`, `color`, `title`, and `description`:

```js
const playgroundItems = [
  {
    src: 'https://your-cdn.com/video1.mp4',  // mp4 / webm URL
    color: '#4fb3d9',                         // border colour
    title: 'Nykaa Land Aftermovie',
    description: 'High-energy festival aftermovie for Nykaa Land',
  },
  {
    src: 'https://your-cdn.com/video2.mp4',
    color: '#e0457b',
    title: 'MuscleBlaze Campaign',
    description: 'Brand commercial for MuscleBlaze',
  },
  // add more...
];
```

> Leave `src: ''` to show a gradient placeholder (useful for "Coming Soon" slots).

### 3. Render the strip

```jsx
<PlaygroundStrip
  items={playgroundItems}
  onExpand={(item) => openModal(item)}   // optional — opens fullscreen modal
/>
```

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `items` | `Array` | ✅ | Array of `{ src, color, title, description }` objects |
| `onExpand` | `Function` | ❌ | Called with the item when user clicks Expand ↗ or the card |

---

## Tuning Constants (inside `PlaygroundStrip.jsx`)

| Constant | Default | What it controls |
|----------|---------|-----------------|
| `BASE_W` | `120` | Base width of each item (px) |
| `BASE_H` | `80` | Base height of each item (px) |
| `GAP` | `10` | Gap between items (px) |
| `MAX_SCALE` | `3.0` | Max zoom on the focused item |
| `SPREAD` | `130` | How wide the magnification bell-curve is (px) |
| `EASE` | `0.10` | Lerp smoothness — lower = slower, higher = snappier |

---

## How the Effect Works

```
Mouse X → 0…1 ratio → lerped with EASE each frame

Each item gets a scale:
  scale = 1 + (MAX_SCALE - 1) × exp(-(distance / SPREAD)²)

Scaled widths are summed → strip is shifted so the focal item
stays under the cursor. Edge clamp prevents empty gaps.

Only the largest item's video plays — all others are paused.
```

---

## Adding to a Section

Wrap it in a `div` with `overflowX: 'hidden'` on the parent section so edge items don't cause horizontal page scroll:

```jsx
<section style={{ overflowX: 'hidden' }}>
  <div className="mb-4 flex justify-between text-xs text-white/40">
    <span>HOVER TO EXPLORE</span>
    <span>↔ drag or hover</span>
  </div>
  <PlaygroundStrip items={playgroundItems} onExpand={openModal} />
</section>
```

---

## Video Tips

- Format: **H.264 MP4**, muted, loop, playsInline
- Size: **480–720px wide**, 1–3 MB per video for smooth loading
- Aspect: **16:9** works with defaults (`BASE_W=120, BASE_H=80`)
- For vertical reels: set `BASE_W = 60`, `BASE_H = 90`

---

## Mobile

The strip uses `pointermove` which works on touch-drag too.  
For a cleaner mobile fallback, replace the strip with a simple horizontal scroll-snap container on small screens.
