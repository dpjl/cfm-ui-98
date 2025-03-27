
import React from 'react';
import { useGalleryState } from '../../hooks/use-gallery-state';
import { useGallerySelection } from '../../hooks/use-gallery-selection';
import { useGalleryPreviewHandler } from '../../hooks/use-gallery-preview-handler';
import GalleryEmptyState from './GalleryEmptyState';
import GalleryError from './GalleryError';
import OptimizedGalleryGrid from './OptimizedGalleryGrid';

const GalleryContent: React.FC = () => {
  const { media, isLoading, error } = useGalleryState();
  const { selectedIds, toggleSelection } = useGallerySelection();
  const { openPreview } = useGalleryPreviewHandler();
  
  // Handle error state
  if (error) {
    return <GalleryError error={error} />;
  }

  // Handle empty state when not loading
  if (!isLoading && (!media || media.length === 0)) {
    return <GalleryEmptyState />;
  }

  // Render the optimized gallery grid
  return (
    <div className="gallery-content-container h-full">
      <OptimizedGalleryGrid
        media={media || []}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectItem={toggleSelection}
        onPreview={openPreview}
      />
    </div>
  );
};

export default React.memo(GalleryContent);
