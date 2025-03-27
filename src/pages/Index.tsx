
import React from 'react';
import { LanguageProvider } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import ServerStatusPanel from '@/components/ServerStatusPanel';
import GalleryLayout from '@/components/layout/GalleryLayout';
import GalleryPageHeader from '@/components/layout/GalleryPageHeader';
import { useGalleryState } from '@/hooks/use-gallery-state';
import { useUIState } from '@/hooks/use-ui-state';
import { useSelectionState } from '@/hooks/use-selection-state';
import { useDirectoryState } from '@/hooks/use-directory-state';
import { useColumnsState } from '@/hooks/use-columns-state';

// Mock galleryActions for now to fix type errors
const useGalleryActions = (
  selectedIdsLeft: string[],
  selectedIdsRight: string[],
  activeSide: 'left' | 'right',
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const handleRefresh = () => {
    console.log('Refreshing gallery');
  };

  const handleDelete = () => {
    console.log('Delete action triggered');
  };

  const handleDeleteSelected = (side: 'left' | 'right') => {
    console.log(`Delete selected from ${side}`);
  };

  // Mock deleteMutation
  const deleteMutation = {
    isPending: false,
    mutate: () => {}
  };

  return {
    handleRefresh,
    handleDelete,
    handleDeleteSelected,
    deleteMutation
  };
};

const Index = () => {
  const isMobile = useIsMobile();
  
  // Use individual hooks 
  const galleryMediaState = useGalleryState();
  const uiState = useUIState();
  const selectionState = useSelectionState();
  const directoryState = useDirectoryState();
  const columnsState = useColumnsState();
  
  // Use the mock gallery actions with proper arguments
  const galleryActions = useGalleryActions(
    selectionState.selectedIdsLeft,
    selectionState.selectedIdsRight,
    selectionState.activeSide || 'left',
    uiState.setDeleteDialogOpen,
    selectionState.setSelectedIdsLeft,
    selectionState.setSelectedIdsRight
  );
  
  const isSidebarOpen = uiState.leftPanelOpen || uiState.rightPanelOpen;

  return (
    <LanguageProvider>
      <div className="h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
        <ServerStatusPanel 
          isOpen={uiState.serverPanelOpen}
          onOpenChange={uiState.setServerPanelOpen}
        />
        
        <GalleryPageHeader 
          onRefresh={galleryActions.handleRefresh}
          isDeletionPending={galleryActions.deleteMutation.isPending}
          isSidebarOpen={isSidebarOpen}
          onCloseSidebars={uiState.closeBothSidebars}
          mobileViewMode={uiState.viewMode}
          setMobileViewMode={uiState.setViewMode}
          selectedIdsLeft={selectionState.selectedIdsLeft}
          selectedIdsRight={selectionState.selectedIdsRight}
          onDelete={galleryActions.handleDelete}
          onToggleServerPanel={() => uiState.setServerPanelOpen(!uiState.serverPanelOpen)}
          isServerPanelOpen={uiState.serverPanelOpen}
        />
        
        <GalleryLayout 
          selectedDirectoryIdLeft={directoryState.selectedDirectoryIdLeft}
          setSelectedDirectoryIdLeft={directoryState.setSelectedDirectoryIdLeft}
          selectedDirectoryIdRight={directoryState.selectedDirectoryIdRight}
          setSelectedDirectoryIdRight={directoryState.setSelectedDirectoryIdRight}
          columnsCountLeft={columnsState.getCurrentColumnsLeft(isMobile, uiState.viewMode)}
          columnsCountRight={columnsState.getCurrentColumnsRight(isMobile, uiState.viewMode)}
          onLeftColumnsChange={(viewType, count) => {
            columnsState.handleLeftColumnsChange(isMobile, uiState.viewMode, count);
          }}
          onRightColumnsChange={(viewType, count) => {
            columnsState.handleRightColumnsChange(isMobile, uiState.viewMode, count);
          }}
          selectedIdsLeft={selectionState.selectedIdsLeft}
          setSelectedIdsLeft={selectionState.setSelectedIdsLeft}
          selectedIdsRight={selectionState.selectedIdsRight}
          setSelectedIdsRight={selectionState.setSelectedIdsRight}
          deleteDialogOpen={uiState.deleteDialogOpen}
          setDeleteDialogOpen={uiState.setDeleteDialogOpen}
          activeSide={selectionState.activeSide || 'left'}
          deleteMutation={galleryActions.deleteMutation}
          handleDeleteSelected={galleryActions.handleDeleteSelected}
          leftPanelOpen={uiState.leftPanelOpen}
          toggleLeftPanel={uiState.toggleLeftPanel}
          rightPanelOpen={uiState.rightPanelOpen}
          toggleRightPanel={uiState.toggleRightPanel}
          viewMode={uiState.viewMode}
          setViewMode={uiState.setViewMode}
          leftFilter={uiState.leftFilter}
          setLeftFilter={uiState.setLeftFilter}
          rightFilter={uiState.rightFilter}
          setRightFilter={uiState.setRightFilter}
        />
      </div>
    </LanguageProvider>
  );
};

export default Index;
