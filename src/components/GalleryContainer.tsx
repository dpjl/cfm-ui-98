
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMediaIds } from '@/api/imageApi';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import GalleryHeader from '@/components/GalleryHeader';
import { useLanguage } from '@/hooks/use-language';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { MediaFilter } from '@/components/AppSidebar';

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
  viewMode?: 'single' | 'split';
  filter?: MediaFilter;
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
  hideHeader = false,
  viewMode = 'single',
  filter = 'all'
}) => {
  const { t } = useLanguage();
  const [mediaIds, setMediaIds] = useState<string[]>([]);
  
  // Fetch media IDs for the selected directory
  const { 
    data = [], 
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['mediaIds', directory, position, filter],
    queryFn: () => fetchMediaIds(directory, filter),
    enabled: !!directory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update mediaIds when data changes
  useEffect(() => {
    if (data && Array.isArray(data)) {
      setMediaIds(data);
    }
  }, [data]);
  
  // Handle selecting/deselecting an item
  const handleSelectItem = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Handle selecting all items
  const handleSelectAll = () => {
    if (selectedIds.length === mediaIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...mediaIds]);
    }
  };
  
  // Handle canceling deletion
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };
  
  // Handle confirming deletion
  const handleConfirmDelete = () => {
    deleteMutation.mutate({
      ids: selectedIds,
      position
    });
  };
  
  // Determine if all items are selected
  const allSelected = mediaIds.length > 0 && selectedIds.length === mediaIds.length;
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Gallery Header - only shown if hideHeader is false */}
      {!hideHeader && (
        <GalleryHeader
          title={title}
          columnsCount={columnsCount}
          setColumnsCount={() => {}} // Dummy function as this prop is required but not used here
          isLoading={isLoading}
          selectedImages={selectedIds}
          onRefresh={() => {}} // Dummy function as this prop is required but not used here
          onDeleteSelected={onDeleteSelected}
          isDeletionPending={false} // Add this required prop
          // Remove onSelectAll and allSelected as they're not in the GalleryHeader props
        />
      )}
      
      {/* Gallery Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {Array.from({ length: 20 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-md" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-destructive font-medium mb-2">Error loading media</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'An unknown error occurred'}
              </p>
            </div>
          </div>
        ) : mediaIds.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="font-medium mb-2">No media found</p>
              <p className="text-sm text-muted-foreground">
                {filter !== 'all' 
                  ? 'Try changing the filter or selecting a different folder'
                  : 'Select a different folder or upload some media'}
              </p>
            </div>
          </div>
        ) : (
          <GalleryGrid
            mediaIds={mediaIds}
            selectedIds={selectedIds}
            onSelectId={handleSelectItem}
            columnsClassName={`grid-cols-${columnsCount}`}
            viewMode={viewMode}
            showDates={false}
          />
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t('delete_confirmation_title')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('delete_confirmation_description', { count: selectedIds.length })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={deleteMutation.isPending}>
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? t('deleting') : t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GalleryContainer;
