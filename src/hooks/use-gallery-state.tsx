
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MediaItem } from '../types/gallery';
import { fetchMediaIds } from '../api/imageApi';
import { useDirectoryState } from './use-directory-state';
import { useMediaCache } from './use-media-cache';

export const useGalleryState = () => {
  const { currentDirectory } = useDirectoryState();
  const { prefetchMediaInfo } = useMediaCache();
  const [media, setMedia] = useState<MediaItem[]>([]);

  // Use React Query for data fetching
  const { data: mediaIds, isLoading, error } = useQuery({
    queryKey: ['mediaIds', currentDirectory],
    queryFn: () => fetchMediaIds(currentDirectory || ''),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Transform IDs to MediaItems
  const transformToMediaItems = useCallback(
    (ids: string[]): MediaItem[] => {
      return ids.map((id) => ({
        id,
        type: 'image',
        alt: `Media ${id}`,
      }));
    },
    []
  );

  // Update media when IDs change
  useEffect(() => {
    if (mediaIds) {
      const items = transformToMediaItems(mediaIds);
      setMedia(items);
      
      // Prefetch first 20 items for smoother experience
      items.slice(0, 20).forEach(item => {
        prefetchMediaInfo(item.id);
      });
    }
  }, [mediaIds, transformToMediaItems, prefetchMediaInfo]);

  // Memoize return values to prevent unnecessary re-renders
  return useMemo(
    () => ({
      media,
      isLoading,
      error: error as Error | null,
    }),
    [media, isLoading, error]
  );
};
