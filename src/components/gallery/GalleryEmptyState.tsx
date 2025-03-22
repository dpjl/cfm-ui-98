
import React from 'react';
import { InboxIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface GalleryEmptyStateProps {
  message?: string;
}

const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({ 
  message 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <InboxIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
      <p className="text-muted-foreground">{message || t('noMediaFound')}</p>
    </div>
  );
};

export default GalleryEmptyState;
