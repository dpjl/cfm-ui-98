
import React from 'react';
import { Button } from '@/components/ui/button';
import { Server, PanelLeft, PanelRight, SplitSquareVertical } from 'lucide-react';
import { MobileViewMode } from '@/types/gallery';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageToggle } from '@/components/LanguageToggle';

interface PageHeaderProps {
  onRefresh: () => void;
  isDeletionPending: boolean;
  isSidebarOpen: boolean;
  onCloseSidebars: () => void;
  mobileViewMode: MobileViewMode;
  setMobileViewMode: React.Dispatch<React.SetStateAction<MobileViewMode>>;
  selectedIdsLeft: string[];
  selectedIdsRight: string[];
  onDelete: () => void;
  onToggleServerPanel: () => void;
  isServerPanelOpen: boolean;
  onToggleLeftPanel?: () => void;
  onToggleRightPanel?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  onToggleServerPanel,
  isServerPanelOpen,
  mobileViewMode,
  setMobileViewMode,
  onToggleLeftPanel,
  onToggleRightPanel
}) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="relative z-20 flex items-center justify-between gap-2 p-2 md:p-4 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex items-center gap-2">
        <div className="mr-2">
          <img 
            src="/lovable-uploads/ddf36f1d-ca4f-4437-8e57-df7c6f916ccc.png" 
            alt="Logo" 
            className="h-8 md:h-10"
          />
        </div>
        
        {/* View mode switcher - Only shown on desktop */}
        {!isMobile && (
          <div className="ml-4 flex items-center gap-1 bg-background/90 border border-border/40 rounded-full p-1 shadow-sm">
            <Button
              variant={mobileViewMode === 'left' ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setMobileViewMode('left')}
              title="Source Gallery Only"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant={mobileViewMode === 'both' ? "default" : "ghost"}
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setMobileViewMode('both')}
              title="Split View"
            >
              <SplitSquareVertical className="h-4 w-4" />
            </Button>
            
            <Button
              variant={mobileViewMode === 'right' ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setMobileViewMode('right')}
              title="Destination Gallery Only"
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Add theme and language toggles */}
        <ThemeToggle />
        <LanguageToggle />
        
        <Button
          onClick={onToggleServerPanel}
          variant={isServerPanelOpen ? "default" : "outline"}
          size={isMobile ? "icon" : "default"}
          className="relative"
        >
          {isMobile ? (
            <Server className="h-4 w-4" />
          ) : (
            <>
              <Server className="h-4 w-4 mr-2" />
              <span>Serveur</span>
            </>
          )}
        </Button>
        
        {!isMobile && (
          <>
            {/* Left panel toggle button - desktop only */}
            {onToggleLeftPanel && (
              <Button
                onClick={onToggleLeftPanel}
                variant="outline"
                size="default"
                className="ml-2"
              >
                <PanelLeft className="h-4 w-4 mr-2" />
                <span>Source</span>
              </Button>
            )}
            
            {/* Right panel toggle button - desktop only */}
            {onToggleRightPanel && (
              <Button
                onClick={onToggleRightPanel}
                variant="outline"
                size="default"
              >
                <PanelRight className="h-4 w-4 mr-2" />
                <span>Destination</span>
              </Button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
