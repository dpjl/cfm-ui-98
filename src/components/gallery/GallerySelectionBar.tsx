
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface GallerySelectionBarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
}

const GallerySelectionBar: React.FC<GallerySelectionBarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={onSelectAll}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        {selectedIds.length === mediaIds.length ? (
          <>
            <Square className="h-4 w-4" />
            {t('deselectAll')}
          </>
        ) : (
          <>
            <CheckSquare className="h-4 w-4" />
            {t('selectAll')}
          </>
        )}
      </Button>
      <div className="text-sm text-muted-foreground">
        {selectedIds.length} {t('selected')}
      </div>
    </div>
  );
};

export default GallerySelectionBar;
