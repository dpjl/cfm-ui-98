
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

// Optimized LazyMediaItem to prevent flickering
const LazyMediaItem = memo(({
  id,
  selected,
  onSelect,
  index,
  showDates = false,
  updateMediaInfo,
  position,
  isScrolling = false
}: LazyMediaItemProps) => {
  const [loaded, setLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const previousSelected = useRef(selected);
  
  // Simplified intersection observer usage
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ 
    threshold: 0.1,
    rootMargin: '200px', // Load images a bit earlier
  });
  
  const { mediaInfo, isLoading } = useMediaInfo(id, isIntersecting, position);
  const { getCachedThumbnailUrl, setCachedThumbnailUrl } = useMediaCache();
  
  // Load thumbnail URL, using cache if available
  useEffect(() => {
    if (isIntersecting) {
      const cachedUrl = getCachedThumbnailUrl(id, position);
      
      if (cachedUrl) {
        setThumbnailUrl(cachedUrl);
      } else {
        const url = getThumbnailUrl(id, position);
        setThumbnailUrl(url);
        setCachedThumbnailUrl(id, position, url);
      }
    }
  }, [id, isIntersecting, position, getCachedThumbnailUrl, setCachedThumbnailUrl]);
  
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
  
  // Optimized click handler
  const handleItemClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(id, e.shiftKey || e.ctrlKey || e.metaKey);
  }, [id, onSelect]);
  
  // Handle checkbox selection - separate from item click for better performance
  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(id, e.shiftKey || e.ctrlKey || e.metaKey);
  }, [id, onSelect]);
  
  // Only render a simple placeholder when the item is not intersecting
  if (!isIntersecting && !thumbnailUrl) {
    return (
      <div 
        ref={elementRef} 
        className="aspect-square bg-muted rounded-lg"
        aria-label="Loading media item"
      ></div>
    );
  }
  
  // Simplified component with optimized rendering
  return (
    <div
      ref={elementRef}
      className={cn(
        "image-card relative aspect-square cursor-pointer",
        selected && "selected"
      )}
      onClick={handleItemClick}
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
      {(thumbnailUrl || isScrolling) && (
        <>
          <MediaItemRenderer
            src={thumbnailUrl || ''}
            alt={mediaInfo?.alt || id}
            isVideo={isVideo}
            onLoad={() => setLoaded(true)}
            loaded={loaded}
            isScrolling={isScrolling}
          />

          {showDates && <DateDisplay dateString={mediaInfo?.createdAt} showDate={showDates} />}

          <div className="image-overlay pointer-events-none" />
          
          <SelectionCheckbox
            selected={selected}
            onSelect={handleCheckboxClick}
            loaded={loaded}
            mediaId={id}
          />
        </>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimizing re-renders
  return (
    prevProps.id === nextProps.id &&
    prevProps.selected === nextProps.selected &&
    prevProps.isScrolling === nextProps.isScrolling &&
    prevProps.showDates === nextProps.showDates
  );
});

// Set component display name for debugging
LazyMediaItem.displayName = 'LazyMediaItem';

export default LazyMediaItem;
