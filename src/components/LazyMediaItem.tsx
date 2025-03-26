
import React, { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useMediaInfo } from '@/hooks/use-media-info';
import { getThumbnailUrl } from '@/api/imageApi';
import { motion } from 'framer-motion';
import MediaItemRenderer from './media/MediaItemRenderer';
import DateDisplay from './media/DateDisplay';
import SelectionCheckbox from './media/SelectionCheckbox';
import { useMediaCache } from '@/hooks/use-media-cache';
import { DetailedMediaInfo } from '@/api/imageApi';

interface LazyMediaItemProps {
  id: string;
  selected: boolean;
  onSelect: (id: string, extendSelection: boolean) => void;
  index: number;
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: any) => void;
  position: 'source' | 'destination';
  onTouchStart?: (id: string) => void;
  onTouchEnd?: () => void;
  isMultiSelectMode?: boolean;
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
  onTouchStart,
  onTouchEnd,
  isMultiSelectMode = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ 
    threshold: 0.1, 
    freezeOnceVisible: true 
  });
  const { mediaInfo, isLoading } = useMediaInfo(id, isIntersecting, position);
  const { getCachedThumbnailUrl, setCachedThumbnailUrl } = useMediaCache();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // Detect macOS or Windows for correct key modifier
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  
  // Load thumbnail URL, using cache if available
  useEffect(() => {
    if (isIntersecting) {
      const cachedUrl = getCachedThumbnailUrl(id, position);
      if (cachedUrl) {
        setThumbnailUrl(cachedUrl);
        return;
      }
      
      const url = getThumbnailUrl(id, position);
      setThumbnailUrl(url);
      setCachedThumbnailUrl(id, position, url);
    }
  }, [id, isIntersecting, position, getCachedThumbnailUrl, setCachedThumbnailUrl]);
  
  // Update the parent component with media info when it's loaded
  useEffect(() => {
    if (mediaInfo && updateMediaInfo) {
      updateMediaInfo(id, mediaInfo);
    }
  }, [id, mediaInfo, updateMediaInfo]);
  
  // Determine if this is a video based on the file extension if available
  const isVideo = mediaInfo?.alt ? /\.(mp4|webm|ogg|mov)$/i.test(mediaInfo.alt) : false;
  
  // Improved handler for selecting the item with key modifier support
  const handleItemClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    
    // Check if ctrl/cmd key is pressed for multi-select
    const modifierKeyPressed = isMac ? e.metaKey : e.ctrlKey;
    
    // Pass the multi-select flag
    onSelect(id, modifierKeyPressed || e.shiftKey || isMultiSelectMode);
  };
  
  // Handle touch events for long-press detection on mobile
  const handleTouchStartEvent = (e: React.TouchEvent) => {
    if (onTouchStart) {
      onTouchStart(id);
    }
  };
  
  const handleTouchEndEvent = (e: React.TouchEvent) => {
    if (onTouchEnd) {
      onTouchEnd();
    }
  };
  
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
  if (!isIntersecting) {
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
      layout="position"
    >
      {thumbnailUrl && (
        <div 
          className={cn(
            "image-card group relative", 
            "aspect-square cursor-pointer", 
            selected && "selected",
            isMultiSelectMode && "multi-select-mode"
          )}
          onClick={handleItemClick}
          onTouchStart={handleTouchStartEvent}
          onTouchEnd={handleTouchEndEvent}
          role="button"
          aria-label={`Media item ${mediaInfo?.alt || id}`}
          aria-pressed={selected}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(id, (isMac ? e.metaKey : e.ctrlKey) || e.shiftKey || isMultiSelectMode);
            }
          }}
          data-media-id={id}
        >
          <MediaItemRenderer
            src={thumbnailUrl}
            alt={mediaInfo?.alt || id}
            isVideo={Boolean(isVideo)}
            onLoad={() => setLoaded(true)}
            loaded={loaded}
          />

          {mediaInfo?.createdAt && (
            <DateDisplay 
              dateString={mediaInfo.createdAt} 
              showDate={showDates} 
            />
          )}

          <div className="image-overlay pointer-events-none" />
          <SelectionCheckbox
            selected={selected}
            onSelect={(e) => {
              e.stopPropagation();
              // Always treat checkbox click as multi-select behavior
              onSelect(id, true);
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
