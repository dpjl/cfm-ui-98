
import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ImageCard from '@/components/ImageCard';
import { DetailedMediaInfo } from '@/api/imageApi';

interface LazyMediaItemProps {
  id: string;
  selected: boolean;
  onSelect: (id: string, extendSelection: boolean) => void;
  onTouchStart?: (id: string) => void;
  onTouchEnd?: () => void;
  index?: number;
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo | null) => void;
  position?: 'source' | 'destination';
}

const LazyMediaItem: React.FC<LazyMediaItemProps> = ({
  id,
  selected,
  onSelect,
  onTouchStart,
  onTouchEnd,
  index = 0,
  showDates = false,
  updateMediaInfo,
  position = 'source',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Use intersection observer to detect when the item is in view
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
    rootMargin: '200px', // Load images before they enter the viewport
  });
  
  // Set item as visible once it's in view
  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true);
    }
  }, [inView, isVisible]);
  
  // Animation variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    }
  };
  
  return (
    <div 
      ref={ref}
      className="aspect-square"
      style={{ 
        // Add a slight delay based on index for staggered animations
        animationDelay: `${index * 50}ms` 
      }}
    >
      {isVisible && (
        <ImageCard
          id={id}
          selected={selected}
          onSelect={onSelect}
          onImageLoad={() => setHasLoaded(true)}
          showDate={showDates}
          position={position}
          updateMediaInfo={updateMediaInfo}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
      )}
    </div>
  );
};

export default LazyMediaItem;
