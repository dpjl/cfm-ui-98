
import React, { memo } from 'react';
import { RefreshCw, Trash2, PanelLeftClose, ChevronDown, ChevronUp, Server } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { MobileViewMode } from '@/types/gallery';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

interface PageHeaderProps {
  selectedIdsLeft?: string[];
  selectedIdsRight?: string[];
  onRefresh: () => void;
  onDelete: () => void;
  isDeletionPending: boolean;
  isSidebarOpen?: boolean;
  onCloseSidebars?: () => void;
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  onToggleServerPanel?: () => void;
  isServerPanelOpen?: boolean;
}

const PageHeader = memo(({
  selectedIdsLeft = [],
  selectedIdsRight = [],
  onRefresh,
  onDelete,
  isDeletionPending,
  isSidebarOpen = false,
  onCloseSidebars,
  mobileViewMode,
  setMobileViewMode,
  onToggleServerPanel,
  isServerPanelOpen = false
}: PageHeaderProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const selectedCount = selectedIdsLeft.length + selectedIdsRight.length;
  const hasSelections = selectedCount > 0;

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm p-3 flex items-center justify-between border-b border-border/30">
      {/* Left section with logo and title */}
      <div className="flex items-center gap-4">
        <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
        <h1 className="text-lg font-medium">{t('media_gallery')}</h1>
      </div>
      
      {/* Right section with controls */}
      <div className="flex items-center gap-2">
        {/* Server status toggle on mobile */}
        {isMobile && onToggleServerPanel && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleServerPanel}
                  className="h-8 w-8"
                >
                  <Server className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('server_status')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Refresh button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={onRefresh}
                disabled={isDeletionPending}
                className={isMobile ? "px-2" : ""}
              >
                <RefreshCw className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
                {isMobile && t('refresh')}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('refresh')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Delete button - only shown when selections exist */}
        {hasSelections && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="destructive"
                  size={isMobile ? "sm" : "icon"}
                  onClick={onDelete}
                  disabled={isDeletionPending}
                  className={isMobile ? "px-2" : ""}
                >
                  <Trash2 className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
                  {isMobile && `${t('delete')} (${selectedCount})`}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{`${t('delete')} (${selectedCount})`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Close sidebars button - only shown when at least one sidebar is open */}
        {isSidebarOpen && onCloseSidebars && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "icon"}
                  onClick={onCloseSidebars}
                  className={isMobile ? "px-2" : ""}
                >
                  <PanelLeftClose className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
                  {isMobile && t('close_sidebars')}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t('close_sidebars')}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {/* Theme and Language toggles */}
        <div className="flex items-center gap-2 ml-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
