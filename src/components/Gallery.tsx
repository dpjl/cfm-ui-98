
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import GalleryGrid from './gallery/GalleryGrid';
import GalleryEmptyState from './gallery/GalleryEmptyState';
import GallerySkeletons from './gallery/GallerySkeletons';
import GallerySelectionBar from './gallery/GallerySelectionBar';
import MediaInfoPanel from './media/MediaInfoPanel';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { getMediaUrl, DetailedMediaInfo } from '@/api/imageApi';
import { useToast } from '@/components/ui/use-toast';
import MediaPreview from './MediaPreview';

export interface ImageItem {
  id: string;
  src?: string;
  alt?: string;
  directory?: string;
  createdAt?: string;
  type?: "image" | "video";
}

interface GalleryProps {
  title: string;
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  isLoading?: boolean;
  columnsCount: number;
  onPreviewMedia?: (id: string) => void;
  viewMode?: 'single' | 'split';
  onDeleteSelected: () => void;
  position?: 'source' | 'destination';
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading = false,
  columnsCount,
  onPreviewMedia,
  viewMode = 'single',
  onDeleteSelected,
  position = 'source'
}) => {
  const [showDates, setShowDates] = useState(false);
  const [mediaInfoMap, setMediaInfoMap] = useState<Map<string, DetailedMediaInfo | null>>(new Map());
  const [previewMediaId, setPreviewMediaId] = useState<string | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Collect media info from child components
  const updateMediaInfo = (id: string, info: DetailedMediaInfo | null) => {
    setMediaInfoMap(prev => {
      const newMap = new Map(prev);
      newMap.set(id, info);
      return newMap;
    });
  };

  // Nouveau comportement de sélection amélioré et simplifié
  const handleSelectItem = (id: string, extendSelection: boolean) => {
    console.log(`Selecting item: ${id}, extend: ${extendSelection}`);
    
    // Si on utilise Shift, on étend la sélection
    if (extendSelection && lastSelectedId) {
      // Recherche des index
      const lastIndex = mediaIds.indexOf(lastSelectedId);
      const currentIndex = mediaIds.indexOf(id);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        // Définir la plage de sélection
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        
        // Sélectionner tous les éléments dans la plage
        const idsToSelect = mediaIds.slice(start, end + 1);
        
        // Créer un nouvel ensemble de sélection en conservant les éléments déjà sélectionnés
        const newSelection = new Set([...selectedIds]);
        
        // Ajouter tous les éléments de la plage
        idsToSelect.forEach(mediaId => {
          if (!newSelection.has(mediaId)) {
            newSelection.add(mediaId);
            onSelectId(mediaId); // Informer le parent de chaque nouvel élément sélectionné
          }
        });
      }
    } 
    // Si un seul élément est déjà sélectionné et qu'on clique sur un autre (sans Shift)
    else if (selectedIds.length === 1 && !selectedIds.includes(id) && !extendSelection) {
      // Désélectionner l'élément actuel
      onSelectId(selectedIds[0]);
      // Sélectionner le nouvel élément
      onSelectId(id);
    }
    // Si plusieurs éléments sont déjà sélectionnés, ou si on clique sur un élément déjà sélectionné
    else {
      // Basculer la sélection de cet élément
      onSelectId(id);
    }
    
    // Garder une trace du dernier élément sélectionné pour la fonctionnalité Shift
    setLastSelectedId(id);
  };

  const handleSelectAll = () => {
    // Sélectionner tous les médias
    mediaIds.forEach(id => {
      if (!selectedIds.includes(id)) {
        onSelectId(id);
      }
    });
  };

  const handleDeselectAll = () => {
    // Désélectionner tous les médias
    selectedIds.forEach(id => onSelectId(id));
  };

  const toggleDates = () => {
    setShowDates(prev => !prev);
  };
  
  const handleDownloadSelected = (ids: string[]) => {
    if (ids.length === 0) return;
    
    // Pour un seul fichier, déclencher le téléchargement direct
    if (ids.length === 1) {
      const a = document.createElement('a');
      a.href = getMediaUrl(ids[0], position);
      a.download = `media-${ids[0]}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    
    // Pour plusieurs fichiers, afficher une notification
    toast({
      title: "Multiple files download",
      description: `Downloading ${ids.length} files is not supported yet. Please select one file at a time.`,
    });
  };
  
  const handleOpenPreview = (id: string) => {
    setPreviewMediaId(id);
    if (onPreviewMedia) {
      onPreviewMedia(id);
    }
  };
  
  const handleClosePreview = () => {
    setPreviewMediaId(null);
  };
  
  const handleNavigatePreview = (direction: 'prev' | 'next') => {
    if (!previewMediaId || mediaIds.length === 0) return;
    
    const currentIndex = mediaIds.indexOf(previewMediaId);
    if (currentIndex === -1) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + mediaIds.length) % mediaIds.length;
    } else {
      newIndex = (currentIndex + 1) % mediaIds.length;
    }
    
    setPreviewMediaId(mediaIds[newIndex]);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mt-2">
          <GallerySkeletons columnsCount={columnsCount} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full relative">
      <div className="sticky top-0 z-10 p-2">
        <GallerySelectionBar 
          selectedIds={selectedIds}
          mediaIds={mediaIds}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          showDates={showDates}
          onToggleDates={toggleDates}
          viewMode={viewMode}
        />
        
        {selectedIds.length > 0 && (
          <MediaInfoPanel 
            selectedIds={selectedIds}
            onOpenPreview={handleOpenPreview}
            onDeleteSelected={onDeleteSelected}
            onDownloadSelected={handleDownloadSelected}
            mediaInfoMap={mediaInfoMap}
          />
        )}
      </div>
      
      {mediaIds.length === 0 ? (
        <GalleryEmptyState />
      ) : (
        <div className="flex-1 overflow-auto">
          <GalleryGrid
            mediaIds={mediaIds}
            selectedIds={selectedIds}
            onSelectId={handleSelectItem}
            columnsCount={columnsCount}
            viewMode={viewMode}
            showDates={showDates}
            updateMediaInfo={updateMediaInfo}
            position={position}
          />
        </div>
      )}
      
      <MediaPreview 
        mediaId={previewMediaId}
        isOpen={previewMediaId !== null}
        onClose={handleClosePreview}
        allMediaIds={mediaIds}
        onNavigate={handleNavigatePreview}
        position={position}
      />
    </div>
  );
};

export default Gallery;
