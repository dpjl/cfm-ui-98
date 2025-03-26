
import React, { useState, useEffect } from 'react';
import GallerySelectionBar from '@/components/gallery/GallerySelectionBar';
import MediaInfoPanel from '@/components/media/MediaInfoPanel';
import { DetailedMediaInfo } from '@/api/imageApi';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryToolbarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
  viewMode?: 'single' | 'split';
  onOpenPreview: (id: string) => void;
  onDeleteSelected: () => void;
  onDownloadSelected: (ids: string[]) => void;
  mediaInfoMap: Map<string, DetailedMediaInfo | null>;
  position?: 'source' | 'destination';
  onToggleSidebar?: () => void;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  onDeselectAll,
  showDates,
  onToggleDates,
  viewMode = 'single',
  onOpenPreview,
  onDeleteSelected,
  onDownloadSelected,
  mediaInfoMap,
  position = 'source',
  onToggleSidebar
}) => {
  const isMobile = useIsMobile();
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  
  // Show the info panel only when exactly one item is selected
  useEffect(() => {
    setShowInfoPanel(selectedIds.length === 1);
  }, [selectedIds.length]);
  
  return (
    <div className="sticky top-0 z-10 space-y-2 p-2">
      {/* Selection toolbar */}
      <GallerySelectionBar
        selectedIds={selectedIds}
        mediaIds={mediaIds}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        showDates={showDates}
        onToggleDates={onToggleDates}
        viewMode={viewMode}
      />
      
      {/* Info panel - only visible when exactly one item is selected */}
      {showInfoPanel && (
        <MediaInfoPanel
          selectedIds={selectedIds}
          onOpenPreview={onOpenPreview}
          onDeleteSelected={onDeleteSelected}
          onDownloadSelected={onDownloadSelected}
          mediaInfoMap={mediaInfoMap}
        />
      )}
    </div>
  );
};

export default GalleryToolbar;
