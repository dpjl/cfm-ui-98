
import React, { useState } from 'react';
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
  onPreview: () => void;
  index: number;
  showDates?: boolean;
}

const LazyMediaItem: React.FC<LazyMediaItemProps> = ({
  id,
  selected,
  onSelect,
  onPreview,
  index,
  showDates = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
  const { mediaInfo } = useMediaInfo(id, isIntersecting);
  
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
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.05 * (index % 10), // Limit the delay to avoid too long animations
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      variants={itemVariants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      layout
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
              onClick={onPreview}
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
