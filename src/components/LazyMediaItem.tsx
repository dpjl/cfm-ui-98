
import React, { useState, useEffect } from 'react';
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

interface LazyMediaItemProps {
  id: string;
  selected: boolean;
  onSelect: () => void;
  index: number;
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: any) => void;
}

const LazyMediaItem: React.FC<LazyMediaItemProps> = ({
  id,
  selected,
  onSelect,
  index,
  showDates = false,
  updateMediaInfo
}) => {
  const [loaded, setLoaded] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
  const { mediaInfo, isLoading } = useMediaInfo(id, isIntersecting);
  
  // Update the parent component with media info when it's loaded
  useEffect(() => {
    if (mediaInfo && updateMediaInfo) {
      updateMediaInfo(id, mediaInfo);
    }
  }, [id, mediaInfo, updateMediaInfo]);
  
  // Determine if this is a video based on the alt text if available
  const isVideo = mediaInfo?.alt ? mediaInfo.alt.match(/\.(mp4|webm|ogg|mov)$/i) : false;
  
  const thumbnailUrl = getThumbnailUrl(id);
  
  const handleDownload = () => {
    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = thumbnailUrl;
    a.download = mediaInfo?.alt || id;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Animation variants - simplified for better performance
  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };
  
  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      variants={itemVariants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      layout="position"
    >
      {isIntersecting && (
        <MediaContextMenu onDownload={handleDownload} isVideo={Boolean(isVideo)}>
          <MediaTooltip content={mediaInfo?.alt || id}>
            <div 
              className={cn(
                "image-card group relative", 
                "aspect-square", 
                selected && "selected",
                !loaded && "animate-pulse bg-muted"
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
      {!isIntersecting && (
        <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
      )}
    </motion.div>
  );
};

export default LazyMediaItem;
