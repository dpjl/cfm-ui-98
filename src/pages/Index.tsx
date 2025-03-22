
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { LanguageProvider } from '@/hooks/use-language';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/AppSidebar';
import AppSidebarRight from '@/components/AppSidebarRight';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import GalleryHeader from '@/components/GalleryHeader';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteImages } from '@/api/imageApi';

// Define container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

const Index = () => {
  const { toast } = useToast();
  // State to track the currently selected directories
  const [selectedDirectoryIdLeft, setSelectedDirectoryIdLeft] = useState<string>("directory1");
  const [selectedDirectoryIdRight, setSelectedDirectoryIdRight] = useState<string>("directory1");
  
  // Shared state for the galleries
  const [columnsCount, setColumnsCount] = useState<number>(6);
  const [selectedIdsLeft, setSelectedIdsLeft] = useState<string[]>([]);
  const [selectedIdsRight, setSelectedIdsRight] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  
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

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <div className="flex h-screen w-full overflow-hidden">
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full"
          >
            {/* Left Sidebar */}
            <SidebarProvider defaultOpen={true}>
              <ResizablePanel 
                defaultSize={15} 
                minSize={5}
                maxSize={20}
                className="border-r border-border"
              >
                <AppSidebar
                  selectedDirectoryId={selectedDirectoryIdLeft}
                  onSelectDirectory={setSelectedDirectoryIdLeft}
                />
              </ResizablePanel>
            </SidebarProvider>

            {/* Resizable Handle */}
            <ResizableHandle withHandle />

            {/* Main Content Panel with Both Galleries */}
            <ResizablePanel defaultSize={70} className="overflow-hidden">
              <main className="relative overflow-auto h-full">
                {/* Common Header for Both Galleries */}
                <div className="p-6 pb-0">
                  <GalleryHeader 
                    title="CFM"
                    columnsCount={columnsCount}
                    setColumnsCount={setColumnsCount}
                    isLoading={false}
                    selectedImages={[...selectedIdsLeft, ...selectedIdsRight]}
                    onRefresh={handleRefresh}
                    onDeleteSelected={() => {
                      if (selectedIdsLeft.length > 0) {
                        handleDeleteSelected('left');
                      } else if (selectedIdsRight.length > 0) {
                        handleDeleteSelected('right');
                      }
                    }}
                    isDeletionPending={deleteMutation.isPending}
                  />
                </div>
                
                {/* Galleries Container */}
                <div className="flex h-[calc(100%-70px)]">
                  <ResizablePanelGroup direction="horizontal" className="w-full">
                    {/* Left Gallery */}
                    <ResizablePanel defaultSize={50} className="overflow-hidden">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="h-full"
                      >
                        <GalleryContainer 
                          title="Left Gallery" 
                          directory={selectedDirectoryIdLeft}
                          position="left"
                          columnsCount={columnsCount}
                          selectedIds={selectedIdsLeft}
                          setSelectedIds={setSelectedIdsLeft}
                          onDeleteSelected={() => handleDeleteSelected('left')}
                          deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
                          setDeleteDialogOpen={setDeleteDialogOpen}
                          deleteMutation={deleteMutation}
                          hideHeader={true}
                        />
                      </motion.div>
                    </ResizablePanel>

                    {/* Resizable Handle between galleries */}
                    <ResizableHandle withHandle />

                    {/* Right Gallery */}
                    <ResizablePanel defaultSize={50} className="overflow-hidden">
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="h-full"
                      >
                        <GalleryContainer 
                          title="Right Gallery" 
                          directory={selectedDirectoryIdRight}
                          position="right"
                          columnsCount={columnsCount}
                          selectedIds={selectedIdsRight}
                          setSelectedIds={setSelectedIdsRight}
                          onDeleteSelected={() => handleDeleteSelected('right')}
                          deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
                          setDeleteDialogOpen={setDeleteDialogOpen}
                          deleteMutation={deleteMutation}
                          hideHeader={true}
                        />
                      </motion.div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </div>
              </main>
            </ResizablePanel>

            {/* Resizable Handle */}
            <ResizableHandle withHandle />

            {/* Right Sidebar */}
            <SidebarProvider defaultOpen={true}>
              <ResizablePanel 
                defaultSize={15} 
                minSize={5}
                maxSize={20}
                className="border-l border-border"
              >
                <AppSidebarRight
                  selectedDirectoryId={selectedDirectoryIdRight}
                  onSelectDirectory={setSelectedDirectoryIdRight}
                />
              </ResizablePanel>
            </SidebarProvider>
          </ResizablePanelGroup>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
