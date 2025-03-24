
import React from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MobileViewMode } from '@/types/gallery';
import MobileViewSwitcher from './MobileViewSwitcher';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';

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
  leftFilter?: MediaFilter;
  rightFilter?: MediaFilter;
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
  deleteMutation,
  leftFilter = 'all',
  rightFilter = 'all'
}) => {
  return (
    <div className="flex-1 overflow-hidden h-full">
      <div className="h-full bg-background/50 backdrop-blur-sm rounded-lg border-2 border-border/40 shadow-sm">
        <div className="h-full relative">
          {/* Left Gallery - always present but can be in background */}
          <div 
            className={`h-full overflow-auto transition-all duration-300 absolute inset-0 z-10 ${
              mobileViewMode === 'right' ? 'z-0' : 
              mobileViewMode === 'both' ? 'w-1/2' : 'w-full'
            }`}
          >
            <GalleryContainer 
              title="Left Gallery"
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={mobileViewMode === 'left' ? 4 : 2} // 4 columns when in full width, 2 when split
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode={mobileViewMode === 'left' ? 'single' : 'split'}
              filter={leftFilter}
              hideMobileColumns={true}
            />
          </div>
          
          {/* Separator - only visible in 'both' mode */}
          {mobileViewMode === 'both' && (
            <div className="absolute top-0 bottom-0 left-1/2 z-20 transform -translate-x-1/2">
              <Separator orientation="vertical" className="bg-border/60 h-full" />
            </div>
          )}
          
          {/* Right Gallery - always present but can be in background */}
          <div 
            className={`h-full overflow-auto transition-all duration-300 absolute inset-0 ${
              mobileViewMode === 'left' ? 'z-0' : 
              mobileViewMode === 'both' ? 'left-1/2 w-1/2 z-10' : 'w-full z-10'
            }`}
          >
            <GalleryContainer 
              title="Right Gallery"
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={mobileViewMode === 'right' ? 4 : 2} // 4 columns when in full width, 2 when split
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode={mobileViewMode === 'right' ? 'single' : 'split'}
              filter={rightFilter}
              hideMobileColumns={true}
            />
          </div>
        </div>
      </div>
      
      {/* Mode switcher floating button */}
      <MobileViewSwitcher 
        mobileViewMode={mobileViewMode}
        setMobileViewMode={setMobileViewMode}
      />
    </div>
  );
};

export default MobileGalleriesView;
