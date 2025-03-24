
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
  
  // Déterminer le nombre de colonnes en fonction du mode de vue
  // En mode 'both', on a besoin de montrer plus d'images par ligne pour compenser la hauteur réduite
  const leftColumnsCount = mobileViewMode === 'both' ? 3 : 3;
  const rightColumnsCount = mobileViewMode === 'both' ? 3 : 3;
  
  return (
    <div className="flex-1 overflow-hidden h-full">
      <div className="h-full bg-background/50 backdrop-blur-sm rounded-lg border-2 border-border/40 shadow-sm">
        {/* Conteneur des galeries avec nouvelle approche de visibilité */}
        <div className={cn("mobile-galleries-container", `view-${mobileViewMode}`)}>
          {/* Galerie Source (Gauche) */}
          <div className="gallery-source">
            <GalleryContainer 
              title={t('source_gallery')}
              directory={selectedDirectoryIdLeft}
              position="left"
              columnsCount={leftColumnsCount}
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
            />
          </div>
          
          {/* Galerie Destination (Droite) */}
          <div className="gallery-destination">
            <GalleryContainer 
              title={t('destination_gallery')}
              directory={selectedDirectoryIdRight}
              position="right"
              columnsCount={rightColumnsCount}
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
            />
          </div>
        </div>
      </div>
      
      {/* Bouton flottant pour changer de mode */}
      <MobileViewSwitcher 
        mobileViewMode={mobileViewMode}
        setMobileViewMode={setMobileViewMode}
      />
    </div>
  );
};

export default React.memo(MobileGalleriesView);
