
import React, { useMemo } from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MobileViewMode } from '@/types/gallery';
import MobileViewSwitcher from './MobileViewSwitcher';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';
import { Button } from '@/components/ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';

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
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
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
  rightFilter = 'all',
  onToggleLeftPanel,
  onToggleRightPanel
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
      
      {/* Mode switcher and sidebar buttons */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center gap-4 z-20">
        {/* Left sidebar button */}
        <Button 
          variant="secondary" 
          size="icon"
          className="rounded-full shadow-md h-10 w-10"
          onClick={onToggleLeftPanel}
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        
        {/* Mode switcher */}
        <MobileViewSwitcher 
          mobileViewMode={mobileViewMode}
          setMobileViewMode={setMobileViewMode}
        />
        
        {/* Right sidebar button */}
        <Button 
          variant="secondary" 
          size="icon"
          className="rounded-full shadow-md h-10 w-10"
          onClick={onToggleRightPanel}
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MobileGalleriesView;
