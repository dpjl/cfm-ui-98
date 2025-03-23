
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PanelLeft, PanelRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "fixed z-40 rounded-full shadow-md bg-primary text-primary-foreground hover:bg-primary/90",
              position === 'left' 
                ? "left-3 top-[4.5rem]" 
                : "right-3 top-[4.5rem]"
            )}
          >
            {position === 'left' ? <PanelLeft size={18} /> : <PanelRight size={18} />}
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh] max-h-[85vh] rounded-t-xl">
          <div className="p-1 h-full overflow-hidden">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="text-sm font-medium">{title}</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7"
                onClick={() => onOpenChange(false)}
              >
                <ChevronDown size={16} />
              </Button>
            </div>
            <div className="h-[calc(100%-2.5rem)] overflow-hidden">
              {children}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  // Desktop sheet implementation
  return (
    <>
      {/* Closed state button/indicator */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "fixed z-40 h-24 w-10 bg-primary/10 hover:bg-primary/20 transition-all duration-300",
            position === 'left' 
              ? "left-0 top-1/3 rounded-r-md" 
              : "right-0 top-1/3 rounded-l-md",
            isHovered && "bg-primary/20 w-12"
          )}
          onClick={() => onOpenChange(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            {position === 'left' 
              ? <ChevronRight size={16} className="text-foreground opacity-70" /> 
              : <ChevronLeft size={16} className="text-foreground opacity-70" />}
            <div 
              className={cn(
                "text-xs font-medium tracking-wide text-foreground/70 whitespace-nowrap", 
                position === 'left' 
                  ? "rotate-90 origin-center" 
                  : "-rotate-90 origin-center"
              )}
            >
              {title}
            </div>
          </div>
        </Button>
      )}
      
      {/* Open state */}
      <Sheet open={isOpen} onOpenChange={onOpenChange} modal={false}>
        <SheetContent 
          side={position} 
          className={cn(
            "w-72 p-0 border-0 shadow-lg bg-card/95 backdrop-blur-sm",
            position === 'left' ? "border-r" : "border-l"
          )}
          overlayClassName="fixed inset-0 z-30"
        >
          <div className="h-full flex flex-col p-0 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b">
              <h3 className="text-sm font-medium">{title}</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={() => onOpenChange(false)}
              >
                {position === 'left' 
                  ? <ChevronLeft size={16} /> 
                  : <ChevronRight size={16} />}
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              {children}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default SidePanel;
