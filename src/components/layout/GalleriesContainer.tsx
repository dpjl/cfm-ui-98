
import React from 'react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import MobileGalleriesView from './MobileGalleriesView';
import DesktopGalleriesView from './DesktopGalleriesView';
import { MobileViewMode } from '@/types/gallery';
import { MediaFilter } from '@/components/AppSidebar';

interface GalleriesContainerProps {
  columnsCountLeft: number;
  columnsCountRight: number;
  selectedIdsLeft: string[];
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIdsRight: string[];
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDirectoryIdLeft: string;
  selectedDirectoryIdRight: string;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSide: 'left' | 'right';
  deleteMutation: any;
  handleDeleteSelected: (side: 'left' | 'right') => void;
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  leftFilter?: MediaFilter;
  rightFilter?: MediaFilter;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
}

const GalleriesContainer: React.FC<GalleriesContainerProps> = ({
  columnsCountLeft,
  columnsCountRight,
  selectedIdsLeft,
  setSelectedIdsLeft,
  selectedIdsRight,
  setSelectedIdsRight,
  selectedDirectoryIdLeft,
  selectedDirectoryIdRight,
  deleteDialogOpen,
  setDeleteDialogOpen,
  activeSide,
  deleteMutation,
  handleDeleteSelected,
  mobileViewMode = 'both',
  setMobileViewMode,
  leftFilter = 'all',
  rightFilter = 'all',
  onToggleLeftPanel,
  onToggleRightPanel
}) => {
  const isMobile = useIsMobile();
  
  // Mobile view
  if (isMobile) {
    return (
      <MobileGalleriesView
        columnsCountLeft={columnsCountLeft}
        columnsCountRight={columnsCountRight}
        mobileViewMode={mobileViewMode}
        setMobileViewMode={setMobileViewMode!}
        selectedDirectoryIdLeft={selectedDirectoryIdLeft}
        selectedDirectoryIdRight={selectedDirectoryIdRight}
        selectedIdsLeft={selectedIdsLeft}
        setSelectedIdsLeft={setSelectedIdsLeft}
        selectedIdsRight={selectedIdsRight}
        setSelectedIdsRight={setSelectedIdsRight}
        handleDeleteSelected={handleDeleteSelected}
        deleteDialogOpen={deleteDialogOpen}
        activeSide={activeSide}
        setDeleteDialogOpen={setDeleteDialogOpen}
        deleteMutation={deleteMutation}
        leftFilter={leftFilter}
        rightFilter={rightFilter}
      />
    );
  }

  // Desktop view - now supports multiple view modes
  return (
    <DesktopGalleriesView
      columnsCountLeft={columnsCountLeft}
      columnsCountRight={columnsCountRight}
      selectedDirectoryIdLeft={selectedDirectoryIdLeft}
      selectedDirectoryIdRight={selectedDirectoryIdRight}
      selectedIdsLeft={selectedIdsLeft}
      setSelectedIdsLeft={setSelectedIdsLeft}
      selectedIdsRight={selectedIdsRight}
      setSelectedIdsRight={setSelectedIdsRight}
      handleDeleteSelected={handleDeleteSelected}
      deleteDialogOpen={deleteDialogOpen}
      activeSide={activeSide}
      setDeleteDialogOpen={setDeleteDialogOpen}
      deleteMutation={deleteMutation}
      leftFilter={leftFilter}
      rightFilter={rightFilter}
      viewMode={mobileViewMode}
      setViewMode={setMobileViewMode}
      onToggleLeftPanel={onToggleLeftPanel}
      onToggleRightPanel={onToggleRightPanel}
    />
  );
};

export default GalleriesContainer;
