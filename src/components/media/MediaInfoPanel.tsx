
import React from 'react';
import { DetailedMediaInfo } from '@/api/imageApi';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-breakpoint';
import { useLanguage } from '@/hooks/use-language';
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
  mediaInfoMap?: Map<string, DetailedMediaInfo | null>;
}

const MediaInfoPanel: React.FC<MediaInfoPanelProps> = ({
  selectedIds,
  onOpenPreview,
  onDeleteSelected,
  onDownloadSelected,
  mediaInfoMap = new Map()
}) => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  
  // Get detailed info for the selected item (if only one is selected)
  const detailedInfo = selectedIds.length === 1 ? mediaInfoMap.get(selectedIds[0]) : null;

  // Return null when no items are selected
  if (selectedIds.length === 0) {
    return null;
  }

  // Return null when multiple items are selected - handled by toolbar
  if (selectedIds.length > 1) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-background/80 backdrop-blur-sm border border-border/40 shadow-sm rounded-md p-3 mb-2"
      >
        {/* Header with action buttons */}
        <div className="flex justify-between items-center mb-2">
          {!isMobile && (
            <h3 className="text-sm font-medium">
              {t('media_information')}
            </h3>
          )}
          <div className={`flex space-x-1 ${isMobile ? "w-full justify-center" : ""}`}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => selectedIds.length === 1 ? onOpenPreview(selectedIds[0]) : null}
              disabled={selectedIds.length !== 1}
              title={t('preview')}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDownloadSelected(selectedIds)}
              title={t('download')}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDeleteSelected}
              className="text-destructive hover:text-destructive"
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        {/* Detailed info section - only visible when a single item is selected */}
        {selectedIds.length === 1 && (
          <div className="text-xs space-y-1.5">
            {!detailedInfo ? (
              <div className="text-center py-2 text-muted-foreground">
                {t('no_detailed_information')}
              </div>
            ) : (
              <div className={`grid ${isMobile ? "grid-cols-1 gap-y-2" : "grid-cols-2 gap-x-2 gap-y-1"}`}>
                {detailedInfo.name && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('name')}:</span>}
                    <span className="truncate">{detailedInfo.name}</span>
                  </div>
                )}

                {detailedInfo.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('date')}:</span>}
                    <span>{new Date(detailedInfo.createdAt).toLocaleString()}</span>
                  </div>
                )}

                {detailedInfo.path && (
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('path')}:</span>}
                    <span className="truncate">{detailedInfo.path}</span>
                  </div>
                )}

                {detailedInfo.size && (
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('size')}:</span>}
                    <span>{detailedInfo.size}</span>
                  </div>
                )}

                {detailedInfo.cameraModel && (
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('camera')}:</span>}
                    <span className="truncate">{detailedInfo.cameraModel}</span>
                  </div>
                )}

                {detailedInfo.hash && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('hash')}:</span>}
                    <span className="truncate">{detailedInfo.hash}</span>
                  </div>
                )}

                {detailedInfo.duplicatesCount !== undefined && (
                  <div className="flex items-center gap-2">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                    {!isMobile && <span className="text-muted-foreground">{t('duplicates')}:</span>}
                    <span>{detailedInfo.duplicatesCount}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaInfoPanel;
