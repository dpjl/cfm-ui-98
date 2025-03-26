
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the supported languages
export type Language = 'en' | 'fr';

// Define the translations
const translations = {
  en: {
    selected: 'selected',
    select_all: 'Select all',
    deselect_all: 'Deselect all',
    show_dates: 'Show dates',
    hide_dates: 'Hide dates',
    gallery_settings: 'Gallery settings',
    preview: 'Preview',
    download: 'Download',
    delete: 'Delete',
    confirm_delete: 'Confirm delete',
    cancel: 'Cancel',
    media_gallery: 'Media Gallery',
    columns: 'Columns:',
    refresh: 'Refresh',
    close_sidebars: 'Close sidebars',
    multiple_selection: 'Enable multiple selection',
    single_selection: 'Switch to single selection'
  },
  fr: {
    selected: 'sélectionné(s)',
    select_all: 'Tout sélectionner',
    deselect_all: 'Tout désélectionner',
    show_dates: 'Afficher les dates',
    hide_dates: 'Masquer les dates',
    gallery_settings: 'Paramètres de la galerie',
    preview: 'Aperçu',
    download: 'Télécharger',
    delete: 'Supprimer',
    confirm_delete: 'Confirmer la suppression',
    cancel: 'Annuler',
    media_gallery: 'Galerie médias',
    columns: 'Colonnes:',
    refresh: 'Actualiser',
    close_sidebars: 'Fermer les panneaux',
    multiple_selection: 'Activer la sélection multiple',
    single_selection: 'Passer à la sélection simple'
  }
};

// Create the context
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
};
