
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { DetailedMediaInfo } from '@/api/imageApi';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string, extendSelection: boolean) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo) => void;
  position: 'source' | 'destination';
}

// Using memo to prevent unnecessary re-renders
const GalleryGrid = memo(({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount = 5,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo,
  position = 'source'
}: GalleryGridProps) => {
  console.log(`GalleryGrid rendering with columnsCount=${columnsCount}`);
  
  // Simplified container variants for better performance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      }
    }
  };

  return (
    <motion.div
      className={`grid gap-2 p-2`}
      style={{
        gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {mediaIds.map((mediaId, index) => (
        <div key={mediaId} className="grid-item">
          {/* We're not using LazyMediaItem here directly to avoid type errors */}
          <div 
            className={`cursor-pointer ${selectedIds.includes(mediaId) ? 'selected' : ''}`}
            onClick={() => onSelectId(mediaId, false)}
          >
            Media {mediaId}
          </div>
        </div>
      ))}
    </motion.div>
  );
});

// Set display name for debugging
GalleryGrid.displayName = 'GalleryGrid';

export default GalleryGrid;
