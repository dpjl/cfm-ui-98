
import * as React from "react"

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export function useBreakpoint(breakpoint: Breakpoint) {
  const [isAboveBreakpoint, setIsAboveBreakpoint] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkBreakpoint = () => {
      setIsAboveBreakpoint(window.innerWidth >= breakpoints[breakpoint]);
    };

    // Initial check
    checkBreakpoint();

    // Add event listener
    window.addEventListener('resize', checkBreakpoint);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [breakpoint]);

  return isAboveBreakpoint;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoints.md); // Consider anything below 'md' (768px) as mobile
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}
