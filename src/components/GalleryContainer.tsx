import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { GalleryHorizontal, GalleryVerticalEnd, GalleryVertical, ArrowLeftRight } from 'lucide-react';

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

// Types for mobile view modes
export type MobileViewMode = 'both' | 'left' | 'right';

interface GalleriesContainerProps {
  columnsCount: number;
  selectedIdsLeft: string[];
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIdsRight: string[];
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDirectoryIdLeft: string;
  selectedDirectoryIdRight: string;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  activeSide: 'left' | 'right';
  deleteMutation: any;
  handleDeleteSelected: (side: 'left' | 'right') => void;
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const GalleriesContainer: React.FC<GalleriesContainerProps> = ({
  columnsCount,
  selectedIdsLeft,
  setSelectedIdsLeft,
  selectedIdsRight,
  setSelectedIdsRight,
  selectedDirectoryIdLeft,
  selectedDirectoryIdRight,
  deleteDialogOpen,
  setDeleteDialogOpen,
  activeSide,
  deleteMutation,
  handleDeleteSelected,
  mobileViewMode = 'both',
  setMobileViewMode
}) => {
  const isMobile = useIsMobile();
  
  // Mode switcher button for mobile
  const renderModeSwitcher = () => {
    if (!isMobile || !setMobileViewMode) return null;
    
    return (
      <div className="fixed bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1 shadow-lg">
        {mobileViewMode === 'both' && (
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setMobileViewMode('left')}
              className="h-10 w-10 rounded-full"
            >
              <GalleryVertical className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setMobileViewMode('right')}
              className="h-10 w-10 rounded-full"
            >
              <GalleryVerticalEnd className="h-5 w-5" />
            </Button>
          </div>
        )}
        
        {mobileViewMode === 'left' && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setMobileViewMode('both')}
            className="h-10 w-10 rounded-full"
          >
            <GalleryHorizontal className="h-5 w-5" />
          </Button>
        )}
        
        {mobileViewMode === 'right' && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setMobileViewMode('both')}
            className="h-10 w-10 rounded-full"
          >
            <GalleryHorizontal className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  };

  // Mobile view with optimized galleries
  if (isMobile) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex flex-col h-full">
          {/* Mobile galleries container */}
          <div className="flex-1 flex overflow-hidden">
            {/* Full width view when only one gallery is shown */}
            {mobileViewMode === 'left' && (
              <div className="w-full h-full overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    <GalleryContainer 
                      title="Left Gallery" 
                      directory={selectedDirectoryIdLeft}
                      position="left"
                      columnsCount={4} // Show 4 columns when in single gallery mode
                      selectedIds={selectedIdsLeft}
                      setSelectedIds={setSelectedIdsLeft}
                      onDeleteSelected={() => handleDeleteSelected('left')}
                      deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
                      setDeleteDialogOpen={setDeleteDialogOpen}
                      deleteMutation={deleteMutation}
                      hideHeader={true}
                    />
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {mobileViewMode === 'right' && (
              <div className="w-full h-full overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-2">
                    <GalleryContainer 
                      title="Right Gallery" 
                      directory={selectedDirectoryIdRight}
                      position="right"
                      columnsCount={4} // Show 4 columns when in single gallery mode
                      selectedIds={selectedIdsRight}
                      setSelectedIds={setSelectedIdsRight}
                      onDeleteSelected={() => handleDeleteSelected('right')}
                      deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
                      setDeleteDialogOpen={setDeleteDialogOpen}
                      deleteMutation={deleteMutation}
                      hideHeader={true}
                    />
                  </div>
                </ScrollArea>
              </div>
            )}
            
            {mobileViewMode === 'both' && (
              <div className="mobile-gallery-container">
                {/* Left Side */}
                <div className="mobile-gallery-panel">
                  <GalleryContainer 
                    title="Left Gallery" 
                    directory={selectedDirectoryIdLeft}
                    position="left"
                    columnsCount={2} // Force 2 columns in split view
                    selectedIds={selectedIdsLeft}
                    setSelectedIds={setSelectedIdsLeft}
                    onDeleteSelected={() => handleDeleteSelected('left')}
                    deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
                    setDeleteDialogOpen={setDeleteDialogOpen}
                    deleteMutation={deleteMutation}
                    hideHeader={true}
                  />
                </div>
                
                {/* Right Side */}
                <div className="mobile-gallery-panel">
                  <GalleryContainer 
                    title="Right Gallery" 
                    directory={selectedDirectoryIdRight}
                    position="right"
                    columnsCount={2} // Force 2 columns in split view
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
          </div>
        </div>
        
        {/* Mode switcher floating button */}
        {renderModeSwitcher()}
      </div>
    );
  }

  // Desktop view with split screen
  return (
    <div className="flex-1 overflow-hidden">
      <div className="flex h-full">
        {/* Left Gallery */}
        <div className="w-1/2 overflow-auto">
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
              columnsCount={columnsCount}
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
            />
          </motion.div>
        </div>

        {/* Right Gallery */}
        <div className="w-1/2 overflow-auto">
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
              columnsCount={columnsCount}
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GalleriesContainer;
