
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount,
  viewMode = 'single',
  showDates = false
}) => {
  const isMobile = useIsMobile();
  
  // Generate explicit grid-cols class based on column count
  const getGridColsClass = () => {
    // On mobile, use fixed columns based on viewMode
    if (isMobile) {
      return viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-4';
    }
    
    // On desktop, use the exact number of columns specified
    return `grid-cols-${columnsCount}`;
  };
  
  // Determine the gap size based on device and view mode
  const getGapClass = () => {
    if (isMobile) {
      return viewMode === 'split' ? 'gap-1' : 'gap-2';
    }
    return 'gap-4';
  };
  
  return (
    <div className={cn("grid h-full content-start p-2", getGridColsClass(), getGapClass())}>
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
