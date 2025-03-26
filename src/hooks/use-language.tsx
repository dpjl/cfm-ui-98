import React from 'react';
import { useLocalStorage } from './use-local-storage';

type Language = 'en' | 'fr';

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  dictionary: Record<Language, Record<string, string>>;
}

const LanguageContext = React.createContext<LanguageContextProps | null>(null);

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useLocalStorage<Language>('language', 'en');
  
  const dictionary: Record<Language, Record<string, string>> = {
    en: {
      media_gallery: 'Media Gallery',
      columns: 'Columns',
      reset_columns: 'Reset columns',
      select_all: 'Select all',
      deselect_all: 'Deselect all',
      show_dates: 'Show dates',
      hide_dates: 'Hide dates',
      preview: 'Preview',
      delete: 'Delete',
      close_sidebars: 'Close sidebars',
      refresh: 'Refresh',
      confirm_delete: 'Confirm Delete',
      confirm_delete_description: 'Are you sure you want to delete these items? This action cannot be undone.',
      cancel: 'Cancel',
      date: 'Date',
      size: 'Size',
      path: 'Path',
      hash: 'Hash',
      camera: 'Camera',
      duplicates: 'Duplicates',
      all: 'All',
      images: 'Images',
      videos: 'Videos',
      favorites: 'Favorites',
      directories: 'Directories',
    },
    fr: {
      media_gallery: 'Galerie de médias',
      columns: 'Colonnes',
      reset_columns: 'Réinitialiser les colonnes',
      select_all: 'Tout sélectionner',
      deselect_all: 'Tout désélectionner',
      show_dates: 'Afficher les dates',
      hide_dates: 'Masquer les dates',
      preview: 'Aperçu',
      delete: 'Supprimer',
      close_sidebars: 'Fermer les panneaux',
      refresh: 'Actualiser',
      confirm_delete: 'Confirmer la suppression',
      confirm_delete_description: 'Êtes-vous sûr de vouloir supprimer ces éléments ? Cette action ne peut pas être annulée.',
      cancel: 'Annuler',
      date: 'Date',
      size: 'Taille',
      path: 'Chemin',
      hash: 'Hachage',
      camera: 'Caméra',
      duplicates: 'Doublons',
      all: 'Tous',
      images: 'Images',
      videos: 'Vidéos',
      favorites: 'Favoris',
      directories: 'Répertoires',
    }
  };
  
  const t = React.useCallback((key: string): string => {
    return dictionary[language][key] || key;
  }, [language]);
  
  const value = React.useMemo(() => {
    return {
      language,
      setLanguage,
      t,
      dictionary,
    };
  }, [language, setLanguage, t, dictionary]);
  
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
