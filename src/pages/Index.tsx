
import React, { useState } from 'react';
import { LanguageProvider } from '@/hooks/use-language';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteImages } from '@/api/imageApi';
import AppSidebar from '@/components/AppSidebar';
import HoverSidebar from '@/components/layout/HoverSidebar';
import GalleriesContainer from '@/components/layout/GalleriesContainer';
import PageHeader from '@/components/layout/PageHeader';
import ServerStatusPanel from '@/components/ServerStatusPanel';

const Index = () => {
  const { toast } = useToast();
  // State to track the currently selected directories
  const [selectedDirectoryIdLeft, setSelectedDirectoryIdLeft] = useState<string>("directory1");
  const [selectedDirectoryIdRight, setSelectedDirectoryIdRight] = useState<string>("directory1");
  
  // Shared state for the galleries
  const [columnsCount, setColumnsCount] = useState<number>(5);
  const [selectedIdsLeft, setSelectedIdsLeft] = useState<string[]>([]);
  const [selectedIdsRight, setSelectedIdsRight] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [hoveringLeft, setHoveringLeft] = useState(false);
  const [hoveringRight, setHoveringRight] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Mutation for deleting images
  const deleteMutation = useMutation({
    mutationFn: deleteImages,
    onSuccess: () => {
      // Show success message
      const activeSelectedIds = activeSide === 'left' ? selectedIdsLeft : selectedIdsRight;
      toast({
        title: `${activeSelectedIds.length} ${activeSelectedIds.length === 1 ? 'media' : 'media files'} deleted`,
        description: "The selected media files have been removed successfully.",
      });
      
      // Reset selected images and close the dialog
      if (activeSide === 'left') {
        setSelectedIdsLeft([]);
      } else {
        setSelectedIdsRight([]);
      }
      setDeleteDialogOpen(false);
      
      // Refetch the image list to reflect the changes
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

  // Function to close both sidebars
  const closeBothSidebars = () => {
    setHoveringLeft(false);
    setHoveringRight(false);
  };

  // Check if any sidebar is open
  const isSidebarOpen = hoveringLeft || hoveringRight;

  return (
    <LanguageProvider>
      <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
        {/* Server status panel at the top */}
        <ServerStatusPanel />
        
        {/* Main layout container */}
        <div className="flex h-full overflow-hidden mt-9 relative">
          {/* Left Sidebar with hover functionality */}
          <HoverSidebar 
            position="left" 
            isHovering={hoveringLeft} 
            onHoverChange={setHoveringLeft}
          >
            <AppSidebar
              selectedDirectoryId={selectedDirectoryIdLeft}
              onSelectDirectory={setSelectedDirectoryIdLeft}
              position="left"
            />
          </HoverSidebar>

          {/* Main content area with header and galleries */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header for both galleries */}
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
            />
            
            {/* Galleries container - fixed 50/50 split */}
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
            />
          </div>

          {/* Right Sidebar with hover functionality */}
          <HoverSidebar 
            position="right" 
            isHovering={hoveringRight} 
            onHoverChange={setHoveringRight}
          >
            <AppSidebar
              selectedDirectoryId={selectedDirectoryIdRight}
              onSelectDirectory={setSelectedDirectoryIdRight}
              position="right"
            />
          </HoverSidebar>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
