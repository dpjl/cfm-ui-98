
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

  return (
    <div className="flex flex-col h-full bg-card/90 backdrop-blur-sm w-full overflow-hidden">
      {/* Folder tree with proper scrolling */}
      <ScrollArea className="flex-1">
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
