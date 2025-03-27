
import React, { useRef, memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';

interface MediaItemRendererProps {
  src: string;
  alt: string;
  isVideo: boolean;
  onLoad: () => void;
  loaded: boolean;
  isScrolling?: boolean;
}

// Using memo with comparison function to prevent unnecessary re-renders
const MediaItemRenderer: React.FC<MediaItemRendererProps> = memo(({
  src,
  alt,
  isVideo,
  onLoad,
  loaded,
  isScrolling = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseOver = () => {
    if (isVideo && videoRef.current && !isScrolling) {
      setIsHovering(true);
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  };
  
  const handleMouseOut = () => {
    if (isVideo && videoRef.current) {
      setIsHovering(false);
      videoRef.current.pause();
    }
  };
  
  // Common classes and styles - optimized and simplified
  const mediaClasses = cn(
    "w-full h-full object-cover pointer-events-none", 
    loaded ? "opacity-100" : "opacity-0"
  );
  
  const containerClasses = cn(
    "w-full h-full rounded-md overflow-hidden",
    !loaded && "animate-pulse bg-muted"
  );
  
  // During scrolling, show a low-quality preview or placeholder
  if (isScrolling && !loaded) {
    return (
      <div className={containerClasses} aria-hidden="true"></div>
    );
  }
  
  return (
    <div 
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={containerClasses}
      aria-hidden="true" // The parent element handles interaction
      style={{ containIntrinsicSize: '0 0', contain: 'content' }} // Better performance optimization
    >
      {isVideo ? (
        <>
          <video 
            ref={videoRef}
            src={src}
            title={alt}
            className={mediaClasses}
            onLoadedData={onLoad}
            muted
            loop
            playsInline
            style={{ transition: 'opacity 300ms ease' }}
          />
          {/* Video icon overlay - only show when needed */}
          {loaded && (
            <div className="absolute top-2 right-2 z-10 bg-black/70 p-1 rounded-md text-white pointer-events-none">
              <Video className="h-4 w-4" />
            </div>
          )}
        </>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt=""
          className={mediaClasses}
          onLoad={onLoad}
          loading="lazy"
          decoding="async"
          style={{ transition: 'opacity 300ms ease' }}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.src === nextProps.src &&
    prevProps.loaded === nextProps.loaded &&
    prevProps.isScrolling === nextProps.isScrolling
  );
});

// Set component display name for debugging
MediaItemRenderer.displayName = 'MediaItemRenderer';

export default MediaItemRenderer;
