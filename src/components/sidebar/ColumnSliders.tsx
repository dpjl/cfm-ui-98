
import React from 'react';
import ColumnSlider from '@/components/sidebar/ColumnSlider';
import { useLanguage } from '@/hooks/use-language';
import { MobileViewMode } from '@/types/gallery';

interface ColumnSlidersProps {
  position: 'left' | 'right';
  columnSettings: {
    desktopColumns: number;
    desktopSingleColumns: number;
    mobileSplitColumns: number;
    mobileSingleColumns: number;
    updateDesktopColumns: (value: number) => void;
    updateDesktopSingleColumns: (value: number) => void;
    updateMobileSplitColumns: (value: number) => void;
    updateMobileSingleColumns: (value: number) => void;
  };
  mobileViewMode: MobileViewMode;
  onColumnsChange?: (viewMode: string, count: number) => void;
}

const ColumnSliders: React.FC<ColumnSlidersProps> = ({
  position,
  columnSettings,
  mobileViewMode,
  onColumnsChange
}) => {
  const { t } = useLanguage();

  // Handle changes to columns and immediately update parent
  const handleColumnsChange = (viewMode: string, count: number) => {
    if (onColumnsChange) {
      console.log(`Column change: ${position} ${viewMode} to ${count}`);
      onColumnsChange(viewMode, count);
    }
  };

  return (
    <div className="space-y-2">
      <ColumnSlider 
        position={position}
        value={columnSettings.desktopColumns}
        onChange={(value) => {
          columnSettings.updateDesktopColumns(value);
          handleColumnsChange('desktop', value);
        }}
        min={2}
        max={10}
        label={t('desktop_columns')}
        viewType="desktop"
        currentMobileViewMode={mobileViewMode}
      />
      
      <ColumnSlider 
        position={position}
        value={columnSettings.desktopSingleColumns}
        onChange={(value) => {
          columnSettings.updateDesktopSingleColumns(value);
          handleColumnsChange('desktop-single', value);
        }}
        min={2}
        max={10}
        label={t('desktop_single_columns')}
        viewType="desktop-single"
        currentMobileViewMode={mobileViewMode}
      />
      
      <ColumnSlider 
        position={position}
        value={columnSettings.mobileSplitColumns}
        onChange={(value) => {
          columnSettings.updateMobileSplitColumns(value);
          handleColumnsChange('mobile-split', value);
        }}
        min={1}
        max={4}
        label={t('split_columns')}
        viewType="mobile-split"
        currentMobileViewMode={mobileViewMode}
      />
      
      <ColumnSlider 
        position={position}
        value={columnSettings.mobileSingleColumns}
        onChange={(value) => {
          columnSettings.updateMobileSingleColumns(value);
          handleColumnsChange('mobile-single', value);
        }}
        min={2}
        max={6}
        label={t('single_columns')}
        viewType="mobile-single"
        currentMobileViewMode={mobileViewMode}
      />
    </div>
  );
};

export default ColumnSliders;
