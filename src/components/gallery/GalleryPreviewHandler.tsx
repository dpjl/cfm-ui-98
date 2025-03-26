
import React, { useState } from 'react';

interface GalleryPreviewHandlerProps {
  mediaIds: string[];
  onPreviewMedia?: (id: string) => void;
}

const GalleryPreviewHandler: React.FC<GalleryPreviewHandlerProps> = ({
  mediaIds,
  onPreviewMedia
}) => {
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);

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

  return {
    previewMediaId,
    handleOpenPreview,
    handleClosePreview,
    handleNavigatePreview
  };
};

export default GalleryPreviewHandler;
