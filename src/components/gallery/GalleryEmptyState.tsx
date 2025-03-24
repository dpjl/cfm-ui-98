
import React from 'react';
import { InboxIcon } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface GalleryEmptyStateProps {
  message?: string;
  filter?: string;
}

const GalleryEmptyState: React.FC<GalleryEmptyStateProps> = ({ 
  message,
  filter = 'all'
}) => {
  const { t } = useLanguage();
  
  const defaultMessage = filter !== 'all' 
    ? 'Try changing the filter or selecting a different folder'
    : 'Select a different folder or upload some media';
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <InboxIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
      <p className="font-medium mb-2">{t('noMediaFound')}</p>
      <p className="text-sm text-muted-foreground">
        {message || defaultMessage}
      </p>
    </div>
  );
};

export default GalleryEmptyState;
