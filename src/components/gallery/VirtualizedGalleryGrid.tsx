
import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { FixedSizeGrid, VariableSizeGrid } from 'react-window';
import LazyMediaItem from '@/components/LazyMediaItem';
import { DetailedMediaInfo } from '@/api/imageApi';
import { useIsMobile } from '@/hooks/use-breakpoint';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualizedGalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string, extendSelection: boolean) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo) => void;
  position: 'source' | 'destination';
}

const VirtualizedGalleryGrid = memo(({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount = 5,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo,
  position = 'source'
}: VirtualizedGalleryGridProps) => {
  const isMobile = useIsMobile();
  const gridRef = useRef<FixedSizeGrid>(null);
  
  // Calculate dimensions
  const [containerSize, setContainerSize] = useState({ width: 1, height: 1 });
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Calculate optimal item size
  const gap = 8; // 2rem converted to px (matches the gap-2 class)
  const itemWidth = Math.floor((containerSize.width - (gap * (columnsCount - 1))) / columnsCount);
  const itemHeight = itemWidth + (showDates ? 40 : 0); // Add space for date display if needed
  
  // Calculate rows needed
  const rowCount = Math.ceil(mediaIds.length / columnsCount);

  // This function is called when scrolling stops to trigger loading of visible cells
  const handleScrollEnd = useCallback(() => {
    // Manually trigger a resize event which forces react-window to recalculate visible items
    window.dispatchEvent(new Event('resize'));
  }, []);
  
  // Reset scroll position when columns or data changes
  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTo({ scrollTop: 0, scrollLeft: 0 });
    }
  }, [columnsCount, mediaIds]);

  // For proper rendering after scroll jumps
  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (gridRef.current) {
          // Force Grid to re-evaluate which cells to render
          gridRef.current.forceUpdate();
        }
      });
    };

    // Add an event listener for scroll events in the parent container
    const parentElement = parentRef.current;
    if (parentElement) {
      parentElement.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      if (parentElement) {
        parentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  // Render each cell of the grid
  const Cell = ({ columnIndex, rowIndex, style }: { columnIndex: number; rowIndex: number; style: React.CSSProperties }) => {
    const index = rowIndex * columnsCount + columnIndex;
    if (index >= mediaIds.length) return null;
    
    const id = mediaIds[index];
    const isSelected = selectedIds.includes(id);
    
    // Apply gap spacing to the style
    const adjustedStyle = {
      ...style,
      left: `${parseFloat(style.left as string) + (columnIndex * gap)}px`,
      top: `${parseFloat(style.top as string) + (rowIndex * gap)}px`,
      width: `${parseFloat(style.width as string) - gap}px`,
      height: `${parseFloat(style.height as string) - gap}px`,
      padding: 0,
    };
    
    return (
      <div style={adjustedStyle}>
        <LazyMediaItem
          key={id}
          id={id}
          selected={isSelected}
          onSelect={onSelectId}
          index={index}
          showDates={showDates}
          updateMediaInfo={updateMediaInfo}
          position={position}
        />
      </div>
    );
  };

  // Memoize Cell component to prevent unnecessary rerenders
  const MemoizedCell = React.memo(Cell, (prevProps, nextProps) => {
    // Only re-render if the item is actually different or selection state changed
    const prevIndex = prevProps.rowIndex * columnsCount + prevProps.columnIndex;
    const nextIndex = nextProps.rowIndex * columnsCount + nextProps.columnIndex;
    
    if (prevIndex >= mediaIds.length || nextIndex >= mediaIds.length) {
      return prevIndex === nextIndex;
    }
    
    const prevId = mediaIds[prevIndex];
    const nextId = mediaIds[nextIndex];
    const prevSelected = selectedIds.includes(prevId);
    const nextSelected = selectedIds.includes(nextId);
    
    return (
      prevId === nextId && 
      prevSelected === nextSelected &&
      prevProps.style.top === nextProps.style.top &&
      prevProps.style.left === nextProps.style.left
    );
  });
  
  return (
    <div ref={parentRef} className="w-full h-full p-2 overflow-auto">
      <AutoSizer>
        {({ height, width }) => {
          // Update container size
          if (width !== containerSize.width || height !== containerSize.height) {
            setContainerSize({ width, height });
          }
          
          return (
            width > 1 && height > 1 && (
              <FixedSizeGrid
                ref={gridRef}
                columnCount={columnsCount}
                columnWidth={itemWidth}
                height={height}
                rowCount={rowCount}
                rowHeight={itemHeight}
                width={width}
                itemData={mediaIds}
                overscanRowCount={5} // Increased from 2 to 5 for better scrolling
                onScroll={({ scrollUpdateWasRequested }) => {
                  // If not a programmatic scroll update, trigger handleScrollEnd
                  if (!scrollUpdateWasRequested) {
                    handleScrollEnd();
                  }
                }}
                className="scrollbar-thin" // Ensure scrollbar is visible
              >
                {MemoizedCell}
              </FixedSizeGrid>
            )
          );
        }}
      </AutoSizer>
    </div>
  );
});

// Set display name for debugging
VirtualizedGalleryGrid.displayName = 'VirtualizedGalleryGrid';

export default VirtualizedGalleryGrid;
