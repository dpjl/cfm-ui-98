
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchServerStatus, ServerStatus } from '@/api/serverApi';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { Server, HardDrive, Clock, FolderOpenDot, Database, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

interface ServerStatusPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServerStatusPanel: React.FC<ServerStatusPanelProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: fetchServerStatus,
    staleTime: 1000 * 60, // 1 minute
    enabled: isOpen, // Only fetch when panel is open
    retry: 1,
    meta: {
      onError: (err: Error) => {
        toast({
          title: t('error_fetching_server_status'),
          description: err instanceof Error ? err.message : t('unknown_error'),
          variant: "destructive",
        });
      }
    }
  });
  
  const statusData: ServerStatus | undefined = data;
  
  // Tabs for mobile and desktop
  const tabs = [
    { id: 'overview', label: t('overview'), icon: <Server className="h-4 w-4" /> },
    { id: 'storage', label: t('storage'), icon: <HardDrive className="h-4 w-4" /> },
    { id: 'source', label: t('source'), icon: <FolderOpenDot className="h-4 w-4" /> },
    { id: 'destination', label: t('destination'), icon: <Database className="h-4 w-4" /> },
  ];

  const renderContent = () => (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              {!isMobile && <span>{tab.label}</span>}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <AlertTriangle className="h-12 w-12 text-destructive" />
              <h3 className="text-lg font-medium">{t('server_error')}</h3>
              <p className="text-sm text-muted-foreground">{error instanceof Error ? error.message : t('unknown_error')}</p>
            </div>
          ) : (
            <>
              <TabsContent value="overview">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{t('server_status')}</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="bg-card p-4 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('connection_status')}</p>
                            <h4 className="text-lg font-semibold">
                              {statusData?.isAccessible ? 
                                <span className="text-green-500">{t('online')}</span> : 
                                <span className="text-destructive">{t('offline')}</span>
                              }
                            </h4>
                          </div>
                          <Badge variant={statusData?.isAccessible ? "default" : "destructive"}>
                            {statusData?.isAccessible ? t('connected') : t('disconnected')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="bg-card p-4 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-muted-foreground">{t('last_execution')}</p>
                            <h4 className="text-lg font-semibold">
                              {statusData?.lastExecutionDate ? 
                                formatDistanceToNow(new Date(statusData.lastExecutionDate), { addSuffix: true }) : 
                                t('never')
                              }
                            </h4>
                          </div>
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="storage">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">{t('storage_information')}</h3>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{t('source_files')}</span>
                        <span className="text-sm">{statusData?.sourceFileCount} {t('files')}</span>
                      </div>
                      <Progress value={(statusData?.sourceFileCount || 0) / (statusData ? Math.max((statusData.sourceFileCount + statusData.destinationFileCount), 1) : 1) * 100} />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">{t('destination_files')}</span>
                        <span className="text-sm">{statusData?.destinationFileCount} {t('files')}</span>
                      </div>
                      <Progress value={(statusData?.destinationFileCount || 0) / (statusData ? Math.max((statusData.sourceFileCount + statusData.destinationFileCount), 1) : 1) * 100} />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="source">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">{t('source_directory')}</h3>
                  <div className="bg-card p-4 rounded-lg border shadow-sm space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t('path')}</span>
                      <p className="font-mono text-sm bg-muted p-2 rounded mt-1 break-all">
                        {statusData?.sourceDirectory || t('not_configured')}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">{t('file_count')}</span>
                      <p className="text-lg font-semibold mt-1">
                        {statusData?.sourceFileCount || 0} {t('files')}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="destination">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-2">{t('destination_directory')}</h3>
                  <div className="bg-card p-4 rounded-lg border shadow-sm space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">{t('path')}</span>
                      <p className="font-mono text-sm bg-muted p-2 rounded mt-1 break-all">
                        {statusData?.destinationDirectory || t('not_configured')}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">{t('file_count')}</span>
                      <p className="text-lg font-semibold mt-1">
                        {statusData?.destinationFileCount || 0} {t('files')}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-sm text-muted-foreground">{t('format')}</span>
                      <p className="font-mono text-sm bg-muted p-2 rounded mt-1">
                        {statusData?.destinationFormat || 'YYYY/MM/DD'}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );

  // Use Sheet for Desktop and Drawer for Mobile
  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="px-0 pb-0">
        <DrawerHeader className="px-4 pb-0">
          <DrawerTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <span className="text-xl">{t('server')}</span>
          </DrawerTitle>
        </DrawerHeader>
        {renderContent()}
      </DrawerContent>
    </Drawer>
  ) : (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="max-w-md p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <span>{t('server_status')}</span>
          </SheetTitle>
        </SheetHeader>
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
};

export default ServerStatusPanel;
