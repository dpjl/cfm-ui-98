
import React from 'react';
import { LanguageProvider } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import ServerStatusPanel from '@/components/ServerStatusPanel';
import GalleryLayout from '@/components/layout/GalleryLayout';
import GalleryPageHeader from '@/components/layout/GalleryPageHeader';
import { useGalleryState } from '@/hooks/use-gallery-state';
import { useUiState } from '@/hooks/use-ui-state';
import { useSelectionState } from '@/hooks/use-selection-state';
import { useDirectoryState } from '@/hooks/use-directory-state';
import { useGalleryActions } from '@/hooks/use-gallery-actions';
import { useColumnsState } from '@/hooks/use-columns-state';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Use individual hooks instead of the combined galleryState
  const galleryMediaState = useGalleryState();
  const uiState = useUiState();
  const selectionState = useSelectionState();
  const directoryState = useDirectoryState();
  const galleryActions = useGalleryActions();
  const columnsState = useColumnsState();
  
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
          columnsCountLeft={columnsState.getCurrentColumnsLeft(isMobile)}
          columnsCountRight={columnsState.getCurrentColumnsRight(isMobile)}
          onLeftColumnsChange={(viewType, count) => {
            columnsState.handleLeftColumnsChange(isMobile, count);
          }}
          onRightColumnsChange={(viewType, count) => {
            columnsState.handleRightColumnsChange(isMobile, count);
          }}
          selectedIdsLeft={selectionState.selectedIdsLeft}
          setSelectedIdsLeft={selectionState.setSelectedIdsLeft}
          selectedIdsRight={selectionState.selectedIdsRight}
          setSelectedIdsRight={selectionState.setSelectedIdsRight}
          deleteDialogOpen={uiState.deleteDialogOpen}
          setDeleteDialogOpen={uiState.setDeleteDialogOpen}
          activeSide={uiState.activeSide}
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
