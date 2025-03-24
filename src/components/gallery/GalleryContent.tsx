
import React from 'react';
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
}

const GalleryContent: React.FC<GalleryContentProps> = ({
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
  filter = 'all'
}) => {
  // Generate the proper class for the number of columns
  const getColumnsClassName = () => {
    // Exact column mapping to respect the selected number of columns
    return `grid-cols-${columnsCount}`;
  };

  if (isLoading) {
    return <GallerySkeletons columnsClassName={getColumnsClassName()} />;
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
      columnsClassName={getColumnsClassName()}
      onPreviewMedia={onPreviewItem}
      viewMode={viewMode}
      onDeleteSelected={onDeleteSelected}
    />
  );
};

export default GalleryContent;
