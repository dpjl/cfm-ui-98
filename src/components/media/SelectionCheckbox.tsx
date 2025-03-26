
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface SelectionCheckboxProps {
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
  loaded: boolean;
  mediaId: string; // Added for accessibility
}

const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({
  selected,
  onSelect,
  onTouchStart,
  onTouchEnd,
  loaded,
  mediaId
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "absolute z-20",
        isMobile ? "top-1 left-1" : "top-2 left-2"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(e);
      }}
      onTouchStart={() => {
        if (onTouchStart) onTouchStart();
      }}
      onTouchEnd={() => {
        if (onTouchEnd) onTouchEnd();
      }}
      role="checkbox"
      aria-checked={selected}
      aria-label={selected ? `Deselect media ${mediaId}` : `Select media ${mediaId}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          const mouseEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          onSelect(mouseEvent as unknown as React.MouseEvent);
        }
      }}
    >
      <Checkbox 
        checked={selected}
        className={cn(
          "border-2",
          isMobile ? "h-5 w-5" : "h-5 w-5",
          selected ? "border-primary bg-primary shadow-md" : "border-white bg-white/30 shadow-sm",
          "transition-all duration-200 ease-out",
          !loaded && "opacity-0"
        )}
        tabIndex={-1} // We want the parent div to receive focus, not the checkbox itself
      />
    </div>
  );
};

export default SelectionCheckbox;
