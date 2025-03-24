
import React, { useMemo, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LazyMediaItem from '@/components/LazyMediaItem';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { DetailedMediaInfo } from '@/api/imageApi';

interface GalleryGridProps {
  mediaIds: string[];
  selectedIds: string[];
  onSelectId: (id: string) => void;
  columnsCount: number;
  viewMode?: 'single' | 'split';
  showDates?: boolean;
  updateMediaInfo?: (id: string, info: DetailedMediaInfo | null) => void;
  position?: 'source' | 'destination';
}

// Version mémorisée de LazyMediaItem
const MemoizedLazyMediaItem = memo(LazyMediaItem);

const GalleryGrid: React.FC<GalleryGridProps> = ({
  mediaIds,
  selectedIds,
  onSelectId,
  columnsCount,
  viewMode = 'single',
  showDates = false,
  updateMediaInfo,
  position = 'source'
}) => {
  const isMobile = useIsMobile();
  
  // Générer le style des colonnes en fonction du nombre de colonnes - mémorisé
  const gridStyle = useMemo(() => {
    return { 
      gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
    };
  }, [columnsCount]);
  
  // Déterminer la taille des écarts en fonction de l'appareil et du mode d'affichage - mémorisé
  const gapClass = useMemo(() => {
    if (isMobile) {
      return columnsCount <= 2 ? 'gap-1' : 'gap-2';
    }
    return 'gap-4';
  }, [isMobile, columnsCount]);
  
  return (
    <div 
      className={cn("grid w-full h-full content-start p-2 gallery-grid", gapClass)}
      style={gridStyle}
    >
      <AnimatePresence>
        {mediaIds.map((id, index) => (
          <MemoizedLazyMediaItem
            key={id}
            id={id}
            selected={selectedIds.includes(id)}
            onSelect={() => onSelectId(id)}
            index={index}
            showDates={showDates}
            updateMediaInfo={updateMediaInfo}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default memo(GalleryGrid);
