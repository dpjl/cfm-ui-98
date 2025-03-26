
import React, { memo } from 'react';
import { Server } from 'lucide-react';
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
  onRefresh?: () => void;
  onDelete?: () => void;
  isDeletionPending?: boolean;
  isSidebarOpen?: boolean;
  onCloseSidebars?: () => void;
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  onToggleServerPanel?: () => void;
  isServerPanelOpen?: boolean;
}

const PageHeader = memo(({
  isSidebarOpen = false,
  onCloseSidebars,
  mobileViewMode,
  setMobileViewMode,
  onToggleServerPanel,
  isServerPanelOpen = false
}: PageHeaderProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm p-3 flex items-center justify-between border-b border-border/30">
      {/* Left section with logo only */}
      <div className="flex items-center gap-4">
        <img src="/lovable-uploads/logo2.png" alt="Logo" className="h-8 w-auto" />
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

        {/* Theme and Language toggles */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
