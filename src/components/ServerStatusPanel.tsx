
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ServerStatus } from '@/api/serverApi';
import { useServerStatus } from '@/hooks/use-server-status';
import { Badge } from '@/components/ui/badge';
import { HardDrive, Activity, Cog, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-breakpoint';

interface ServerStatusPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to format memory size
const formatMemory = (bytes: number | undefined): string => {
  if (bytes === undefined) return 'N/A';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let unitIndex = 0;
  
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  
  return `${value.toFixed(2)} ${units[unitIndex]}`;
};

// Indicator component
const StatusIndicator = ({ status }: { status: 'online' | 'offline' | 'warning' | 'unknown' }) => {
  const getColor = () => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${getColor()} animate-pulse`}></div>
      <span className="text-xs font-medium">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

const ServerStatusPanel: React.FC<ServerStatusPanelProps> = ({ isOpen, onOpenChange }) => {
  const { data, isLoading, error } = useServerStatus();
  const isMobile = useIsMobile();
  
  const serverStatus = data?.status;
  const serverSettings = data?.settings;
  
  const statusState = error 
    ? 'offline' 
    : isLoading 
      ? 'unknown' 
      : serverStatus?.isRunning 
        ? 'online' 
        : 'offline';
  
  const cpuLoad = serverStatus?.cpuUsage ? `${(serverStatus.cpuUsage * 100).toFixed(1)}%` : 'N/A';
  const memoryUsage = formatMemory(serverStatus?.memoryUsage);
  const totalMemory = formatMemory(serverStatus?.totalMemory);
  
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="max-h-[75vh] overflow-y-auto w-full sm:max-w-[800px] mx-auto">
        <SheetHeader className="text-left mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              {!isMobile && <SheetTitle>Server Status</SheetTitle>}
              <Badge variant={statusState === 'online' ? 'default' : 'destructive'} className="ml-2">
                <StatusIndicator status={statusState} />
              </Badge>
            </div>
            {serverStatus?.lastUpdated && (
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(serverStatus.lastUpdated).toLocaleString()}
              </div>
            )}
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="status">
          <TabsList className="mb-4">
            <TabsTrigger value="status" className="flex items-center gap-1.5">
              <Activity className="h-4 w-4" />
              <span>Status</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5">
              <Cog className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            {error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Server Connection Error</p>
                  <p className="text-sm">{String(error)}</p>
                </div>
              </div>
            ) : isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-24 bg-muted rounded-md"></div>
                  <div className="h-24 bg-muted rounded-md"></div>
                  <div className="h-24 bg-muted rounded-md"></div>
                  <div className="h-24 bg-muted rounded-md"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-md border">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      CPU Usage
                    </h3>
                    <p className="text-2xl font-bold">{cpuLoad}</p>
                    {serverStatus?.cpuCores && (
                      <p className="text-xs text-muted-foreground">Cores: {serverStatus.cpuCores}</p>
                    )}
                  </div>
                  
                  <div className="bg-card p-4 rounded-md border">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Memory
                    </h3>
                    <p className="text-2xl font-bold">{memoryUsage} <span className="text-sm font-normal text-muted-foreground">/ {totalMemory}</span></p>
                    {serverStatus?.memoryUsage !== undefined && serverStatus?.totalMemory !== undefined && (
                      <p className="text-xs text-muted-foreground">
                        {((serverStatus.memoryUsage / serverStatus.totalMemory) * 100).toFixed(1)}% used
                      </p>
                    )}
                  </div>
                  
                  {serverStatus?.diskUsage !== undefined && (
                    <div className="bg-card p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Disk Usage</h3>
                      <p className="text-2xl font-bold">{formatMemory(serverStatus.diskUsage)} <span className="text-sm font-normal text-muted-foreground">/ {formatMemory(serverStatus.totalDiskSpace)}</span></p>
                      {serverStatus?.diskUsage !== undefined && serverStatus?.totalDiskSpace !== undefined && (
                        <p className="text-xs text-muted-foreground">
                          {((serverStatus.diskUsage / serverStatus.totalDiskSpace) * 100).toFixed(1)}% used
                        </p>
                      )}
                    </div>
                  )}
                  
                  {serverStatus?.uptimeSeconds !== undefined && (
                    <div className="bg-card p-4 rounded-md border">
                      <h3 className="font-medium mb-2">Uptime</h3>
                      <p className="text-2xl font-bold">
                        {Math.floor(serverStatus.uptimeSeconds / 86400)}d {Math.floor((serverStatus.uptimeSeconds % 86400) / 3600)}h {Math.floor((serverStatus.uptimeSeconds % 3600) / 60)}m
                      </p>
                      <p className="text-xs text-muted-foreground">Server started: {new Date(Date.now() - serverStatus.uptimeSeconds * 1000).toLocaleString()}</p>
                    </div>
                  )}
                </div>
                
                {serverStatus?.activeProcesses && serverStatus.activeProcesses.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Active Processes ({serverStatus.activeProcesses.length})</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-1">Process</th>
                              <th className="text-right py-2 px-1">CPU</th>
                              <th className="text-right py-2 px-1">Memory</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serverStatus.activeProcesses.map((process, index) => (
                              <tr key={index} className="border-b border-border/40">
                                <td className="py-2 px-1">{process.name}</td>
                                <td className="text-right py-2 px-1">{(process.cpuUsage * 100).toFixed(1)}%</td>
                                <td className="text-right py-2 px-1">{formatMemory(process.memoryUsage)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            {error ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                <p>Unable to connect to server</p>
              </div>
            ) : isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-muted rounded-md"></div>
                <div className="h-12 bg-muted rounded-md"></div>
                <div className="h-12 bg-muted rounded-md"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {serverSettings && Object.entries(serverSettings).map(([key, value]) => (
                    <div key={key} className="bg-card p-4 rounded-md border">
                      <h3 className="font-medium mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                      <p className="text-sm">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Enabled
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
                              <AlertTriangle className="mr-1 h-3 w-3" /> Disabled
                            </Badge>
                          )
                        ) : typeof value === 'object' ? (
                          JSON.stringify(value, null, 2)
                        ) : (
                          String(value)
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button disabled={isLoading}>
                    Restart Server
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ServerStatusPanel;
