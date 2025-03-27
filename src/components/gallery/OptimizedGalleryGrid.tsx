
import React, { useCallback, useMemo } from 'react';
import { useColumnCount } from '../../hooks/use-columns-count';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VariableSizeGrid as Grid } from 'react-window';
import { MediaItem } from '../../types/gallery';
import { GallerySkeletonGrid } from './GallerySkeletons';
import MediaItemRenderer from '../media/MediaItemRenderer';

interface OptimizedGalleryGridProps {
  media: MediaItem[];
  isLoading: boolean;
  selectedIds: Set<string>;
  onSelectItem: (id: string, multiSelect?: boolean) => void;
  onPreview: (id: string) => void;
}

// Memoize individual cell renderers to prevent unnecessary re-renders
const MemoizedCell = React.memo(
  ({ data, rowIndex, columnIndex, style }: any) => {
    const { media, columns, onSelectItem, onPreview, selectedIds } = data;
    const index = rowIndex * columns + columnIndex;
    
    if (index >= media.length) return null;
    
    const item = media[index];
    
    return (
      <div style={style}>
        <MediaItemRenderer
          item={item}
          isSelected={selectedIds.has(item.id)}
          onSelect={(multiSelect) => onSelectItem(item.id, multiSelect)}
          onPreview={() => onPreview(item.id)}
        />
      </div>
    );
  },
  (prevProps, nextProps) => {
    const prevData = prevProps.data;
    const nextData = nextProps.data;
    const prevIndex = prevProps.rowIndex * prevData.columns + prevProps.columnIndex;
    const nextIndex = nextProps.rowIndex * nextData.columns + nextProps.columnIndex;
    
    // If the indexes are out of bounds, optimize by returning early
    if (prevIndex >= prevData.media.length && nextIndex >= nextData.media.length) return true;
    if (prevIndex >= prevData.media.length || nextIndex >= nextData.media.length) return false;
    
    const prevItem = prevData.media[prevIndex];
    const nextItem = nextData.media[nextIndex];
    
    // Compare relevant props
    return (
      prevItem?.id === nextItem?.id &&
      prevData.selectedIds.has(prevItem?.id) === nextData.selectedIds.has(nextItem?.id) &&
      prevProps.style.top === nextProps.style.top &&
      prevProps.style.left === nextProps.style.left
    );
  }
);

const OptimizedGalleryGrid = ({
  media,
  isLoading,
  selectedIds,
  onSelectItem,
  onPreview,
}: OptimizedGalleryGridProps) => {
  const columns = useColumnCount();
  
  // Memoize this calculation to prevent recreating the grid during scrolling
  const rowCount = useMemo(() => {
    return Math.ceil(media.length / columns);
  }, [media.length, columns]);

  // Use a consistent item height to prevent recalculation
  const itemHeight = 220;
  
  // Memoize the grid item data to prevent recreating objects during scrolling
  const itemData = useMemo(
    () => ({
      media,
      columns,
      onSelectItem,
      onPreview,
      selectedIds,
    }),
    [media, columns, onSelectItem, onPreview, selectedIds]
  );

  // Memoize these callbacks to prevent recreating functions during scrolling
  const getColumnWidth = useCallback(() => {
    return 100 / columns + '%';
  }, [columns]);

  const getRowHeight = useCallback(() => {
    return itemHeight;
  }, []);

  if (isLoading) {
    return <GallerySkeletonGrid columns={columns} />;
  }

  return (
    <div className="h-full w-full">
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            className="gallery-grid"
            columnCount={columns}
            columnWidth={() => width / columns}
            height={height}
            rowCount={rowCount}
            rowHeight={getRowHeight}
            width={width}
            itemData={itemData}
            overscanRowCount={2}
            useIsScrolling={false}
          >
            {MemoizedCell}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(OptimizedGalleryGrid);
