
import React from 'react';
import { MobileViewMode } from '@/types/gallery';
import PageHeader from '@/components/layout/PageHeader';

interface GalleryPageHeaderProps {
  onRefresh: () => void;
  isDeletionPending: boolean;
  isSidebarOpen: boolean;
  onCloseSidebars: () => void;
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  selectedIdsLeft: string[];
  selectedIdsRight: string[];
  onDelete: () => void;
  onToggleServerPanel: () => void;
  isServerPanelOpen: boolean;
}

const GalleryPageHeader: React.FC<GalleryPageHeaderProps> = ({
  onRefresh,
  isDeletionPending,
  isSidebarOpen,
  onCloseSidebars,
  mobileViewMode,
  setMobileViewMode,
  selectedIdsLeft,
  selectedIdsRight,
  onDelete,
  onToggleServerPanel,
  isServerPanelOpen
}) => {
  return (
    <PageHeader 
      onRefresh={onRefresh}
      isDeletionPending={isDeletionPending}
      isSidebarOpen={isSidebarOpen}
      onCloseSidebars={onCloseSidebars}
      mobileViewMode={mobileViewMode}
      setMobileViewMode={setMobileViewMode}
      selectedIdsLeft={selectedIdsLeft}
      selectedIdsRight={selectedIdsRight}
      onDelete={onDelete}
      onToggleServerPanel={onToggleServerPanel}
      isServerPanelOpen={isServerPanelOpen}
    />
  );
};

export default GalleryPageHeader;
