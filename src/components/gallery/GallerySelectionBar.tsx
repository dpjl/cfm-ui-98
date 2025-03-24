
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Calendar, CalendarOff, X } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GallerySelectionBarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  onDeselectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
}

const GallerySelectionBar: React.FC<GallerySelectionBarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  onDeselectAll,
  showDates,
  onToggleDates,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between w-full bg-background/90 backdrop-blur-sm py-1.5 px-3 rounded-md z-10 shadow-sm border border-border/30">
      <div className="flex items-center gap-2">
        {/* Select All Button */}
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
        
        {/* Deselect All Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onDeselectAll}
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={selectedIds.length === 0}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{t('deselect_all')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Toggle Dates Button */}
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
      </div>
      
      <div className={`text-xs text-muted-foreground`}>
        {selectedIds.length}/{mediaIds.length} {t('selected')}
      </div>
    </div>
  );
};

export default GallerySelectionBar;
