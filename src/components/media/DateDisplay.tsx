
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateDisplayProps {
  dateString: string | null;
  showDate?: boolean;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ dateString, showDate = false }) => {
  if (!dateString || !showDate) return null;
  
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  
  return (
    <div className="absolute bottom-2 left-2 z-10 bg-black/70 px-1.5 py-0.5 text-[10px] rounded-md text-white flex items-center date-display-small">
      <Calendar className="h-2.5 w-2.5 mr-0.5 date-icon" />
      {formattedDate}
    </div>
  );
};

export default DateDisplay;
