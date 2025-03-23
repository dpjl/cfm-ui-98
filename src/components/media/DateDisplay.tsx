
import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateDisplayProps {
  dateString: string | null;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  if (!dateString) return null;
  
  const [isVisible, setIsVisible] = useState(true);
  const [isSmall, setIsSmall] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  
  // Function to determine size and visibility
  const checkSize = () => {
    if (containerRef.current && dateRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        // Get dimensions
        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;
        const dateWidth = dateRef.current.offsetWidth;
        const dateHeight = dateRef.current.offsetHeight;
        
        // Use smaller text if parent container is smaller than 120px
        setIsSmall(parentWidth < 120);
        
        // Hide date if it would take up more than 40% of the width or 20% of the height
        const widthRatio = dateWidth / parentWidth;
        const heightRatio = dateHeight / parentHeight;
        setIsVisible(widthRatio < 0.4 && heightRatio < 0.2);
      }
    }
  };
  
  // Check size on mount and when window resizes
  useEffect(() => {
    // Initial check after a small delay to ensure rendering
    const timer = setTimeout(checkSize, 100);
    
    const observer = new ResizeObserver(() => {
      checkSize();
    });
    
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
  
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  
  if (!isVisible) return null;
  
  return (
    <div 
      ref={containerRef}
      className={`absolute bottom-2 left-2 z-10 bg-black/70 ${isSmall ? 'px-1 py-0.5 text-[8px]' : 'px-1.5 py-0.5 text-[10px]'} rounded-md text-white flex items-center`}
    >
      <div ref={dateRef} className="flex items-center">
        <Calendar className={`${isSmall ? 'h-2 w-2 mr-0.5' : 'h-2.5 w-2.5 mr-0.5'}`} />
        {formattedDate}
      </div>
    </div>
  );
};

export default DateDisplay;
