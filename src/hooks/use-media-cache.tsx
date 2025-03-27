import { useState, useCallback, useEffect } from 'react';
import { fetchMediaInfo } from '../api/imageApi';

type ThumbnailCache = Record<string, string>;
type InfoCache = Record<string, any>;
type PositionCache = Record<string, any>;

// Create a singleton cache instance that persists across renders
const globalCache = {
  thumbnails: {} as ThumbnailCache,
  info: {} as InfoCache,
  pendingThumbnails: new Set<string>(),
  pendingInfo: new Set<string>(),
  positionInfo: {} as PositionCache,
};

// Log cache stats periodically
const logCacheStats = () => {
  const thumbnailCount = Object.keys(globalCache.thumbnails).length;
  const infoCount = Object.keys(globalCache.info).length;
  console.info(`Cache stats - Thumbnails: ${thumbnailCount}, Info: ${infoCount}`);
};

// Mock thumbnail fetching function 
const fetchThumbnail = async (mediaId: string): Promise<Blob> => {
  // Simulated fetch
  return new Blob([], { type: 'image/jpeg' });
};

// Start the periodic logging
setInterval(logCacheStats, 2000);

export const useMediaCache = () => {
  const [, forceUpdate] = useState({});

  // Clear the cache if it gets too big
  useEffect(() => {
    const checkCacheSize = () => {
      const thumbnailCount = Object.keys(globalCache.thumbnails).length;
      const infoCount = Object.keys(globalCache.info).length;
      
      if (thumbnailCount > 500 || infoCount > 500) {
        // Keep the most recent 200 items
        const thumbnailKeys = Object.keys(globalCache.thumbnails);
        const infoKeys = Object.keys(globalCache.info);
        
        if (thumbnailKeys.length > 200) {
          const keysToRemove = thumbnailKeys.slice(0, thumbnailKeys.length - 200);
          keysToRemove.forEach(key => {
            delete globalCache.thumbnails[key];
          });
        }
        
        if (infoKeys.length > 200) {
          const keysToRemove = infoKeys.slice(0, infoKeys.length - 200);
          keysToRemove.forEach(key => {
            delete globalCache.info[key];
          });
        }
        
        forceUpdate({});
      }
    };
    
    const interval = setInterval(checkCacheSize, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Get thumbnail URL from cache or fetch it
  const getThumbnailUrl = useCallback(async (mediaId: string, fetchIfMissing = false) => {
    // Return from cache if available
    if (globalCache.thumbnails[mediaId]) {
      return globalCache.thumbnails[mediaId];
    }
    
    // Return null if we don't want to fetch
    if (!fetchIfMissing) {
      return null;
    }
    
    // Don't start duplicate fetches
    if (globalCache.pendingThumbnails.has(mediaId)) {
      return null;
    }
    
    // Mark as pending
    globalCache.pendingThumbnails.add(mediaId);
    
    try {
      const blob = await fetchThumbnail(mediaId);
      const url = URL.createObjectURL(blob);
      globalCache.thumbnails[mediaId] = url;
      forceUpdate({});
      return url;
    } catch (error) {
      console.error(`Failed to fetch thumbnail for media ${mediaId}:`, error);
      return null;
    } finally {
      globalCache.pendingThumbnails.delete(mediaId);
    }
  }, []);

  // Get media info from cache or fetch it
  const getMediaInfo = useCallback(async (mediaId: string, fetchIfMissing = false) => {
    // Return from cache if available
    if (globalCache.info[mediaId]) {
      return globalCache.info[mediaId];
    }
    
    // Return null if we don't want to fetch
    if (!fetchIfMissing) {
      return null;
    }
    
    // Don't start duplicate fetches
    if (globalCache.pendingInfo.has(mediaId)) {
      return null;
    }
    
    // Mark as pending
    globalCache.pendingInfo.add(mediaId);
    
    try {
      const info = await fetchMediaInfo(mediaId, 'source');
      globalCache.info[mediaId] = info;
      forceUpdate({});
      return info;
    } catch (error) {
      console.error(`Failed to fetch info for media ${mediaId}:`, error);
      return null;
    } finally {
      globalCache.pendingInfo.delete(mediaId);
    }
  }, []);

  // Prefetch media info (but don't wait for it)
  const prefetchMediaInfo = useCallback((mediaId: string) => {
    // Only prefetch if not already in cache or pending
    if (!globalCache.info[mediaId] && !globalCache.pendingInfo.has(mediaId)) {
      getMediaInfo(mediaId, true).catch(() => {
        // Ignore errors in prefetch
      });
    }
    
    // Only prefetch thumbnail if not already in cache or pending
    if (!globalCache.thumbnails[mediaId] && !globalCache.pendingThumbnails.has(mediaId)) {
      getThumbnailUrl(mediaId, true).catch(() => {
        // Ignore errors in prefetch
      });
    }
  }, [getMediaInfo, getThumbnailUrl]);

  // Methods for position-specific media info caching
  const getCachedMediaInfo = useCallback((id: string, position: string) => {
    const key = `${id}-${position}`;
    return globalCache.positionInfo[key] || null;
  }, []);

  const setCachedMediaInfo = useCallback((id: string, position: string, info: any) => {
    const key = `${id}-${position}`;
    globalCache.positionInfo[key] = info;
    forceUpdate({});
  }, []);

  return {
    getThumbnailUrl,
    getMediaInfo,
    prefetchMediaInfo,
    getCachedMediaInfo,
    setCachedMediaInfo
  };
};
