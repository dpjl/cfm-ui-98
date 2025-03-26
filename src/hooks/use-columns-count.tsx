
import { useState, useEffect } from 'react';

// Define types for different view modes
type ViewMode = 'desktop' | 'mobile-split' | 'mobile-single';
type SidePosition = 'left' | 'right';

// Default column counts for different modes
const DEFAULT_COLUMN_COUNTS = {
  'desktop-left': 5,
  'desktop-right': 5,
  'mobile-split-left': 2,
  'mobile-split-right': 2,
  'mobile-single-left': 4,
  'mobile-single-right': 4,
};

// Hook to manage column counts with localStorage persistence
export function useColumnsCount(position: SidePosition) {
  // Initialize states for each view mode
  const [desktopColumns, setDesktopColumns] = useState<number>(DEFAULT_COLUMN_COUNTS[`desktop-${position}`]);
  const [mobileSplitColumns, setMobileSplitColumns] = useState<number>(DEFAULT_COLUMN_COUNTS[`mobile-split-${position}`]);
  const [mobileSingleColumns, setMobileSingleColumns] = useState<number>(DEFAULT_COLUMN_COUNTS[`mobile-single-${position}`]);

  // Load saved values from localStorage on component mount
  useEffect(() => {
    const savedDesktopColumns = localStorage.getItem(`columns-desktop-${position}`);
    const savedMobileSplitColumns = localStorage.getItem(`columns-mobile-split-${position}`);
    const savedMobileSingleColumns = localStorage.getItem(`columns-mobile-single-${position}`);

    if (savedDesktopColumns) setDesktopColumns(Number(savedDesktopColumns));
    if (savedMobileSplitColumns) setMobileSplitColumns(Number(savedMobileSplitColumns));
    if (savedMobileSingleColumns) setMobileSingleColumns(Number(savedMobileSingleColumns));
  }, [position]);

  // Save to localStorage whenever values change
  const updateDesktopColumns = (value: number) => {
    setDesktopColumns(value);
    localStorage.setItem(`columns-desktop-${position}`, value.toString());
  };

  const updateMobileSplitColumns = (value: number) => {
    setMobileSplitColumns(value);
    localStorage.setItem(`columns-mobile-split-${position}`, value.toString());
  };

  const updateMobileSingleColumns = (value: number) => {
    setMobileSingleColumns(value);
    localStorage.setItem(`columns-mobile-single-${position}`, value.toString());
  };

  // Get the column count based on the current view mode
  const getColumnCount = (viewMode: ViewMode): number => {
    switch (viewMode) {
      case 'desktop':
        return desktopColumns;
      case 'mobile-split':
        return mobileSplitColumns;
      case 'mobile-single':
        return mobileSingleColumns;
      default:
        return desktopColumns;
    }
  };

  return {
    desktopColumns,
    mobileSplitColumns,
    mobileSingleColumns,
    updateDesktopColumns,
    updateMobileSplitColumns,
    updateMobileSingleColumns,
    getColumnCount,
  };
}
