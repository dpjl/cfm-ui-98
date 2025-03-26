import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-breakpoint';

export const useGallerySelection = (
  mediaIds: string[],
  selectedIds: string[],
  onSelectId: (id: string) => void
) => {
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  
  // Helper to check if we're in multi-select mode
  const checkMultiSelectMode = (event?: React.MouseEvent | React.TouchEvent) => {
    if (isMobile) {
      return isMultiSelectMode;
    } else {
      // On desktop, check if Ctrl key is pressed
      return event && 'ctrlKey' in event && event.ctrlKey;
    }
  };
  
  // Clear any existing selections when leaving multi-select mode
  useEffect(() => {
    if (!isMultiSelectMode && selectedIds.length > 1) {
      // Keep only the last selected item when exiting multi-select mode
      if (lastSelectedId && selectedIds.includes(lastSelectedId)) {
        selectedIds.forEach(id => {
          if (id !== lastSelectedId) {
            onSelectId(id);
          }
        });
      } else {
        // If last selected is not in the selection, deselect all
        handleDeselectAll();
      }
    }
  }, [isMultiSelectMode]);
  
  // Handle touch start for long press detection (mobile only)
  const handleTouchStart = useCallback((id: string) => {
    if (!isMobile) return;
    
    // Setup long press timer
    const timer = setTimeout(() => {
      setIsMultiSelectMode(true);
      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms long press to activate multi-select
    
    setLongPressTimer(timer);
  }, [isMobile]);
  
  // Handle touch end to clear timer
  const handleTouchEnd = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);
  
  const handleSelectItem = useCallback((id: string, extendSelection: boolean = false, event?: React.MouseEvent | React.TouchEvent) => {
    const isMultiSelect = extendSelection || checkMultiSelectMode(event);
    
    // If not in multi-select mode and we already have selections
    if (!isMultiSelect && selectedIds.length > 0) {
      // If clicking on an already selected item, do nothing
      if (selectedIds.includes(id) && selectedIds.length === 1) {
        return;
      }
      
      // If clicking on a different item, deselect all and select the new one
      selectedIds.forEach(selectedId => {
        if (selectedId !== id) {
          onSelectId(selectedId);
        }
      });
      
      // If the item wasn't already selected, select it
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    } 
    // For multi-select or first selection
    else {
      // Toggle the selection of this item
      onSelectId(id);
    }
    
    // Keep track of the last selected item
    setLastSelectedId(id);
  }, [selectedIds, onSelectId, checkMultiSelectMode]);
  
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
    selectedIds.forEach(id => onSelectId(id));
    setLastSelectedId(null);
    
    // If in multi-select mode, exit it
    if (isMultiSelectMode) {
      setIsMultiSelectMode(false);
    }
  }, [selectedIds, onSelectId, isMultiSelectMode]);
  
  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode(prev => !prev);
  }, []);
  
  return {
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll,
    handleTouchStart,
    handleTouchEnd,
    isMultiSelectMode,
    toggleMultiSelectMode
  };
};
