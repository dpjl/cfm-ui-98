
import React, { useMemo, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { DetailedMediaInfo } from '@/api/imageApi';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo | null) => void;
  position?: 'source' | 'destination';
}

// Create a memoized version of LazyMediaItem
const MemoizedLazyMediaItem = memo(LazyMediaItem);

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo,
  position = 'source'
}) => {
  const isMobile = useIsMobile();
  
  // Generate grid template columns style based on column count - memoized
  const gridStyle = useMemo(() => {
    // On mobile, we now respect the columnsCount from props which will be set by the parent based on view mode
    if (isMobile) {
      return { 
        gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
      };
    }
    
    // On desktop, use the exact number of columns specified
    return { 
      gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
    };
  }, [columnsCount, isMobile]);
  
  // Determine the gap size based on device and view mode - memoized
  const gapClass = useMemo(() => {
    if (isMobile) {
      return columnsCount <= 2 ? 'gap-1' : 'gap-2';
    }
    return 'gap-4';
  }, [isMobile, columnsCount]);
  
  return (
    <div 
      className={cn("grid h-full content-start p-2", gapClass)}
      style={gridStyle}
    >
      <AnimatePresence>
        {mediaIds.map((id, index) => (
          <MemoizedLazyMediaItem
            key={id}
            id={id}
            selected={selectedIds.includes(id)}
            onSelect={() => onSelectId(id)}
            index={index}
            showDates={showDates}
            updateMediaInfo={updateMediaInfo}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default memo(GalleryGrid);
