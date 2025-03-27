
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight, ChevronDown, X, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { MobileViewMode } from '@/types/gallery';

interface SidePanelProps {
  children: React.ReactNode;
  position: 'left' | 'right';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  viewMode?: MobileViewMode;
}

const SidePanel: React.FC<SidePanelProps> = ({
  children,
  position,
  isOpen,
  onOpenChange,
  title,
  viewMode = 'both'
}) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  // Determine if we should show the trigger button based on view mode
  // Fixed: Only show the settings button for the gallery that is visible
  const shouldShowTrigger = () => {
    if (viewMode === 'both') return true;
    if (position === 'left' && viewMode === 'left') return true;
    if (position === 'right' && viewMode === 'right') return true;
    return false;
  };

  // Mobile drawer implementation
  if (isMobile) {
    return <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          {/* Mobile trigger is handled externally */}
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] max-h-[85vh] rounded-t-xl">
          <div className="p-1 h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-medium">{title}</h3>
              <Button variant="ghost" size="sm" className="h-7 w-7" onClick={() => onOpenChange(false)}>
                <ChevronDown size={16} />
              </Button>
            </div>
            <div className="h-[calc(100%-2.5rem)] overflow-hidden">
              {children}
            </div>
          </div>
        </DrawerContent>
      </Drawer>;
  }

  // Custom trigger button that shows the appropriate icon based on position
  const renderTriggerButton = () => {
    if (!shouldShowTrigger()) return null;
    
    const icon = position === 'left' ? <PanelLeft size={16} /> : <PanelRight size={16} />;
    const alignmentClass = position === 'left' ? 'left-0' : 'right-0';
    const borderRadiusClass = position === 'left' ? 'rounded-r-md' : 'rounded-l-md';
    
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "absolute top-3 h-8 px-2 bg-background/80 backdrop-blur-sm hover:bg-background", 
          alignmentClass,
          borderRadiusClass
        )}
        onClick={() => onOpenChange(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <span className="flex items-center gap-2">
            {icon} {title}
          </span>
        ) : (
          icon
        )}
      </Button>
    );
  };

  // Desktop sheet implementation
  return <>
      {/* Closed state button/indicator */}
      {!isOpen && renderTriggerButton()}
      
      {/* Open state */}
      <Sheet open={isOpen} onOpenChange={onOpenChange} modal={false}>
        <SheetContent side={position} className={cn("w-72 p-0 border-0 shadow-lg bg-card/95 backdrop-blur-sm", position === 'left' ? "border-r" : "border-l")}>
          <div className="h-full flex flex-col p-0 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-medium">{title}</h3>
              {/* Add our custom close button */}
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenChange(false)}>
                <X size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>;
};

export default SidePanel;
