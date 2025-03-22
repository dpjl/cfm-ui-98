
import React from 'react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '@/components/ui/context-menu';
import { Download } from 'lucide-react';

interface MediaContextMenuProps {
  children: React.ReactNode;
  onDownload: () => void;
  isVideo: boolean;
}

const MediaContextMenu: React.FC<MediaContextMenuProps> = ({
  children,
  onDownload,
  isVideo
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onDownload} className="cursor-pointer flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span>Télécharger {isVideo ? 'la vidéo' : 'la photo'}</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default MediaContextMenu;
