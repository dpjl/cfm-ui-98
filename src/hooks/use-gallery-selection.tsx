import { useState, useCallback } from 'react';

export type SelectionMode = 'single' | 'multiple';

export interface UseGallerySelectionProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  onSelectionChange?: (ids: string[]) => void;
}

export const useGallerySelection = ({
  mediaIds,
  selectedIds,
  onSelectId,
  onSelectionChange
}: UseGallerySelectionProps) => {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('single');
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  
  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => prev === 'single' ? 'multiple' : 'single');
    
    if (selectionMode === 'multiple' && selectedIds.length > 1) {
      const toDeselect = [...selectedIds];
      if (lastSelectedId && selectedIds.includes(lastSelectedId)) {
        const lastIndex = toDeselect.indexOf(lastSelectedId);
        toDeselect.splice(lastIndex, 1);
      } else {
        toDeselect.pop();
      }
      
      toDeselect.forEach(id => {
        onSelectId(id);
      });
    }
  }, [selectionMode, selectedIds, lastSelectedId, onSelectId]);

  const handleSelectItem = useCallback((id: string, extendSelection: boolean = false) => {
    setLastSelectedId(id);
    
    if (selectionMode === 'single') {
      selectedIds.forEach(selectedId => {
        if (selectedId !== id) {
          onSelectId(selectedId);
        }
      });
      
      onSelectId(id);
    } else {
      if (extendSelection && lastSelectedId) {
        const lastIndex = mediaIds.indexOf(lastSelectedId);
        const currentIndex = mediaIds.indexOf(id);
        
        if (lastIndex !== -1 && currentIndex !== -1) {
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);
          
          const idsInRange = mediaIds.slice(start, end + 1);
          
          idsInRange.forEach(rangeId => {
            if (!selectedIds.includes(rangeId)) {
              onSelectId(rangeId);
            }
          });
        }
      } else {
        onSelectId(id);
      }
    }
    
    if (onSelectionChange) {
      let newSelection: string[];
      
      if (selectionMode === 'single') {
        newSelection = selectedIds.includes(id) ? [] : [id];
      } else {
        if (selectedIds.includes(id)) {
          newSelection = selectedIds.filter(selectedId => selectedId !== id);
        } else {
          newSelection = [...selectedIds, id];
        }
      }
      
      onSelectionChange(newSelection);
    }
  }, [selectionMode, mediaIds, selectedIds, lastSelectedId, onSelectId, onSelectionChange]);
  
  const handleSelectAll = useCallback(() => {
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
    
    if (mediaIds.length > 1 && selectionMode === 'single') {
      setSelectionMode('multiple');
    }
    
    if (onSelectionChange) {
      onSelectionChange([...mediaIds]);
    }
  }, [mediaIds, selectedIds, onSelectId, onSelectionChange, selectionMode]);
  
  const handleDeselectAll = useCallback(() => {
    selectedIds.forEach(id => {
      onSelectId(id);
    });
    
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [selectedIds, onSelectId, onSelectionChange]);
  
  return {
    selectionMode,
    toggleSelectionMode,
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll
  };
};
