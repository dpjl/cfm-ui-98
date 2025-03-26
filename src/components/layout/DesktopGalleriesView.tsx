
import React from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';
import { MobileViewMode } from '@/types/gallery';

interface DesktopGalleriesViewProps {
  columnsCountLeft: number;
  columnsCountRight: number;
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
  viewMode: MobileViewMode;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}

const DesktopGalleriesView: React.FC<DesktopGalleriesViewProps> = ({
  columnsCountLeft,
  columnsCountRight,
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
  viewMode,
  onToggleLeftPanel,
  onToggleRightPanel
}) => {
  return (
    <div className="flex-1 overflow-hidden h-full">
      <div className="h-full bg-background rounded-lg border-2 border-border/40 shadow-sm">
        <div className="h-full flex flex-row">
          {/* Left Gallery */}
          <div 
            className={`h-full ${viewMode === 'both' ? 'w-1/2' : viewMode === 'left' ? 'w-full' : 'hidden'}`}
          >
            {(viewMode === 'both' || viewMode === 'left') && (
              <GalleryContainer 
                title="Source"
                directory={selectedDirectoryIdLeft}
                position="left"
                columnsCount={columnsCountLeft}
                selectedIds={selectedIdsLeft}
                setSelectedIds={setSelectedIdsLeft}
                onDeleteSelected={() => handleDeleteSelected('left')}
                deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
                setDeleteDialogOpen={setDeleteDialogOpen}
                deleteMutation={deleteMutation}
                hideHeader={false}
                viewMode={viewMode === 'left' ? 'single' : 'split'}
                filter={leftFilter}
                onToggleSidebar={onToggleLeftPanel}
              />
            )}
          </div>
          
          {/* Gallery Separator - only visible in 'both' mode */}
          {viewMode === 'both' && (
            <Separator orientation="vertical" className="bg-border/60" />
          )}
          
          {/* Right Gallery */}
          <div 
            className={`h-full ${viewMode === 'both' ? 'w-1/2' : viewMode === 'right' ? 'w-full' : 'hidden'}`}
          >
            {(viewMode === 'both' || viewMode === 'right') && (
              <GalleryContainer 
                title="Destination"
                directory={selectedDirectoryIdRight}
                position="right"
                columnsCount={columnsCountRight}
                selectedIds={selectedIdsRight}
                setSelectedIds={setSelectedIdsRight}
                onDeleteSelected={() => handleDeleteSelected('right')}
                deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
                setDeleteDialogOpen={setDeleteDialogOpen}
                deleteMutation={deleteMutation}
                hideHeader={false}
                viewMode={viewMode === 'right' ? 'single' : 'split'}
                filter={rightFilter}
                onToggleSidebar={onToggleRightPanel}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopGalleriesView;
