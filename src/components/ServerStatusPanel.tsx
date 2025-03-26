
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
  Memory,
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
    meta: {
      onError: (error: Error) => {
        console.error('Error fetching server status:', error);
      }
    }
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
                {status?.isRunning ? 
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
        ) : (
          <div className="space-y-6">
            {/* Server status indicator */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status?.isRunning ? (
                    <Server className="h-6 w-6 text-primary" />
                  ) : (
                    <ServerOff className="h-6 w-6 text-destructive" />
                  )}
                  <div>
                    <h3 className="font-medium">
                      {status?.isRunning ? t('server_running') : t('server_stopped')}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {t('last_updated')}: {
                        status?.lastUpdated ? 
                        new Date(status.lastUpdated).toLocaleString() : 
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
            
            {/* Server metrics */}
            {status?.isRunning && (
              <div className="space-y-4">
                {/* CPU Usage */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('cpu_usage')}</h3>
                  </div>
                  <Progress value={status.cpuUsage} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span>{Math.round(status.cpuUsage)}%</span>
                    <span className="text-xs text-muted-foreground">
                      {t('cpu_cores')}: {status.cpuCores}
                    </span>
                  </div>
                </div>
                
                {/* Memory Usage */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Memory className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('memory_usage')}</h3>
                  </div>
                  <Progress 
                    value={(status.memoryUsage / status.totalMemory) * 100} 
                    className="h-2 mb-2" 
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {Math.round(status.memoryUsage / 1024 / 1024 / 1024 * 10) / 10} GB 
                      / {Math.round(status.totalMemory / 1024 / 1024 / 1024 * 10) / 10} GB
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((status.memoryUsage / status.totalMemory) * 100)}%
                    </span>
                  </div>
                </div>
                
                {/* Disk Usage */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('disk_usage')}</h3>
                  </div>
                  <Progress 
                    value={(status.diskUsage / status.totalDiskSpace) * 100} 
                    className="h-2 mb-2" 
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      {Math.round(status.diskUsage / 1024 / 1024 / 1024 * 10) / 10} GB 
                      / {Math.round(status.totalDiskSpace / 1024 / 1024 / 1024 * 10) / 10} GB
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((status.diskUsage / status.totalDiskSpace) * 100)}%
                    </span>
                  </div>
                </div>
                
                {/* Uptime */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('uptime')}</h3>
                  </div>
                  <div className="text-sm">
                    {Math.floor(status.uptimeSeconds / 86400)}d {Math.floor((status.uptimeSeconds % 86400) / 3600)}h {Math.floor((status.uptimeSeconds % 3600) / 60)}m {Math.floor(status.uptimeSeconds % 60)}s
                  </div>
                </div>
                
                {/* Active Processes */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-medium">{t('active_processes')}</h3>
                  </div>
                  <div className="text-sm flex justify-between items-center">
                    <span>{status.activeProcesses} {t('processes')}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <SheetFooter className="mt-6">
          <div className="w-full text-center text-xs text-muted-foreground">
            {status?.activeProcesses ? t('processes_running', { count: status.activeProcesses }) : ''}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ServerStatusPanel;
