
import React from 'react';
import { motion } from 'framer-motion';
import GalleryContainer from '@/components/GalleryContainer';

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
