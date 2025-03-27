
import React from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { Separator } from '@/components/ui/separator';
import { BaseGalleryProps, SidebarToggleProps, ViewModeProps } from '@/types/gallery-props';

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

// Combined props for DesktopGalleriesView
interface DesktopGalleriesViewProps extends BaseGalleryProps, ViewModeProps, SidebarToggleProps {}

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
  // Extract common props for left gallery
  const leftGalleryProps = {
    title: "Left Gallery",
    directory: selectedDirectoryIdLeft,
    position: 'left' as const,
    columnsCount: columnsCountLeft,
    selectedIds: selectedIdsLeft,
    setSelectedIds: setSelectedIdsLeft,
    onDeleteSelected: () => handleDeleteSelected('left'),
    deleteDialogOpen: deleteDialogOpen && activeSide === 'left',
    setDeleteDialogOpen,
    deleteMutation,
    hideHeader: true,
    filter: leftFilter,
    onToggleSidebar: onToggleLeftPanel
  };
  
  // Extract common props for right gallery
  const rightGalleryProps = {
    title: "Right Gallery",
    directory: selectedDirectoryIdRight,
    position: 'right' as const,
    columnsCount: columnsCountRight,
    selectedIds: selectedIdsRight,
    setSelectedIds: setSelectedIdsRight,
    onDeleteSelected: () => handleDeleteSelected('right'),
    deleteDialogOpen: deleteDialogOpen && activeSide === 'right',
    setDeleteDialogOpen,
    deleteMutation,
    hideHeader: true,
    filter: rightFilter,
    onToggleSidebar: onToggleRightPanel
  };

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
                {...leftGalleryProps}
                viewMode={viewMode === 'both' ? 'split' : 'single'}
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
                {...rightGalleryProps}
                viewMode={viewMode === 'both' ? 'split' : 'single'}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopGalleriesView;
