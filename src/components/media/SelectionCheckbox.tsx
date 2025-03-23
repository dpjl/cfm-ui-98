
import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

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
  return (
    <div className="image-checkbox absolute top-2 right-2 z-20" onClick={(e) => e.stopPropagation()}>
      <Checkbox 
        checked={selected}
        className={cn(
          "h-5 w-5 border-2",
          selected ? "border-primary bg-primary" : "border-white bg-white/20",
          "transition-all duration-200 ease-out",
          !loaded && "opacity-0"
        )}
        onClick={onSelect}
      />
    </div>
  );
};

export default SelectionCheckbox;
