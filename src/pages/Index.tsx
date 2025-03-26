import React, { useState, useEffect } from 'react';
import { LanguageProvider } from '@/hooks/use-language';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteImages } from '@/api/imageApi';
import AppSidebar, { MediaFilter } from '@/components/AppSidebar';
import SidePanel from '@/components/layout/SidePanel';
import GalleriesContainer from '@/components/layout/GalleriesContainer';
import PageHeader from '@/components/layout/PageHeader';
import ServerStatusPanel from '@/components/ServerStatusPanel';
import { MobileViewMode, ViewModeType } from '@/types/gallery';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { useLocalStorage } from '@/hooks/use-local-storage';

const Index = () => {
  const { toast } = useToast();
  const [selectedDirectoryIdLeft, setSelectedDirectoryIdLeft] = useState<string>("directory1");
  const [selectedDirectoryIdRight, setSelectedDirectoryIdRight] = useState<string>("directory1");
  
  const isMobile = useIsMobile();
  
  // Column counts for different modes, stored in local storage
  const [desktopColumnsLeft, setDesktopColumnsLeft] = useLocalStorage('desktop-split-columns-left', 5);
  const [desktopColumnsRight, setDesktopColumnsRight] = useLocalStorage('desktop-split-columns-right', 5);
  const [desktopSingleColumnsLeft, setDesktopSingleColumnsLeft] = useLocalStorage('desktop-single-columns-left', 6);
  const [desktopSingleColumnsRight, setDesktopSingleColumnsRight] = useLocalStorage('desktop-single-columns-right', 6);
  const [mobileSplitColumnsLeft, setMobileSplitColumnsLeft] = useLocalStorage('mobile-split-columns-left', 2);
  const [mobileSplitColumnsRight, setMobileSplitColumnsRight] = useLocalStorage('mobile-split-columns-right', 2);
  const [mobileSingleColumnsLeft, setMobileSingleColumnsLeft] = useLocalStorage('mobile-single-columns-left', 4);
  const [mobileSingleColumnsRight, setMobileSingleColumnsRight] = useLocalStorage('mobile-single-columns-right', 4);
  
  const [selectedIdsLeft, setSelectedIdsLeft] = useState<string[]>([]);
  const [selectedIdsRight, setSelectedIdsRight] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<MobileViewMode>('both');
  const [leftFilter, setLeftFilter] = useState<MediaFilter>('all');
  const [rightFilter, setRightFilter] = useState<MediaFilter>('all');
  const [serverPanelOpen, setServerPanelOpen] = useState(false);
  
  const queryClient = useQueryClient();
  
  // Get current column count based on view mode and device
  const getCurrentColumnsLeft = (): number => {
    if (isMobile) {
      return viewMode === 'both' ? mobileSplitColumnsLeft : mobileSingleColumnsLeft;
    }
    return viewMode === 'both' ? desktopColumnsLeft : desktopSingleColumnsLeft;
  };
  
  const getCurrentColumnsRight = (): number => {
    if (isMobile) {
      return viewMode === 'both' ? mobileSplitColumnsRight : mobileSingleColumnsRight;
    }
    return viewMode === 'both' ? desktopColumnsRight : desktopSingleColumnsRight;
  };
  
  // Update column count for the specific view mode
  const handleLeftColumnsChange = (count: number) => {
    if (isMobile) {
      if (viewMode === 'both') {
        setMobileSplitColumnsLeft(count);
      } else {
        setMobileSingleColumnsLeft(count);
      }
    } else {
      if (viewMode === 'both') {
        setDesktopColumnsLeft(count);
      } else {
        setDesktopSingleColumnsLeft(count);
      }
    }
  };
  
  const handleRightColumnsChange = (count: number) => {
    if (isMobile) {
      if (viewMode === 'both') {
        setMobileSplitColumnsRight(count);
      } else {
        setMobileSingleColumnsRight(count);
      }
    } else {
      if (viewMode === 'both') {
        setDesktopColumnsRight(count);
      } else {
        setDesktopSingleColumnsRight(count);
      }
    }
  };
  
  // Map view mode to column configuration type
  const getViewModeType = (position: 'left' | 'right', currentViewMode: MobileViewMode): ViewModeType => {
    if (isMobile) {
      return currentViewMode === 'both' ? 'mobile-split' : 'mobile-single';
    } else {
      return currentViewMode === 'both' ? 'desktop' : 'desktop-single';
    }
  };
  
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

  const toggleLeftPanel = () => {
    setLeftPanelOpen(prev => !prev);
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(prev => !prev);
  };

  const closeBothSidebars = () => {
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  };

  const isSidebarOpen = leftPanelOpen || rightPanelOpen;

  return (
    <LanguageProvider>
      <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
        <ServerStatusPanel 
          isOpen={serverPanelOpen}
          onOpenChange={setServerPanelOpen}
        />
        
        <PageHeader 
          onRefresh={handleRefresh}
          isDeletionPending={deleteMutation.isPending}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebars={closeBothSidebars}
          mobileViewMode={viewMode}
          setMobileViewMode={setViewMode}
          selectedIdsLeft={selectedIdsLeft}
          selectedIdsRight={selectedIdsRight}
          onDelete={handleDelete}
          onToggleServerPanel={() => setServerPanelOpen(!serverPanelOpen)}
          isServerPanelOpen={serverPanelOpen}
        />
        
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
              mobileViewMode={viewMode}
              onColumnsChange={(viewType, count) => {
                const viewModeType = viewType as ViewModeType;
                if (viewModeType === 'desktop') {
                  setDesktopColumnsLeft(count);
                } else if (viewModeType === 'desktop-single') {
                  setDesktopSingleColumnsLeft(count);
                } else if (viewModeType === 'mobile-split') {
                  setMobileSplitColumnsLeft(count);
                } else if (viewModeType === 'mobile-single') {
                  setMobileSingleColumnsLeft(count);
                }
              }}
            />
          </SidePanel>

          <div className="flex-1 flex flex-col overflow-hidden">
            <GalleriesContainer 
              columnsCountLeft={getCurrentColumnsLeft()}
              columnsCountRight={getCurrentColumnsRight()}
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
              mobileViewMode={viewMode}
              setMobileViewMode={setViewMode}
              leftFilter={leftFilter}
              rightFilter={rightFilter}
              onToggleLeftPanel={toggleLeftPanel}
              onToggleRightPanel={toggleRightPanel}
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
              mobileViewMode={viewMode}
              onColumnsChange={(viewType, count) => {
                const viewModeType = viewType as ViewModeType;
                if (viewModeType === 'desktop') {
                  setDesktopColumnsRight(count);
                } else if (viewModeType === 'desktop-single') {
                  setDesktopSingleColumnsRight(count);
                } else if (viewModeType === 'mobile-split') {
                  setMobileSplitColumnsRight(count);
                } else if (viewModeType === 'mobile-single') {
                  setMobileSingleColumnsRight(count);
                }
              }}
            />
          </SidePanel>
        </div>
      </div>
    </LanguageProvider>
  );
};

export default Index;
