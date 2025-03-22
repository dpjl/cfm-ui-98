
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
    <div className="absolute bottom-2 left-2 z-10 bg-black/70 px-1.5 py-0.5 rounded-md text-white text-[10px] flex items-center">
      <Calendar className="h-2.5 w-2.5 mr-0.5" />
      {formattedDate}
    </div>
  );
};

export default DateDisplay;
