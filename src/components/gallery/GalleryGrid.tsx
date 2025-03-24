
import React from 'react';
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
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo
}) => {
  const isMobile = useIsMobile();
  
  // Generate grid template columns style based on column count
  const getGridStyle = () => {
    // On mobile, use fixed columns based on viewMode
    if (isMobile) {
      return { 
        gridTemplateColumns: viewMode === 'split' ? 'repeat(2, minmax(0, 1fr))' : 'repeat(4, minmax(0, 1fr))'
      };
    }
    
    // On desktop, use the exact number of columns specified
    return { 
      gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
    };
  };
  
  // Determine the gap size based on device and view mode
  const getGapClass = () => {
    if (isMobile) {
      return viewMode === 'split' ? 'gap-1' : 'gap-2';
    }
    return 'gap-4';
  };
  
  return (
    <div 
      className={cn("grid h-full content-start p-2", getGapClass())}
      style={getGridStyle()}
    >
      <AnimatePresence>
        {mediaIds.map((id, index) => (
          <LazyMediaItem
            key={id}
            id={id}
            selected={selectedIds.includes(id)}
            onSelect={() => onSelectId(id)}
            index={index}
            showDates={showDates}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
