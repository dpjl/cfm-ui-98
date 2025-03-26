
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { useLanguage } from '@/hooks/use-language';
import GallerySelectionBar from './GallerySelectionBar';
import { DetailedMediaInfo } from '@/api/imageApi';
import { Eye, Trash2, Download, PanelLeft, PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryToolbarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
  viewMode: 'single' | 'split';
  onOpenPreview: (id: string) => void;
  onDeleteSelected: () => void;
  onDownloadSelected: (ids: string[]) => void;
  mediaInfoMap?: Map<string, DetailedMediaInfo | null>;
  position?: 'source' | 'destination';
  onToggleSidebar?: () => void;
  isMultiSelectMode?: boolean;
  setIsMultiSelectMode?: (value: boolean) => void;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  onDeselectAll,
  showDates,
  onToggleDates,
  viewMode,
  onOpenPreview,
  onDeleteSelected,
  onDownloadSelected,
  mediaInfoMap = new Map(),
  position = 'source',
  onToggleSidebar,
  isMultiSelectMode = false,
  setIsMultiSelectMode
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Get info for the selected item (if only one is selected)
  const singleSelectedItemInfo = selectedIds.length === 1 ? mediaInfoMap.get(selectedIds[0]) : null;
  
  return (
    <div className="sticky top-0 z-10 py-2 space-y-2">
      {/* Selection bar */}
      <div className="flex justify-between items-center">
        <GallerySelectionBar
          selectedIds={selectedIds}
          mediaIds={mediaIds}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          showDates={showDates}
          onToggleDates={onToggleDates}
          viewMode={viewMode}
        />
        
        <div className="flex items-center gap-1">
          {/* Multi-select mode indicator */}
          {isMultiSelectMode && setIsMultiSelectMode && (
            <Badge 
              variant="outline" 
              className="bg-primary/10 hover:bg-primary/20 cursor-pointer"
              onClick={() => setIsMultiSelectMode(false)}
            >
              {t('multi_select')} ×
            </Badge>
          )}
          
          {/* Sidebar toggle for mobile */}
          {isMobile && onToggleSidebar && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 ml-1"
              onClick={onToggleSidebar}
            >
              {position === 'source' ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelRight className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Action buttons for selected items */}
      {selectedIds.length > 0 && (
        <div className={cn(
          "flex items-center gap-1 bg-accent/20 p-1.5 rounded-md transition-all",
          selectedIds.length === 1 && !isMultiSelectMode ? "opacity-0 h-0 pointer-events-none -mb-2" : "opacity-100"
        )}>
          <div className="flex-1 pl-1.5 text-xs font-medium">
            {selectedIds.length} {selectedIds.length === 1 ? t('item_selected') : t('items_selected')}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => onOpenPreview(selectedIds[0])}
            disabled={selectedIds.length !== 1}
          >
            <Eye className="h-4 w-4 mr-1" />
            {!isMobile && t('preview')}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8"
            onClick={() => onDownloadSelected(selectedIds)}
          >
            <Download className="h-4 w-4 mr-1" />
            {!isMobile && t('download')}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 text-destructive hover:text-destructive"
            onClick={onDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {!isMobile && t('delete')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GalleryToolbar;
