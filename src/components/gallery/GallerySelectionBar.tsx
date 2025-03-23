
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
        size="icon"
        className="h-7 w-7"
      >
        {selectedIds.length === mediaIds.length ? (
          <Square className="h-3.5 w-3.5" />
        ) : (
          <CheckSquare className="h-3.5 w-3.5" />
        )}
      </Button>
      <div className={`text-xs text-muted-foreground`}>
        {selectedIds.length} {t('selected')}
      </div>
    </div>
  );
};

export default GallerySelectionBar;
