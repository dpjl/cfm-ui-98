import React, { useState } from 'react';
import { LanguageProvider } from '@/hooks/use-language';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteImages } from '@/api/imageApi';
import AppSidebar, { MediaFilter } from '@/components/AppSidebar';
import SidePanel from '@/components/layout/SidePanel';
import GalleriesContainer from '@/components/layout/GalleriesContainer';
import PageHeader from '@/components/layout/PageHeader';
import ServerStatusPanel from '@/components/ServerStatusPanel';
import { MobileViewMode } from '@/types/gallery';

const Index = () => {
  const { toast } = useToast();
  const [selectedDirectoryIdLeft, setSelectedDirectoryIdLeft] = useState<string>("directory1");
  const [selectedDirectoryIdRight, setSelectedDirectoryIdRight] = useState<string>("directory1");
  
  const [columnsCount, setColumnsCount] = useState<number>(5);
  const [selectedIdsLeft, setSelectedIdsLeft] = useState<string[]>([]);
  const [selectedIdsRight, setSelectedIdsRight] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [mobileViewMode, setMobileViewMode] = useState<MobileViewMode>('both');
  const [leftFilter, setLeftFilter] = useState<MediaFilter>('all');
  const [rightFilter, setRightFilter] = useState<MediaFilter>('all');
  
  const queryClient = useQueryClient();
  
  const deleteMutation = useMutation({
    mutationFn: deleteImages,
    onSuccess: () => {
      const activeSelectedIds = activeSide === 'left' ? selectedIdsLeft : selectedIdsRight;
      toast({
        title: `${activeSelectedIds.length} ${activeSelectedIds.length === 1 ? 'media' : 'media files'} deleted`,
        description: "The selected media files have been removed successfully.",
      });
      
      if (activeSide === 'left') {
        setSelectedIdsLeft([]);
      } else {
        setSelectedIdsRight([]);
      }
      setDeleteDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['mediaIds'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting media files",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
    }
  });
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing media",
      description: "Fetching the latest media files..."
    });
    queryClient.invalidateQueries({ queryKey: ['mediaIds'] });
  };
  
  const handleDeleteSelected = (side: 'left' | 'right') => {
    setActiveSide(side);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (selectedIdsLeft.length > 0) {
      handleDeleteSelected('left');
    } else if (selectedIdsRight.length > 0) {
      handleDeleteSelected('right');
    }
  };

  const closeBothSidebars = () => {
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  };

  const isSidebarOpen = leftPanelOpen || rightPanelOpen;

  return (
    <LanguageProvider>
      <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
        <ServerStatusPanel />
        
        <div className="flex h-full overflow-hidden mt-2 relative">
          <SidePanel 
            position="left" 
            isOpen={leftPanelOpen} 
            onOpenChange={setLeftPanelOpen}
            title="Source"
          >
            <AppSidebar
              selectedDirectoryId={selectedDirectoryIdLeft}
              onSelectDirectory={setSelectedDirectoryIdLeft}
              position="left"
              selectedFilter={leftFilter}
              onFilterChange={setLeftFilter}
            />
          </SidePanel>

          <div className="flex-1 flex flex-col overflow-hidden">
            <PageHeader 
              columnsCount={columnsCount}
              setColumnsCount={setColumnsCount}
              selectedIdsLeft={selectedIdsLeft}
              selectedIdsRight={selectedIdsRight}
              onRefresh={handleRefresh}
              onDelete={handleDelete}
              isDeletionPending={deleteMutation.isPending}
              isSidebarOpen={isSidebarOpen}
              onCloseSidebars={closeBothSidebars}
              mobileViewMode={mobileViewMode}
              setMobileViewMode={setMobileViewMode}
            />
            
            <GalleriesContainer 
              columnsCount={columnsCount}
              selectedIdsLeft={selectedIdsLeft}
              setSelectedIdsLeft={setSelectedIdsLeft}
              selectedIdsRight={selectedIdsRight}
              setSelectedIdsRight={setSelectedIdsRight}
              selectedDirectoryIdLeft={selectedDirectoryIdLeft}
              selectedDirectoryIdRight={selectedDirectoryIdRight}
              deleteDialogOpen={deleteDialogOpen}
              setDeleteDialogOpen={setDeleteDialogOpen}
              activeSide={activeSide}
              deleteMutation={deleteMutation}
              handleDeleteSelected={handleDeleteSelected}
              mobileViewMode={mobileViewMode}
              setMobileViewMode={setMobileViewMode}
              leftFilter={leftFilter}
              rightFilter={rightFilter}
            />
          </div>

          <SidePanel 
            position="right" 
            isOpen={rightPanelOpen} 
            onOpenChange={setRightPanelOpen}
            title="Destination"
          >
            <AppSidebar
              selectedDirectoryId={selectedDirectoryIdRight}
              onSelectDirectory={setSelectedDirectoryIdRight}
              position="right"
              selectedFilter={rightFilter}
              onFilterChange={setRightFilter}
            />
          </SidePanel>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
