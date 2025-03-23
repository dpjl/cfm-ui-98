
import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Folder, 
  Files, 
  Calendar, 
  FileText, 
  Gauge 
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { fetchServerStatus } from '@/api/serverApi';

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

  useEffect(() => {
    const getServerStatus = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServerStatus();
        setStatus(data);
        setError(null);
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

    getServerStatus();
    // Poll for server status every 30 seconds
    const intervalId = setInterval(getServerStatus, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

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
                "flex items-center gap-2 px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm text-slate-100",
                "border-b border-slate-700 rounded-b-lg shadow-md transition-all duration-200",
                "hover:bg-slate-800/90"
              )}
            >
              <span className="text-xs font-medium">Server status</span>
              {status ? (
                status.isAccessible ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-500" />
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
          <div className="bg-slate-900/95 backdrop-blur-md text-slate-100 p-4 border-b border-slate-700 shadow-lg">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold flex items-center gap-2">
                  <Gauge className="h-4 w-4" />
                  System Information
                </h2>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {isLoading ? 'Refreshing...' : 'Last updated: just now'}
                  </span>
                  
                  <div className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    status?.isAccessible 
                      ? "bg-green-400/20 text-green-400" 
                      : "bg-red-500/20 text-red-500"
                  )}>
                    {status?.isAccessible ? 'Connected' : 'Disconnected'}
                  </div>
                </div>
              </div>
              
              <Separator className="bg-slate-700/50 mb-3" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-slate-800/50 border-slate-700 shadow-md p-3">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300">
                    <Folder className="h-3.5 w-3.5" />
                    Directories
                  </div>
                  
                  <div className="space-y-2 ml-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Source:</span>
                      <span className="font-mono text-slate-200 truncate max-w-60" title={status?.sourceDirectory || ''}>
                        {status?.sourceDirectory || '—'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Destination:</span>
                      <span className="font-mono text-slate-200 truncate max-w-60" title={status?.destinationDirectory || ''}>
                        {status?.destinationDirectory || '—'}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700 shadow-md p-3">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300">
                    <Files className="h-3.5 w-3.5" />
                    File Counts
                  </div>
                  
                  <div className="space-y-2 ml-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Source:</span>
                      <span className="font-mono text-slate-200">
                        {status?.sourceFileCount.toLocaleString() || '—'} files
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Destination:</span>
                      <span className="font-mono text-slate-200">
                        {status?.destinationFileCount.toLocaleString() || '—'} files
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700 shadow-md p-3">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300">
                    <Calendar className="h-3.5 w-3.5" />
                    Last Execution
                  </div>
                  
                  <div className="space-y-2 ml-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Date:</span>
                      <span className="font-mono text-slate-200">
                        {status?.lastExecutionDate 
                          ? new Date(status.lastExecutionDate).toLocaleString('fr-FR') 
                          : 'Never executed'}
                      </span>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-slate-800/50 border-slate-700 shadow-md p-3">
                  <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300">
                    <FileText className="h-3.5 w-3.5" />
                    Configuration
                  </div>
                  
                  <div className="space-y-2 ml-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Destination Format:</span>
                      <span className="font-mono text-slate-200">
                        {status?.destinationFormat || '—'}
                      </span>
                    </div>
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
