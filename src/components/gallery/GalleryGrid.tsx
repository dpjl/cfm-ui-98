
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onPreviewMedia?: (id: string) => void;
  columnsClassName?: string;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  onPreviewMedia,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
}) => {
  return (
    <div className={cn("grid gap-4 h-full overflow-auto content-start", columnsClassName)}>
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
