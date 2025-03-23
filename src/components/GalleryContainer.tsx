
import React from 'react';
import Gallery from './Gallery';
import { useQuery } from '@tanstack/react-query';
import { fetchMediaIds } from '@/api/imageApi';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface GalleryContainerProps {
  title: string;
  directory: string;
  position: 'left' | 'right';
  columnsCount: number;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
  onDeleteSelected: () => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteMutation: any;
  hideHeader?: boolean;
}

const GalleryContainer: React.FC<GalleryContainerProps> = ({
  title,
  directory,
  position,
  columnsCount,
  selectedIds,
  setSelectedIds,
  onDeleteSelected,
  deleteDialogOpen,
  setDeleteDialogOpen,
  deleteMutation,
  hideHeader = false
}) => {
  // Query to get media IDs for the directory
  const { data: mediaIds = [], isLoading } = useQuery({
    queryKey: ['mediaIds', directory],
    queryFn: () => fetchMediaIds(directory),
  });

  // Function to handle selecting/deselecting an image
  const handleSelectId = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Function to handle previewing a media item
  const handlePreviewMedia = (id: string) => {
    console.log(`Preview media ${id} in ${position} gallery`);
    // Implement preview functionality here
  };

  // Determine the columns className based on the number of columns
  const columnsClassName = `grid-cols-${columnsCount < 9 ? columnsCount : 8}`;

  return (
    <div className="h-full px-2 py-1">
      <Gallery
        title={title}
        mediaIds={mediaIds}
        selectedIds={selectedIds}
        onSelectId={handleSelectId}
        isLoading={isLoading}
        columnsClassName={columnsClassName}
        onPreviewMedia={handlePreviewMedia}
        hideHeader={hideHeader}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedCount={selectedIds.length}
        onConfirm={() => {
          deleteMutation.mutate(selectedIds);
        }}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default GalleryContainer;
