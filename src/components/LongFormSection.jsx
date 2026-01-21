import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const LongFormSection = () => {
  const videos = [
    {
      id: 1,
      src: "/reels/oneplus-final.mp4",
      title: "OnePlus Campaign",
      description: "A cinematic journey showcasing the flagship features"
    },
    {
      id: 2,
      src: "/reels/montage-trailer.mp4",
      title: "Montage Trailer",
      description: "An epic compilation of creative moments"
    }
  ];

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
      const vid = videoRef.current;
      if (vid.paused) {
        vid.play();
        setIsPlaying(true);
      } else {
        vid.pause();
        setIsPlaying(false);
      }
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
            onClick={togglePlay}
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Long Form <span className="text-purple-500">Content</span>
          </h2>
          <p className="text-gray-400 text-lg">Extended storytelling and cinematic experiences</p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LongFormSection;
