
import React from 'react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from '@/components/ui/tooltip';

interface MediaTooltipProps {
  children: React.ReactNode;
  content: string;
}

const MediaTooltip: React.FC<MediaTooltipProps> = ({ children, content }) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          align="center" 
          className="bg-black/80 text-white border-none text-xs p-2 max-w-[300px] break-words"
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MediaTooltip;
