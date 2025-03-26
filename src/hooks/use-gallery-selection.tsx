import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from './use-breakpoint';

/**
 * Custom hook to manage gallery selection with these behaviors:
 * - Single selection shows media info panel
 * - Multi-selection hides the panel and shows count
 * - Selecting a new item in single-select mode replaces the current selection
 * - Using modifier key (or long press on mobile) enables multi-selection
 */
export const useGallerySelection = (
  mediaIds: string[],
  selectedIds: string[],
  onSelectId: (id: string) => void
) => {
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  // Reset multi-select mode when selection is cleared
  useEffect(() => {
    if (selectedIds.length === 0) {
      setIsMultiSelectMode(false);
    }
  }, [selectedIds]);

  const handleSelectItem = useCallback((id: string, extendSelection: boolean = false) => {
    // If using modifier key or already in multi-select mode
    if (extendSelection || isMultiSelectMode) {
      // Enable multi-select mode
      setIsMultiSelectMode(true);
      
      // Toggle the selected state of this item
      onSelectId(id);
      
      // If Shift key is used and we have a previous selection
      if (extendSelection && lastSelectedId && !isMobile) {
        // Find indices
        const lastIndex = mediaIds.indexOf(lastSelectedId);
        const currentIndex = mediaIds.indexOf(id);
        
        if (lastIndex !== -1 && currentIndex !== -1) {
          // Define selection range
          const start = Math.min(lastIndex, currentIndex);
          const end = Math.max(lastIndex, currentIndex);
          
          // Select all items in the range
          for (let i = start; i <= end; i++) {
            const mediaId = mediaIds[i];
            if (!selectedIds.includes(mediaId)) {
              onSelectId(mediaId);
            }
          }
        }
      }
    } 
    // Single selection mode - deselect previous and select new
    else {
      // If we're selecting the same item that's already selected, just toggle it
      if (selectedIds.includes(id) && selectedIds.length === 1) {
        onSelectId(id);
        return;
      }
      
      // Deselect all currently selected items
      selectedIds.forEach(selectedId => {
        if (selectedId !== id) {
          onSelectId(selectedId);
        }
      });
      
      // If the clicked item isn't already selected, select it
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    }
    
    // Keep track of the last selected item for Shift functionality
    setLastSelectedId(id);
  }, [onSelectId, mediaIds, selectedIds, isMultiSelectMode, lastSelectedId, isMobile]);
  
  const handleSelectAll = useCallback(() => {
    setIsMultiSelectMode(true);
    
    // Select all media
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  }, [mediaIds, selectedIds, onSelectId]);
  
  const handleDeselectAll = useCallback(() => {
    // Deselect all media
    selectedIds.forEach(id => {
      onSelectId(id);
    });
    
    setIsMultiSelectMode(false);
  }, [selectedIds, onSelectId]);
  
  // Handle touch start for mobile long-press to multi-select
  const handleTouchStart = useCallback((id: string) => {
    if (isMobile) {
      // Start a timer to detect long press
      const timer = setTimeout(() => {
        setIsMultiSelectMode(true);
        // Vibrate if supported by the device
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }, 500); // 500ms is a good threshold for long press
      
      setLongPressTimer(timer);
    }
  }, [isMobile]);
  
  // Handle touch end to clear the timer
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);
  
  return {
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    handleTouchStart,
    handleTouchEnd,
    isMultiSelectMode,
    setIsMultiSelectMode
  };
};
