
import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useMediaInfo } from '@/hooks/use-media-info';
import { getThumbnailUrl } from '@/api/imageApi';
import { motion } from 'framer-motion';
import MediaItemRenderer from './media/MediaItemRenderer';
import DateDisplay from './media/DateDisplay';
import SelectionCheckbox from './media/SelectionCheckbox';
import { useMediaCache } from '@/hooks/use-media-cache';

interface LazyMediaItemProps {
  id: string;
  selected: boolean;
  onSelect: (id: string, extendSelection: boolean) => void;
  index: number;
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: any) => void;
  position: 'source' | 'destination';
  isScrolling?: boolean;
}

// Using memo to prevent unnecessary re-renders
const LazyMediaItem: React.FC<LazyMediaItemProps> = memo(({
  id,
  selected,
  onSelect,
  index,
  showDates = false,
  updateMediaInfo,
  position,
  isScrolling = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const previousSelected = useRef(selected);
  
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ 
    threshold: 0.1, 
    freezeOnceVisible: false // Changed to false to ensure visibility is checked continuously
  });
  
  const { mediaInfo, isLoading } = useMediaInfo(id, isIntersecting, position);
  const { getCachedThumbnailUrl, setCachedThumbnailUrl } = useMediaCache();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // Clean up the timer when component unmounts
  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [pressTimer]);
  
  // Load thumbnail URL, using cache if available
  useEffect(() => {
    // Don't load during scrolling to avoid thrashing
    if (isIntersecting && (!isScrolling || loaded)) {
      const cachedUrl = getCachedThumbnailUrl(id, position);
      if (cachedUrl) {
        setThumbnailUrl(cachedUrl);
        return;
      }
      
      const url = getThumbnailUrl(id, position);
      setThumbnailUrl(url);
      setCachedThumbnailUrl(id, position, url);
    }
  }, [id, isIntersecting, position, getCachedThumbnailUrl, setCachedThumbnailUrl, isScrolling, loaded]);
  
  // Update the parent component with media info when it's loaded
  useEffect(() => {
    if (mediaInfo && updateMediaInfo && isIntersecting) {
      updateMediaInfo(id, mediaInfo);
    }
  }, [id, mediaInfo, updateMediaInfo, isIntersecting]);
  
  // Track selection changes to avoid flicker
  useEffect(() => {
    previousSelected.current = selected;
  }, [selected]);
  
  // Determine if this is a video based on the file extension if available
  const isVideo = mediaInfo?.alt ? /\.(mp4|webm|ogg|mov)$/i.test(mediaInfo.alt) : false;
  
  // Handle clicks
  const handleItemClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event from bubbling up
    onSelect(id, e.shiftKey || e.ctrlKey || e.metaKey);
  }, [id, onSelect]);
  
  // Handle long press for mobile devices (as an alternative to Ctrl+click)
  const handleTouchStart = useCallback(() => {
    // Start a timer to detect long press
    const timer = setTimeout(() => {
      setLongPressTriggered(true);
      // Simulate a "Ctrl+click" by passing true as the second argument
      onSelect(id, true);
    }, 500); // 500ms is a good delay for a long press
    
    setPressTimer(timer);
  }, [id, onSelect]);
  
  const handleTouchEnd = useCallback(() => {
    // Cancel the timer if the user releases too early
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    // If it wasn't a long press, treat it as a normal click
    if (!longPressTriggered) {
      onSelect(id, false);
    }
    
    // Reset the state for the next press
    setLongPressTriggered(false);
  }, [pressTimer, longPressTriggered, id, onSelect]);
  
  // Simplified animation variants for better performance
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Only render a simple placeholder when the item is not intersecting
  if (!isIntersecting && !thumbnailUrl) {
    return (
      <div 
        ref={elementRef} 
        className="aspect-square bg-muted rounded-lg"
        role="img"
        aria-label="Loading media item"
      ></div>
    );
  }
  
  return (
    <motion.div
      ref={elementRef}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      layout={false} // Disable layout animations to prevent flicker
      style={{ willChange: 'auto' }} // Optimize for GPU rendering
    >
      {(thumbnailUrl || isScrolling) && (
        <div 
          className={cn(
            "image-card group relative", 
            "aspect-square cursor-pointer", 
            selected && "selected",
          )}
          onClick={handleItemClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          aria-label={`Media item ${mediaInfo?.alt || id}`}
          aria-pressed={selected}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(id, e.shiftKey || e.ctrlKey || e.metaKey);
            }
          }}
          data-media-id={id}
          style={{ willChange: 'transform, opacity' }}
        >
          <MediaItemRenderer
            src={thumbnailUrl || ''}
            alt={mediaInfo?.alt || id}
            isVideo={Boolean(isVideo)}
            onLoad={() => setLoaded(true)}
            loaded={loaded}
            isScrolling={isScrolling}
          />

          <DateDisplay dateString={mediaInfo?.createdAt} showDate={showDates} />

          <div className="image-overlay pointer-events-none" />
          <SelectionCheckbox
            selected={selected}
            onSelect={(e) => {
              e.stopPropagation();
              onSelect(id, e.shiftKey || e.ctrlKey || e.metaKey);
            }}
            loaded={loaded}
            mediaId={id}
          />
        </div>
      )}
    </motion.div>
  );
});

// Set component display name for debugging
LazyMediaItem.displayName = 'LazyMediaItem';

export default LazyMediaItem;
