import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DirectoryNode } from '@/types/gallery';
import { useLanguage } from '@/hooks/use-language';

interface FolderTreeProps {
  directories: DirectoryNode[];
  selectedDirectoryId: string;
  onSelectDirectory: (directoryId: string) => void;
  level?: number;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  directories,
  selectedDirectoryId,
  onSelectDirectory,
  level = 0
}) => {
  const { t } = useLanguage();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  // Toggle folder expansion
  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  // Check if folder is currently expanded
  const isFolderExpanded = (folderId: string) => {
    return !!expandedFolders[folderId];
  };

  if (!directories || directories.length === 0) {
    return (
      <div className="px-2 py-1 text-xs text-muted-foreground">
        {t('noDirectories')}
      </div>
    );
  }

  return (
    <ul className={cn("space-y-0.5", level > 0 ? "ml-2" : "")}>
      {directories.map((directory) => {
        const hasChildren = directory.children && directory.children.length > 0;
        const isExpanded = isFolderExpanded(directory.id);
        const isSelected = selectedDirectoryId === directory.id;
        
        return (
          <li key={directory.id}>
            <div 
              className={cn(
                "flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer text-xs",
                isSelected ? "bg-accent text-accent-foreground font-medium" : ""
              )}
              onClick={() => onSelectDirectory(directory.id)}
            >
              {hasChildren ? (
                <span 
                  className="w-2.5 h-2.5 flex items-center justify-center"
                  onClick={(e) => toggleFolder(directory.id, e)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-2.5 w-2.5" />
                  ) : (
                    <ChevronRight className="h-2.5 w-2.5" />
                  )}
                </span>
              ) : (
                <span className="w-2.5 h-2.5" />
              )}
              
              {isSelected ? (
                <FolderOpen className="h-2.5 w-2.5 text-accent-foreground" />
              ) : (
                <Folder className="h-2.5 w-2.5" />
              )}
              
              <span className="truncate text-xs">{directory.name}</span>
            </div>
            
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FolderTree
                  directories={directory.children}
                  selectedDirectoryId={selectedDirectoryId}
                  onSelectDirectory={onSelectDirectory}
                  level={level + 1}
                />
              </motion.div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default FolderTree;
