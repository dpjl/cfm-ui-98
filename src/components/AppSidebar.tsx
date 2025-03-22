
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDirectoryTree } from '@/api/imageApi';
import FolderTree from '@/components/FolderTree';
import { useLanguage } from '@/hooks/use-language';
import { useSidebar } from '@/components/ui/sidebar';
import { Folder } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppSidebarProps {
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  selectedDirectoryId, 
  onSelectDirectory 
}) => {
  const { t } = useLanguage();
  const { state } = useSidebar();
  
  // Fetch directory tree data
  const { 
    data: directoryTree = [], 
    isLoading 
  } = useQuery({
    queryKey: ['directoryTree'],
    queryFn: fetchDirectoryTree
  });

  // For debugging purposes
  useEffect(() => {
    console.log('Directory tree loaded:', directoryTree);
    console.log('Sidebar state:', state);
  }, [directoryTree, state]);

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-r border-border">
      <SidebarRail />
      <SidebarHeader className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          <span className={`font-medium transition-opacity duration-200 ${state === 'collapsed' ? 'opacity-0' : 'opacity-100'}`}>
            {t('directories')}
          </span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('folderStructure')}</SidebarGroupLabel>
          <ScrollArea className="h-[calc(100vh-130px)] p-2">
            {isLoading ? (
              <div className="flex flex-col gap-2 p-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-6 bg-muted rounded-md animate-pulse" 
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
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
