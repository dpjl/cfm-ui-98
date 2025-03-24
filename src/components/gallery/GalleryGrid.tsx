
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  columnsClassName?: string;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  viewMode = 'single',
  showDates = false
}) => {
  const isMobile = useIsMobile();
  
  // Optimize grid layout based on device and view mode
  const getGridClasses = () => {
    if (isMobile) {
      // Mobile-specific grid classes with appropriate gaps
      if (viewMode === 'split') {
        return "grid-cols-2 gap-1.5"; // Split view - 2 columns per side with small gap
      } else {
        return "grid-cols-3 gap-2"; // Single view - 3 columns with larger gap
      }
    } else {
      // Desktop - use provided column classes with appropriate gap
      return `${columnsClassName} gap-3`;
    }
  };
  
  return (
    <div className={cn("grid h-full content-start p-1.5", getGridClasses())}>
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
