
import React, { useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Separator } from '@/components/ui/separator';
import { useColumnsCount } from '@/hooks/use-columns-count';
import { MobileViewMode } from '@/types/gallery';
import FilterOptions from '@/components/sidebar/FilterOptions';
import ColumnSliders from '@/components/sidebar/ColumnSliders';
import FolderTreeSection from '@/components/sidebar/FolderTreeSection';

// Define our filter types
export type MediaFilter = 'all' | 'unique' | 'duplicates' | 'exclusive' | 'common';

interface AppSidebarProps {
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
  position?: 'left' | 'right';
  selectedFilter?: MediaFilter;
  onFilterChange?: (filter: MediaFilter) => void;
  mobileViewMode?: MobileViewMode;
  onColumnsChange?: (viewMode: string, count: number) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  selectedDirectoryId, 
  onSelectDirectory,
  position = 'left',
  selectedFilter = 'all',
  onFilterChange = () => {},
  mobileViewMode = 'both',
  onColumnsChange
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const columnSettings = useColumnsCount(position);
  
  // Force synchronize columns settings with parent component on mount and when values change
  useEffect(() => {
    if (!onColumnsChange) return;
    
    // Update for the current view mode
    const updateCurrentColumns = () => {
      const viewModeType = getViewModeType();
      const columnCount = columnSettings.getColumnCount(viewModeType);
      console.log(`Updating ${position} columns for ${viewModeType} to ${columnCount}`);
      onColumnsChange(viewModeType, columnCount);
    };
    
    // Initial update
    updateCurrentColumns();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnSettings.desktopColumns, 
    columnSettings.desktopSingleColumns,
    columnSettings.mobileSplitColumns, 
    columnSettings.mobileSingleColumns,
    onColumnsChange,
    mobileViewMode,
    isMobile
  ]);

  // Determine the current view mode type based on device and layout
  const getViewModeType = (): string => {
    if (isMobile) {
      return mobileViewMode === 'both' ? 'mobile-split' : 'mobile-single';
    } else {
      return mobileViewMode === 'both' ? 'desktop' : 'desktop-single';
    }
  };

  return (
    <div className="flex flex-col h-full bg-card/90 backdrop-blur-sm w-full overflow-hidden">
      {/* Filters and Column Sliders section */}
      <div className="p-3 border-b">
        {/* Filter Options */}
        <FilterOptions
          selectedFilter={selectedFilter}
          onFilterChange={onFilterChange}
        />
        
        {/* Column count sliders */}
        <div className="mt-3">
          <ColumnSliders
            position={position}
            columnSettings={columnSettings}
            mobileViewMode={mobileViewMode}
            onColumnsChange={onColumnsChange}
          />
        </div>
      </div>
      
      {/* Folder tree section */}
      <FolderTreeSection
        selectedDirectoryId={selectedDirectoryId}
        onSelectDirectory={onSelectDirectory}
        position={position}
      />
    </div>
  );
};

export default AppSidebar;
