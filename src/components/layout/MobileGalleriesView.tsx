
import React from 'react';
import GalleryContainer from '@/components/GalleryContainer';
import { MediaFilter } from '@/components/AppSidebar';
import { useLanguage } from '@/hooks/use-language';

interface MobileGalleriesViewProps {
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
        {/* Fixed side-by-side galleries for mobile */}
        <div className="mobile-galleries-container">
          {/* Source Gallery */}
          <div className="mobile-gallery-panel">
            <GalleryContainer 
              title={t('source_gallery')}
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={2} // Always 2 columns on mobile
              selectedIds={selectedIdsLeft}
              setSelectedIds={setSelectedIdsLeft}
              onDeleteSelected={() => handleDeleteSelected('left')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'left'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode="split"
              filter={leftFilter}
            />
          </div>
          
          {/* Destination Gallery */}
          <div className="mobile-gallery-panel">
            <GalleryContainer 
              title={t('destination_gallery')}
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={2} // Always 2 columns on mobile
              selectedIds={selectedIdsRight}
              setSelectedIds={setSelectedIdsRight}
              onDeleteSelected={() => handleDeleteSelected('right')}
              deleteDialogOpen={deleteDialogOpen && activeSide === 'right'}
              setDeleteDialogOpen={setDeleteDialogOpen}
              deleteMutation={deleteMutation}
              hideHeader={true}
              viewMode="split"
              filter={rightFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MobileGalleriesView);
