
import React, { useState } from 'react';
import { getMediaUrl, DetailedMediaInfo } from '@/api/imageApi';
import { useToast } from '@/components/ui/use-toast';

interface GalleryMediaHandlerProps {
  selectedIds: string[];
  position?: 'source' | 'destination';
}

const GalleryMediaHandler: React.FC<GalleryMediaHandlerProps> = ({
  selectedIds,
  position = 'source'
}) => {
  const { toast } = useToast();

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
    
    // For multiple files, display a notification
    toast({
      title: "Multiple files download",
      description: `Downloading ${ids.length} files is not supported yet. Please select one file at a time.`,
    });
  };

  return {
    handleDownloadSelected
  };
};

export default GalleryMediaHandler;
