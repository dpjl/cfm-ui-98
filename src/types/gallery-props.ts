
import { MobileViewMode } from '@/types/gallery';
import { MediaFilter } from '@/components/AppSidebar';

// Base gallery props that are common to most gallery components
export interface BaseGalleryProps {
  selectedDirectoryIdLeft: string;
  selectedDirectoryIdRight: string;
  columnsCountLeft: number;
  columnsCountRight: number;
  selectedIdsLeft: string[];
  setSelectedIdsLeft: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIdsRight: string[];
  setSelectedIdsRight: React.Dispatch<React.SetStateAction<string[]>>;
  handleDeleteSelected: (side: 'left' | 'right') => void;
  deleteDialogOpen: boolean;
  activeSide: 'left' | 'right';
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteMutation: any;
  leftFilter?: MediaFilter;
  rightFilter?: MediaFilter;
}

// Props specific to mobile/desktop view mode handling
export interface ViewModeProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  viewMode?: MobileViewMode;
}

// Props for sidebar toggle functionality
export interface SidebarToggleProps {
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}
