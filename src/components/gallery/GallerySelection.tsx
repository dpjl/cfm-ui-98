import React, { useState } from 'react';

interface GallerySelectionProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
}

const GallerySelection: React.FC<GallerySelectionProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
}) => {
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const handleSelectItem = (id: string, extendSelection: boolean) => {
    console.log(`Selecting item: ${id}, extend: ${extendSelection}`);
    
    // If Shift key is used to extend selection
    if (extendSelection && lastSelectedId) {
      // Find indices
      const lastIndex = mediaIds.indexOf(lastSelectedId);
      const currentIndex = mediaIds.indexOf(id);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        // Define selection range
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        
        // Select all items in the range
        const idsToSelect = mediaIds.slice(start, end + 1);
        
        // Create a new selection set keeping already selected items
        const newSelection = new Set([...selectedIds]);
        
        // Add all items in the range
        idsToSelect.forEach(mediaId => {
          if (!newSelection.has(mediaId)) {
            newSelection.add(mediaId);
            onSelectId(mediaId); // Inform parent of each newly selected item
          }
        });
      }
    } 
    // If only one item is already selected and we click on another (without Shift)
    else if (selectedIds.length === 1 && !selectedIds.includes(id) && !extendSelection) {
      // Deselect the current item
      onSelectId(selectedIds[0]);
      // Select the new item
      onSelectId(id);
    }
    // If multiple items are already selected, or we click on an already selected item
    else {
      // Toggle the selection of this item
      onSelectId(id);
    }
    
    // Keep track of the last selected item for Shift functionality
    setLastSelectedId(id);
  };

  const handleSelectAll = () => {
    // Select all media
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  };

  const handleDeselectAll = () => {
    // Deselect all media
    selectedIds.forEach(id => onSelectId(id));
  };

  return {
    handleSelectItem,
    handleSelectAll,
    handleDeselectAll
  };
};

export default GallerySelection;
