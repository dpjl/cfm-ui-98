
import { useQuery } from '@tanstack/react-query';
import { fetchServerStatus, ServerStatus } from '@/api/serverApi';

export interface ServerStatusData {
  status: ServerStatus;
  settings?: Record<string, any>;
}

export function useServerStatus() {
  return useQuery({
    queryKey: ['serverStatus'],
    queryFn: async (): Promise<ServerStatusData> => {
      try {
        const status = await fetchServerStatus();
        
        // Mock settings for demonstration
        const settings = {
          autoSync: true,
          compressionEnabled: false,
          maxConcurrentOperations: 4,
          backupEnabled: true,
          notificationsEnabled: true,
          serverPort: 8080,
          logLevel: 'info'
        };
        
        return { status, settings };
      } catch (error) {
        throw error;
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
