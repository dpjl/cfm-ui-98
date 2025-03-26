
import React, { useRef, memo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';
import { getThumbnailUrl } from '@/api/imageApi';

interface MediaItemRendererProps {
  src?: string;
  alt?: string;
  isVideo?: boolean;
  onLoad?: () => void;
  loaded?: boolean;
  id?: string;
  position?: 'source' | 'destination';
}

// Using memo to prevent unnecessary re-renders
const MediaItemRenderer: React.FC<MediaItemRendererProps> = memo(({
  src,
  alt = "",
  isVideo = false,
  onLoad = () => {},
  loaded = false,
  id,
  position = 'source'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaLoaded, setMediaLoaded] = useState(loaded);
  const [mediaSrc, setMediaSrc] = useState(src);
  
  useEffect(() => {
    if (!src && id) {
      // If no src is provided but we have an ID, generate the URL
      setMediaSrc(getThumbnailUrl(id, position));
    }
  }, [id, position, src]);
  
  const handleLoadEvent = () => {
    setMediaLoaded(true);
    onLoad();
  };
  
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
  
  // Common classes and styles
  const mediaClasses = cn(
    "w-full h-full object-cover pointer-events-none", // Disable pointer events on the media itself
    mediaLoaded ? "opacity-100" : "opacity-0"
  );
  
  const containerClasses = cn(
    "w-full h-full rounded-md overflow-hidden",
    !mediaLoaded && "animate-pulse bg-muted"
  );
  
  return (
    <div 
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      className={containerClasses}
      aria-hidden="true" // The parent element handles interaction
    >
      {isVideo ? (
        <>
          <video 
            ref={videoRef}
            src={mediaSrc}
            title={alt}
            className={mediaClasses}
            onLoadedData={handleLoadEvent}
            muted
            loop
            playsInline
            style={{ transition: 'opacity 300ms ease' }}
          />
          {/* Video icon overlay */}
          <div className="absolute top-2 right-2 z-10 bg-black/70 p-1 rounded-md text-white pointer-events-none">
            <Video className="h-4 w-4" />
          </div>
        </>
      ) : (
        <img
          src={mediaSrc}
          alt={alt}
          className={mediaClasses}
          onLoad={handleLoadEvent}
          style={{ transition: 'opacity 300ms ease' }}
        />
      )}
    </div>
  );
});

// Set component display name for debugging
MediaItemRenderer.displayName = 'MediaItemRenderer';

export default MediaItemRenderer;
