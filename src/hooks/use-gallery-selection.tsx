
import { useState, useCallback } from 'react';

export const useGallerySelection = (
  mediaIds: string[],
  selectedIds: string[],
  onSelectId: (id: string) => void
) => {
  const handleSelectItem = useCallback((id: string, extendSelection: boolean = false) => {
    if (extendSelection) {
      // TODO: Implement extended selection with Shift key
      console.log('Extended selection not implemented yet');
    }
    
    onSelectId(id);
  }, [onSelectId]);
  
  const handleSelectAll = useCallback(() => {
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  }, [mediaIds, selectedIds, onSelectId]);
  
  const handleDeselectAll = useCallback(() => {
    selectedIds.forEach(id => {
      onSelectId(id);
    });
  }, [selectedIds, onSelectId]);
  
  return {
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll
  };
};
