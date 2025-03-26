
import { API_BASE_URL } from './constants';

export interface ServerStatus {
  isAccessible: boolean;
  isRunning?: boolean;
  sourceDirectory: string;
  destinationDirectory: string;
  sourceFileCount: number;
  destinationFileCount: number;
  lastExecutionDate: string | null;
  destinationFormat: string;
  
  // Additional properties used in the ServerStatusPanel
  cpuUsage?: number;
  cpuCores?: number;
  memoryUsage?: number;
  totalMemory?: number;
  diskUsage?: number;
  totalDiskSpace?: number;
  uptimeSeconds?: number;
  lastUpdated?: string;
  activeProcesses?: Array<{
    name: string;
    cpuUsage: number;
    memoryUsage: number;
  }>;
}

export async function fetchServerStatus(): Promise<ServerStatus> {
  console.log("Fetching server status from:", `${API_BASE_URL}/status`);
  
  try {
    const response = await fetch(`${API_BASE_URL}/status`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch server status: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Server status data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching server status:", error);
    
    // If we can't connect to the server, it's definitely not accessible
    if (error instanceof Error && (
      error.message.includes('Failed to fetch') || 
      error.message.includes('NetworkError')
    )) {
      throw new Error('Server is unreachable');
    }
    
    // For development, return mock data
    console.log("Using mock server status due to error");
    return {
      isAccessible: false,
      isRunning: false,
      sourceDirectory: '/mock/source/directory/path',
      destinationDirectory: '/mock/destination/directory/path',
      sourceFileCount: 1250,
      destinationFileCount: 1175,
      lastExecutionDate: new Date().toISOString(),
      destinationFormat: 'YYYY/MM/DD',
      
      // Mock data for the panel
      cpuUsage: 0.25,
      cpuCores: 8,
      memoryUsage: 4.2 * 1024 * 1024 * 1024, // 4.2 GB
      totalMemory: 16 * 1024 * 1024 * 1024, // 16 GB
      diskUsage: 256 * 1024 * 1024 * 1024, // 256 GB
      totalDiskSpace: 1024 * 1024 * 1024 * 1024, // 1 TB
      uptimeSeconds: 3600 * 24 * 3, // 3 days
      lastUpdated: new Date().toISOString(),
      activeProcesses: [
        { name: 'photo-sync', cpuUsage: 0.15, memoryUsage: 1.2 * 1024 * 1024 * 1024 },
        { name: 'database', cpuUsage: 0.08, memoryUsage: 0.8 * 1024 * 1024 * 1024 },
        { name: 'web-server', cpuUsage: 0.02, memoryUsage: 0.4 * 1024 * 1024 * 1024 }
      ]
    };
  }
}
