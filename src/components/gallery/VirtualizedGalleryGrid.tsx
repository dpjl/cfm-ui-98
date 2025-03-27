
import React, { memo, useCallback, useRef, useState } from 'react';
import { FixedSizeGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
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

// Optimized grid with stable references and reduced rerenders
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
  
  // Optimize by memoizing selectedIds as a Set for O(1) lookups
  const selectedIdsSet = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  
  // Calculate gap between items
  const gap = 8; // 2rem converted to px
  
  // Throttled scroll handler - important for performance
  const handleScroll = useCallback(throttle(() => {
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 150);
  }, 100, { leading: true, trailing: false }), []);
  
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
        {/* Simplified media item representation */}
        <div 
          className={`cursor-pointer ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelectId(id, false)}
        >
          Media {id}
        </div>
      </div>
    );
  }, [mediaIds, selectedIdsSet, columnsCount, gap, onSelectId]);
  
  // Calculate rows needed - memoized to avoid recalculation
  const rowCount = React.useMemo(() => Math.ceil(mediaIds.length / columnsCount), [mediaIds.length, columnsCount]);
  
  return (
    <div className="w-full h-full p-2">
      <AutoSizer>
        {({ width, height }) => {
          // Calculate optimal item size based on available width
          const itemWidth = Math.floor((width - (gap * (columnsCount - 1))) / columnsCount);
          const itemHeight = itemWidth + (showDates ? 28 : 0);
          
          return (
            <FixedSizeGrid
              ref={gridRef}
              columnCount={columnsCount}
              columnWidth={itemWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={itemHeight}
              width={width}
              overscanRowCount={6} // Increased for smoother scrolling
              onScroll={handleScroll}
              style={{ overflowX: 'hidden' }}
              useIsScrolling={false} // Changed to false for better performance
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
