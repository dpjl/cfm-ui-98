
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
  setViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
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
  setViewMode
}) => {
  return (
    <div className="flex-1 overflow-hidden bg-background/50 backdrop-blur-sm rounded-lg border-2 border-border/40 shadow-sm relative">
      <div className="flex h-full">
        {/* View mode switcher - Desktop version */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2 bg-background shadow-md border border-border rounded-full p-2">
          <button
            className={`flex items-center justify-center w-8 h-8 rounded-full ${viewMode === 'left' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-secondary'}`}
            onClick={() => setViewMode && setViewMode('left')}
            title="Source Gallery Only"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="11" height="18" x="3" y="3" rx="2" />
              <path d="M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-1" />
            </svg>
          </button>
          
          <button
            className={`flex items-center justify-center w-8 h-8 rounded-full ${viewMode === 'both' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-secondary'}`}
            onClick={() => setViewMode && setViewMode('both')}
            title="Split View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <line x1="12" x2="12" y1="3" y2="21" />
            </svg>
          </button>
          
          <button
            className={`flex items-center justify-center w-8 h-8 rounded-full ${viewMode === 'right' ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-secondary'}`}
            onClick={() => setViewMode && setViewMode('right')}
            title="Destination Gallery Only"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="11" height="18" x="10" y="3" rx="2" />
              <path d="M8 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h1" />
            </svg>
          </button>
        </div>

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
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopGalleriesView;
