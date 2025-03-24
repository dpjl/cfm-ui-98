
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface GalleryErrorProps {
  error: unknown;
}

const GalleryError: React.FC<GalleryErrorProps> = ({ error }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-4">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-destructive font-medium mb-2">{t('errorLoadingMedia')}</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </p>
      </div>
    </div>
  );
};

export default GalleryError;
