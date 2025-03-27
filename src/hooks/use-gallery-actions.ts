
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { deleteImages } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';

export function useGalleryActions(
  selectedIdsLeft: string[],
  selectedIdsRight: string[],
  activeSide: 'left' | 'right',
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>,
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>
) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteImages,
    onSuccess: () => {
      const activeSelectedIds = activeSide === 'left' ? selectedIdsLeft : selectedIdsRight;
      toast({
        title: `${activeSelectedIds.length} ${activeSelectedIds.length === 1 ? 'media' : 'media files'} deleted`,
        description: "The selected media files have been removed successfully.",
      });
      
      if (activeSide === 'left') {
        setSelectedIdsLeft([]);
      } else {
        setSelectedIdsRight([]);
      }
      setDeleteDialogOpen(false);
      
      queryClient.invalidateQueries({ queryKey: ['mediaIds'] });
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
  
  // Action handlers
  const handleRefresh = () => {
    toast({
      title: "Refreshing media",
      description: "Fetching the latest media files..."
    });
    queryClient.invalidateQueries({ queryKey: ['mediaIds'] });
  };
  
  const handleDeleteSelected = (side: 'left' | 'right') => {
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (selectedIdsLeft.length > 0) {
      handleDeleteSelected('left');
    } else if (selectedIdsRight.length > 0) {
      handleDeleteSelected('right');
    }
  };
  
  return {
    deleteMutation,
    handleRefresh,
    handleDeleteSelected,
    handleDelete
  };
}
