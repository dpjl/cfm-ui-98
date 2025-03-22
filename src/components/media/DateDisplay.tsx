
import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';

interface DateDisplayProps {
  dateString: string | null;
}

const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  if (!dateString) return null;
  
  const isMobile = useIsMobile();
  const formattedDate = format(new Date(dateString), 'dd MMM yyyy', { locale: fr });
  
  return (
    <div className={`absolute bottom-2 left-2 z-10 bg-black/70 ${isMobile ? 'px-1 py-0.5 text-[8px]' : 'px-1.5 py-0.5 text-[10px]'} rounded-md text-white flex items-center`}>
      <Calendar className={`${isMobile ? 'h-2 w-2 mr-0.5' : 'h-2.5 w-2.5 mr-0.5'}`} />
      {formattedDate}
    </div>
  );
};

export default DateDisplay;
