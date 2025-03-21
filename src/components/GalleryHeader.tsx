
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, FolderSearch, RefreshCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface GalleryHeaderProps {
  title: string;
  columnsCount: number;
  setColumnsCount: (value: number) => void;
  isLoading: boolean;
  selectedImages: string[];
  onRefresh: () => void;
  onDeleteSelected: () => void;
  isDeletionPending: boolean;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title,
  columnsCount,
  setColumnsCount,
  isLoading,
  selectedImages,
  onRefresh,
  onDeleteSelected,
  isDeletionPending
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <FolderSearch className="h-9 w-9 text-primary mr-3" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Columns: {columnsCount}</span>
          <Slider
            className="w-24 md:w-32"
            value={[columnsCount]}
            min={2}
            max={8}
            step={1}
            onValueChange={(value) => setColumnsCount(value[0])}
          />
        </div>
        
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="gap-2"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Loading...' : 'Refresh'}
        </Button>
        
        <Button
          onClick={onDeleteSelected}
          variant="destructive"
          size="sm"
          className="gap-2"
          disabled={selectedImages.length === 0 || isDeletionPending}
        >
          <Trash2 className="h-4 w-4" />
          {isDeletionPending ? 'Deleting...' : 'Delete Selected'}
        </Button>
      </div>
    </div>
  );
};

export default GalleryHeader;
