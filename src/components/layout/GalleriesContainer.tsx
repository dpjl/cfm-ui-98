
import React from 'react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import MobileGalleriesView from './MobileGalleriesView';
import DesktopGalleriesView from './DesktopGalleriesView';
import { MediaFilter } from '@/components/AppSidebar';

interface GalleriesContainerProps {
  columnsCount: number;
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
  leftFilter?: MediaFilter;
  rightFilter?: MediaFilter;
}

const GalleriesContainer: React.FC<GalleriesContainerProps> = ({
  columnsCount,
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
  leftFilter = 'all',
  rightFilter = 'all'
}) => {
  const isMobile = useIsMobile();
  
  // Mobile view
  if (isMobile) {
    return (
      <MobileGalleriesView
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

  // Desktop view
  return (
    <DesktopGalleriesView
      columnsCount={columnsCount}
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
};

export default GalleriesContainer;
