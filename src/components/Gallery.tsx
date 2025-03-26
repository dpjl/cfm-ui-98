
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GallerySkeletons from './gallery/GallerySkeletons';
import MediaPreview from './MediaPreview';
import { DetailedMediaInfo } from '@/api/imageApi';
import GallerySelection from './gallery/GallerySelection';
import GalleryPreviewHandler from './gallery/GalleryPreviewHandler';
import GalleryToolbar from './gallery/GalleryToolbar';
import GalleryMediaHandler from './gallery/GalleryMediaHandler';

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
  columnsCount: number;
  onPreviewMedia?: (id: string) => void;
  viewMode?: 'single' | 'split';
  onDeleteSelected: () => void;
  position?: 'source' | 'destination';
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading = false,
  columnsCount,
  onPreviewMedia,
  viewMode = 'single',
  onDeleteSelected,
  position = 'source'
}) => {
  const [showDates, setShowDates] = useState(false);
  const [mediaInfoMap, setMediaInfoMap] = useState<Map<string, DetailedMediaInfo | null>>(new Map());
  const { t } = useLanguage();
  
  // Initialize gallery selection features
  const selection = GallerySelection({
    mediaIds,
    selectedIds,
    onSelectId
  });
  
  // Initialize preview features
  const preview = GalleryPreviewHandler({
    mediaIds,
    onPreviewMedia
  });
  
  // Initialize media operations
  const mediaHandler = GalleryMediaHandler({
    selectedIds,
    position
  });

  // Collect media info from child components
  const updateMediaInfo = (id: string, info: DetailedMediaInfo | null) => {
    setMediaInfoMap(prev => {
      const newMap = new Map(prev);
      newMap.set(id, info);
      return newMap;
    });
  };

  const toggleDates = () => {
    setShowDates(prev => !prev);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mt-2">
          <GallerySkeletons columnsCount={columnsCount} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full relative">
      <GalleryToolbar
        selectedIds={selectedIds}
        mediaIds={mediaIds}
        onSelectAll={selection.handleSelectAll}
        onDeselectAll={selection.handleDeselectAll}
        showDates={showDates}
        onToggleDates={toggleDates}
        viewMode={viewMode}
        onOpenPreview={preview.handleOpenPreview}
        onDeleteSelected={onDeleteSelected}
        onDownloadSelected={mediaHandler.handleDownloadSelected}
        mediaInfoMap={mediaInfoMap}
      />
      
      {mediaIds.length === 0 ? (
        <GalleryEmptyState />
      ) : (
        <div className="flex-1 overflow-auto">
          <GalleryGrid
            mediaIds={mediaIds}
            selectedIds={selectedIds}
            onSelectId={selection.handleSelectItem}
            columnsCount={columnsCount}
            viewMode={viewMode}
            showDates={showDates}
            updateMediaInfo={updateMediaInfo}
            position={position}
          />
        </div>
      )}
      
      <MediaPreview 
        mediaId={preview.previewMediaId}
        isOpen={preview.previewMediaId !== null}
        onClose={preview.handleClosePreview}
        allMediaIds={mediaIds}
        onNavigate={preview.handleNavigatePreview}
        position={position}
      />
    </div>
  );
};

export default Gallery;
