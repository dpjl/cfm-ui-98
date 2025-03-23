
import React from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Button } from '@/components/ui/button';
import { GalleryHorizontal, GalleryVertical, GalleryVerticalEnd } from 'lucide-react';

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
  
  // Render mobile view mode switcher buttons
  const renderMobileViewSwitcher = () => {
    if (!isMobile || !setMobileViewMode) return null;
    
    return (
      <div className="mobile-view-switcher">
        <Button 
          variant={mobileViewMode === 'left' ? "default" : "outline"} 
          size="icon" 
          onClick={() => setMobileViewMode('left')}
          className="h-10 w-10 rounded-full"
        >
          <GalleryVertical className="h-5 w-5" />
        </Button>
        
        <Button 
          variant={mobileViewMode === 'both' ? "default" : "outline"} 
          size="icon" 
          onClick={() => setMobileViewMode('both')}
          className="h-10 w-10 rounded-full"
        >
          <GalleryHorizontal className="h-5 w-5" />
        </Button>
        
        <Button 
          variant={mobileViewMode === 'right' ? "default" : "outline"} 
          size="icon" 
          onClick={() => setMobileViewMode('right')}
          className="h-10 w-10 rounded-full"
        >
          <GalleryVerticalEnd className="h-5 w-5" />
        </Button>
      </div>
    );
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex-1 overflow-hidden">
        {/* Mobile view with optimized galleries */}
        {mobileViewMode === 'both' && (
          <div className="mobile-galleries-container h-full">
            {/* Left Gallery */}
            <div className="mobile-gallery-wrapper">
              <GalleryContainer 
                title="Left Gallery"
                directory={selectedDirectoryIdLeft}
                position="left"
                columnsCount={2}
                selectedIds={selectedIdsLeft}
                setSelectedIds={setSelectedIdsLeft}
                onDeleteSelected={() => handleDeleteSelected('left')}
                deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
                setDeleteDialogOpen={setDeleteDialogOpen}
                deleteMutation={deleteMutation}
                hideHeader={true}
              />
            </div>
            
            {/* Right Gallery */}
            <div className="mobile-gallery-wrapper">
              <GalleryContainer 
                title="Right Gallery"
                directory={selectedDirectoryIdRight}
                position="right"
                columnsCount={2}
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
        
        {/* Full width single gallery views */}
        {mobileViewMode === 'left' && (
          <div className="h-full overflow-hidden px-1">
            <GalleryContainer 
              title="Left Gallery"
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={4}
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
            />
          </div>
        )}
        
        {mobileViewMode === 'right' && (
          <div className="h-full overflow-hidden px-1">
            <GalleryContainer 
              title="Right Gallery"
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={4}
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
            />
          </div>
        )}
        
        {/* Mode switcher floating button */}
        {renderMobileViewSwitcher()}
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
