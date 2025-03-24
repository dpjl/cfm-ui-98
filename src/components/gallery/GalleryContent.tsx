
import React, { memo } from 'react';
import Gallery from '@/components/Gallery';
import GalleryEmptyState from '@/components/gallery/GalleryEmptyState';
import GallerySkeletons from '@/components/gallery/GallerySkeletons';
import GalleryError from '@/components/gallery/GalleryError';

interface GalleryContentProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  columnsCount: number;
  viewMode: 'single' | 'split';
  onPreviewItem: (id: string) => void;
  onDeleteSelected: () => void;
  title: string;
  filter?: string;
  position?: 'source' | 'destination';
}

// Using memo to prevent unnecessary re-renders
const GalleryContent: React.FC<GalleryContentProps> = memo(({
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading,
  isError,
  error,
  columnsCount,
  viewMode,
  onPreviewItem,
  onDeleteSelected,
  title,
  filter = 'all',
  position = 'source'
}) => {
  if (isLoading) {
    return <GallerySkeletons columnsCount={columnsCount} />;
  }

  if (isError) {
    return <GalleryError error={error} />;
  }

  if (mediaIds.length === 0) {
    return <GalleryEmptyState filter={filter} />;
  }

  return (
    <Gallery
      title={title}
      mediaIds={mediaIds}
      selectedIds={selectedIds}
      onSelectId={onSelectId}
      isLoading={isLoading}
      columnsCount={columnsCount}
      onPreviewMedia={onPreviewItem}
      viewMode={viewMode}
      onDeleteSelected={onDeleteSelected}
      position={position}
    />
  );
});

// Set component display name for debugging
GalleryContent.displayName = 'GalleryContent';

export default GalleryContent;
