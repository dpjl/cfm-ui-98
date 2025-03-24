
import { useState, useEffect } from 'react';
import { fetchMediaInfo, DetailedMediaInfo } from '@/api/imageApi';

export const useMediaInfo = (id: string, isIntersecting: boolean, detailed: boolean = false) => {
  const [mediaInfo, setMediaInfo] = useState<DetailedMediaInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isIntersecting && !mediaInfo && !error) {
      setIsLoading(true);
      
      // If it's a mock ID, create mock data instead of fetching
      if (id.startsWith('mock-media-')) {
        setMediaInfo({
          alt: `Mock Media ${id}`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
        });
        setIsLoading(false);
        return;
      }
      
      fetchMediaInfo(id, detailed)
        .then(data => {
          setMediaInfo(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(`Error fetching info for media ${id}:`, err);
          setError(err);
          // Set a fallback media info with the ID
          setMediaInfo({ alt: `Media ${id}`, createdAt: null });
          setIsLoading(false);
        });
    }
  }, [id, isIntersecting, mediaInfo, error, detailed]);

  return {
    mediaInfo,
    error,
    isLoading
  };
};
