
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
        "image-checkbox absolute z-20",
        isMobile ? "top-1 left-1" : "top-2 left-2"
      )}
      onClick={(e) => {
        e.stopPropagation(); // S'assurer que le clic ne se propage pas
        onSelect(e);
      }}
    >
      <Checkbox 
        checked={selected}
        className={cn(
          "border-2",
          isMobile ? "h-4 w-4" : "h-5 w-5",
          selected ? "border-primary bg-primary shadow-md" : "border-white bg-white/30 shadow-sm",
          "transition-all duration-200 ease-out",
          !loaded && "opacity-0"
        )}
        onTouchEnd={(e) => {
          e.stopPropagation(); // Arrêter la propagation sur les appareils tactiles
        }}
      />
    </div>
  );
};

export default SelectionCheckbox;
