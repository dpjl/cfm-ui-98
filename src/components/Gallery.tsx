
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLanguage } from '@/hooks/use-language';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GallerySkeletons from './gallery/GallerySkeletons';
import GallerySelectionBar from './gallery/GallerySelectionBar';
import MediaInfoPanel from './media/MediaInfoPanel';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { getMediaUrl, DetailedMediaInfo } from '@/api/imageApi';
import { useToast } from '@/components/ui/use-toast';
import MediaPreview from './MediaPreview';

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
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Collect media info from child components
  const updateMediaInfo = useCallback((id: string, info: DetailedMediaInfo | null) => {
    setMediaInfoMap(prev => {
      const newMap = new Map(prev);
      newMap.set(id, info);
      return newMap;
    });
  }, []);

  // Select/deselect all handlers
  const handleSelectAll = useCallback(() => {
    // Select all unselected media
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  }, [mediaIds, selectedIds, onSelectId]);

  const handleDeselectAll = useCallback(() => {
    // Deselect all selected media
    if (selectedIds.length > 0) {
      selectedIds.forEach(id => onSelectId(id));
    }
  }, [selectedIds, onSelectId]);

  // Toggle dates visibility
  const toggleDates = useCallback(() => {
    setShowDates(prev => !prev);
  }, []);
  
  // Handle download of selected items
  const handleDownloadSelected = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    
    // For a single file, trigger direct download
    if (ids.length === 1) {
      const a = document.createElement('a');
      a.href = getMediaUrl(ids[0], position);
      a.download = `media-${ids[0]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    
    // For multiple files, show a notification
    toast({
      title: "Multiple files download",
      description: `Downloading ${ids.length} files is not supported yet. Please select one file at a time.`,
    });
  }, [toast, position]);
  
  // Preview media handlers
  const handleOpenPreview = useCallback((id: string) => {
    setPreviewMediaId(id);
    if (onPreviewMedia) {
      onPreviewMedia(id);
    }
  }, [onPreviewMedia]);
  
  const handleClosePreview = useCallback(() => {
    setPreviewMediaId(null);
  }, []);
  
  const handleNavigatePreview = useCallback((direction: 'prev' | 'next') => {
    if (!previewMediaId || mediaIds.length === 0) return;
    
    const currentIndex = mediaIds.indexOf(previewMediaId);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + mediaIds.length) % mediaIds.length;
    } else {
      newIndex = (currentIndex + 1) % mediaIds.length;
    }
    
    setPreviewMediaId(mediaIds[newIndex]);
  }, [previewMediaId, mediaIds]);
  
  // Render loading skeleton if data is loading
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mt-2">
          <GallerySkeletons columnsCount={columnsCount} />
        </div>
      </div>
    );
  }
  
  // Memoize whether to show the media info panel
  const showMediaInfoPanel = selectedIds.length > 0;
  
  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 p-2">
        <GallerySelectionBar 
          selectedIds={selectedIds}
          mediaIds={mediaIds}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          showDates={showDates}
          onToggleDates={toggleDates}
        />
        
        {showMediaInfoPanel && (
          <MediaInfoPanel 
            selectedIds={selectedIds}
            onOpenPreview={handleOpenPreview}
            onDeleteSelected={onDeleteSelected}
            onDownloadSelected={handleDownloadSelected}
            mediaInfoMap={mediaInfoMap}
            position={position}
          />
        )}
      </div>
      
      {mediaIds.length === 0 ? (
        <GalleryEmptyState />
      ) : (
        <div className="flex-1 overflow-auto">
          <GalleryGrid
            mediaIds={mediaIds}
            selectedIds={selectedIds}
            onSelectId={onSelectId}
            columnsCount={columnsCount}
            viewMode={viewMode}
            showDates={showDates}
            updateMediaInfo={updateMediaInfo}
            position={position}
          />
        </div>
      )}
      
      <MediaPreview 
        mediaId={previewMediaId}
        isOpen={previewMediaId !== null}
        onClose={handleClosePreview}
        allMediaIds={mediaIds}
        onNavigate={handleNavigatePreview}
        position={position}
      />
    </div>
  );
};

export default React.memo(Gallery);
