
import React, { useState, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { useMediaInfo } from '@/hooks/use-media-info';
import { getThumbnailUrl } from '@/api/imageApi';
import { motion } from 'framer-motion';
import MediaItemRenderer from './media/MediaItemRenderer';
import DateDisplay from './media/DateDisplay';
import SelectionCheckbox from './media/SelectionCheckbox';
import MediaContextMenu from './media/MediaContextMenu';
import MediaTooltip from './media/MediaTooltip';
import { useMediaCache } from '@/hooks/use-media-cache';

interface LazyMediaItemProps {
  id: string;
  selected: boolean;
  onSelect: () => void;
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
  const { elementRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({ 
    threshold: 0.1, 
    freezeOnceVisible: true 
  });
  const { mediaInfo, isLoading } = useMediaInfo(id, isIntersecting, position);
  const { getCachedThumbnailUrl, setCachedThumbnailUrl } = useMediaCache();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  
  // Load thumbnail URL, using cache if available
  useEffect(() => {
    if (isIntersecting) {
      // First check if we have it in the cache
      const cachedUrl = getCachedThumbnailUrl(id, position);
      if (cachedUrl) {
        setThumbnailUrl(cachedUrl);
        return;
      }
      
      // If not in cache, get the URL and cache it
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
  
  const handleDownload = () => {
    // Create a temporary link to trigger the download
    if (!thumbnailUrl) return;
    
    const a = document.createElement('a');
    a.href = thumbnailUrl;
    a.download = mediaInfo?.alt || id;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
  
  // Only render the full content when the item is intersecting
  if (!isIntersecting) {
    return <div ref={elementRef} className="aspect-square bg-muted rounded-lg"></div>;
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
        <MediaContextMenu onDownload={handleDownload} isVideo={Boolean(isVideo)}>
          <MediaTooltip content={mediaInfo?.alt || id}>
            <div 
              className={cn(
                "image-card group relative", 
                "aspect-square", 
                selected && "selected",
              )}
              onClick={onSelect}
            >
              <MediaItemRenderer
                src={thumbnailUrl}
                alt={mediaInfo?.alt || id}
                isVideo={Boolean(isVideo)}
                onLoad={() => setLoaded(true)}
                loaded={loaded}
                showDate={showDates}
              />

              <DateDisplay dateString={mediaInfo?.createdAt} showDate={showDates} />

              <div className="image-overlay" />
              <SelectionCheckbox
                selected={selected}
                onSelect={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                loaded={loaded}
              />
            </div>
          </MediaTooltip>
        </MediaContextMenu>
      )}
    </motion.div>
  );
});

// Set component display name for debugging
LazyMediaItem.displayName = 'LazyMediaItem';

export default LazyMediaItem;
