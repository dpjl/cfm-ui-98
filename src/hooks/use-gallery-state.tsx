
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { deleteImages } from '@/api/imageApi';
import { useMutation } from '@tanstack/react-query';
import { MobileViewMode, ViewModeType } from '@/types/gallery';
import { MediaFilter } from '@/components/AppSidebar';

export function useGalleryState() {
  // Directory selection state
  const [selectedDirectoryIdLeft, setSelectedDirectoryIdLeft] = useState<string>("directory1");
  const [selectedDirectoryIdRight, setSelectedDirectoryIdRight] = useState<string>("directory1");
  
  // Column counts for different modes, stored in local storage
  const [desktopColumnsLeft, setDesktopColumnsLeft] = useLocalStorage('desktop-split-columns-left', 5);
  const [desktopColumnsRight, setDesktopColumnsRight] = useLocalStorage('desktop-split-columns-right', 5);
  const [desktopSingleColumnsLeft, setDesktopSingleColumnsLeft] = useLocalStorage('desktop-single-columns-left', 6);
  const [desktopSingleColumnsRight, setDesktopSingleColumnsRight] = useLocalStorage('desktop-single-columns-right', 6);
  const [mobileSplitColumnsLeft, setMobileSplitColumnsLeft] = useLocalStorage('mobile-split-columns-left', 2);
  const [mobileSplitColumnsRight, setMobileSplitColumnsRight] = useLocalStorage('mobile-split-columns-right', 2);
  const [mobileSingleColumnsLeft, setMobileSingleColumnsLeft] = useLocalStorage('mobile-single-columns-left', 4);
  const [mobileSingleColumnsRight, setMobileSingleColumnsRight] = useLocalStorage('mobile-single-columns-right', 4);
  
  // Media selection state
  const [selectedIdsLeft, setSelectedIdsLeft] = useState<string[]>([]);
  const [selectedIdsRight, setSelectedIdsRight] = useState<string[]>([]);
  
  // UI state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState<MobileViewMode>('both');
  const [leftFilter, setLeftFilter] = useState<MediaFilter>('all');
  const [rightFilter, setRightFilter] = useState<MediaFilter>('all');
  const [serverPanelOpen, setServerPanelOpen] = useState(false);
  
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
  
  // Column management
  const getCurrentColumnsLeft = (isMobile: boolean): number => {
    if (isMobile) {
      return viewMode === 'both' ? mobileSplitColumnsLeft : mobileSingleColumnsLeft;
    }
    return viewMode === 'both' ? desktopColumnsLeft : desktopSingleColumnsLeft;
  };
  
  const getCurrentColumnsRight = (isMobile: boolean): number => {
    if (isMobile) {
      return viewMode === 'both' ? mobileSplitColumnsRight : mobileSingleColumnsRight;
    }
    return viewMode === 'both' ? desktopColumnsRight : desktopSingleColumnsRight;
  };
  
  const handleLeftColumnsChange = (isMobile: boolean, count: number) => {
    if (isMobile) {
      if (viewMode === 'both') {
        setMobileSplitColumnsLeft(count);
      } else {
        setMobileSingleColumnsLeft(count);
      }
    } else {
      if (viewMode === 'both') {
        setDesktopColumnsLeft(count);
      } else {
        setDesktopSingleColumnsLeft(count);
      }
    }
  };
  
  const handleRightColumnsChange = (isMobile: boolean, count: number) => {
    if (isMobile) {
      if (viewMode === 'both') {
        setMobileSplitColumnsRight(count);
      } else {
        setMobileSingleColumnsRight(count);
      }
    } else {
      if (viewMode === 'both') {
        setDesktopColumnsRight(count);
      } else {
        setDesktopSingleColumnsRight(count);
      }
    }
  };
  
  // Action handlers
  const handleRefresh = () => {
    toast({
      title: "Refreshing media",
      description: "Fetching the latest media files..."
    });
    queryClient.invalidateQueries({ queryKey: ['mediaIds'] });
  };
  
  const handleDeleteSelected = (side: 'left' | 'right') => {
    setActiveSide(side);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (selectedIdsLeft.length > 0) {
      handleDeleteSelected('left');
    } else if (selectedIdsRight.length > 0) {
      handleDeleteSelected('right');
    }
  };
  
  const toggleLeftPanel = () => {
    setLeftPanelOpen(prev => !prev);
  };
  
  const toggleRightPanel = () => {
    setRightPanelOpen(prev => !prev);
  };
  
  const closeBothSidebars = () => {
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  };
  
  // Map view mode to column configuration type
  const getViewModeType = (position: 'left' | 'right', currentViewMode: MobileViewMode, isMobile: boolean): ViewModeType => {
    if (isMobile) {
      return currentViewMode === 'both' ? 'mobile-split' : 'mobile-single';
    } else {
      return currentViewMode === 'both' ? 'desktop' : 'desktop-single';
    }
  };
  
  return {
    // Directory state
    selectedDirectoryIdLeft,
    setSelectedDirectoryIdLeft,
    selectedDirectoryIdRight,
    setSelectedDirectoryIdRight,
    
    // Column counts 
    getCurrentColumnsLeft,
    getCurrentColumnsRight,
    handleLeftColumnsChange,
    handleRightColumnsChange,
    
    // Selection state
    selectedIdsLeft,
    setSelectedIdsLeft,
    selectedIdsRight,
    setSelectedIdsRight,
    
    // UI state
    deleteDialogOpen,
    setDeleteDialogOpen,
    activeSide,
    leftPanelOpen,
    rightPanelOpen,
    viewMode,
    setViewMode,
    leftFilter,
    setLeftFilter,
    rightFilter,
    setRightFilter,
    serverPanelOpen,
    setServerPanelOpen,
    
    // Actions
    handleRefresh,
    handleDeleteSelected,
    handleDelete,
    toggleLeftPanel,
    toggleRightPanel,
    closeBothSidebars,
    deleteMutation,
    
    // Utilities
    getViewModeType
  };
}
