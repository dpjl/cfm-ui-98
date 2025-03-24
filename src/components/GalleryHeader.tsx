
import React, { ReactNode } from 'react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryHeaderProps {
  title: ReactNode;
  columnsCount: number;
  setColumnsCount: (value: number) => void;
  isLoading: boolean;
  selectedImages: string[];
  onRefresh: () => void;
  onDeleteSelected: () => void;
  isDeletionPending: boolean;
  extraControls?: React.ReactNode;
  hideMobileColumns?: boolean;
  hideDeleteButton?: boolean;
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
  extraControls,
  hideMobileColumns = false,
  hideDeleteButton = false
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Render smaller header for mobile
  if (isMobile) {
    return (
      <div className="flex flex-col w-full gap-2 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {title}
          </div>
          
          <div className="flex items-center gap-1">
            {extraControls}
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop header
  return (
    <div className="flex justify-between items-center mb-4 w-full">
      <div className="flex items-center">
        {title}
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
      </div>
    </div>
  );
};

export default GalleryHeader;
