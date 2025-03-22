
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckSquare, Square } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import LazyMediaItem from './LazyMediaItem';

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
  columnsClassName?: string;
  onPreviewMedia?: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({
  title,
  mediaIds,
  selectedIds,
  onSelectId,
  isLoading = false,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  onPreviewMedia
}) => {
  const [mounted, setMounted] = useState(false);
  const { t } = useLanguage();
  
  // We'll update these counts when we have metadata
  const [countInfo, setCountInfo] = useState({ photoCount: 0, videoCount: 0 });
  
  useEffect(() => {
    setMounted(true);
    // Default count - we'll assume all are photos initially
    setCountInfo({ photoCount: mediaIds.length, videoCount: 0 });
    return () => setMounted(false);
  }, [mediaIds.length]);

  const handleSelectAll = () => {
    if (selectedIds.length === mediaIds.length) {
      // Deselect all media
      selectedIds.forEach(id => onSelectId(id));
    } else {
      // Select all unselected media
      mediaIds.forEach(id => {
        if (!selectedIds.includes(id)) {
          onSelectId(id);
        }
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        <div className={cn("grid gap-4", columnsClassName)}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={`skeleton-${i}`} 
              className="aspect-square rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">
          {t('mediaGallery')} ({countInfo.photoCount} {t('photos')}, {countInfo.videoCount} videos)
        </h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleSelectAll}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            {selectedIds.length === mediaIds.length ? (
              <>
                <Square className="h-4 w-4" />
                {t('deselectAll')}
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                {t('selectAll')}
              </>
            )}
          </Button>
          <div className="text-sm text-muted-foreground">
            {selectedIds.length} {t('selected')}
          </div>
        </div>
      </div>
      
      {mediaIds.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">{t('noMediaFound')}</p>
        </div>
      ) : (
        <div className={cn("grid gap-4 h-full overflow-auto content-start", columnsClassName)}>
          <AnimatePresence>
            {mediaIds.map((id, index) => (
              <LazyMediaItem
                key={id}
                id={id}
                selected={selectedIds.includes(id)}
                onSelect={() => onSelectId(id)}
                onPreview={() => onPreviewMedia ? onPreviewMedia(id) : null}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Gallery;
