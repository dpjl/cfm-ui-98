
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, FolderSearch, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryHeaderProps {
  title: string;
  columnsCount: number;
  setColumnsCount: (value: number) => void;
  isLoading: boolean;
  selectedImages: string[];
  onRefresh: () => void;
  onDeleteSelected: () => void;
  isDeletionPending: boolean;
  extraControls?: React.ReactNode;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title,
  columnsCount,
  setColumnsCount,
  isLoading,
  selectedImages,
  onRefresh,
  onDeleteSelected,
  isDeletionPending,
  extraControls
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Render smaller header for mobile
  if (isMobile) {
    return (
      <div className="flex flex-col w-full gap-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FolderSearch className="h-5 w-5 text-primary mr-2" />
            <h1 className="text-xl font-bold tracking-tight truncate">
              {t('title')}
            </h1>
          </div>
          
          <div className="flex items-center gap-1">
            {extraControls}
          </div>
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 w-full">
            <span className="text-xs whitespace-nowrap">{t('columns')} {columnsCount}</span>
            <Slider
              className="w-full"
              value={[columnsCount]}
              min={2}
              max={8}
              step={1}
              onValueChange={(value) => setColumnsCount(value[0])}
            />
          </div>
          
          <div className="flex gap-1">
            <Button
              onClick={onRefresh}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button
              onClick={onDeleteSelected}
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              disabled={selectedImages.length === 0 || isDeletionPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop header
  return (
    <div className="flex justify-between items-center mb-6 w-full">
      <div className="flex items-center">
        <FolderSearch className="h-9 w-9 text-primary mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t('title')}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">{t('columns')} {columnsCount}</span>
          <Slider
            className="w-24 md:w-32"
            value={[columnsCount]}
            min={2}
            max={8}
            step={1}
            onValueChange={(value) => setColumnsCount(value[0])}
          />
        </div>
        
        {extraControls}
        
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? t('loading') : t('refresh')}
        </Button>
        
        <Button
          onClick={onDeleteSelected}
          variant="destructive"
          size="sm"
          className="gap-2"
          disabled={selectedImages.length === 0 || isDeletionPending}
        >
          <Trash2 className="h-4 w-4" />
          {isDeletionPending ? t('deleting') : t('delete')}
        </Button>
      </div>
    </div>
  );
};

export default GalleryHeader;
