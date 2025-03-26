
import React from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface DateDisplayProps {
  date?: string;
  createdAt?: string; 
  loaded?: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ 
  date, 
  createdAt, 
  loaded = false 
}) => {
  // Use either date or createdAt
  const dateString = date || createdAt;
  
  if (!dateString) return null;
  
  const formattedDate = new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  return (
    <div 
      className={cn(
        "absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/60 to-transparent z-10",
        "text-white text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        loaded ? "translate-y-0" : "translate-y-2",
        "transition-all duration-300 ease-out"
      )}
    >
      <Calendar className="h-3 w-3" />
      <span>{formattedDate}</span>
    </div>
  );
};

export default DateDisplay;
