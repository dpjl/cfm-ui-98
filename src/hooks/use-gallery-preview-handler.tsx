
import { useState, useCallback } from 'react';

export const useGalleryPreviewHandler = (
  mediaIds: string[],
  onPreviewMedia?: (id: string) => void
) => {
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  
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
    
    const currentIndex = mediaIds.findIndex(id => id === previewMediaId);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % mediaIds.length;
    } else {
      newIndex = (currentIndex - 1 + mediaIds.length) % mediaIds.length;
    }
    
    const newId = mediaIds[newIndex];
    setPreviewMediaId(newId);
    if (onPreviewMedia) {
      onPreviewMedia(newId);
    }
  }, [previewMediaId, mediaIds, onPreviewMedia]);
  
  return {
    previewMediaId,
    handleOpenPreview,
    handleClosePreview,
    handleNavigatePreview
  };
};
