
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/80 backdrop-blur-sm border border-border rounded-full w-10 h-10"
          aria-label="Change language"
        >
          <Globe className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-accent text-accent-foreground' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('fr')}
          className={language === 'fr' ? 'bg-accent text-accent-foreground' : ''}
        >
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
