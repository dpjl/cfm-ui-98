
import React, { memo, useMemo } from 'react';
import { RefreshCw, PanelLeftClose, GalleryHorizontal, GalleryVertical, GalleryVerticalEnd } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GalleryHeader from '@/components/GalleryHeader';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { MobileViewMode } from '@/types/gallery';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';
import { cn } from '@/lib/utils';

// Séparation du Logo en son propre composant mémoïsé
const Logo = memo(({ isMobile }: { isMobile: boolean }) => (
  <div className="flex items-center px-1 py-0.5">
    <img 
      src="/lovable-uploads/ddf36f1d-ca4f-4437-8e57-df7c6f916ccc.png" 
      alt="Media Analyzer" 
      className={cn(
        "h-auto",
        isMobile ? "w-20 ml-1" : "w-32 ml-1"
      )} 
    />
  </div>
));

Logo.displayName = 'Logo';

interface PageHeaderProps {
  columnsCount: number;
  setColumnsCount: React.Dispatch<React.SetStateAction<number>>;
  onRefresh: () => void;
  isSidebarOpen?: boolean;
  onCloseSidebars?: () => void;
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  isDeletionPending?: boolean;
}

// Composant principal du header complètement mémoïsé
const PageHeader = memo((props: PageHeaderProps) => {
  const { 
    columnsCount, 
    setColumnsCount, 
    onRefresh, 
    isSidebarOpen = false, 
    onCloseSidebars, 
    mobileViewMode = 'both', 
    setMobileViewMode,
    isDeletionPending = false
  } = props;

  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Mémoïsation des contrôles supplémentaires pour éviter les re-renders
  const extraControls = useMemo(() => (
    <div className="flex items-center gap-2">
      {/* Mobile view mode switcher */}
      {isMobile && setMobileViewMode && (
        <div className="flex items-center border rounded-md mr-1">
          <Button
            variant={mobileViewMode === 'left' ? "default" : "ghost"}
            size="icon"
            onClick={() => setMobileViewMode('left')}
            className="h-8 w-8 rounded-none rounded-l-md"
          >
            <GalleryVertical className="h-4 w-4" />
          </Button>
          
          <Button
            variant={mobileViewMode === 'both' ? "default" : "ghost"}
            size="icon"
            onClick={() => setMobileViewMode('both')}
            className="h-8 w-8 rounded-none"
          >
            <GalleryHorizontal className="h-4 w-4" />
          </Button>
          
          <Button
            variant={mobileViewMode === 'right' ? "default" : "ghost"}
            size="icon"
            onClick={() => setMobileViewMode('right')}
            className="h-8 w-8 rounded-none rounded-r-md"
          >
            <GalleryVerticalEnd className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Refresh button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefresh}
              disabled={isDeletionPending}
              className="h-9 w-9"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('refresh')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Close sidebars button - only shown when at least one sidebar is open */}
      {isSidebarOpen && onCloseSidebars && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={onCloseSidebars}
                className="h-9 w-9"
              >
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t('close_sidebars')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Language toggle */}
      <LanguageToggle />
      
      {/* Theme toggle */}
      <ThemeToggle />
    </div>
  ), [t, isMobile, mobileViewMode, isDeletionPending, isSidebarOpen, onRefresh, onCloseSidebars, setMobileViewMode]);

  // Titre mémoïsé avec le logo
  const headerTitle = useMemo(() => <Logo isMobile={isMobile} />, [isMobile]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <GalleryHeader
        title={headerTitle}
        columnsCount={columnsCount}
        setColumnsCount={setColumnsCount}
        extraControls={extraControls}
        hideMobileColumns={true}
      />
    </header>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
