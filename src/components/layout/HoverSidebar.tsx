
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
  return (
    <div 
      className={`fixed ${position}-0 top-0 bottom-0 z-30`}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div className={`h-full transition-all duration-300 ${isHovering ? 'w-[16rem]' : 'w-[2rem]'}`}>
        <div className={`h-full bg-slate-900/70 backdrop-blur-sm ${isHovering ? 'opacity-95' : 'opacity-70'} transition-opacity duration-300`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default HoverSidebar;
