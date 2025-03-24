
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface GallerySkeletonsProps {
  columnsCount: number;
}

const GallerySkeletons: React.FC<GallerySkeletonsProps> = ({ columnsCount }) => {
  const isMobile = useIsMobile();
  
  // Generate grid template columns style based on column count
  const getGridStyle = () => {
    if (isMobile) {
      return { 
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
      };
    }
    
    return { 
      gridTemplateColumns: `repeat(${columnsCount}, minmax(0, 1fr))`
    };
  };
  
  return (
    <div 
      className="grid gap-4 p-4"
      style={getGridStyle()}
    >
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="aspect-square">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export default GallerySkeletons;
