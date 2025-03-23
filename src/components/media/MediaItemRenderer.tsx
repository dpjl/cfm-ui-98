
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';

interface MediaItemRendererProps {
  src: string;
  alt: string;
  isVideo: boolean;
  onLoad: () => void;
  loaded: boolean;
  showDate?: boolean;
}

const MediaItemRenderer: React.FC<MediaItemRendererProps> = ({
  src,
  alt,
  isVideo,
  onLoad,
  loaded,
  showDate = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const handleMouseOver = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  };
  
  const handleMouseOut = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  return (
    <div 
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={cn(
        "w-full h-full",
        !loaded && "animate-pulse bg-muted"
      )}
    >
      {isVideo ? (
        <>
          <video 
            ref={videoRef}
            src={src}
            title={alt}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoadedData={onLoad}
            muted
            loop
            playsInline
          />
          {/* Video icon overlay */}
          <div className="absolute top-2 left-2 z-10 bg-black/70 p-1 rounded-md text-white">
            <Video className="h-4 w-4" />
          </div>
        </>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={onLoad}
        />
      )}
    </div>
  );
};

export default MediaItemRenderer;
