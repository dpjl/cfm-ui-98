
import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Folder, 
  Files, 
  Calendar, 
  FileText, 
  ServerCrash,
  Server,
  RefreshCw
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fetchServerStatus } from '@/api/serverApi';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { useTheme } from '@/hooks/use-theme';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ServerStatus {
  isAccessible: boolean;
  sourceDirectory: string;
  destinationDirectory: string;
  sourceFileCount: number;
  destinationFileCount: number;
  lastExecutionDate: string | null;
  destinationFormat: string;
}

const ServerStatusPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<ServerStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  const getServerStatus = async () => {
    try {
      setIsLoading(true);
      const data = await fetchServerStatus();
      setStatus(data);
      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to fetch server status:', err);
      setError('Unable to connect to server');
      // In case of error, set status with server inaccessible
      setStatus({
        isAccessible: false,
        sourceDirectory: '—',
        destinationDirectory: '—',
        sourceFileCount: 0,
        destinationFileCount: 0,
        lastExecutionDate: null,
        destinationFormat: '—'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getServerStatus();
    // Poll for server status every 30 seconds
    const intervalId = setInterval(getServerStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const triggerRefresh = () => {
    getServerStatus();
  };

  // Format the last refreshed time in a readable format
  const getLastRefreshedText = () => {
    if (!lastRefreshed) return 'Jamais';
    
    const now = new Date();
    const diffMs = now.getTime() - lastRefreshed.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    if (diffSec < 60) return `il y a ${diffSec} sec`;
    if (diffSec < 3600) return `il y a ${Math.floor(diffSec / 60)} min`;
    
    return format(lastRefreshed, isMobile ? 'HH:mm' : 'HH:mm:ss', { locale: fr });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-center cursor-pointer">
            <div 
              className={cn(
                "flex items-center gap-2 px-3 py-1.5",
                theme === 'dark' 
                  ? "bg-slate-900/90 backdrop-blur-sm text-slate-100 border-slate-700" 
                  : "bg-white/90 backdrop-blur-sm text-slate-800 border-slate-200",
                "border-b rounded-b-lg shadow-md transition-all duration-200",
                theme === 'dark' ? "hover:bg-slate-800/90" : "hover:bg-slate-50/90"
              )}
            >
              <span className="text-xs font-medium">Server Status</span>
              {isLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : status ? (
                status.isAccessible ? (
                  <Server className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <ServerCrash className="h-3.5 w-3.5 text-red-500" />
                )
              ) : (
                <div className="h-3.5 w-3.5 rounded-full bg-slate-600 animate-pulse" />
              )}
              {isOpen ? (
                <ChevronUp className="h-3.5 w-3.5 ml-1" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className={cn(
            "p-3 md:p-4 border-b shadow-lg",
            theme === 'dark' 
              ? "bg-slate-900/95 backdrop-blur-md text-slate-100 border-slate-700" 
              : "bg-white/95 backdrop-blur-md text-slate-800 border-slate-200",
          )}>
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    Dashboard Serveur
                  </h2>
                  
                  <Badge 
                    variant={status?.isAccessible ? "success" : "destructive"}
                    className="text-[0.65rem] h-5"
                  >
                    {status?.isAccessible ? 'En ligne' : 'Hors ligne'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Dernière actualisation: {getLastRefreshedText()}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={triggerRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                  </Button>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className={cn(
                  "p-3 border shadow-sm",
                  theme === 'dark' ? "bg-slate-800/70" : "bg-slate-50/70"
                )}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium">
                    <Folder className="h-3.5 w-3.5" />
                    Répertoires
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 text-xs">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="col-span-2 font-mono truncate" title={status?.sourceDirectory || ''}>
                        {status?.sourceDirectory || '—'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 text-xs">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="col-span-2 font-mono truncate" title={status?.destinationDirectory || ''}>
                        {status?.destinationDirectory || '—'}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className={cn(
                  "p-3 border shadow-sm",
                  theme === 'dark' ? "bg-slate-800/70" : "bg-slate-50/70"
                )}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium">
                    <Files className="h-3.5 w-3.5" />
                    Fichiers
                  </div>
                  
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 text-xs">
                      <span className="text-muted-foreground">Source:</span>
                      <span className="font-mono text-right">
                        {status?.sourceFileCount.toLocaleString()} fichiers
                      </span>
                    </div>
                    <div className="grid grid-cols-2 text-xs">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-mono text-right">
                        {status?.destinationFileCount.toLocaleString()} fichiers
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className={cn(
                  "p-3 border shadow-sm",
                  theme === 'dark' ? "bg-slate-800/70" : "bg-slate-50/70"
                )}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium">
                    <Calendar className="h-3.5 w-3.5" />
                    Dernière exécution
                  </div>
                  
                  <div className="text-xs">
                    <span className="font-mono">
                      {status?.lastExecutionDate 
                        ? format(new Date(status.lastExecutionDate), 
                            isMobile ? 'dd/MM/yy HH:mm' : 'dd MMMM yyyy HH:mm:ss', 
                            { locale: fr }) 
                        : 'Jamais exécuté'}
                    </span>
                  </div>
                </Card>
                
                <Card className={cn(
                  "p-3 border shadow-sm",
                  theme === 'dark' ? "bg-slate-800/70" : "bg-slate-50/70"
                )}>
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium">
                    <FileText className="h-3.5 w-3.5" />
                    Configuration
                  </div>
                  
                  <div className="grid grid-cols-3 text-xs">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="col-span-2 font-mono">
                      {status?.destinationFormat || '—'}
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ServerStatusPanel;
