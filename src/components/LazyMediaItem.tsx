
import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/use-intersection-observer';
import { useMediaCache } from '../hooks/use-media-cache';

interface LazyMediaItemProps {
  mediaId: string;
  alt?: string;
  className?: string;
}

const LazyMediaItem = React.memo(({ mediaId, alt = '', className = '' }: LazyMediaItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const { getThumbnailUrl } = useMediaCache();
  const imgRef = useRef<HTMLImageElement>(null);
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [url, setUrl] = useState<string | null>(null);

  // Use intersection observer to detect when the image is in viewport
  const onIntersect = (isIntersecting: boolean) => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  };

  // Set up intersection observer
  useIntersectionObserver(placeholderRef, onIntersect, {
    rootMargin: '200px',
    threshold: 0.1,
  });

  // Load thumbnail when visible
  useEffect(() => {
    if (!isVisible) return;
    
    // Check if we already have the URL
    const cachedUrl = getThumbnailUrl(mediaId);
    if (cachedUrl) {
      setUrl(cachedUrl);
    } else {
      // This will trigger the cache to load the thumbnail
      getThumbnailUrl(mediaId, true).then(newUrl => {
        if (newUrl) setUrl(newUrl);
      });
    }
  }, [isVisible, mediaId, getThumbnailUrl]);

  // Handle image load completion
  const handleImageLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={placeholderRef} 
      className={`lazy-media-container ${className}`}
      style={{ 
        aspectRatio: '1/1',
        backgroundColor: '#f0f0f0',
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {url && (
        <img
          ref={imgRef}
          src={url}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoaded}
          loading="lazy"
        />
      )}
    </div>
  );
});

export default LazyMediaItem;
