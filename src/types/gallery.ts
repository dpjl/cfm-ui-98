
// MobileViewMode now applies to both mobile and desktop views
export type MobileViewMode = 'both' | 'left' | 'right';

// ViewModeType is used for column count calculations
export type ViewModeType = 'desktop' | 'desktop-single' | 'mobile-split' | 'mobile-single';

// Media item interface
export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  alt?: string;
  name?: string;
  path?: string;
  createdAt?: string;
  size?: string;
}
