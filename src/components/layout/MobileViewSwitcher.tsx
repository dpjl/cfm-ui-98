import React from 'react';
import { Button } from '@/components/ui/button';
import { GalleryHorizontal, GalleryVertical, GalleryVerticalEnd } from 'lucide-react';
import { MobileViewMode } from '@/types/gallery';

interface MobileViewSwitcherProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const MobileViewSwitcher: React.FC<MobileViewSwitcherProps> = ({
  mobileViewMode,
  setMobileViewMode
}) => {
  return (
    <div className="mobile-view-switcher">
      <Button 
        variant={mobileViewMode === 'left' ? "default" : "outline"} 
        size="icon" 
        onClick={() => setMobileViewMode('left')}
        className="h-10 w-10 rounded-full"
      >
        <GalleryVertical className="h-5 w-5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'both' ? "default" : "outline"} 
        size="icon" 
        onClick={() => setMobileViewMode('both')}
        className="h-10 w-10 rounded-full"
      >
        <GalleryHorizontal className="h-5 w-5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'right' ? "default" : "outline"} 
        size="icon" 
        onClick={() => setMobileViewMode('right')}
        className="h-10 w-10 rounded-full"
      >
        <GalleryVerticalEnd className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MobileViewSwitcher;
