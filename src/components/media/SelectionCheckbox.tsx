
import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface SelectionCheckboxProps {
  selected: boolean;
  onChange: (e: React.MouseEvent) => void;
  loaded: boolean;
  mediaId: string;
}

// Optimized SelectionCheckbox with controlled rendering
const SelectionCheckbox = memo(({
  selected,
  onChange,
  loaded,
  mediaId
}: SelectionCheckboxProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "absolute z-20",
        isMobile ? "top-1 left-1" : "top-2 left-2",
        !loaded && "opacity-0", // Hide until loaded
        "transition-opacity duration-200"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange(e);
      }}
      role="checkbox"
      aria-checked={selected}
      aria-label={selected ? `Deselect media ${mediaId}` : `Select media ${mediaId}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const mouseEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          onChange(mouseEvent as unknown as React.MouseEvent);
        }
      }}
    >
      <Checkbox 
        checked={selected}
        className={cn(
          "border-2",
          "h-5 w-5",
          selected ? "border-primary bg-primary" : "border-white bg-white/30",
          "transition-colors duration-150 ease-out"
        )}
        tabIndex={-1}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Optimized comparison function
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.loaded === nextProps.loaded
  );
});

SelectionCheckbox.displayName = 'SelectionCheckbox';

export default SelectionCheckbox;
