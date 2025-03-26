
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-breakpoint';
import SelectionCheckbox from '@/components/media/SelectionCheckbox';
import DateDisplay from '@/components/media/DateDisplay';
import MediaItemRenderer from '@/components/media/MediaItemRenderer';
import { useMediaInfo } from '@/hooks/use-media-info';
import { DetailedMediaInfo } from '@/api/imageApi';

interface ImageCardProps {
  id: string;
  selected: boolean;
  onSelect: (id: string, extendSelection: boolean) => void;
  onImageLoad?: () => void;
  showDate?: boolean;
  position?: 'source' | 'destination';
  updateMediaInfo?: (id: string, info: DetailedMediaInfo | null) => void;
  onTouchStart?: (id: string) => void;
  onTouchEnd?: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  id,
  selected,
  onSelect,
  onImageLoad,
  showDate = false,
  position = 'source',
  updateMediaInfo,
  onTouchStart,
  onTouchEnd
}) => {
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { mediaInfo, isLoading: isLoadingInfo } = useMediaInfo(id, true, position);
  
  // Call the updateMediaInfo callback when media info changes
  React.useEffect(() => {
    if (updateMediaInfo && mediaInfo) {
      updateMediaInfo(id, mediaInfo);
    }
  }, [id, mediaInfo, updateMediaInfo]);
  
  const handleImageLoad = () => {
    setLoaded(true);
    onImageLoad?.();
  };
  
  const handleSelect = (e: React.MouseEvent) => {
    // Check if Ctrl key is pressed for desktop (multi-select)
    const extendSelection = e.ctrlKey || e.metaKey; // metaKey for Mac
    onSelect(id, extendSelection);
  };
  
  const handleTouchStart = () => {
    // For mobile long-press handling
    if (onTouchStart) {
      onTouchStart(id);
    }
  };
  
  const handleTouchEnd = () => {
    if (onTouchEnd) {
      onTouchEnd();
    }
  };
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-md cursor-pointer transition-all duration-200 ease-out transform bg-muted/30",
        "hover:shadow-md active:scale-[0.98]",
        selected && "shadow-md border-2 border-primary ring-1 ring-primary"
      )}
      onClick={() => onSelect(id, false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <SelectionCheckbox 
        selected={selected} 
        onSelect={handleSelect}
        loaded={loaded}
        mediaId={id}
      />
      
      <MediaItemRenderer 
        id={id} 
        position={position} 
        onLoad={handleImageLoad}
        loaded={loaded}
      />
      
      {showDate && loaded && mediaInfo?.createdAt && (
        <DateDisplay 
          createdAt={mediaInfo.createdAt} 
          loaded={loaded} 
        />
      )}
    </div>
  );
};

export default ImageCard;
