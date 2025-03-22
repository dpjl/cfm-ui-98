
import React from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface GallerySkeletonsProps {
  count?: number;
  columnsClassName?: string;
}

const GallerySkeletons: React.FC<GallerySkeletonsProps> = ({
  count = 12,
  columnsClassName = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
}) => {
  return (
    <div className={cn("grid gap-4", columnsClassName)}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={`skeleton-${i}`} 
          className="aspect-square rounded-lg bg-muted animate-pulse"
        />
      ))}
    </div>
  );
};

export default GallerySkeletons;
