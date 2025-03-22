
import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateDisplayProps {
  dateString: string | null;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  if (!dateString) return null;
  
  const [isSmall, setIsSmall] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to determine size
  const checkSize = () => {
    if (containerRef.current) {
      const parent = containerRef.current.parentElement;
      if (parent) {
        // If parent container is smaller than 120px, use smaller text
        setIsSmall(parent.offsetWidth < 120);
      }
    }
  };
  
  // Check size on mount and when window resizes
  useEffect(() => {
    checkSize();
    
    const observer = new ResizeObserver(checkSize);
    
    if (containerRef.current?.parentElement) {
      observer.observe(containerRef.current.parentElement);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  
  return (
    <div 
      ref={containerRef}
      className={`absolute bottom-2 left-2 z-10 bg-black/70 ${isSmall ? 'px-1 py-0.5 text-[8px]' : 'px-1.5 py-0.5 text-[10px]'} rounded-md text-white flex items-center`}
    >
      <Calendar className={`${isSmall ? 'h-2 w-2 mr-0.5' : 'h-2.5 w-2.5 mr-0.5'}`} />
      {formattedDate}
    </div>
  );
};

export default DateDisplay;
