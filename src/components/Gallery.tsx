
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GallerySkeletons from './gallery/GallerySkeletons';
import GallerySelectionBar from './gallery/GallerySelectionBar';
import { useIsMobile } from '@/hooks/use-breakpoint';

export interface ImageItem {
  id: string;
  src?: string;
  alt?: string;
  directory?: string;
  createdAt?: string;
  type?: "image" | "video";
}

interface GalleryProps {
  title: string;
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  isLoading?: boolean;
  columnsClassName?: string;
  onPreviewMedia?: (id: string) => void;
  viewMode?: 'single' | 'split';
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading = false,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  onPreviewMedia,
  viewMode = 'single'
}) => {
  const [mounted, setMounted] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === mediaIds.length) {
      // Deselect all media
      selectedIds.forEach(id => onSelectId(id));
    } else {
      // Select all unselected media
      mediaIds.forEach(id => {
        if (!selectedIds.includes(id)) {
          onSelectId(id);
        }
      });
    }
  };

  const toggleDates = () => {
    setShowDates(prev => !prev);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mt-2">
          <GallerySkeletons columnsClassName={columnsClassName} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 p-2">
        <GallerySelectionBar 
          selectedIds={selectedIds}
          mediaIds={mediaIds}
          onSelectAll={handleSelectAll}
          showDates={showDates}
          onToggleDates={toggleDates}
        />
      </div>
      
      {mediaIds.length === 0 ? (
        <GalleryEmptyState />
      ) : (
        <div className="flex-1 overflow-auto">
          <GalleryGrid
            mediaIds={mediaIds}
            selectedIds={selectedIds}
            onSelectId={onSelectId}
            onPreviewMedia={onPreviewMedia}
            columnsClassName={columnsClassName}
            viewMode={viewMode}
            showDates={showDates}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
