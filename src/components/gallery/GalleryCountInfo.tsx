
import React from 'react';
import { useLanguage } from '@/hooks/use-language';

interface GalleryCountInfoProps {
  photoCount: number;
  videoCount: number;
}

const GalleryCountInfo: React.FC<GalleryCountInfoProps> = ({
  photoCount,
  videoCount
}) => {
  const { t } = useLanguage();
  
  return (
    <h2 className="text-lg font-medium">
      {t('mediaGallery')} ({photoCount} {t('photos')}, {videoCount} videos)
    </h2>
  );
};

export default GalleryCountInfo;
