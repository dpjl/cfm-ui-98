
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MobileViewMode } from '@/types/gallery';

interface MobileViewSwitcherProps {
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const MobileViewSwitcher: React.FC<MobileViewSwitcherProps> = ({
  mobileViewMode,
  setMobileViewMode
}) => {
  // Use memoized callbacks to prevent unnecessary re-renders
  const handleLeftView = useCallback(() => {
    setMobileViewMode('left');
  }, [setMobileViewMode]);
  
  const handleSplitView = useCallback(() => {
    setMobileViewMode('both');
  }, [setMobileViewMode]);
  
  const handleRightView = useCallback(() => {
    setMobileViewMode('right');
  }, [setMobileViewMode]);
  
  return (
    <div className="bg-background shadow-md border border-border rounded-full p-2 flex gap-2">
      <Button 
        variant={mobileViewMode === 'left' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleLeftView}
        className="h-10 w-10 rounded-full"
        title="Source Gallery View"
      >
        <div className="relative h-5 w-5">
          <div className="absolute left-0 top-0 h-5 w-3.5 border-2 border-current rounded-l-sm"></div>
          <div className="absolute right-0 top-0 h-5 w-1 border-r-2 border-current"></div>
        </div>
      </Button>
      
      <Button 
        variant={mobileViewMode === 'both' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleSplitView}
        className="h-10 w-10 rounded-full"
        title="Split View"
      >
        <div className="relative h-5 w-5">
          <div className="absolute left-0 top-0 h-5 w-2 border-l-2 border-current"></div>
          <div className="absolute left-1/2 top-0 h-5 w-0 border-l-2 border-current"></div>
          <div className="absolute right-0 top-0 h-5 w-2 border-r-2 border-current"></div>
        </div>
      </Button>
      
      <Button 
        variant={mobileViewMode === 'right' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleRightView}
        className="h-10 w-10 rounded-full"
        title="Destination Gallery Only"
      >
        <div className="relative h-5 w-5">
          <div className="absolute left-0 top-0 h-5 w-1 border-l-2 border-current"></div>
          <div className="absolute right-0 top-0 h-5 w-3.5 border-2 border-current rounded-r-sm"></div>
        </div>
      </Button>
    </div>
  );
};

export default MobileViewSwitcher;
