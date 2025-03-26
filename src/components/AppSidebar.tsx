import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '@/api/imageApi';
import FolderTree from '@/components/FolderTree';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Folder, ImageIcon, Files, Copy, Fingerprint, Columns } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Separator } from '@/components/ui/separator';
import ColumnSlider from '@/components/sidebar/ColumnSlider';
import { useColumnsCount } from '@/hooks/use-columns-count';
import { MobileViewMode } from '@/types/gallery';

// Define our filter types
export type MediaFilter = 'all' | 'unique' | 'duplicates' | 'exclusive' | 'common';

interface AppSidebarProps {
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
  position?: 'left' | 'right';
  selectedFilter?: MediaFilter;
  onFilterChange?: (filter: MediaFilter) => void;
  mobileViewMode?: MobileViewMode;
  onColumnsChange?: (viewMode: 'desktop' | 'mobile-split' | 'mobile-single', count: number) => void;
}

interface FilterOption {
  id: MediaFilter;
  label: string;
  icon: React.ReactNode;
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
  
  // Filter options with simpler labels
  const filterOptions: FilterOption[] = [
    { 
      id: 'all', 
      label: 'All Media',
      icon: <Folder className="h-3 w-3" />
    },
    { 
      id: 'unique', 
      label: 'No Duplicates',
      icon: <ImageIcon className="h-3 w-3" />
    },
    { 
      id: 'duplicates', 
      label: 'Duplicates',
      icon: <Copy className="h-3 w-3" />
    },
    { 
      id: 'exclusive', 
      label: 'Unique to Gallery',
      icon: <Fingerprint className="h-3 w-3" />
    },
    { 
      id: 'common', 
      label: 'In Both Galleries',
      icon: <Files className="h-3 w-3" />
    }
  ];
  
  // Fetch directory tree data with position=left or right
  const { 
    data: directoryTree = [], 
    isLoading 
  } = useQuery({
    queryKey: [`directoryTree${position === 'left' ? 'Left' : 'Right'}`],
    queryFn: () => fetchDirectoryTree(position)
  });

  // When column counts change, notify parent component
  useEffect(() => {
    if (!onColumnsChange) return;
    
    const updateColumns = (viewMode: 'desktop' | 'mobile-split' | 'mobile-single') => {
      onColumnsChange(viewMode, columnSettings.getColumnCount(viewMode));
    };
    
    // Update all view modes
    updateColumns('desktop');
    updateColumns('mobile-split');
    updateColumns('mobile-single');
  }, [
    columnSettings.desktopColumns, 
    columnSettings.mobileSplitColumns, 
    columnSettings.mobileSingleColumns,
    onColumnsChange
  ]);

  const handleFilterChange = (filter: MediaFilter) => {
    onFilterChange(filter);
  };

  return (
    <div className="flex flex-col h-full bg-card/90 backdrop-blur-sm w-full overflow-hidden">
      {/* Filters at the top */}
      <div className="p-3 border-b">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {filterOptions.map((option) => (
            <Badge
              key={option.id}
              variant={selectedFilter === option.id ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors py-1 px-2", 
                selectedFilter === option.id 
                  ? "bg-primary hover:bg-primary/90" 
                  : "hover:bg-primary/10 hover:text-primary-foreground"
              )}
              onClick={() => handleFilterChange(option.id)}
            >
              <span className="flex items-center gap-1">
                {option.icon}
                <span className={isMobile ? "text-[10px]" : "text-xs"}>
                  {option.label}
                </span>
              </span>
            </Badge>
          ))}
        </div>
        
        {/* Column count sliders */}
        <div className="mt-3 space-y-2">
          <ColumnSlider 
            position={position}
            value={columnSettings.desktopColumns}
            onChange={columnSettings.updateDesktopColumns}
            min={2}
            max={10}
            label={t('desktop_columns')}
            viewType="desktop"
          />
          
          <ColumnSlider 
            position={position}
            value={columnSettings.mobileSplitColumns}
            onChange={columnSettings.updateMobileSplitColumns}
            min={1}
            max={4}
            label={t('split_columns')}
            viewType="mobile-split"
            currentMobileViewMode={mobileViewMode}
          />
          
          <ColumnSlider 
            position={position}
            value={columnSettings.mobileSingleColumns}
            onChange={columnSettings.updateMobileSingleColumns}
            min={2}
            max={6}
            label={t('single_columns')}
            viewType="mobile-single"
            currentMobileViewMode={mobileViewMode}
          />
        </div>
      </div>
      
      {/* Folder tree */}
      <ScrollArea className="flex-1 h-[calc(100%-52px)]">
        <div className="p-3">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div 
                  key={index} 
                  className="h-4 bg-muted rounded-md animate-pulse" 
                />
              ))}
            </div>
          ) : (
            <FolderTree 
              directories={directoryTree}
              selectedDirectoryId={selectedDirectoryId}
              onSelectDirectory={onSelectDirectory}
              position={position}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AppSidebar;
