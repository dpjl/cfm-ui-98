
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
}

// Using memo to prevent unnecessary re-renders
const LazyMediaItem: React.FC<LazyMediaItemProps> = memo(({
  id,
  selected,
  onSelect,
  index,
  showDates = false,
  updateMediaInfo,
  position
}) => {
  const [loaded, setLoaded] = useState(false);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const inViewRef = useRef(false);
  
  // We'll use a standard ref instead of intersection observer hook
  // This helps avoid the flickering issue when selecting items
  const elementRef = useRef<HTMLDivElement>(null);
  
  const { mediaInfo, isLoading } = useMediaInfo(id, true, position);
  const { getCachedThumbnailUrl, setCachedThumbnailUrl } = useMediaCache();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // Cleanup timer when component is unmounted
  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [pressTimer]);
  
  // Load thumbnail URL, using cache if available
  useEffect(() => {
    const cachedUrl = getCachedThumbnailUrl(id, position);
    if (cachedUrl) {
      setThumbnailUrl(cachedUrl);
      return;
    }
    
    const url = getThumbnailUrl(id, position);
    setThumbnailUrl(url);
    setCachedThumbnailUrl(id, position, url);
  }, [id, position, getCachedThumbnailUrl, setCachedThumbnailUrl]);
  
  // Update the parent component with media info when it's loaded
  useEffect(() => {
    if (mediaInfo && updateMediaInfo) {
      updateMediaInfo(id, mediaInfo);
    }
  }, [id, mediaInfo, updateMediaInfo]);
  
  // Determine if this is a video based on the file extension if available
  const isVideo = mediaInfo?.alt ? /\.(mp4|webm|ogg|mov)$/i.test(mediaInfo.alt) : false;
  
  // Handle clicks
  const handleItemClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    onSelect(id, e.shiftKey || e.ctrlKey || e.metaKey);
  }, [id, onSelect]);
  
  // Handle long press for mobile (as alternative to Ctrl+click)
  const handleTouchStart = useCallback(() => {
    // Start timer to detect long press
    const timer = setTimeout(() => {
      setLongPressTriggered(true);
      // Simulate a "Ctrl+click" by passing true as second argument
      onSelect(id, true);
    }, 500); // 500ms is a good delay for long press
    
    setPressTimer(timer);
  }, [id, onSelect]);
  
  const handleTouchEnd = useCallback(() => {
    // Cancel timer if user releases too early
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    
    // If it wasn't a long press, treat as normal click
    if (!longPressTriggered) {
      onSelect(id, false);
    }
    
    // Reset state for next press
    setLongPressTriggered(false);
  }, [pressTimer, longPressTriggered, id, onSelect]);
  
  // Removed animations that could cause flickering
  
  return (
    <div
      ref={elementRef} 
      className={cn(
        "image-card group relative", 
        "aspect-square cursor-pointer", 
        selected && "selected",
        "transition-all duration-75" // Faster transition to reduce perceived flicker
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
    >
      {thumbnailUrl && (
        <>
          <MediaItemRenderer
            src={thumbnailUrl}
            alt={mediaInfo?.alt || id}
            isVideo={Boolean(isVideo)}
            onLoad={() => setLoaded(true)}
            loaded={loaded}
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
        </>
      )}
    </div>
  );
});

// Set component display name for debugging
LazyMediaItem.displayName = 'LazyMediaItem';

export default LazyMediaItem;
