import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const LongFormSection = () => {
  const [modalVideo, setModalVideo] = useState(null);
  const modalVideoRef = useRef(null);

  const videos = [
    {
      id: 1,
      src: "/reels/muscleblaze.mp4",
      title: "MuscleBlaze Campaign",
      description: "Brand commercial for MuscleBlaze"
    },
    {
      id: 2,
      src: "/reels/oneplus-final.mp4",
      title: "OnePlus Campaign",
      description: "A cinematic journey showcasing the flagship features"
    },
    {
      id: 3,
      src: "/reels/montage-trailer.mp4",
      title: "Montage Trailer",
      description: "An epic compilation of creative moments"
    }
  ];

  const openModal = (video) => {
    setModalVideo(video);
  };

  const closeModal = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.pause();
    }
    setModalVideo(null);
  };

  // Close modal on escape key and handle body overflow
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    if (modalVideo) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalVideo]);

  // Video card component
  const VideoCard = ({ video }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    const togglePlay = (e) => {
      e.stopPropagation();
      const vid = videoRef.current;
      if (vid.paused) {
        vid.play();
        setIsPlaying(true);
      } else {
        vid.pause();
        setIsPlaying(false);
      }
    };

    const toggleMute = (e) => {
      e.stopPropagation();
      const vid = videoRef.current;
      vid.muted = !vid.muted;
      setIsMuted(!vid.muted);
    };

    const handleVideoClick = () => {
      openModal(video);
    };

    return (
      <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-black">
        <video
          ref={videoRef}
          src={video.src}
          className="w-full aspect-video object-cover cursor-pointer"
          loop
          playsInline
          muted
          autoPlay
          onClick={handleVideoClick}
          onLoadedData={(e) => {
            e.target.play();
            setIsPlaying(true);
          }}
        />
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              openModal(video);
            }}
          >
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center transform transition-transform group-hover:scale-110 shadow-2xl">
              <Play className="w-8 h-8 text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <h3 className="text-white text-lg font-bold mb-1">{video.title}</h3>
          <p className="text-gray-300 text-sm mb-3">{video.description}</p>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>
            
            <button 
              onClick={toggleMute}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                openModal(video);
              }}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              title="Open in fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Long Form <span className="text-amber-500">Content</span>
          </h2>
          <p className="text-neutral-400 text-lg">Extended storytelling and cinematic experiences</p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>

      {/* Glassmorphism Video Modal */}
      <AnimatePresence>
        {modalVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Backdrop with glassmorphism */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-lg"></div>
            
            {/* Animated glass orbs for ambient effect */}
            <motion.div 
              className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-500/20 rounded-full blur-xl"
              animate={{
                x: [0, 100, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-r from-amber-400/15 to-orange-500/15 rounded-full blur-xl"
              animate={{
                x: [0, -80, 0],
                y: [0, -40, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-4xl mx-auto"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glassmorphism container */}
              <div className="relative backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Video container */}
                <div className="aspect-video w-full">
                  <video
                    ref={modalVideoRef}
                    className="w-full h-full object-cover rounded-3xl"
                    controls
                    autoPlay
                    loop
                    playsInline
                    muted={false}
                    onLoadedData={() => {
                      if (modalVideoRef.current) {
                        modalVideoRef.current.currentTime = 0;
                        modalVideoRef.current.muted = false;
                        modalVideoRef.current.volume = 0.8;
                      }
                    }}
                  >
                    <source src={modalVideo.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Decorative gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-amber-500/20 via-transparent to-blue-500/20 pointer-events-none"></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default LongFormSection;
