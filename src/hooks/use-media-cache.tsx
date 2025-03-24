
import { useState, useCallback, useEffect } from 'react';
import { DetailedMediaInfo } from '@/api/imageApi';

// Type for our cache
interface MediaCache {
  thumbnails: Map<string, string>;
  info: Map<string, DetailedMediaInfo>;
}

// Create a global cache that persists between component renders
const globalCache: MediaCache = {
  thumbnails: new Map<string, string>(),
  info: new Map<string, DetailedMediaInfo>(),
};

export function useMediaCache() {
  const [cache] = useState<MediaCache>(globalCache);

  // Get cached thumbnail URL or return undefined if not cached
  const getCachedThumbnailUrl = useCallback((id: string, position: 'source' | 'destination'): string | undefined => {
    const cacheKey = `${id}-${position}`;
    return cache.thumbnails.get(cacheKey);
  }, [cache.thumbnails]);

  // Set a thumbnail URL in the cache
  const setCachedThumbnailUrl = useCallback((id: string, position: 'source' | 'destination', url: string): void => {
    const cacheKey = `${id}-${position}`;
    cache.thumbnails.set(cacheKey, url);
  }, [cache.thumbnails]);

  // Get cached media info or return undefined if not cached
  const getCachedMediaInfo = useCallback((id: string, position: 'source' | 'destination'): DetailedMediaInfo | undefined => {
    const cacheKey = `${id}-${position}`;
    return cache.info.get(cacheKey);
  }, [cache.info]);

  // Set media info in the cache
  const setCachedMediaInfo = useCallback((id: string, position: 'source' | 'destination', info: DetailedMediaInfo): void => {
    const cacheKey = `${id}-${position}`;
    cache.info.set(cacheKey, info);
  }, [cache.info]);

  // Just for debugging purposes - reduced frequency of logging
  useEffect(() => {
    const logInterval = 10000; // Log once every 10 seconds
    const intervalId = setInterval(() => {
      console.log(`Cache stats - Thumbnails: ${cache.thumbnails.size}, Info: ${cache.info.size}`);
    }, logInterval);
    
    return () => clearInterval(intervalId);
  }, [cache.thumbnails.size, cache.info.size]);

  return {
    getCachedThumbnailUrl,
    setCachedThumbnailUrl,
    getCachedMediaInfo,
    setCachedMediaInfo
  };
}
