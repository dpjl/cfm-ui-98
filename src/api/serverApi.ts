
import { API_BASE_URL } from './constants';

export interface ServerStatus {
  isAccessible: boolean;
  sourceDirectory: string;
  destinationDirectory: string;
  sourceFileCount: number;
  destinationFileCount: number;
  lastExecutionDate: string | null;
  destinationFormat: string;
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
      sourceDirectory: '/mock/source/directory/path',
      destinationDirectory: '/mock/destination/directory/path',
      sourceFileCount: 1250,
      destinationFileCount: 1175,
      lastExecutionDate: new Date().toISOString(),
      destinationFormat: 'YYYY/MM/DD'
    };
  }
}
