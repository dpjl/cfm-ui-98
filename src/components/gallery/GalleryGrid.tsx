
import React from 'react';
import { motion } from 'framer-motion';
import LazyMediaItem from '@/components/LazyMediaItem';
import { DetailedMediaInfo } from '@/api/imageApi';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo) => void;
  position: 'source' | 'destination';
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount = 5,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo,
  position = 'source'
}) => {
  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
        staggerDirection: 1
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
      {mediaIds.map((id, index) => (
        <LazyMediaItem
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
    </motion.div>
  );
};

export default GalleryGrid;
