import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Real portfolio stills — Cloudinary auto-format thumbnails from Abhishek's work
const images = [
  // Realme campaigns
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777628884/reels/realme-11pro.mp4",
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777628901/reels/realme-15pro-launch.mp4",
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_1,w_400,h_560,c_fill,f_jpg,q_80/v1777628896/reels/realme-15pro-launch-new.mp4",
  // Fuse
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777628685/reels/fuse-brand-edit.mp4",
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_2,w_400,h_560,c_fill,f_jpg,q_80/v1777628710/reels/fuse-bts-final.mp4",
  // Duroflex + OnePlus
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777739610/reels/shreyanka-x-duroflex.mp4",
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777628879/reels/oneplus-final.mp4",
  // Fashion + Honor
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777628375/reels/fashion-gurav.mp4",
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1777628714/reels/honor-brand.mp4",
  // Fuse Bangalore + Ishan Kishan
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_1,w_400,h_560,c_fill,f_jpg,q_80/v1777628645/reels/fuse-bangalore.mp4",
  "https://res.cloudinary.com/de6kkxnqn/video/upload/so_0,w_400,h_560,c_fill,f_jpg,q_80/v1780988936/reels/ishan-kishan.mp4",
];

// How far (px) cursor must travel before a new image appears
const DISTANCE_THRESHOLD = 80;
// How long (ms) before the image fades out
const DISMISS_DELAY = 900;

export default function MouseTrail() {
  const [activeImages, setActiveImages] = useState([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      const dx = x - lastPosition.current.x;
      const dy = y - lastPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > DISTANCE_THRESHOLD) {
        lastPosition.current = { x, y };

        // Slight random tilt per card for organic feel
        const tilt = (Math.random() - 0.5) * 22;

        const newImage = {
          id: Date.now() + Math.random(),
          src: images[imageIndex.current],
          x,
          y,
          tilt,
        };

        imageIndex.current = (imageIndex.current + 1) % images.length;
        setActiveImages((prev) => [...prev, newImage]);

        setTimeout(() => {
          setActiveImages((prev) => prev.filter((img) => img.id !== newImage.id));
        }, DISMISS_DELAY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden="true"
    >
      <AnimatePresence>
        {activeImages.map((img) => (
          <motion.div
            key={img.id}
            initial={{ scale: 0, opacity: 0, rotate: img.tilt }}
            animate={{ scale: 1, opacity: 1, rotate: img.tilt }}
            exit={{ scale: 0.75, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              opacity: { duration: 0.15 },
            }}
            style={{
              position: "absolute",
              left: img.x,
              top: img.y,
              translateX: "-50%",
              translateY: "-50%",
              width: 200,
              height: 280,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow:
                "0 25px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.08)",
              willChange: "transform, opacity",
            }}
          >
            {/* Image */}
            <img
              src={img.src}
              alt=""
              loading="eager"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                // Fallback gradient if image fails to load
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement.style.background =
                  "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)";
              }}
            />
            {/* Subtle overlay to keep it cinematic */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.45) 100%)",
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
