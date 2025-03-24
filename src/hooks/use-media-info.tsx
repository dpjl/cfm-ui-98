
import { useState, useEffect } from 'react';
import { fetchMediaInfo, DetailedMediaInfo } from '@/api/imageApi';

export const useMediaInfo = (id: string, isIntersecting: boolean) => {
  const [mediaInfo, setMediaInfo] = useState<DetailedMediaInfo | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isIntersecting && !mediaInfo && !error) {
      setIsLoading(true);
      
      // If it's a mock ID, create mock data instead of fetching
      if (id.startsWith('mock-media-')) {
        const mockInfo: DetailedMediaInfo = {
          alt: `Mock Media ${id}`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random date within last 30 days
          name: `file_${id}.jpg`,
          path: `/media/photos/file_${id}.jpg`,
          size: `${Math.floor(Math.random() * 10000) + 500}KB`,
          cameraModel: ["iPhone 13 Pro", "Canon EOS 5D", "Sony Alpha A7III", "Nikon Z6"][Math.floor(Math.random() * 4)],
          hash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          duplicatesCount: Math.floor(Math.random() * 3)
        };
        setMediaInfo(mockInfo);
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
          setMediaInfo({ 
            alt: `Media ${id}`, 
            createdAt: null
          });
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
