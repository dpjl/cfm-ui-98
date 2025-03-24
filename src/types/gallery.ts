
export type MobileViewMode = 'both' | 'left' | 'right';

export interface DirectoryNode {
  id: string;
  name: string;
  children?: DirectoryNode[];
}
