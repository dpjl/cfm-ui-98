
import React from 'react';
import { ChevronLeft, ChevronRight, X, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Button } from '@/components/ui/button';

interface HoverSidebarProps {
  children: React.ReactNode;
  position: 'left' | 'right';
  isHovering: boolean;
  onHoverChange: (hovering: boolean) => void;
}

const HoverSidebar: React.FC<HoverSidebarProps> = ({
  children,
  position,
  isHovering,
  onHoverChange
}) => {
  const isMobile = useIsMobile();
  
  // Clone children and pass isHovering prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { isHovering } as any);
    }
    return child;
  });

  // Vertical title text that appears when sidebar is collapsed
  const sidebarTitle = position === 'left' ? 'Source' : 'Destination';
  
  // Close button handler
  const handleClose = () => {
    onHoverChange(false);
  };
  
  // Mobile version
  if (isMobile) {
    return (
      <div 
        className={`fixed ${position}-0 z-30 ${isHovering ? 'top-0 h-full w-[80vw]' : 'top-1/2 -translate-y-1/2 w-[2rem] h-auto'}`}
        onClick={() => !isHovering && onHoverChange(true)}
        style={{ transition: 'all 0.3s ease-in-out' }}
      >
        <div className={`h-full bg-slate-900/90 backdrop-blur-sm ${isHovering ? 'w-full rounded-r-xl' : 'w-full rounded-r-md'} transition-all duration-300 relative`}>
          {/* Vertical text for handle when sidebar is collapsed */}
          {!isHovering && (
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <div 
                className={`text-white font-medium tracking-wide transform ${position === 'left' ? 'rotate-90' : '-rotate-90'} origin-center whitespace-nowrap flex items-center gap-2 cursor-pointer`}
              >
                {sidebarTitle}
                {position === 'left' ? (
                  <div className="flex items-center gap-1">
                    <Settings className="h-3.5 w-3.5" />
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Sidebar content - only visible when expanded */}
          <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100 h-full' : 'opacity-0 h-0 overflow-hidden'}`}>
            {isHovering && (
              <Button
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-slate-800/50 text-white hover:bg-slate-700/70"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {childrenWithProps}
          </div>
        </div>
      </div>
    );
  }
  
  // Desktop version
  return (
    <div 
      className={`fixed ${position}-0 top-1/2 -translate-y-1/2 z-30 hidden md:block`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      style={{ 
        transition: 'all 0.3s ease-in-out',
        height: isHovering ? '100%' : 'auto', 
        top: isHovering ? '0' : '50%', 
        transform: isHovering ? 'translateY(0)' : 'translateY(-50%)' 
      }}
    >
      <div className={`h-full transition-all duration-300 ${isHovering ? 'w-[16rem]' : 'w-[2rem]'}`}>
        <div className={`h-full bg-slate-900/70 backdrop-blur-sm ${isHovering ? 'opacity-95 rounded-none' : 'opacity-80 rounded-md rounded-l-none'} transition-all duration-300 relative`}>
          {/* Vertical text when sidebar is collapsed */}
          {!isHovering && (
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <div 
                className={`text-white font-medium tracking-wide transform ${position === 'left' ? 'rotate-90' : '-rotate-90'} origin-center whitespace-nowrap flex items-center gap-2 cursor-pointer`}
              >
                {sidebarTitle}
                {position === 'left' ? (
                  <div className="flex items-center gap-1">
                    <Settings className="h-3.5 w-3.5" />
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <Settings className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Regular sidebar content - only visible when expanded */}
          <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100 h-full' : 'opacity-0 h-0 overflow-hidden'}`}>
            {isHovering && (
              <Button
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-slate-800/50 text-white hover:bg-slate-700/70 z-50"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            {childrenWithProps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverSidebar;
