
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Columns, Monitor, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MobileViewMode } from '@/types/gallery';

interface ColumnSliderProps {
  position: 'left' | 'right';
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  viewType: 'desktop' | 'mobile-split' | 'mobile-single';
  currentMobileViewMode?: MobileViewMode;
}

const ColumnSlider: React.FC<ColumnSliderProps> = ({
  position,
  value,
  onChange,
  min = 1,
  max = 8,
  step = 1,
  label,
  viewType,
  currentMobileViewMode
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Check if this slider should be visible based on the current view mode
  const isVisible = () => {
    if (!isMobile) return viewType === 'desktop';
    
    if (viewType === 'mobile-split') {
      return currentMobileViewMode === 'both';
    }
    
    if (viewType === 'mobile-single') {
      return currentMobileViewMode === position;
    }
    
    return false;
  };

  if (!isVisible()) return null;

  // Get appropriate icon based on view type
  const getIcon = () => {
    if (viewType === 'desktop') return <Monitor className="h-3 w-3" />;
    if (viewType === 'mobile-split') return <Smartphone className="h-3 w-3" />;
    return <Columns className="h-3 w-3" />;
  };

  return (
    <div className={cn(
      "flex flex-col space-y-1.5", 
      !isVisible() && "hidden"
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {getIcon()}
          <span>{label || t('columns')}: {value}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => onChange(vals[0])}
        className="w-full"
      />
    </div>
  );
};

export default ColumnSlider;
