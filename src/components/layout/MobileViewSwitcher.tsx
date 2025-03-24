
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { GalleryVertical, GalleryHorizontal, GalleryVerticalEnd } from 'lucide-react';
import { MobileViewMode } from '@/types/gallery';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface MobileViewSwitcherProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const MobileViewSwitcher: React.FC<MobileViewSwitcherProps> = ({
  mobileViewMode,
  setMobileViewMode
}) => {
  const { t } = useLanguage();
  
  // Prevent re-renders by using separate handlers
  const handleSourceView = () => setMobileViewMode('left');
  const handleBothView = () => setMobileViewMode('both');
  const handleDestinationView = () => setMobileViewMode('right');
  
  return (
    <div className="mobile-view-switcher">
      <Button 
        variant={mobileViewMode === 'left' ? "default" : "outline"} 
        size="icon" 
        onClick={handleSourceView}
        className={cn(
          "h-10 w-10 rounded-full transition-all",
          mobileViewMode === 'left' ? "shadow-md" : "shadow-sm"
        )}
        aria-label="Show source gallery only"
      >
        <GalleryVertical className="h-5 w-5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'both' ? "default" : "outline"} 
        size="icon" 
        onClick={handleBothView}
        className={cn(
          "h-10 w-10 rounded-full transition-all",
          mobileViewMode === 'both' ? "shadow-md" : "shadow-sm"
        )}
        aria-label="Show both galleries side by side"
      >
        <GalleryHorizontal className="h-5 w-5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'right' ? "default" : "outline"} 
        size="icon" 
        onClick={handleDestinationView}
        className={cn(
          "h-10 w-10 rounded-full transition-all",
          mobileViewMode === 'right' ? "shadow-md" : "shadow-sm"
        )}
        aria-label="Show destination gallery only"
      >
        <GalleryVerticalEnd className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(MobileViewSwitcher);
