
import React from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MobileViewMode } from '@/types/gallery';
import MobileViewSwitcher from './MobileViewSwitcher';

interface MobileGalleriesViewProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  selectedDirectoryIdLeft: string;
  selectedDirectoryIdRight: string;
  selectedIdsLeft: string[];
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIdsRight: string[];
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteSelected: (side: 'left' | 'right') => void;
  deleteDialogOpen: boolean;
  activeSide: 'left' | 'right';
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteMutation: any;
}

const MobileGalleriesView: React.FC<MobileGalleriesViewProps> = ({
  mobileViewMode,
  setMobileViewMode,
  selectedDirectoryIdLeft,
  selectedDirectoryIdRight,
  selectedIdsLeft,
  setSelectedIdsLeft,
  selectedIdsRight,
  setSelectedIdsRight,
  handleDeleteSelected,
  deleteDialogOpen,
  activeSide,
  setDeleteDialogOpen,
  deleteMutation
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      {/* Side-by-side galleries in 'both' mode */}
      {mobileViewMode === 'both' && (
        <div className="mobile-galleries-container h-full">
          {/* Left Gallery */}
          <div className="mobile-gallery-wrapper">
            <GalleryContainer 
              title="Left Gallery"
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={2}
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
            />
          </div>
          
          {/* Right Gallery */}
          <div className="mobile-gallery-wrapper">
            <GalleryContainer 
              title="Right Gallery"
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={2}
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
            />
          </div>
        </div>
      )}
      
      {/* Full width single gallery view - Left */}
      {mobileViewMode === 'left' && (
        <div className="h-full overflow-hidden px-1">
          <GalleryContainer 
            title="Left Gallery"
            directory={selectedDirectoryIdLeft}
            position="left"
            columnsCount={4}
            selectedIds={selectedIdsLeft}
            setSelectedIds={setSelectedIdsLeft}
            onDeleteSelected={() => handleDeleteSelected('left')}
            deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteMutation={deleteMutation}
            hideHeader={true}
          />
        </div>
      )}
      
      {/* Full width single gallery view - Right */}
      {mobileViewMode === 'right' && (
        <div className="h-full overflow-hidden px-1">
          <GalleryContainer 
            title="Right Gallery"
            directory={selectedDirectoryIdRight}
            position="right"
            columnsCount={4}
            selectedIds={selectedIdsRight}
            setSelectedIds={setSelectedIdsRight}
            onDeleteSelected={() => handleDeleteSelected('right')}
            deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteMutation={deleteMutation}
            hideHeader={true}
          />
        </div>
      )}
      
      {/* Mode switcher floating button */}
      <MobileViewSwitcher 
        mobileViewMode={mobileViewMode}
        setMobileViewMode={setMobileViewMode}
      />
    </div>
  );
};

export default MobileGalleriesView;
