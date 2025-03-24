
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GallerySkeletonsProps {
  columnsCount: number;
}

const GallerySkeletons: React.FC<GallerySkeletonsProps> = ({ columnsCount }) => {
  const isMobile = useIsMobile();
  
  // Generate explicit grid-cols class based on column count
  const getGridColsClass = () => {
    if (isMobile) {
      return 'grid-cols-2';
    }
    return `grid-cols-${columnsCount}`;
  };
  
  return (
    <div className={cn("grid gap-4 p-4", getGridColsClass())}>
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="aspect-square">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default GallerySkeletons;
