
import React from 'react';
import { useGalleryState } from '../../hooks/use-gallery-state';
import { useGallerySelection } from '../../hooks/use-gallery-selection';
import { useGalleryPreviewHandler } from '../../hooks/use-gallery-preview-handler';
import GalleryEmptyState from './GalleryEmptyState';
import GalleryError from './GalleryError';
import OptimizedGalleryGrid from './OptimizedGalleryGrid';

const GalleryContent: React.FC = () => {
  const { media, isLoading, error } = useGalleryState();
  const mediaIds = media?.map(item => item.id) || [];
  
  const selection = useGallerySelection({
    mediaIds,
    selectedIds: [],
    onSelectId: () => {} // This will be replaced by a proper handler
  });
  
  // Create a Set for selected IDs
  const selectedIds = new Set<string>();
  
  // Use the hook with proper object argument
  const preview = useGalleryPreviewHandler({
    mediaIds,
    onPreviewMedia: undefined
  });
  
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
        onSelectItem={(id, multiSelect) => selection.handleSelectItem(id, multiSelect || false)}
        onPreview={(id) => preview.handleOpenPreview(id)}
      />
    </div>
  );
};

export default React.memo(GalleryContent);
