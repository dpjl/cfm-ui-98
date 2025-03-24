
import React from 'react';
import Gallery from '@/components/Gallery';
import GalleryEmptyState from '@/components/gallery/GalleryEmptyState';
import GallerySkeletons from '@/components/gallery/GallerySkeletons';
import GalleryError from '@/components/gallery/GalleryError';
import { useIsMobile } from '@/hooks/use-breakpoint';

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
  filter = 'all',
  position = 'source'
}) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return <GallerySkeletons columnsCount={columnsCount} />;
  }

  if (isError) {
    return <GalleryError error={error} />;
  }

  if (mediaIds.length === 0) {
    return <GalleryEmptyState filter={filter} />;
  }

  // Wrap the gallery in a div that allows scrolling on mobile
  return (
    <div className={isMobile && viewMode === 'split' ? 'h-full overflow-auto' : ''}>
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
    </div>
  );
};

export default GalleryContent;
