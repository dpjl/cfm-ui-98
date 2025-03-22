
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
    <div className="flex flex-col space-y-1">
      <h2 className="text-lg font-medium">
        {t('mediaGallery')}
      </h2>
      <p className="text-sm text-muted-foreground">
        {photoCount} {t('photos')}, {videoCount} {t('videos')}
      </p>
    </div>
  );
};

export default GalleryCountInfo;
