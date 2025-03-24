
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '@/api/imageApi';
import FolderTree from '@/components/FolderTree';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Folder, ImageIcon, Files, Copy, Fingerprint } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-breakpoint';

// Define our filter types
export type MediaFilter = 'all' | 'unique' | 'duplicates' | 'exclusive' | 'common';

interface AppSidebarProps {
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
  position?: 'left' | 'right';
  selectedFilter?: MediaFilter;
  onFilterChange?: (filter: MediaFilter) => void;
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
  onFilterChange = () => {}
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
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

  // For debugging purposes
  useEffect(() => {
    console.log(`${position} directory tree loaded:`, directoryTree);
  }, [directoryTree, position]);

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
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AppSidebar;
