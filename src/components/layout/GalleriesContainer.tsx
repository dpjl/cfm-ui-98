
import React from 'react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import MobileGalleriesView from './MobileGalleriesView';
import DesktopGalleriesView from './DesktopGalleriesView';
import { MobileViewMode } from '@/types/gallery';
import { MediaFilter } from '@/components/AppSidebar';
import { BaseGalleryProps, ViewModeProps, SidebarToggleProps } from '@/types/gallery-props';

// Combined props for GalleriesContainer
interface GalleriesContainerProps extends BaseGalleryProps, SidebarToggleProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const GalleriesContainer: React.FC<GalleriesContainerProps> = ({
  columnsCountLeft,
  columnsCountRight,
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
  mobileViewMode,
  setMobileViewMode,
  leftFilter = 'all',
  rightFilter = 'all',
  onToggleLeftPanel,
  onToggleRightPanel
}) => {
  const isMobile = useIsMobile();
  
  console.log(`GalleriesContainer rendering with columns: left=${columnsCountLeft}, right=${columnsCountRight}`);
  
  // Create props object for desktop/mobile views
  const sharedProps = {
    columnsCountLeft,
    columnsCountRight,
    selectedDirectoryIdLeft,
    selectedDirectoryIdRight,
    selectedIdsLeft,
    setSelectedIdsLeft,
    selectedIdsRight,
    setSelectedIdsRight,
    handleDeleteSelected,
    deleteDialogOpen,
    activeSide,
    setDeleteDialogOpen,
    deleteMutation,
    leftFilter,
    rightFilter,
    onToggleLeftPanel,
    onToggleRightPanel
  };
  
  // Add custom CSS variables for scrollbar colors
  React.useEffect(() => {
    document.documentElement.style.setProperty('--scrollbar-thumb', '100, 100, 100');
    document.documentElement.style.setProperty('--scrollbar-track', '50, 50, 50');
  }, []);
  
  // Return appropriate view based on device type
  return (
    <div className="flex-1 overflow-hidden relative h-[calc(100vh-120px)]">
      {isMobile ? (
        <MobileGalleriesView
          {...sharedProps}
          mobileViewMode={mobileViewMode}
          setMobileViewMode={setMobileViewMode}
        />
      ) : (
        <DesktopGalleriesView
          {...sharedProps}
          viewMode={mobileViewMode}
          mobileViewMode={mobileViewMode}
        />
      )}
    </div>
  );
};

export default GalleriesContainer;
