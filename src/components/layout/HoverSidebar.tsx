
import React from 'react';

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
  // Clone children and pass isHovering prop
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { isHovering } as any);
    }
    return child;
  });

  // Vertical title text that appears when sidebar is collapsed
  const sidebarTitle = position === 'left' ? 'Source' : 'Destination';
  
  return (
    <div 
      className={`fixed ${position}-0 top-0 bottom-0 z-30`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className={`h-full transition-all duration-300 ${isHovering ? 'w-[16rem]' : 'w-[2rem]'}`}>
        <div className={`h-full bg-slate-900/70 backdrop-blur-sm ${isHovering ? 'opacity-95' : 'opacity-70'} transition-opacity duration-300 relative`}>
          {/* Vertical text when sidebar is collapsed */}
          {!isHovering && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`text-white font-medium tracking-wide transform ${position === 'left' ? 'rotate-90' : '-rotate-90'} origin-center whitespace-nowrap`}
              >
                {sidebarTitle}
              </div>
            </div>
          )}
          
          {/* Regular sidebar content - only visible when expanded */}
          <div className={`transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            {childrenWithProps}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoverSidebar;
