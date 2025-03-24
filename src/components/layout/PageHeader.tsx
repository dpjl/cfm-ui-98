
import React from 'react';
import { RefreshCw, PanelLeftClose, GalleryHorizontal, GalleryVertical, GalleryVerticalEnd } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GalleryHeader from '@/components/GalleryHeader';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { MobileViewMode } from '@/types/gallery';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

interface PageHeaderProps {
  columnsCount: number;
  setColumnsCount: React.Dispatch<React.SetStateAction<number>>;
  selectedIdsLeft: string[];
  selectedIdsRight: string[];
  onRefresh: () => void;
  onDelete: () => void;
  isDeletionPending: boolean;
  isSidebarOpen?: boolean;
  onCloseSidebars?: () => void;
  mobileViewMode?: MobileViewMode;
  setMobileViewMode?: React.Dispatch<React.SetStateAction<MobileViewMode>>;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  columnsCount,
  setColumnsCount,
  selectedIdsLeft,
  selectedIdsRight,
  onRefresh,
  onDelete,
  isDeletionPending,
  isSidebarOpen = false,
  onCloseSidebars,
  mobileViewMode = 'both',
  setMobileViewMode
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // Prepare extra buttons for the header
  const extraControls = (
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
  );

  // Custom header logo component
  const Logo = () => (
    <div className="flex items-center">
      <img src="/logo.svg" alt="Media Analyzer" className="h-8 w-8" />
    </div>
  );

  return (
    <GalleryHeader
      title={<Logo />}
      columnsCount={columnsCount}
      setColumnsCount={setColumnsCount}
      isLoading={false}
      selectedImages={[...selectedIdsLeft, ...selectedIdsRight]}
      onRefresh={onRefresh}
      onDeleteSelected={onDelete}
      isDeletionPending={isDeletionPending}
      extraControls={extraControls}
      hideMobileColumns={false}
      hideDeleteButton={true}
    />
  );
};

export default PageHeader;
