
import React from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MobileViewMode } from '@/types/gallery';
import MobileViewSwitcher from './MobileViewSwitcher';
import { MediaFilter } from '@/components/AppSidebar';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface MobileGalleriesViewProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  selectedDirectoryIdLeft: string;
  selectedDirectoryIdRight: string;
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

const MobileGalleriesView: React.FC<MobileGalleriesViewProps> = ({
  mobileViewMode,
  setMobileViewMode,
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
  leftFilter = 'all',
  rightFilter = 'all'
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 overflow-hidden h-full">
      <div className="h-full bg-background/50 backdrop-blur-sm rounded-lg border-2 border-border/40 shadow-sm">
        {/* Main container with classname based on view mode */}
        <div className={cn("mobile-view-container", `mobile-view-${mobileViewMode}`)}>
          {/* Source Gallery */}
          <div className="mobile-gallery-panel gallery-source">
            <GalleryContainer 
              title={t('source_gallery')}
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={mobileViewMode === 'both' ? 2 : 3}
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode="single"
              filter={leftFilter}
              hideMobileColumns={true}
              mobileView={mobileViewMode}
            />
          </div>
          
          {/* Divider only shown in 'both' mode */}
          {mobileViewMode === 'both' && (
            <div className="gallery-divider"></div>
          )}
          
          {/* Destination Gallery */}
          <div className="mobile-gallery-panel gallery-destination">
            <GalleryContainer 
              title={t('destination_gallery')}
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={mobileViewMode === 'both' ? 2 : 3}
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode="single"
              filter={rightFilter}
              hideMobileColumns={true}
              mobileView={mobileViewMode}
            />
          </div>
        </div>
      </div>
      
      {/* View mode switcher */}
      <MobileViewSwitcher 
        mobileViewMode={mobileViewMode}
        setMobileViewMode={setMobileViewMode}
      />
    </div>
  );
};

export default React.memo(MobileGalleriesView);
