
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '@/api/imageApi';
import FolderTree from '@/components/FolderTree';
import { useLanguage } from '@/hooks/use-language';
import { useSidebar } from '@/components/ui/sidebar';
import { Folder } from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppSidebarRightProps {
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
}

const AppSidebarRight: React.FC<AppSidebarRightProps> = ({ 
  selectedDirectoryId, 
  onSelectDirectory 
}) => {
  const { t } = useLanguage();
  const { state, toggleSidebar } = useSidebar();
  
  // Fetch directory tree data with position=right
  const { 
    data: directoryTree = [], 
    isLoading 
  } = useQuery({
    queryKey: ['directoryTreeRight'],
    queryFn: () => fetchDirectoryTree('right')
  });

  // For debugging purposes
  useEffect(() => {
    console.log('Right directory tree loaded:', directoryTree);
    console.log('Right sidebar state:', state);
  }, [directoryTree, state]);

  const isCollapsed = state === 'collapsed';

  return (
    <div className={`flex flex-col h-full bg-slate-900/40 dark:bg-slate-900/60 backdrop-blur-sm transition-all duration-300 ${isCollapsed ? 'w-[3rem]' : 'w-full'}`}>
      {/* Header with toggles */}
      <div className="flex justify-between items-center p-3 border-b border-border">
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-muted"
        >
          <svg 
            width="15" 
            height="15" 
            viewBox="0 0 15 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}
          >
            <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            {t('directories')}
          </span>
          <Folder className="h-4 w-4" />
        </div>
      </div>
      
      {/* Theme and language toggles - only show when expanded */}
      {!isCollapsed && (
        <div className="flex items-center justify-between p-3 border-b border-border">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      )}
      
      {/* Folder tree with proper scrolling - only show when expanded */}
      {!isCollapsed ? (
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
      ) : (
        <div className="flex-1 flex justify-center p-2 mt-4">
          <Folder className="h-5 w-5 text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default AppSidebarRight;
