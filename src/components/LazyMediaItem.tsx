
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';
import { fetchMediaInfo, getThumbnailUrl } from '@/api/imageApi';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import { Download, Video, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface LazyMediaItemProps {
  id: string;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  index: number;
}

const LazyMediaItem: React.FC<LazyMediaItemProps> = ({
  id,
  selected,
  onSelect,
  onPreview,
  index
}) => {
  const [loaded, setLoaded] = useState(false);
  const [mediaInfo, setMediaInfo] = useState<{ alt: string; createdAt: string | null } | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1, freezeOnceVisible: true });
  
  // Fetch media info when the component becomes visible
  useEffect(() => {
    if (isIntersecting && !mediaInfo && !error) {
      // If it's a mock ID, create mock data instead of fetching
      if (id.startsWith('mock-media-')) {
        setMediaInfo({
          alt: `Mock Media ${id}`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Random date within last 30 days
        });
        return;
      }
      
      fetchMediaInfo(id)
        .then(data => setMediaInfo(data))
        .catch(err => {
          console.error(`Error fetching info for media ${id}:`, err);
          setError(err);
          // Set a fallback media info with the ID
          setMediaInfo({ alt: `Media ${id}`, createdAt: null });
        });
    }
  }, [id, isIntersecting, mediaInfo, error]);
  
  // Determine if this is a video based on the alt text if available
  const isVideo = mediaInfo?.alt ? mediaInfo.alt.match(/\.(mp4|webm|ogg|mov)$/i) : false;
  
  const thumbnailUrl = getThumbnailUrl(id);
  
  const handleDownload = () => {
    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = thumbnailUrl;
    a.download = mediaInfo?.alt || id;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleMouseOver = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.play().catch(err => console.error('Error playing video:', err));
    }
  };
  
  const handleMouseOut = () => {
    if (isVideo && videoRef.current) {
      videoRef.current.pause();
    }
  };
  
  // Format the date if available
  const formattedDate = mediaInfo?.createdAt 
    ? format(new Date(mediaInfo.createdAt), 'dd MMM yyyy', { locale: fr }) 
    : null;
  
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        delay: 0.05 * (index % 10), // Limit the delay to avoid too long animations
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      variants={itemVariants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      layout
    >
      {isIntersecting && (
        <ContextMenu>
          <ContextMenuTrigger>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={cn(
                      "image-card group relative", 
                      "aspect-square", 
                      selected && "selected",
                      !loaded && "animate-pulse bg-muted"
                    )}
                    onClick={onPreview}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                  >
                    {isVideo ? (
                      <>
                        <video 
                          ref={videoRef}
                          src={thumbnailUrl}
                          title={mediaInfo?.alt || id}
                          className={cn(
                            "w-full h-full object-cover transition-all duration-500",
                            loaded ? "opacity-100" : "opacity-0"
                          )}
                          onLoadedData={() => setLoaded(true)}
                          muted
                          loop
                          playsInline
                        />
                        {/* Video icon overlay */}
                        <div className="absolute top-2 left-2 z-10 bg-black/70 p-1 rounded-md text-white">
                          <Video className="h-4 w-4" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={thumbnailUrl}
                        alt={mediaInfo?.alt || id}
                        className={cn(
                          "w-full h-full object-cover transition-all duration-500",
                          loaded ? "opacity-100" : "opacity-0"
                        )}
                        onLoad={() => setLoaded(true)}
                      />
                    )}

                    {/* Date creation overlay */}
                    {formattedDate && (
                      <div className="absolute bottom-2 left-2 z-10 bg-black/70 px-2 py-1 rounded-md text-white text-xs flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formattedDate}
                      </div>
                    )}

                    <div className="image-overlay" />
                    <div className="image-checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selected}
                        className={cn(
                          "h-5 w-5 border-2",
                          selected ? "border-primary bg-primary" : "border-white bg-white/20",
                          "transition-all duration-200 ease-out",
                          !loaded && "opacity-0"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelect();
                        }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  align="center" 
                  className="bg-black/80 text-white border-none text-xs p-2 max-w-[300px] break-words"
                >
                  {mediaInfo?.alt || id}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-48">
            <ContextMenuItem onClick={handleDownload} className="cursor-pointer flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Télécharger {isVideo ? 'la vidéo' : 'la photo'}</span>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      )}
      {!isIntersecting && (
        <div className="aspect-square bg-muted animate-pulse rounded-lg"></div>
      )}
    </motion.div>
  );
};

export default LazyMediaItem;
