
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  className
}) => {
  if (!isLoading) return null;
  
  return (
    <div 
      className={cn(
        "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
        "flex items-center justify-center",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-center text-foreground font-medium">{message}</p>
      </div>
    </div>
  );
};

export { LoadingOverlay };
