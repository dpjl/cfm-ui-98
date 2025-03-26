
import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-breakpoint';

export const useGallerySelection = (
  mediaIds: string[],
  selectedIds: string[],
  onSelectId: (id: string) => void
) => {
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const isMobile = useIsMobile();

  // Clear selection mode when selection is empty
  useEffect(() => {
    if (selectedIds.length === 0) {
      setIsMultiSelectMode(false);
    } else if (selectedIds.length > 1) {
      setIsMultiSelectMode(true);
    }
  }, [selectedIds]);

  // Touch handlers for mobile
  const handleTouchStart = useCallback((id: string) => {
    // Start a timer for long press detection
    const timer = setTimeout(() => {
      setIsMultiSelectMode(true);
      // If item not already selected, select it
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    }, 500); // 500ms long press
    
    setLongPressTimer(timer);
  }, [selectedIds, onSelectId]);

  const handleTouchEnd = useCallback(() => {
    // Clear the timer if touch ends before long press is detected
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  // Handle regular click/tap selection
  const handleSelectItem = useCallback((id: string, extendSelection: boolean = false) => {
    // If this is a control-click or in multi-select mode
    if (extendSelection || isMultiSelectMode) {
      // Toggle selection of this item
      onSelectId(id);
      setLastSelectedId(id);
      return;
    }
    
    // Single-select mode - deselect other items first
    if (selectedIds.length === 1 && selectedIds[0] !== id) {
      // Deselect the current selection
      onSelectId(selectedIds[0]);
    } else if (selectedIds.length > 1) {
      // Deselect all selections first
      selectedIds.forEach(selectedId => {
        if (selectedId !== id) {
          onSelectId(selectedId);
        }
      });
    }
    
    // Toggle selection of the clicked item
    onSelectId(id);
    setLastSelectedId(id);
  }, [onSelectId, selectedIds, isMultiSelectMode]);
  
  const handleSelectAll = useCallback(() => {
    setIsMultiSelectMode(true);
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
    setIsMultiSelectMode(false);
  }, [selectedIds, onSelectId]);
  
  const isInMultiSelectMode = useCallback(() => {
    return isMultiSelectMode;
  }, [isMultiSelectMode]);

  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => !prev);
  }, []);
  
  return {
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    handleTouchStart,
    handleTouchEnd,
    isInMultiSelectMode,
    toggleMultiSelectMode
  };
};
