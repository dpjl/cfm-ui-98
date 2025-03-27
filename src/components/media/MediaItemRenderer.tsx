
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

// Use React.memo to avoid unnecessary re-renders
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
              selected={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                onSelect(e.ctrlKey || e.metaKey);
              }}
              mediaId={item.id}
              loaded={true}
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
