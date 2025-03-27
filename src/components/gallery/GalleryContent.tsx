
import React from 'react';
import { useGalleryState } from '../../hooks/use-gallery-state';
import { useGallerySelection } from '../../hooks/use-gallery-selection';
import { useGalleryPreviewHandler } from '../../hooks/use-gallery-preview-handler';
import GalleryEmptyState from './GalleryEmptyState';
import GalleryError from './GalleryError';
import OptimizedGalleryGrid from './OptimizedGalleryGrid';

const GalleryContent: React.FC = () => {
  const { media, isLoading, error } = useGalleryState();
  const selection = useGallerySelection({
    mediaIds: media?.map(item => item.id) || [],
    selectedIds: [],
    onSelectId: () => {} // This will be replaced by a proper handler
  });
  const preview = useGalleryPreviewHandler(
    media?.map(item => item.id) || []
  );
  
  // Handle error state
  if (error) {
    return <GalleryError error={error} />;
  }

  // Handle empty state when not loading
  if (!isLoading && (!media || media.length === 0)) {
    return <GalleryEmptyState />;
  }

  // Extract selected IDs set from selection
  const selectedIds = new Set<string>();

  // Render the optimized gallery grid
  return (
    <div className="gallery-content-container h-full">
      <OptimizedGalleryGrid
        media={media || []}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectItem={(id, multiSelect) => selection.handleSelectItem(id, multiSelect)}
        onPreview={(id) => preview.handleOpenPreview(id)}
      />
    </div>
  );
};

export default React.memo(GalleryContent);
