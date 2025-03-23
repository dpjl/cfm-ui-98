
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-breakpoint';

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
                  <ChevronRight className="h-4 w-4 mt-0.5" />
                ) : (
                  <ChevronLeft className="h-4 w-4 mt-0.5" />
                )}
              </div>
            </div>
          )}
          
          {/* Sidebar content - only visible when expanded */}
          <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100 h-full' : 'opacity-0 h-0 overflow-hidden'}`}>
            {isHovering && (
              <div className="absolute top-4 right-4">
                <button 
                  className="p-2 rounded-full bg-slate-800/50 text-white"
                  onClick={() => onHoverChange(false)}
                >
                  {position === 'left' ? (
                    <ChevronLeft className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                  <ChevronRight className="h-4 w-4 mt-0.5" />
                ) : (
                  <ChevronLeft className="h-4 w-4 mt-0.5" />
                )}
              </div>
            </div>
          )}
          
          {/* Regular sidebar content - only visible when expanded */}
          <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100 h-full' : 'opacity-0 h-0 overflow-hidden'}`}>
            {childrenWithProps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverSidebar;
