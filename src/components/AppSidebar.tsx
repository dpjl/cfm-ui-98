
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '@/api/imageApi';
import FolderTree from '@/components/FolderTree';
import { useLanguage } from '@/hooks/use-language';
import { Folder } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppSidebarProps {
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
  position?: 'left' | 'right';
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  selectedDirectoryId, 
  onSelectDirectory,
  position = 'left'
}) => {
  const { t } = useLanguage();
  
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

  const isLeftSide = position === 'left';

  return (
    <div className="flex flex-col h-full bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 w-full">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-border">
        {isLeftSide ? (
          <>
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4" />
              <span className="text-sm font-medium">
                {t('directories')}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {t('directories')}
              </span>
              <Folder className="h-4 w-4" />
            </div>
          </>
        )}
      </div>
      
      {/* Folder tree with proper scrolling */}
      <ScrollArea className="flex-1">
        <div className="p-2">
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
