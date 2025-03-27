
import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../hooks/use-intersection-observer';

interface LazyMediaItemProps {
  id: string;
  alt?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  width?: string;
  height?: string;
  className?: string;
  thumbnailSrc?: string;
}

export const LazyMediaItem = ({
  id,
  alt = '',
  isSelected = false,
  onSelect,
  width = '100%',
  height = 'auto',
  className = '',
  thumbnailSrc,
}: LazyMediaItemProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const placeholderRef = useRef<HTMLDivElement>(null);
  
  const onIntersect = (isIntersecting: boolean) => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true);
    }
  };

  // Set up intersection observer
  const entry = useIntersectionObserver(placeholderRef);
  
  // React to intersection changes
  useEffect(() => {
    if (entry?.isIntersecting) {
      onIntersect(true);
    }
  }, [entry]);

  // Load thumbnail when visible
  useEffect(() => {
    if (isVisible && thumbnailSrc) {
      const img = new Image();
      img.src = thumbnailSrc;
      img.onload = () => setHasLoaded(true);
    }
  }, [isVisible, thumbnailSrc]);

  const handleSelect = () => {
    onSelect?.(id);
  };

  // Create the base URL for thumbnail
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
  const thumbUrl = thumbnailSrc || `${apiBaseUrl}/thumbnail?id=${id}`;

  return (
    <div
      ref={placeholderRef}
      className={`relative media-item ${className} ${isSelected ? 'selected' : ''}`}
      style={{ width, height, aspectRatio: '1' }}
      onClick={handleSelect}
    >
      {isVisible ? (
        <img
          src={thumbUrl}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            hasLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500 bg-opacity-30 border-2 border-blue-500"></div>
      )}
    </div>
  );
};

export default LazyMediaItem;
