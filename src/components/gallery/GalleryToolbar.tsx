
import React from 'react';
import GallerySelectionBar from './GallerySelectionBar';
import MediaInfoPanel from '../media/MediaInfoPanel';
import { DetailedMediaInfo } from '@/api/imageApi';

interface GalleryToolbarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
  viewMode: 'single' | 'split';
  onOpenPreview: (id: string) => void;
  onDeleteSelected: () => void;
  onDownloadSelected: (ids: string[]) => void;
  mediaInfoMap: Map<string, DetailedMediaInfo | null>;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  onDeselectAll,
  showDates,
  onToggleDates,
  viewMode,
  onOpenPreview,
  onDeleteSelected,
  onDownloadSelected,
  mediaInfoMap
}) => {
  return (
    <div className="sticky top-0 z-10 p-2">
      <GallerySelectionBar 
        selectedIds={selectedIds}
        mediaIds={mediaIds}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        showDates={showDates}
        onToggleDates={onToggleDates}
        viewMode={viewMode}
      />
      
      {selectedIds.length > 0 && (
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
