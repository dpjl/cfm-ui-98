
import React from 'react';
import { RefreshCw, Trash2, PanelLeftClose, GalleryHorizontal, GalleryVertical, GalleryVerticalEnd } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import GalleryHeader from '@/components/GalleryHeader';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { MobileViewMode } from './GalleriesContainer';

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
  const selectedCount = selectedIdsLeft.length + selectedIdsRight.length;
  const hasSelections = selectedCount > 0;

  // Prepare extra buttons for the header
  const extraControls = (
    <div className="flex items-center gap-2">
      {/* Mobile view mode switcher */}
      {isMobile && setMobileViewMode && (
        <div className="mobile-view-switcher">
          <Button
            variant={mobileViewMode === 'left' ? "default" : "ghost"}
            size="icon"
            onClick={() => setMobileViewMode('left')}
            className="h-8 w-8"
          >
            <GalleryVertical className="h-4 w-4" />
          </Button>
          
          <Button
            variant={mobileViewMode === 'both' ? "default" : "ghost"}
            size="icon"
            onClick={() => setMobileViewMode('both')}
            className="h-8 w-8"
          >
            <GalleryHorizontal className="h-4 w-4" />
          </Button>
          
          <Button
            variant={mobileViewMode === 'right' ? "default" : "ghost"}
            size="icon"
            onClick={() => setMobileViewMode('right')}
            className="h-8 w-8"
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
    </div>
  );

  return (
    <GalleryHeader
      title={t('media_gallery')}
      columnsCount={columnsCount}
      setColumnsCount={setColumnsCount}
      isLoading={false}
      selectedImages={[...selectedIdsLeft, ...selectedIdsRight]}
      onRefresh={onRefresh}
      onDeleteSelected={onDelete}
      isDeletionPending={isDeletionPending}
      extraControls={extraControls}
    />
  );
};

export default PageHeader;
