
import React from 'react';
import GalleryHeader from '@/components/GalleryHeader';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

interface PageHeaderProps {
  columnsCount: number;
  setColumnsCount: React.Dispatch<React.SetStateAction<number>>;
  selectedIdsLeft: string[];
  selectedIdsRight: string[];
  onRefresh: () => void;
  onDelete: () => void;
  isDeletionPending: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  columnsCount,
  setColumnsCount,
  selectedIdsLeft,
  selectedIdsRight,
  onRefresh,
  onDelete,
  isDeletionPending
}) => {
  return (
    <div className="p-4">
      <GalleryHeader 
        title="CFM"
        columnsCount={columnsCount}
        setColumnsCount={setColumnsCount}
        isLoading={false}
        selectedImages={[...selectedIdsLeft, ...selectedIdsRight]}
        onRefresh={onRefresh}
        onDeleteSelected={onDelete}
        isDeletionPending={isDeletionPending}
        additionalControls={
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        }
      />
    </div>
  );
};

export default PageHeader;
