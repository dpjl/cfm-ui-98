
import React from 'react';
import { MediaItem } from '../../types/gallery';
import LazyMediaItem from '../LazyMediaItem';
import SelectionCheckbox from './SelectionCheckbox';

interface MediaItemRendererProps {
  item: MediaItem;
  isSelected: boolean;
  onSelect: (multiSelect?: boolean) => void;
  onPreview: () => void;
}

// Utiliser React.memo pour éviter les re-rendus inutiles
const MediaItemRenderer = React.memo(
  ({ item, isSelected, onSelect, onPreview }: MediaItemRendererProps) => {
    const handleClick = (e: React.MouseEvent) => {
      if (e.ctrlKey || e.metaKey) {
        onSelect(true);
      } else {
        onPreview();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onPreview();
        e.preventDefault();
      }
    };

    return (
      <div
        className={`media-item-container p-1 relative ${isSelected ? 'selected' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
      >
        <div className="media-item-wrapper relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-200 hover:shadow-md">
          <LazyMediaItem
            mediaId={item.id}
            alt={item.alt || 'Media item'}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute top-2 right-2">
            <SelectionCheckbox
              isSelected={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.ctrlKey || e.metaKey);
              }}
              id={`select-${item.id}`}
            />
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these props change
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.isSelected === nextProps.isSelected
    );
  }
);

export default MediaItemRenderer;
