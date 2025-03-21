
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageItem } from './Gallery';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaPreviewProps {
  media: ImageItem | null;
  onClose: () => void;
  isOpen: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ media, onClose, isOpen }) => {
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

  if (!media) return null;

  const isVideo = media.alt.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center"
          onClick={onClose}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            height: '100vh', 
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-50 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Close preview"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="max-w-full overflow-hidden rounded-lg flex items-center justify-center" style={{ maxHeight: '80vh' }}>
              {isVideo ? (
                <video
                  src={media.src}
                  controls
                  autoPlay
                  className="max-w-full object-contain"
                  style={{ maxHeight: '80vh' }}
                />
              ) : (
                <img
                  src={media.src}
                  alt={media.alt}
                  className="max-w-full object-contain"
                  style={{ maxHeight: '80vh' }}
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
