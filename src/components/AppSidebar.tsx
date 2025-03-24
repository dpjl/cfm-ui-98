
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '@/api/imageApi';
import FolderTree from '@/components/FolderTree';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Check, Filter, Folder, ImageOff } from 'lucide-react';
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
  description: string;
  icon?: React.ReactNode;
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
  const [activeTab, setActiveTab] = useState<string>('folders');
  
  // Filter options with clearer terminology
  const filterOptions: FilterOption[] = [
    { 
      id: 'all', 
      label: 'All Media', 
      description: 'Show all available media',
      icon: <Folder className="h-4 w-4" />
    },
    { 
      id: 'unique', 
      label: 'No Duplicates', 
      description: 'Show media that appears only once in this gallery',
      icon: <ImageOff className="h-4 w-4" />
    },
    { 
      id: 'duplicates', 
      label: 'Has Duplicates', 
      description: 'Show media that appears multiple times in this gallery',
      icon: <Filter className="h-4 w-4" />
    },
    { 
      id: 'exclusive', 
      label: 'Exclusive', 
      description: 'Show media that appears only in this gallery, not in the other',
      icon: <Filter className="h-4 w-4" />
    },
    { 
      id: 'common', 
      label: 'Common', 
      description: 'Show media that appears in both galleries',
      icon: <Filter className="h-4 w-4" />
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
      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-2 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="folders" className="flex-1">
              Folders
            </TabsTrigger>
            <TabsTrigger value="filters" className="flex-1">
              Filters
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Folders tab content */}
        <TabsContent value="folders" className="flex-1 h-[calc(100%-40px)]">
          <ScrollArea className="flex-1 h-full">
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
        </TabsContent>
        
        {/* Filters tab content */}
        <TabsContent value="filters" className="flex-1 h-[calc(100%-40px)]">
          <ScrollArea className="flex-1 h-full">
            <div className="p-3 space-y-2">
              <div className="text-sm font-medium mb-1">Media Filters</div>
              
              {/* Filter options */}
              <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1"} gap-2`}>
                {filterOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={selectedFilter === option.id ? "default" : "outline"}
                    className={cn(
                      "w-full justify-start gap-2 h-auto py-2", 
                      selectedFilter === option.id ? "bg-primary/10" : ""
                    )}
                    onClick={() => handleFilterChange(option.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {option.icon}
                        <span>{option.label}</span>
                      </div>
                      {selectedFilter === option.id && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 pl-6">
                      {option.description}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppSidebar;
