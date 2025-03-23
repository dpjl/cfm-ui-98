
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
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
import DateDisplay from './media/DateDisplay';

interface ImageCardProps {
  src: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  aspectRatio?: "portrait" | "square" | "video";
  type?: "image" | "video";
  onInView?: () => void;
  createdAt?: string;
  showDates?: boolean;
}

const ImageCard: React.FC<ImageCardProps> = ({
  src,
  alt,
  selected,
  onSelect,
  onPreview,
  aspectRatio = "square",
  type = "image",
  onInView,
  createdAt,
  showDates = false
}) => {
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Call onInView immediately when component mounts if it exists
  React.useEffect(() => {
    if (onInView) {
      onInView();
    }
  }, [onInView]);
  
  // Determine based on alt (file name) instead of src
  const isVideo = type === "video" || alt.match(/\.(mp4|webm|ogg|mov)$/i);
  
  const handleDownload = () => {
    // Create a temporary link to trigger download
    const a = document.createElement('a');
    a.href = src;
    a.download = alt;
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
  
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "image-card group relative", 
                  "aspect-square", // Always use square aspect
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
                      src={src}
                      title={alt}
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
                    src={src}
                    alt={alt}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-500",
                      loaded ? "opacity-100" : "opacity-0"
                    )}
                    onLoad={() => setLoaded(true)}
                  />
                )}

                {/* Use the improved DateDisplay component */}
                <DateDisplay dateString={createdAt} showDate={showDates} />

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
              {alt}
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
  );
};

export default ImageCard;
