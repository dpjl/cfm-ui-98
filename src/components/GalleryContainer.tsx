
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Gallery, { ImageItem } from '@/components/Gallery';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { useToast } from '@/components/ui/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MediaPreview from '@/components/MediaPreview';
import { fetchImages, deleteImages } from '@/api/imageApi';
import GalleryHeader from '@/components/GalleryHeader';

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
}

const GalleryContainer: React.FC<GalleryContainerProps> = ({ title, directory }) => {
  const { toast } = useToast();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<ImageItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [columnsCount, setColumnsCount] = useState<number>(6);
  
  const queryClient = useQueryClient();
  
  // Fetch data from a specified directory
  const { 
    data: images = [], 
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['images', directory],
    queryFn: () => fetchImages(directory),
  });
  
  // Mutation for deleting images
  const deleteMutation = useMutation({
    mutationFn: deleteImages,
    onSuccess: () => {
      // Show success message
      toast({
        title: `${selectedImages.length} ${selectedImages.length === 1 ? 'media' : 'media files'} deleted`,
        description: "The selected media files have been removed successfully.",
      });
      
      // Reset selected images and close the dialog
      setSelectedImages([]);
      setDeleteDialogOpen(false);
      
      // Refetch the image list to reflect the changes
      queryClient.invalidateQueries({ queryKey: ['images'] });
    },
    onError: (error) => {
      toast({
        title: "Error deleting media files",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
    }
  });
  
  const handleSelectImage = (id: string) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    );
  };
  
  const handleDeleteSelected = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    deleteMutation.mutate(selectedImages);
  };
  
  const handleRefresh = () => {
    toast({
      title: "Refreshing media",
      description: "Fetching the latest media files..."
    });
    refetch();
  };

  const handlePreviewMedia = (mediaId: string) => {
    const media = images.find(img => img.id === mediaId);
    if (media) {
      setPreviewMedia(media);
      setIsPreviewOpen(true);
    }
  };

  const handleNavigateMedia = (direction: 'prev' | 'next') => {
    if (!previewMedia || images.length === 0) return;
    
    // Sort images same way as in Gallery component (newest to oldest)
    const sortedImages = [...images].sort((a, b) => {
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    const currentIndex = sortedImages.findIndex(img => img.id === previewMedia.id);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + sortedImages.length) % sortedImages.length;
    } else {
      newIndex = (currentIndex + 1) % sortedImages.length;
    }
    
    setPreviewMedia(sortedImages[newIndex]);
  };
  
  const closePreview = () => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewMedia(null), 300);
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
    <>
      <GalleryHeader 
        title={title}
        columnsCount={columnsCount}
        setColumnsCount={setColumnsCount}
        isLoading={isLoading}
        selectedImages={selectedImages}
        onRefresh={handleRefresh}
        onDeleteSelected={handleDeleteSelected}
        isDeletionPending={deleteMutation.isPending}
      />
      
      <motion.div 
        variants={itemVariants}
        className="glass-panel p-6"
      >
        <Gallery
          title="Media Gallery"
          images={images}
          selectedImages={selectedImages}
          onSelectImage={handleSelectImage}
          isLoading={isLoading}
          columnsClassName={getColumnsClassName()}
          onPreviewMedia={handlePreviewMedia}
        />
      </motion.div>
      
      <MediaPreview
        media={previewMedia}
        isOpen={isPreviewOpen}
        onClose={closePreview}
        allMedia={images.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        })}
        onNavigate={handleNavigateMedia}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        selectedCount={selectedImages.length}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};

export default GalleryContainer;
