
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight, ChevronDown, X, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

interface SidePanelProps {
  children: React.ReactNode;
  position: 'left' | 'right';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  children,
  position,
  isOpen,
  onOpenChange,
  title
}) => {
  const isMobile = useIsMobile();
  const [isHovered, setIsHovered] = useState(false);

  // Mobile drawer implementation
  if (isMobile) {
    return <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          
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
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={`h-8 w-auto px-2.5 absolute top-20 z-20 ${position === 'left' ? 'left-0 rounded-l-none' : 'right-0 rounded-r-none'} bg-card/95 backdrop-blur-sm shadow-md border-${position === 'left' ? 'r' : 'l'} flex items-center gap-1.5`}
        onClick={() => onOpenChange(true)}
      >
        {position === 'left' ? (
          <>
            <Settings className="h-3.5 w-3.5" />
            <ChevronRight className="h-3.5 w-3.5" />
          </>
        ) : (
          <>
            <ChevronLeft className="h-3.5 w-3.5" />
            <Settings className="h-3.5 w-3.5" />
          </>
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
