import React, { useState, useEffect } from 'react';
import { Server, ServerCrash, RefreshCw, Folder, Files, Calendar, FileText } from 'lucide-react';
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

interface ServerStatusPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServerStatusPanel: React.FC<ServerStatusPanelProps> = ({
  isOpen,
  onOpenChange,
}) => {
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
    const intervalId = setInterval(getServerStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const triggerRefresh = () => {
    getServerStatus();
  };

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
    <Collapsible 
      open={isOpen} 
      onOpenChange={onOpenChange}
      className="w-full"
    >
      <CollapsibleContent>
        <div className={cn(
          "p-3 md:p-4 border-b shadow-lg",
          theme === 'dark' 
            ? "bg-slate-900/95 backdrop-blur-md text-slate-100 border-slate-700" 
            : "bg-white/95 backdrop-blur-md text-slate-800 border-slate-200",
        )}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4" />
                <h2 className="text-sm font-medium">Dashboard Serveur</h2>
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
              <ServerInfoCard
                icon={<Folder className="h-3.5 w-3.5" />}
                title="Répertoires"
                items={[
                  { label: 'Source:', value: status?.sourceDirectory || '—' },
                  { label: 'Destination:', value: status?.destinationDirectory || '—' }
                ]}
              />
              
              <ServerInfoCard
                icon={<Files className="h-3.5 w-3.5" />}
                title="Fichiers"
                items={[
                  { label: 'Source:', value: `${status?.sourceFileCount.toLocaleString() || '0'} fichiers` },
                  { label: 'Destination:', value: `${status?.destinationFileCount.toLocaleString() || '0'} fichiers` }
                ]}
              />
              
              <ServerInfoCard
                icon={<Calendar className="h-3.5 w-3.5" />}
                title="Dernière exécution"
                items={[
                  {
                    label: '',
                    value: status?.lastExecutionDate 
                      ? format(new Date(status.lastExecutionDate), 
                          isMobile ? 'dd/MM/yy HH:mm' : 'dd MMMM yyyy HH:mm:ss', 
                          { locale: fr })
                      : 'Jamais exécuté'
                  }
                ]}
              />
              
              <ServerInfoCard
                icon={<FileText className="h-3.5 w-3.5" />}
                title="Configuration"
                items={[
                  { label: 'Format:', value: status?.destinationFormat || '—' }
                ]}
              />
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ServerInfoCardProps {
  icon: React.ReactNode;
  title: string;
  items: Array<{ label: string; value: string }>;
}

const ServerInfoCard: React.FC<ServerInfoCardProps> = ({ icon, title, items }) => {
  const { theme } = useTheme();
  
  return (
    <Card className={cn(
      "p-3 border shadow-sm",
      theme === 'dark' ? "bg-slate-800/70" : "bg-slate-50/70"
    )}>
      <div className="flex items-center gap-2 mb-2 text-xs font-medium">
        {icon}
        {title}
      </div>
      
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-3 text-xs">
            {item.label && (
              <span className="text-muted-foreground">{item.label}</span>
            )}
            <span className={cn(
              "font-mono truncate",
              item.label ? "col-span-2" : "col-span-3"
            )} title={item.value}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ServerStatusPanel;
