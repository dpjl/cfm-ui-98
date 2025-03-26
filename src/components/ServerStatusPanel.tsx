
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { ServerStatus } from '@/api/serverApi';
import { useServerStatus } from '@/hooks/use-server-status';
import { useLanguage } from '@/hooks/use-language';
import { Button } from "@/components/ui/button";
import { 
  ServerCrash, 
  Server, 
  ServerOff, 
  RefreshCw,
  Cpu,
  HardDrive,
  MemoryStick,
  Clock,
  Activity
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-breakpoint";

interface ServerStatusPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServerStatusPanel: React.FC<ServerStatusPanelProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const { 
    status, 
    isLoading, 
    isError, 
    refetch 
  } = useServerStatus({
    queryKey: ['serverStatus'],
    retry: 3,
    refetchInterval: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
  
  // Handle the refresh button click
  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          {isMobile ? (
            <div className="flex items-center justify-between">
              <SheetTitle className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                {t('server_status')}
              </SheetTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </Button>
            </div>
          ) : (
            <>
              <SheetTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                {t('server_status')}
              </SheetTitle>
              <SheetDescription>
                {status?.isAccessible ? 
                  t('server_running_description') : 
                  t('server_stopped_description')
                }
              </SheetDescription>
            </>
          )}
        </SheetHeader>
        
        {/* Status content */}
        {isError ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <ServerCrash size={48} className="text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-destructive">{t('error_fetching_status')}</h3>
              <p className="text-sm text-muted-foreground mt-2">{t('error_try_again')}</p>
            </div>
            <Button onClick={handleRefresh} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('retry')}
            </Button>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <RefreshCw size={32} className="animate-spin text-primary" />
            <p className="text-center text-sm text-muted-foreground">{t('loading_server_status')}</p>
          </div>
        ) : status ? (
          <div className="space-y-6">
            {/* Server status indicator */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status.isAccessible ? (
                    <Server className="h-6 w-6 text-primary" />
                  ) : (
                    <ServerOff className="h-6 w-6 text-destructive" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {status.isAccessible ? t('server_running') : t('server_stopped')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t('last_updated')}: {
                        status.lastExecutionDate ? 
                        new Date(status.lastExecutionDate).toLocaleString() : 
                        t('unknown')
                      }
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className={isMobile ? "hidden" : ""}
                >
                  <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                  {t('refresh')}
                </Button>
              </div>
            </div>
            
            {/* Server metrics - using sample metrics since the API has different properties */}
            {status.isAccessible && (
              <div className="space-y-4">
                {/* Source Files */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('source_files')}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{status.sourceFileCount} {t('files')}</span>
                    <span className="text-xs text-muted-foreground">
                      {t('source_directory')}: {status.sourceDirectory}
                    </span>
                  </div>
                </div>
                
                {/* Destination Files */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MemoryStick className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('destination_files')}</h3>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>{status.destinationFileCount} {t('files')}</span>
                    <span className="text-xs text-muted-foreground">
                      {t('destination_directory')}: {status.destinationDirectory}
                    </span>
                  </div>
                </div>
                
                {/* Destination Format */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('destination_format')}</h3>
                  </div>
                  <div className="text-sm">
                    {status.destinationFormat}
                  </div>
                </div>
                
                {/* Last Execution Date */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('last_execution')}</h3>
                  </div>
                  <div className="text-sm">
                    {status.lastExecutionDate ? 
                      new Date(status.lastExecutionDate).toLocaleString() : 
                      t('never_executed')}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}
        
        <SheetFooter className="mt-6">
          <div className="w-full text-center text-xs text-muted-foreground">
            {status?.sourceFileCount ? t('files_count', { count: status.sourceFileCount }) : ''}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ServerStatusPanel;
