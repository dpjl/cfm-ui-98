
import React from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { Separator } from '@/components/ui/separator';
import { MediaFilter } from '@/components/AppSidebar';
import { MobileViewMode } from '@/types/gallery';

// Define container animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};

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
  viewMode?: MobileViewMode;
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
  viewMode = 'both',
  onToggleLeftPanel,
  onToggleRightPanel
}) => {
  return (
    <div className="flex-1 overflow-hidden bg-background/50 backdrop-blur-sm rounded-lg border-2 border-border/40 shadow-sm relative">
      <div className="flex h-full">
        {/* Left Gallery */}
        <div className={`overflow-hidden transition-all duration-300 ${
          viewMode === 'both' ? 'w-1/2' : 
          viewMode === 'left' ? 'w-full' : 'w-0'
        }`}>
          {(viewMode === 'both' || viewMode === 'left') && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="h-full"
            >
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
                viewMode={viewMode === 'both' ? 'split' : 'single'}
                filter={leftFilter}
                onToggleSidebar={onToggleLeftPanel}
              />
            </motion.div>
          )}
        </div>

        {/* Gallery Separator - only shown in split view */}
        {viewMode === 'both' && (
          <Separator orientation="vertical" className="bg-border/60" />
        )}

        {/* Right Gallery */}
        <div className={`overflow-hidden transition-all duration-300 ${
          viewMode === 'both' ? 'w-1/2' : 
          viewMode === 'right' ? 'w-full' : 'w-0'
        }`}>
          {(viewMode === 'both' || viewMode === 'right') && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="h-full"
            >
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
                viewMode={viewMode === 'both' ? 'split' : 'single'}
                filter={rightFilter}
                onToggleSidebar={onToggleRightPanel}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopGalleriesView;
