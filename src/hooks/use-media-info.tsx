
import { useState, useEffect } from 'react';
import { fetchMediaInfo } from '@/api/imageApi';

interface MediaInfo {
  alt: string;
  createdAt: string | null;
}

export const useMediaInfo = (id: string, isIntersecting: boolean) => {
  const [mediaInfo, setMediaInfo] = useState<MediaInfo | null>(null);
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
      
      fetchMediaInfo(id)
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
  }, [id, isIntersecting, mediaInfo, error]);

  return {
    mediaInfo,
    error,
    isLoading
  };
};
