
import { ImageItem } from '@/components/Gallery';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

console.log("API Base URL:", API_BASE_URL);

export interface DirectoryNode {
  id: string;
  name: string;
  children?: DirectoryNode[];
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
    return [{ id: `directory1-${position || 'default'}`, name: "Default Directory", children: [] }];
  }
}

export async function fetchMediaIds(directory: string): Promise<string[]> {
  const url = `${API_BASE_URL}/media?directory=${encodeURIComponent(directory)}`;
  console.log("Fetching media IDs from:", url);
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to fetch media IDs: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Received media IDs:", data);
    
    return data;
  } catch (error) {
    console.error("Error fetching media IDs:", error);
    throw error;
  }
}

export async function fetchMediaInfo(id: string): Promise<{ alt: string, createdAt: string }> {
  const url = `${API_BASE_URL}/info?id=${encodeURIComponent(id)}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch media info: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching media info:", error);
    throw error;
  }
}

export function getThumbnailUrl(id: string): string {
  return `${API_BASE_URL}/thumbnail?id=${encodeURIComponent(id)}`;
}

export function getMediaUrl(id: string): string {
  return `${API_BASE_URL}/media?id=${encodeURIComponent(id)}`;
}

export async function deleteImages(imageIds: string[]): Promise<{ success: boolean, message: string }> {
  const url = `${API_BASE_URL}/images`;
  console.log("Deleting images at:", url, "IDs:", imageIds);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server responded with error:", response.status, errorText);
      throw new Error(`Failed to delete images: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Delete response:", data);
    return data;
  } catch (error) {
    console.error("Error deleting images:", error);
    throw error;
  }
}
