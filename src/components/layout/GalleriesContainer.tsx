
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  handleDeleteSelected
}) => {
  const isMobile = useIsMobile();
  const [currentGallery, setCurrentGallery] = useState<'left' | 'right'>('left');
  
  const toggleGallery = () => {
    setCurrentGallery(prev => prev === 'left' ? 'right' : 'left');
  };

  // Mobile view with tab switching
  if (isMobile) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Gallery selector for mobile */}
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleGallery}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              {currentGallery === 'right' ? 'Source' : ''}
            </Button>
            
            <span className="font-medium">
              {currentGallery === 'left' ? 'Source' : 'Destination'}
            </span>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleGallery}
              className="flex items-center gap-1"
            >
              {currentGallery === 'left' ? 'Destination' : ''}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Gallery content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentGallery === 'left' ? (
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
              ) : (
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
              )}
            </motion.div>
          </div>
        </div>
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
