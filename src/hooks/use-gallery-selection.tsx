import { useState, useCallback, useRef } from 'react';

export type SelectionMode = 'single' | 'multiple';

interface UseGallerySelectionProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  initialSelectionMode?: SelectionMode;
}

export function useGallerySelection({
  mediaIds,
  selectedIds,
  onSelectId,
  initialSelectionMode = 'multiple'
}: UseGallerySelectionProps) {
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(initialSelectionMode);
  const processingRef = useRef(false);

  // Optimized with debouncing protection
  const handleSelectItem = useCallback((id: string, extendSelection: boolean) => {
    // Prevent double-processing during animations
    if (processingRef.current) return;
    processingRef.current = true;
    
    // Use requestAnimationFrame for better visual sync
    requestAnimationFrame(() => {
      try {
        // Single selection mode without extension
        if (selectionMode === 'single' && !extendSelection) {
          // If already selected, deselect
          if (selectedIds.includes(id)) {
            onSelectId(id);
          } 
          // Otherwise replace selection
          else {
            // First select the new item (to avoid empty selection flicker)
            if (!selectedIds.includes(id)) {
              onSelectId(id);
            }
            
            // Then deselect others
            selectedIds.forEach(selectedId => {
              if (selectedId !== id) {
                onSelectId(selectedId);
              }
            });
          }
        }
        // Multiple selection or extended selection
        else {
          // Shift selection for range
          if (extendSelection && lastSelectedId) {
            const lastIndex = mediaIds.indexOf(lastSelectedId);
            const currentIndex = mediaIds.indexOf(id);
            
            if (lastIndex !== -1 && currentIndex !== -1) {
              const start = Math.min(lastIndex, currentIndex);
              const end = Math.max(lastIndex, currentIndex);
              
              // Optimize range selection
              for (let i = start; i <= end; i++) {
                const mediaId = mediaIds[i];
                if (!selectedIds.includes(mediaId)) {
                  onSelectId(mediaId);
                }
              }
            }
          } 
          // Toggle single item
          else {
            onSelectId(id);
          }
        }
        
        // Store last selected ID for Shift functionality
        setLastSelectedId(id);
      } finally {
        // Always release lock
        processingRef.current = false;
      }
    });
  }, [mediaIds, selectedIds, onSelectId, selectionMode]);

  const handleSelectAll = useCallback(() => {
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  }, [mediaIds, selectedIds, onSelectId]);

  const handleDeselectAll = useCallback(() => {
    selectedIds.forEach(id => onSelectId(id));
  }, [selectedIds, onSelectId]);

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => prev === 'single' ? 'multiple' : 'single');
    
    // Simplify selection logic when switching modes
    if (selectionMode === 'multiple' && selectedIds.length > 1) {
      // Keep only the last selected item
      if (lastSelectedId && selectedIds.includes(lastSelectedId)) {
        selectedIds.forEach(id => {
          if (id !== lastSelectedId) {
            onSelectId(id);
          }
        });
      } 
      // Or deselect all but first if no last ID
      else if (selectedIds.length > 0) {
        const keepId = selectedIds[0];
        selectedIds.slice(1).forEach(id => onSelectId(id));
      }
    }
  }, [selectionMode, selectedIds, lastSelectedId, onSelectId]);

  return {
    selectionMode,
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    toggleSelectionMode
  };
}
