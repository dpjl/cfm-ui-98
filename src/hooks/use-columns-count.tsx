
import { useState, useEffect } from 'react';
import { ViewModeType } from '@/types/gallery';

// Define types for different view modes
type SidePosition = 'left' | 'right';

// Default column counts for different modes
const DEFAULT_COLUMN_COUNTS = {
  'desktop': 5,              // Split view desktop
  'desktop-single': 6,       // Full screen view desktop
  'mobile-split': 2,         // Split view mobile
  'mobile-single': 4,        // Full screen view mobile
};

// Hook to manage column counts with localStorage persistence
export function useColumnsCount(position: SidePosition) {
  // Initialize states for each view mode with localStorage values or defaults
  const [desktopColumns, setDesktopColumns] = useState<number>(
    Number(localStorage.getItem(`columns-desktop-${position}`)) || DEFAULT_COLUMN_COUNTS.desktop
  );
  const [desktopSingleColumns, setDesktopSingleColumns] = useState<number>(
    Number(localStorage.getItem(`columns-desktop-single-${position}`)) || DEFAULT_COLUMN_COUNTS['desktop-single']
  );
  const [mobileSplitColumns, setMobileSplitColumns] = useState<number>(
    Number(localStorage.getItem(`columns-mobile-split-${position}`)) || DEFAULT_COLUMN_COUNTS['mobile-split']
  );
  const [mobileSingleColumns, setMobileSingleColumns] = useState<number>(
    Number(localStorage.getItem(`columns-mobile-single-${position}`)) || DEFAULT_COLUMN_COUNTS['mobile-single']
  );

  // Save to localStorage whenever values change
  const updateDesktopColumns = (value: number) => {
    setDesktopColumns(value);
    localStorage.setItem(`columns-desktop-${position}`, value.toString());
  };

  const updateDesktopSingleColumns = (value: number) => {
    setDesktopSingleColumns(value);
    localStorage.setItem(`columns-desktop-single-${position}`, value.toString());
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
  const getColumnCount = (viewMode: ViewModeType | string): number => {
    switch (viewMode) {
      case 'desktop':
        return desktopColumns;
      case 'desktop-single':
        return desktopSingleColumns;
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
    desktopSingleColumns,
    mobileSplitColumns,
    mobileSingleColumns,
    updateDesktopColumns,
    updateDesktopSingleColumns,
    updateMobileSplitColumns,
    updateMobileSingleColumns,
    getColumnCount,
  };
}
