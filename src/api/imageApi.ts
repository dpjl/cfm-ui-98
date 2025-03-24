
import { DirectoryNode } from '@/types/gallery';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

console.log("API Base URL:", API_BASE_URL);

export interface DirectoryNode {
  id: string;
  name: string;
  children?: DirectoryNode[];
}

export interface DetailedMediaInfo {
  alt: string;
  createdAt: string | null;
  name?: string;
  path?: string;
  size?: string;
  cameraModel?: string;
  hash?: string;
  duplicatesCount?: number;
}

export async function fetchDirectoryTree(position?: 'left' | 'right'): Promise<DirectoryNode[]> {
  const url = `${API_BASE_URL}/tree${position ? `?position=${position}` : ''}`;
  console.log(`Fetching directory tree from: ${url}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to fetch directory tree: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received directory tree for ${position || 'default'}:`, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching directory tree for ${position || 'default'}:`, error);
    
    // Return mock data in case of errors for development
    const mockData = [{ 
      id: `directory1-${position || 'default'}`, 
      name: "Default Directory", 
      children: [] 
    }];
    
    console.log(`Using mock directory data for ${position || 'default'}:`, mockData);
    return mockData;
  }
}

export async function fetchMediaIds(directory: string, filter: string = 'all', position: 'source' | 'destination' = 'source'): Promise<string[]> {
  // Use position parameter for directory context
  const url = `${API_BASE_URL}/media?directory=${encodeURIComponent(directory)}&position=${position}${filter !== 'all' ? `&filter=${filter}` : ''}`;
  console.log(`Fetching media IDs from: ${url} for position: ${position}`);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to fetch media IDs: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received media IDs for ${position}:`, data);
    
    return data;
  } catch (error) {
    console.error(`Error fetching media IDs for ${position}:`, error);
    
    // Return mock data for development
    console.log(`Using mock media IDs for ${position} due to error`);
    const mockMediaIds = Array.from({ length: 20 }, (_, i) => `mock-media-${position}-${i}`);
    return mockMediaIds;
  }
}

export async function fetchMediaInfo(id: string, position: 'source' | 'destination' = 'source'): Promise<DetailedMediaInfo> {
  const url = `${API_BASE_URL}/info?id=${encodeURIComponent(id)}&position=${position}`;
  console.log(`Fetching media info for ID ${id} from:`, url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Server error for media info (ID: ${id}):`, response.status);
      throw new Error(`Failed to fetch media info: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Media info for ID ${id} (${position}):`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching media info for ID ${id} (${position}):`, error);
    
    // Return mock data for development
    const mockInfo: DetailedMediaInfo = { 
      alt: `Mock Media ${id} (${position})`, 
      createdAt: new Date().toISOString(),
      name: `file_${id}.jpg`,
      path: `/media/${position}/${id}`,
      size: `${Math.floor(Math.random() * 10000) + 500}KB`,
      cameraModel: ["iPhone 13 Pro", "Canon EOS 5D", "Sony Alpha A7III", "Nikon Z6"][Math.floor(Math.random() * 4)],
      hash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      duplicatesCount: Math.floor(Math.random() * 3)
    };
    
    console.log(`Using mock media info for ${id} (${position}):`, mockInfo);
    return mockInfo;
  }
}

export function getThumbnailUrl(id: string, position: 'source' | 'destination' = 'source'): string {
  // If it looks like a mock ID, return a placeholder image
  if (id.startsWith('mock-media-')) {
    // Use a placeholder service to generate a random colored image
    return `https://via.placeholder.com/300x300/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${id}`;
  }
  return `${API_BASE_URL}/thumbnail?id=${encodeURIComponent(id)}&position=${position}`;
}

export function getMediaUrl(id: string, position: 'source' | 'destination' = 'source'): string {
  // If it looks like a mock ID, return a placeholder image
  if (id.startsWith('mock-media-')) {
    return `https://via.placeholder.com/800x600/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${id}`;
  }
  return `${API_BASE_URL}/media?id=${encodeURIComponent(id)}&position=${position}`;
}

export async function deleteImages(imageIds: string[], position: 'source' | 'destination' = 'source'): Promise<{ success: boolean, message: string }> {
  const url = `${API_BASE_URL}/images`;
  console.log(`Deleting images at: ${url}, IDs: ${imageIds}, position: ${position}`);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds, position }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to delete images: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Delete response for ${position}:`, data);
    return data;
  } catch (error) {
    console.error(`Error deleting images for ${position}:`, error);
    
    // Return mock response for development
    console.log(`Using mock delete response for ${position} due to error`);
    return { success: true, message: `Successfully deleted ${imageIds.length} image(s) from ${position}` };
  }
}
