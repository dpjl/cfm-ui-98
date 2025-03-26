
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Calendar, CalendarOff, Eye, Download, Trash2, PanelLeft, Users, UserPlus } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DetailedMediaInfo } from '@/api/imageApi';
import { SelectionMode } from '@/hooks/use-gallery-selection';

interface GalleryToolbarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
  viewMode?: 'single' | 'split';
  onOpenPreview?: (id: string) => void;
  onDeleteSelected: () => void;
  onDownloadSelected: (ids: string[]) => void;
  mediaInfoMap?: Map<string, DetailedMediaInfo | null>;
  position?: 'source' | 'destination';
  onToggleSidebar?: () => void;
  selectionMode: SelectionMode;
  onToggleSelectionMode: () => void;
}

const GalleryToolbar: React.FC<GalleryToolbarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  onDeselectAll,
  showDates,
  onToggleDates,
  viewMode = 'single',
  onOpenPreview,
  onDeleteSelected,
  onDownloadSelected,
  mediaInfoMap,
  position = 'source',
  onToggleSidebar,
  selectionMode,
  onToggleSelectionMode
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isCompactMode = viewMode === 'split';
  const hasSelections = selectedIds.length > 0;
  
  return (
    <div className="flex items-center justify-between w-full bg-background/90 backdrop-blur-sm py-1.5 px-3 rounded-md z-10 shadow-sm border border-border/30 mb-2">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSelectAll}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <CheckSquare className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{t('select_all')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onDeselectAll}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <Square className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{t('deselect_all')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleDates}
                variant={showDates ? "default" : "outline"}
                size="icon"
                className="h-7 w-7"
              >
                {showDates ? (
                  <Calendar className="h-3.5 w-3.5" />
                ) : (
                  <CalendarOff className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{showDates ? t('hide_dates') : t('show_dates')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Bouton de sélection multiple */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onToggleSelectionMode}
                variant={selectionMode === 'multiple' ? "default" : "outline"}
                size="icon"
                className="h-7 w-7"
              >
                {selectionMode === 'multiple' ? (
                  <Users className="h-3.5 w-3.5" />
                ) : (
                  <UserPlus className="h-3.5 w-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{selectionMode === 'multiple' ? t('single_selection') : t('multiple_selection')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Sidebar toggle for desktop mode only */}
        {!isMobile && onToggleSidebar && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onToggleSidebar}
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                >
                  <PanelLeft className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{t('gallery_settings')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`text-xs text-muted-foreground mr-2`}>
          {selectedIds.length}/{mediaIds.length} {!isCompactMode && t('selected')}
        </div>
        
        {hasSelections && (
          <>
            {onOpenPreview && selectedIds.length === 1 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onOpenPreview(selectedIds[0])}
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{t('preview')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => onDownloadSelected(selectedIds)}
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{t('download')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onDeleteSelected}
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>{t('delete')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
};

export default GalleryToolbar;
