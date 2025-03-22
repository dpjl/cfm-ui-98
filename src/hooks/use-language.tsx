
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
};

// Translation dictionary
const translations: Record<string, Record<string, string>> = {
  en: {
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selected: 'selected',
    noMediaFound: 'No media found',
    mediaGallery: 'Media Gallery',
    photos: 'photos',
    videos: 'videos',
    refresh: 'Refresh',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    columns: 'Columns',
    directories: 'Directories',
    folderStructure: 'Folder Structure',
    noDirectories: 'No directories found',
    deleteConfirmation: 'Are you sure you want to delete the selected media?',
    deleteConfirmationDescription: 'This action cannot be undone.',
    title: 'CFM',
    loading: 'Loading',
    deleting: 'Deleting',
  },
  fr: {
    selectAll: 'Tout Sélectionner',
    deselectAll: 'Tout Désélectionner',
    selected: 'sélectionné(s)',
    noMediaFound: 'Aucun média trouvé',
    mediaGallery: 'Galerie de médias',
    photos: 'photos',
    videos: 'vidéos',
    refresh: 'Rafraîchir',
    delete: 'Supprimer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    columns: 'Colonnes',
    directories: 'Répertoires',
    folderStructure: 'Structure des dossiers',
    noDirectories: 'Aucun répertoire trouvé',
    deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer les médias sélectionnés ?',
    deleteConfirmationDescription: 'Cette action est irréversible.',
    title: 'CFM',
    loading: 'Chargement',
    deleting: 'Suppression',
  },
};

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

// Provider component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial language preference from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      return savedLanguage || 'en';
    }
    return 'en';
  });

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!translations[language]) return key;
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
