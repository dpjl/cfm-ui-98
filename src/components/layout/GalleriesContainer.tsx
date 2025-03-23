
import React from 'react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import MobileGalleriesView from './MobileGalleriesView';
import DesktopGalleriesView from './DesktopGalleriesView';
import { MobileViewMode } from '@/types/gallery';

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
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
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
  mobileViewMode = 'both',
  setMobileViewMode
}) => {
  const isMobile = useIsMobile();
  
  // Mobile view
  if (isMobile) {
    return (
      <MobileGalleriesView
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
      />
    );
  }

  // Desktop view with split screen
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
    />
  );
};

export default GalleriesContainer;
