import React from 'react';

const VideoBackground = ({ src = "/reels/anshika-montage.mp4" }) => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
      <div className="absolute inset-0 bg-black/40 z-10" /> 
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full top-0 left-0 object-cover"
        style={{ 
          objectPosition: 'center',
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;
