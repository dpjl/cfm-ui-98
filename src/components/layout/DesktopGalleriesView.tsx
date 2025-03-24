
import React from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';

interface DesktopGalleriesViewProps {
  columnsCount: number;
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

const DesktopGalleriesView: React.FC<DesktopGalleriesViewProps> = ({
  columnsCount,
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
    <div className="flex-1 overflow-hidden bg-background/50 backdrop-blur-sm rounded-lg border-2 border-border/40 shadow-sm">
      <div className="flex h-full">
        {/* Left Gallery */}
        <div className="w-1/2 overflow-hidden">
          <GalleryContainer 
            title="Left Gallery"
            directory={selectedDirectoryIdLeft}
            position="left"
            columnsCount={columnsCount}
            selectedIds={selectedIdsLeft}
            setSelectedIds={setSelectedIdsLeft}
            onDeleteSelected={() => handleDeleteSelected('left')}
            deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteMutation={deleteMutation}
            hideHeader={true}
            viewMode="split"
            filter={leftFilter}
          />
        </div>

        {/* Gallery Separator */}
        <Separator orientation="vertical" className="bg-border/60" />

        {/* Right Gallery */}
        <div className="w-1/2 overflow-hidden">
          <GalleryContainer 
            title="Right Gallery"
            directory={selectedDirectoryIdRight}
            position="right"
            columnsCount={columnsCount}
            selectedIds={selectedIdsRight}
            setSelectedIds={setSelectedIdsRight}
            onDeleteSelected={() => handleDeleteSelected('right')}
            deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
            setDeleteDialogOpen={setDeleteDialogOpen}
            deleteMutation={deleteMutation}
            hideHeader={true}
            viewMode="split"
            filter={rightFilter}
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopGalleriesView;
