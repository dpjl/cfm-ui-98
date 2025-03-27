
import { useIsMobile } from '@/hooks/use-breakpoint';
import { useDirectoryState } from '@/hooks/use-directory-state';
import { useColumnsState } from '@/hooks/use-columns-state';
import { useSelectionState } from '@/hooks/use-selection-state';
import { useUIState } from '@/hooks/use-ui-state';
import { useGalleryActions } from '@/hooks/use-gallery-actions';
import { ViewModeType } from '@/types/gallery';

export function useGalleryState() {
  const isMobile = useIsMobile();
  
  // Use all the specialized hooks
  const directoryState = useDirectoryState();
  const columnsState = useColumnsState();
  const selectionState = useSelectionState();
  const uiState = useUIState();
  
  // Gallery actions need access to selection state and UI state
  const galleryActions = useGalleryActions(
    selectionState.selectedIdsLeft,
    selectionState.selectedIdsRight,
    selectionState.activeSide,
    uiState.setDeleteDialogOpen,
    selectionState.setSelectedIdsLeft,
    selectionState.setSelectedIdsRight
  );
  
  // Convenience methods that use data from multiple hooks
  const getCurrentColumnsLeft = (isMobile: boolean): number => {
    return columnsState.getCurrentColumnsLeft(isMobile, uiState.viewMode);
  };
  
  const getCurrentColumnsRight = (isMobile: boolean): number => {
    return columnsState.getCurrentColumnsRight(isMobile, uiState.viewMode);
  };
  
  const handleLeftColumnsChange = (isMobile: boolean, count: number) => {
    columnsState.handleLeftColumnsChange(isMobile, uiState.viewMode, count);
  };
  
  const handleRightColumnsChange = (isMobile: boolean, count: number) => {
    columnsState.handleRightColumnsChange(isMobile, uiState.viewMode, count);
  };
  
  // Return all the state and methods from our hooks
  return {
    // Directory state
    ...directoryState,
    
    // Column management (with simplified interfaces)
    getCurrentColumnsLeft,
    getCurrentColumnsRight,
    handleLeftColumnsChange,
    handleRightColumnsChange,
    
    // Selection state
    ...selectionState,
    
    // UI state
    ...uiState,
    
    // Actions
    ...galleryActions,
    
    // Utilities
    getViewModeType: columnsState.getViewModeType
  };
}
