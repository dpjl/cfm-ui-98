
import React, { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { useLanguage } from '@/hooks/use-language';
import { getMediaUrl } from '@/api/imageApi';

interface MediaPreviewProps {
  mediaId: string | null;
  onClose: () => void;
  isOpen: boolean;
  allMediaIds: string[];
  onNavigate?: (direction: 'prev' | 'next') => void;
  position?: 'source' | 'destination';
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  mediaId, 
  onClose, 
  isOpen, 
  allMediaIds = [],
  onNavigate,
  position = 'source'
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const { t } = useLanguage();

  // Prevent body scroll when preview is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Update current index when media changes
  useEffect(() => {
    if (mediaId && allMediaIds.length) {
      const index = allMediaIds.indexOf(mediaId);
      setCurrentIndex(index);
    }
  }, [mediaId, allMediaIds]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!allMediaIds.length || currentIndex === -1) return;
    
    if (onNavigate) {
      onNavigate(direction);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handleNavigate('prev');
    } else if (e.key === 'ArrowRight') {
      handleNavigate('next');
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, allMediaIds]);

  if (!mediaId) return null;

  const currentId = currentIndex !== -1 && allMediaIds[currentIndex] ? allMediaIds[currentIndex] : mediaId;
  const isVideo = currentId.match(/\.(mp4|webm|ogg|mov)$/i);
  const mediaUrl = getMediaUrl(currentId, position);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Close preview"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 h-14 w-14 z-30"
              aria-label="Previous media"
            >
              <ArrowLeft className="h-10 w-10" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 h-14 w-14 z-30"
              aria-label="Next media"
            >
              <ArrowRight className="h-10 w-10" />
            </Button>

            <div className="max-w-full max-h-[90vh] overflow-hidden flex items-center justify-center">
              {isVideo ? (
                <video
                  src={mediaUrl}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={currentId}
                  className="max-w-full max-h-[85vh] object-contain"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaPreview;
