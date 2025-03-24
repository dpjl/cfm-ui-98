
import React from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MobileViewMode } from '@/types/gallery';
import MobileViewSwitcher from './MobileViewSwitcher';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';
import { cn } from '@/lib/utils';

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
        {/* Both galleries are always rendered but visibility is toggled */}
        <div className="gallery-container h-full relative">
          {/* Split View - Both Galleries Side by Side */}
          <div 
            className={cn(
              "h-full flex flex-row absolute inset-0 transition-opacity duration-200",
              mobileViewMode === 'both' ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {/* Left Gallery */}
            <div className="h-full w-1/2 overflow-hidden">
              <GalleryContainer 
                title="Left Gallery"
                directory={selectedDirectoryIdLeft}
                position="left"
                columnsCount={2} // Fixed at 2 for mobile split view
                selectedIds={selectedIdsLeft}
                setSelectedIds={setSelectedIdsLeft}
                onDeleteSelected={() => handleDeleteSelected('left')}
                deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
                setDeleteDialogOpen={setDeleteDialogOpen}
                deleteMutation={deleteMutation}
                hideHeader={true}
                viewMode="split"
                filter={leftFilter}
                hideMobileColumns={true}
              />
            </div>
            
            {/* Gallery Separator */}
            <Separator orientation="vertical" className="bg-border/60" />
            
            {/* Right Gallery */}
            <div className="h-full w-1/2 overflow-hidden">
              <GalleryContainer 
                title="Right Gallery"
                directory={selectedDirectoryIdRight}
                position="right"
                columnsCount={2} // Fixed at 2 for mobile split view
                selectedIds={selectedIdsRight}
                setSelectedIds={setSelectedIdsRight}
                onDeleteSelected={() => handleDeleteSelected('right')}
                deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
                setDeleteDialogOpen={setDeleteDialogOpen}
                deleteMutation={deleteMutation}
                hideHeader={true}
                viewMode="split"
                filter={rightFilter}
                hideMobileColumns={true}
              />
            </div>
          </div>
          
          {/* Left Gallery Full View */}
          <div 
            className={cn(
              "h-full absolute inset-0 transition-opacity duration-200",
              mobileViewMode === 'left' ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <GalleryContainer 
              title="Left Gallery"
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={4} // 4 columns for single view
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode="single"
              filter={leftFilter}
              hideMobileColumns={true}
            />
          </div>
          
          {/* Right Gallery Full View */}
          <div 
            className={cn(
              "h-full absolute inset-0 transition-opacity duration-200",
              mobileViewMode === 'right' ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            <GalleryContainer 
              title="Right Gallery"
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={4} // 4 columns for single view
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode="single"
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
