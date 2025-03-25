
import React, { useState, useEffect } from 'react';
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
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Collect media info from child components
  const updateMediaInfo = (id: string, info: DetailedMediaInfo | null) => {
    setMediaInfoMap(prev => {
      const newMap = new Map(prev);
      newMap.set(id, info);
      return newMap;
    });
  };

  // Handler with enhanced selection behavior
  const handleSelectItem = (id: string, extendSelection: boolean) => {
    if (extendSelection && lastSelectedId && selectedIds.length > 0) {
      // Shift key is pressed - extend selection from last selected item to current
      const lastIndex = mediaIds.indexOf(lastSelectedId);
      const currentIndex = mediaIds.indexOf(id);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        // Determine the range
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        
        // Get media IDs in the range
        const rangeIds = mediaIds.slice(start, end + 1);
        
        // Update the selected IDs to include the range
        // Create a new set to avoid duplicates
        const updatedSelectedIds = new Set(selectedIds);
        rangeIds.forEach(mediaId => updatedSelectedIds.add(mediaId));
        
        // Call the parent's onSelectId with each newly selected ID
        const newSelectedIds = Array.from(updatedSelectedIds);
        onSelectId(id); // Update with the new selection set
        setLastSelectedId(id);
        return;
      }
    }
    
    // Normal selection behavior - either replace or extend
    if (!extendSelection && selectedIds.length === 1 && !selectedIds.includes(id)) {
      // Replace selection when clicking a new item and only one is currently selected
      onSelectId(selectedIds[0]); // Deselect current
      onSelectId(id); // Select new
    } else if (selectedIds.length > 1 || extendSelection) {
      // Extend/toggle selection when multiple items are selected or shift is pressed
      onSelectId(id); // Toggle this ID
    } else {
      // Default toggle behavior
      onSelectId(id);
    }
    
    setLastSelectedId(id);
  };

  const handleSelectAll = () => {
    // Select all media
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  };

  const handleDeselectAll = () => {
    // Deselect all media
    selectedIds.forEach(id => onSelectId(id));
  };

  const toggleDates = () => {
    setShowDates(prev => !prev);
  };
  
  const handleDownloadSelected = (ids: string[]) => {
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
  };
  
  const handleOpenPreview = (id: string) => {
    setPreviewMediaId(id);
    if (onPreviewMedia) {
      onPreviewMedia(id);
    }
  };
  
  const handleClosePreview = () => {
    setPreviewMediaId(null);
  };
  
  const handleNavigatePreview = (direction: 'prev' | 'next') => {
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
      <div className="sticky top-0 z-10 p-2">
        <GallerySelectionBar 
          selectedIds={selectedIds}
          mediaIds={mediaIds}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          showDates={showDates}
          onToggleDates={toggleDates}
          viewMode={viewMode}
        />
        
        {selectedIds.length > 0 && (
          <MediaInfoPanel 
            selectedIds={selectedIds}
            onOpenPreview={handleOpenPreview}
            onDeleteSelected={onDeleteSelected}
            onDownloadSelected={handleDownloadSelected}
            mediaInfoMap={mediaInfoMap}
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
            onSelectId={handleSelectItem}
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

export default Gallery;
