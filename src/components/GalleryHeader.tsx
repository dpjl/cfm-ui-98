
import React, { ReactNode, memo } from 'react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GalleryHeaderProps {
  title: ReactNode;
  columnsCount: number;
  setColumnsCount: (value: number) => void;
  extraControls?: React.ReactNode;
  hideMobileColumns?: boolean;
}

// Using memo to prevent unnecessary re-renders
const GalleryHeader = memo(({ 
  title, 
  columnsCount, 
  setColumnsCount, 
  extraControls,
  hideMobileColumns = false
}: GalleryHeaderProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  // Render smaller header for mobile
  if (isMobile) {
    return (
      <div className="flex flex-col w-full gap-1 mb-1">
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
    <div className="flex justify-between items-center mb-3 w-full">
      <div className="flex items-center">
        {title}
      </div>

      <div className="flex items-center gap-4">
        {!hideMobileColumns && (
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
        )}
        
        {extraControls}
      </div>
    </div>
  );
});

// Set display name for debugging
GalleryHeader.displayName = 'GalleryHeader';

export default GalleryHeader;
