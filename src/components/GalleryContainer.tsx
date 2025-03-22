
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Gallery from '@/components/Gallery';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import MediaPreview from '@/components/MediaPreview';
import { fetchMediaIds, deleteImages } from '@/api/imageApi';

// Define animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

interface GalleryContainerProps {
  title: string;
  directory: string;
  position?: 'left' | 'right';
  columnsCount: number;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onDeleteSelected: () => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteMutation: UseMutationResult<any, Error, string[], unknown>;
  hideHeader?: boolean;
}

const GalleryContainer: React.FC<GalleryContainerProps> = ({ 
  title, 
  directory,
  position = 'left',
  columnsCount,
  selectedIds,
  setSelectedIds,
  onDeleteSelected,
  deleteDialogOpen,
  setDeleteDialogOpen,
  deleteMutation,
  hideHeader = false
}) => {
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Fetch media IDs from a specified directory
  const { 
    data: mediaIds = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['mediaIds', directory, position],
    queryFn: () => fetchMediaIds(directory),
  });
  
  const handleSelectId = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(mediaId => mediaId !== id)
        : [...prev, id]
    );
  };
  
  const confirmDelete = () => {
    deleteMutation.mutate(selectedIds);
  };

  const handlePreviewMedia = (mediaId: string) => {
    setPreviewMediaId(mediaId);
    setIsPreviewOpen(true);
  };

  const handleNavigateMedia = (direction: 'prev' | 'next') => {
    if (!previewMediaId || mediaIds.length === 0) return;
    
    const currentIndex = mediaIds.indexOf(previewMediaId);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + mediaIds.length) % mediaIds.length;
    } else {
      newIndex = (currentIndex + 1) % mediaIds.length;
    }
    
    setPreviewMediaId(mediaIds[newIndex]);
  };
  
  const closePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewMediaId(null), 300);
  };

  const getColumnsClassName = () => {
    switch (columnsCount) {
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-2 sm:grid-cols-3";
      case 4: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4";
      case 5: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
      case 6: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
      case 7: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7";
      case 8: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8";
      default: return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6";
    }
  };
  
  return (
    <div className="h-full flex flex-col p-4">
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-4 flex-1 overflow-auto flex flex-col"
      >
        <Gallery
          title={title}
          mediaIds={mediaIds}
          selectedIds={selectedIds}
          onSelectId={handleSelectId}
          isLoading={isLoading}
          columnsClassName={getColumnsClassName()}
          onPreviewMedia={handlePreviewMedia}
        />
      </motion.div>
      
      <MediaPreview
        mediaId={previewMediaId}
        isOpen={isPreviewOpen}
        onClose={closePreview}
        allMediaIds={mediaIds}
        onNavigate={handleNavigateMedia}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        selectedCount={selectedIds.length}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default GalleryContainer;
