
import { useLocalStorage } from '@/hooks/use-local-storage';
import { MobileViewMode } from '@/types/gallery';

export function useColumnsState() {
  // Column counts for different modes, stored in local storage
  const [desktopColumnsLeft, setDesktopColumnsLeft] = useLocalStorage('desktop-split-columns-left', 5);
  const [desktopColumnsRight, setDesktopColumnsRight] = useLocalStorage('desktop-split-columns-right', 5);
  const [desktopSingleColumnsLeft, setDesktopSingleColumnsLeft] = useLocalStorage('desktop-single-columns-left', 6);
  const [desktopSingleColumnsRight, setDesktopSingleColumnsRight] = useLocalStorage('desktop-single-columns-right', 6);
  const [mobileSplitColumnsLeft, setMobileSplitColumnsLeft] = useLocalStorage('mobile-split-columns-left', 2);
  const [mobileSplitColumnsRight, setMobileSplitColumnsRight] = useLocalStorage('mobile-split-columns-right', 2);
  const [mobileSingleColumnsLeft, setMobileSingleColumnsLeft] = useLocalStorage('mobile-single-columns-left', 4);
  const [mobileSingleColumnsRight, setMobileSingleColumnsRight] = useLocalStorage('mobile-single-columns-right', 4);
  
  // Column management functions
  const getCurrentColumnsLeft = (isMobile: boolean, viewMode: MobileViewMode): number => {
    if (isMobile) {
      return viewMode === 'both' ? mobileSplitColumnsLeft : mobileSingleColumnsLeft;
    }
    return viewMode === 'both' ? desktopColumnsLeft : desktopSingleColumnsLeft;
  };
  
  const getCurrentColumnsRight = (isMobile: boolean, viewMode: MobileViewMode): number => {
    if (isMobile) {
      return viewMode === 'both' ? mobileSplitColumnsRight : mobileSingleColumnsRight;
    }
    return viewMode === 'both' ? desktopColumnsRight : desktopSingleColumnsRight;
  };
  
  const handleLeftColumnsChange = (isMobile: boolean, viewMode: MobileViewMode, count: number) => {
    if (isMobile) {
      if (viewMode === 'both') {
        setMobileSplitColumnsLeft(count);
      } else {
        setMobileSingleColumnsLeft(count);
      }
    } else {
      if (viewMode === 'both') {
        setDesktopColumnsLeft(count);
      } else {
        setDesktopSingleColumnsLeft(count);
      }
    }
  };
  
  const handleRightColumnsChange = (isMobile: boolean, viewMode: MobileViewMode, count: number) => {
    if (isMobile) {
      if (viewMode === 'both') {
        setMobileSplitColumnsRight(count);
      } else {
        setMobileSingleColumnsRight(count);
      }
    } else {
      if (viewMode === 'both') {
        setDesktopColumnsRight(count);
      } else {
        setDesktopSingleColumnsRight(count);
      }
    }
  };
  
  // Map view mode to column configuration type
  const getViewModeType = (position: 'left' | 'right', currentViewMode: MobileViewMode, isMobile: boolean): string => {
    if (isMobile) {
      return currentViewMode === 'both' ? 'mobile-split' : 'mobile-single';
    } else {
      return currentViewMode === 'both' ? 'desktop' : 'desktop-single';
    }
  };
  
  return {
    getCurrentColumnsLeft,
    getCurrentColumnsRight,
    handleLeftColumnsChange,
    handleRightColumnsChange,
    getViewModeType
  };
}
