
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Calendar, CalendarOff, Layers } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface GallerySelectionBarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
  viewMode?: 'single' | 'split';
}

const GallerySelectionBar: React.FC<GallerySelectionBarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  onDeselectAll,
  showDates,
  onToggleDates,
  viewMode = 'single'
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const isCompactMode = isMobile && viewMode === 'split';
  
  const keyModifier = navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
  
  return (
    <div className="flex items-center justify-between w-full bg-background/90 backdrop-blur-sm py-1.5 px-3 rounded-md z-10 shadow-sm border border-border/30">
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
        
        {!isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-1 text-xs text-muted-foreground">
                  <Badge variant="outline" className="font-mono bg-muted/50 text-xs">
                    {keyModifier}
                  </Badge>
                  <span className="ml-1">+&nbsp;click for multi-select</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Hold {keyModifier} key while clicking to select multiple items</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {isMobile && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="ml-1 text-xs text-muted-foreground flex items-center">
                  <Layers className="h-3 w-3 mr-1" />
                  <span>Long press for multi-select</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Press and hold to enable multi-selection mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className={`text-xs text-muted-foreground`}>
        {selectedIds.length}/{mediaIds.length} {!isCompactMode && t('selected')}
      </div>
    </div>
  );
};

export default GallerySelectionBar;
