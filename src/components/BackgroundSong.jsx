import React, { useEffect, useRef, useState } from "react";

export default function BackgroundSong({
  src = "https://pub-d726b2263a78468490bf2e0e10ecbe64.r2.dev/audio/song.m4a",
}) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.35;

    const hasActiveModalVideo = () => {
      const videos = document.querySelectorAll("video");
      for (const v of videos) {
        // Pause background song whenever a user-opened video (has controls or unmuted) is playing
        if (!v.paused && !v.ended && (v.controls || !v.muted)) {
          return true;
        }
      }
      return false;
    };

    const update = () => {
      if (!muted && !hasActiveModalVideo() && !document.hidden) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    };

    const onVideoPlay = (e) => {
      if (e.target.tagName === "VIDEO" && (e.target.controls || !e.target.muted)) {
        audio.pause();
      }
    };

    const onVideoStop = (e) => {
      if (e.target.tagName === "VIDEO") {
        // Defer one frame so closed/unmounted modal videos are reflected
        requestAnimationFrame(update);
      }
    };

    // Also detect when a modal video unmounts directly (e.g. closing Showreel/LongForm modal)
    const mo = new MutationObserver(() => {
      requestAnimationFrame(update);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Unlock audio on first click/tap (required by Safari/Chrome)
    const onFirstClick = () => update();

    document.addEventListener("play", onVideoPlay, true);
    document.addEventListener("pause", onVideoStop, true);
    document.addEventListener("ended", onVideoStop, true);
    document.addEventListener("volumechange", update, true);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("pointerdown", onFirstClick, { once: true });

    update();

    return () => {
      mo.disconnect();
      document.removeEventListener("play", onVideoPlay, true);
      document.removeEventListener("pause", onVideoStop, true);
      document.removeEventListener("ended", onVideoStop, true);
      document.removeEventListener("volumechange", update, true);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("pointerdown", onFirstClick);
      audio.pause();
    };
  }, [muted]);

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="metadata" />
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="fixed top-6 right-20 md:top-5 md:right-auto md:left-1/2 md:-translate-x-1/2 z-[60] cursor-pointer rounded-full border border-white/15 bg-black/80 backdrop-blur-md px-3 py-1.5 md:px-3.5 md:py-2 font-mono text-[10px] tracking-widest text-[#f59e0b] uppercase hover:border-[#f59e0b]/60 transition-colors"
      >
        <span className="md:hidden">{muted ? "🔇" : "🔊"}</span>
        <span className="hidden md:inline">{muted ? "🔇 Sound Off" : "🔊 Sound On"}</span>
      </button>
    </>
  );
}
