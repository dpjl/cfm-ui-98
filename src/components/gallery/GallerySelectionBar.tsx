
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckSquare, Square, Calendar, CalendarOff } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface GallerySelectionBarProps {
  selectedIds: string[];
  mediaIds: string[];
  onSelectAll: () => void;
  showDates: boolean;
  onToggleDates: () => void;
}

const GallerySelectionBar: React.FC<GallerySelectionBarProps> = ({
  selectedIds,
  mediaIds,
  onSelectAll,
  showDates,
  onToggleDates,
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center justify-between w-full bg-background/80 backdrop-blur-sm py-1 px-2 rounded-md z-10">
      <div className="flex items-center gap-2">
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
