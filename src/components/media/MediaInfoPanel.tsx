
import React, { useEffect, useState } from 'react';
import { DetailedMediaInfo, fetchMediaInfo, getMediaUrl } from '@/api/imageApi';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Camera, 
  FileText, 
  FolderOpen, 
  HardDrive, 
  Hash, 
  Copy,
  Trash2,
  Download,
  Eye
} from 'lucide-react';

interface MediaInfoPanelProps {
  selectedIds: string[];
  onOpenPreview: (id: string) => void;
  onDeleteSelected: () => void;
  onDownloadSelected: (ids: string[]) => void;
}

const MediaInfoPanel: React.FC<MediaInfoPanelProps> = ({
  selectedIds,
  onOpenPreview,
  onDeleteSelected,
  onDownloadSelected
}) => {
  const [detailedInfo, setDetailedInfo] = useState<DetailedMediaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch detailed info when a single media is selected
  useEffect(() => {
    if (selectedIds.length === 1) {
      setIsLoading(true);
      fetchMediaInfo(selectedIds[0], true)
        .then(info => {
          setDetailedInfo(info);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Error fetching detailed info:", error);
          toast({
            title: "Error",
            description: "Could not load detailed information",
            variant: "destructive"
          });
          setDetailedInfo(null);
          setIsLoading(false);
        });
    } else {
      // Clear detailed info when multiple or no items are selected
      setDetailedInfo(null);
    }
  }, [selectedIds, toast]);

  if (selectedIds.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-background/80 backdrop-blur-sm border border-border/40 shadow-sm rounded-md p-3 mb-2"
    >
      {/* Header with action buttons */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">
          {selectedIds.length === 1 
            ? "Media Information" 
            : `${selectedIds.length} items selected`}
        </h3>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => selectedIds.length === 1 ? onOpenPreview(selectedIds[0]) : null}
            disabled={selectedIds.length !== 1}
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onDownloadSelected(selectedIds)}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDeleteSelected}
            className="text-destructive hover:text-destructive"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Detailed info section - only visible when a single item is selected */}
      {selectedIds.length === 1 && (
        <div className="text-xs space-y-1.5">
          {isLoading ? (
            <div className="flex justify-center py-2">
              <div className="animate-pulse h-4 w-full bg-muted rounded"></div>
            </div>
          ) : detailedInfo ? (
            <>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {detailedInfo.name && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Name:</span>
                  </div>
                )}
                {detailedInfo.name && (
                  <div className="truncate">{detailedInfo.name}</div>
                )}

                {detailedInfo.createdAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                  </div>
                )}
                {detailedInfo.createdAt && (
                  <div>{new Date(detailedInfo.createdAt).toLocaleString()}</div>
                )}

                {detailedInfo.path && (
                  <div className="flex items-center gap-1">
                    <FolderOpen className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Path:</span>
                  </div>
                )}
                {detailedInfo.path && (
                  <div className="truncate">{detailedInfo.path}</div>
                )}

                {detailedInfo.size && (
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Size:</span>
                  </div>
                )}
                {detailedInfo.size && (
                  <div>{detailedInfo.size}</div>
                )}

                {detailedInfo.cameraModel && (
                  <div className="flex items-center gap-1">
                    <Camera className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Camera:</span>
                  </div>
                )}
                {detailedInfo.cameraModel && (
                  <div className="truncate">{detailedInfo.cameraModel}</div>
                )}

                {detailedInfo.hash && (
                  <div className="flex items-center gap-1">
                    <Hash className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Hash:</span>
                  </div>
                )}
                {detailedInfo.hash && (
                  <div className="truncate">{detailedInfo.hash}</div>
                )}

                {detailedInfo.duplicatesCount !== undefined && (
                  <div className="flex items-center gap-1">
                    <Copy className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Duplicates:</span>
                  </div>
                )}
                {detailedInfo.duplicatesCount !== undefined && (
                  <div>{detailedInfo.duplicatesCount}</div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-2 text-muted-foreground">
              No detailed information available
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MediaInfoPanel;
