
import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { MobileViewMode } from '@/types/gallery';
import { PanelLeft, PanelLeftRight, PanelRight } from 'lucide-react';

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
        className="h-9 w-9 rounded-full"
        title="Source Gallery View"
      >
        <PanelLeft className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'both' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleSplitView}
        className="h-9 w-9 rounded-full"
        title="Split View"
      >
        <PanelLeftRight className="h-3.5 w-3.5" />
      </Button>
      
      <Button 
        variant={mobileViewMode === 'right' ? "default" : "ghost"} 
        size="icon" 
        onClick={handleRightView}
        className="h-9 w-9 rounded-full"
        title="Destination Gallery Only"
      >
        <PanelRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default MobileViewSwitcher;
