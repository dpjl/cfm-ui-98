
import React, { memo, useEffect, useState, useRef, useCallback } from 'react';
import { FixedSizeGrid, FixedSizeGridProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import LazyMediaItem from '@/components/LazyMediaItem';
import { DetailedMediaInfo } from '@/api/imageApi';
import { useIsMobile } from '@/hooks/use-breakpoint';
import throttle from 'lodash/throttle';

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
  const [isScrolling, setIsScrolling] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Optimize by memoizing selectedIds as a Set for O(1) lookups
  const selectedIdsSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  
  // Calculate gap between items
  const gap = 8; // 2rem converted to px (matches the gap-2 class)
  
  // Forced rerender after window resize to adjust grid
  useEffect(() => {
    const handleResize = throttle(() => {
      setForceUpdate(prev => prev + 1);
    }, 200);
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Reset scroll position when data changes
  useEffect(() => {
    if (gridRef.current) {
      // Only reset if the dataset changes completely
      if (mediaIds.length === 0) {
        gridRef.current.scrollTo({ scrollTop: 0, scrollLeft: 0 });
      }
    }
  }, [mediaIds.length === 0]);

  // Handle scroll state using throttle to avoid excessive rerenders
  const handleScroll = useCallback(throttle(() => {
    setIsScrolling(true);
    
    // Release the scrolling state after a delay
    setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, 100), []);
  
  // Memoize the cell renderer to prevent unnecessary rerenders
  const Cell = useCallback(({ columnIndex, rowIndex, style }: { 
    columnIndex: number; rowIndex: number; style: React.CSSProperties 
  }) => {
    const index = rowIndex * columnsCount + columnIndex;
    if (index >= mediaIds.length) return null;
    
    const id = mediaIds[index];
    const isSelected = selectedIdsSet.has(id);
    
    // Apply gap spacing to the style without modifying the original style object
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
          isScrolling={isScrolling}
        />
      </div>
    );
  }, [mediaIds, selectedIdsSet, columnsCount, gap, showDates, updateMediaInfo, position, onSelectId, isScrolling]);
  
  // Calculate rows needed - memoized to avoid recalculation
  const rowCount = React.useMemo(() => Math.ceil(mediaIds.length / columnsCount), [mediaIds.length, columnsCount]);
  
  const handleItemsRendered = useCallback(({ 
    overscanRowStartIndex, 
    overscanRowStopIndex
  }: {
    overscanRowStartIndex: number, 
    overscanRowStopIndex: number
  }) => {
    // We can use this to trigger loading if needed
    console.log(`Rendering rows ${overscanRowStartIndex} to ${overscanRowStopIndex}`);
  }, []);
  
  return (
    <div className="w-full h-full p-2">
      <AutoSizer>
        {({ width, height }) => {
          // Calculate optimal item size based on available width
          const itemWidth = Math.floor((width - (gap * (columnsCount - 1))) / columnsCount);
          const itemHeight = itemWidth + (showDates ? 28 : 0); // Add space for date display if needed
          
          return (
            <FixedSizeGrid
              ref={gridRef}
              columnCount={columnsCount}
              columnWidth={itemWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={itemHeight}
              width={width}
              overscanRowCount={4} // Increase overscan for smoother scrolling
              onScroll={handleScroll}
              onItemsRendered={handleItemsRendered}
              useIsScrolling={true} // Pass scrolling state to cells
              style={{ overflowX: 'hidden' }} // Prevents horizontal scrollbar
            >
              {Cell}
            </FixedSizeGrid>
          );
        }}
      </AutoSizer>
    </div>
  );
});

// Set display name for debugging
VirtualizedGalleryGrid.displayName = 'VirtualizedGalleryGrid';

export default VirtualizedGalleryGrid;
