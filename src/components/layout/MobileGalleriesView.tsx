
import React, { useMemo } from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MobileViewMode } from '@/types/gallery';
import MobileViewSwitcher from './MobileViewSwitcher';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';

interface MobileGalleriesViewProps {
  columnsCountLeft: number;
  columnsCountRight: number;
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
  columnsCountLeft,
  columnsCountRight,
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
    <div className="flex-1 overflow-hidden h-full relative">
      <div className="h-full bg-background rounded-lg border-2 border-border/40 shadow-sm">
        <div className="h-full flex flex-row relative">
          {/* Left Gallery */}
          <div 
            className={`h-full ${
              mobileViewMode === 'both' ? 'w-1/2 relative' : 
              mobileViewMode === 'left' ? 'w-full relative z-10' : 
              'w-0 absolute opacity-0 pointer-events-none'
            }`}
            style={{
              transition: 'width 200ms ease-out',
              background: 'var(--background)'
            }}
          >
            {(mobileViewMode === 'both' || mobileViewMode === 'left') && (
              <GalleryContainer 
                title="Left Gallery"
                directory={selectedDirectoryIdLeft}
                position="left"
                columnsCount={columnsCountLeft}
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
            )}
          </div>
          
          {/* Gallery Separator - only visible in 'both' mode */}
          {mobileViewMode === 'both' && (
            <Separator orientation="vertical" className="bg-border/60" />
          )}
          
          {/* Right Gallery */}
          <div 
            className={`h-full ${
              mobileViewMode === 'both' ? 'w-1/2 relative' : 
              mobileViewMode === 'right' ? 'w-full relative z-10' : 
              'w-0 absolute opacity-0 pointer-events-none'
            }`}
            style={{
              transition: 'width 200ms ease-out',
              background: 'var(--background)'
            }}
          >
            {(mobileViewMode === 'both' || mobileViewMode === 'right') && (
              <GalleryContainer 
                title="Right Gallery"
                directory={selectedDirectoryIdRight}
                position="right"
                columnsCount={columnsCountRight}
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
            )}
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
