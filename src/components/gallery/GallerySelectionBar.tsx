
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between w-full">
      <Button
        onClick={onSelectAll}
        variant="outline"
        size={isMobile ? "icon" : "sm"}
        className={isMobile ? "h-8 w-8" : "gap-2"}
      >
        {selectedIds.length === mediaIds.length ? (
          <>
            <Square className="h-4 w-4" />
            {!isMobile && t('deselectAll')}
          </>
        ) : (
          <>
            <CheckSquare className="h-4 w-4" />
            {!isMobile && t('selectAll')}
          </>
        )}
      </Button>
      <div className={`text-sm text-muted-foreground ${isMobile ? 'text-xs' : ''}`}>
        {selectedIds.length} {t('selected')}
      </div>
    </div>
  );
};

export default GallerySelectionBar;
