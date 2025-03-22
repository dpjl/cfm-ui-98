
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateDisplayProps {
  dateString: string | null;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  if (!dateString) return null;
  
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  
  return (
    <div className="absolute bottom-2 left-2 z-10 bg-black/70 px-2 py-1 rounded-md text-white text-xs flex items-center">
      <Calendar className="h-3 w-3 mr-1" />
      {formattedDate}
    </div>
  );
};

export default DateDisplay;
