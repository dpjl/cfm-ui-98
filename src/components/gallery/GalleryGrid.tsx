
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onPreviewMedia?: (id: string) => void;
  columnsClassName?: string;
  viewMode?: 'single' | 'split';
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  onPreviewMedia,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  viewMode = 'single'
}) => {
  const isMobile = useIsMobile();
  
  // Create appropriate grid classes based on view mode
  const gridClasses = isMobile 
    ? viewMode === 'single' 
      ? "grid-cols-4" // Mobile single view - 4 columns
      : "grid-cols-2" // Mobile split view - 2 columns per side
    : columnsClassName; // Desktop view - use provided classes
  
  // Use smaller gaps on mobile
  const gapClass = isMobile ? "gap-1" : "gap-4";
  
  return (
    <div className={cn("grid h-full content-start", gapClass, gridClasses)}>
      <AnimatePresence>
        {mediaIds.map((id, index) => (
          <LazyMediaItem
            key={id}
            id={id}
            selected={selectedIds.includes(id)}
            onSelect={() => onSelectId(id)}
            onPreview={() => onPreviewMedia ? onPreviewMedia(id) : null}
            index={index}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
