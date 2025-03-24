
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GallerySkeletons from './gallery/GallerySkeletons';
import GallerySelectionBar from './gallery/GallerySelectionBar';
import MediaInfoPanel from './media/MediaInfoPanel';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { getMediaUrl } from '@/api/imageApi';
import { useToast } from '@/components/ui/use-toast';

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
  columnsClassName?: string;
  onPreviewMedia?: (id: string) => void;
  viewMode?: 'single' | 'split';
  onDeleteSelected: () => void;
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading = false,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  onPreviewMedia,
  viewMode = 'single',
  onDeleteSelected
}) => {
  const [mounted, setMounted] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === mediaIds.length) {
      // Deselect all media
      selectedIds.forEach(id => onSelectId(id));
    } else {
      // Select all unselected media
      mediaIds.forEach(id => {
        if (!selectedIds.includes(id)) {
          onSelectId(id);
        }
      });
    }
  };

  const toggleDates = () => {
    setShowDates(prev => !prev);
  };
  
  const handleDownloadSelected = (ids: string[]) => {
    if (ids.length === 0) return;
    
    // For a single file, trigger direct download
    if (ids.length === 1) {
      const a = document.createElement('a');
      a.href = getMediaUrl(ids[0]);
      a.download = `media-${ids[0]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    
    // For multiple files, show a notification (actual batch download would require server-side implementation)
    toast({
      title: "Multiple files download",
      description: `Downloading ${ids.length} files is not supported yet. Please select one file at a time.`,
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mt-2">
          <GallerySkeletons columnsClassName={columnsClassName} />
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
          showDates={showDates}
          onToggleDates={toggleDates}
        />
        
        {selectedIds.length > 0 && (
          <MediaInfoPanel 
            selectedIds={selectedIds}
            onOpenPreview={(id) => onPreviewMedia ? onPreviewMedia(id) : null}
            onDeleteSelected={onDeleteSelected}
            onDownloadSelected={handleDownloadSelected}
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
            columnsClassName={columnsClassName}
            viewMode={viewMode}
            showDates={showDates}
          />
        </div>
      )}
    </div>
  );
};

export default Gallery;
