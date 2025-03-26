
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface SelectionCheckboxProps {
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
  loaded: boolean;
}

const SelectionCheckbox: React.FC<SelectionCheckboxProps> = ({
  selected,
  onSelect,
  loaded
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div 
      className={cn(
        "absolute z-20 touch-none",
        isMobile ? "top-1 left-1" : "top-2 left-2"
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(e);
      }}
    >
      <Checkbox 
        checked={selected}
        className={cn(
          "border-2",
          isMobile ? "h-5 w-5" : "h-5 w-5",
          selected ? "border-primary bg-primary shadow-md" : "border-white bg-white/30 shadow-sm",
          "transition-all duration-200 ease-out touch-none",
          !loaded && "opacity-0"
        )}
      />
    </div>
  );
};

export default SelectionCheckbox;
