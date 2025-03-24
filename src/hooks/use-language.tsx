
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
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
    delete_confirmation_title: 'Delete confirmation',
    delete_confirmation_description: 'Are you sure you want to delete {count} selected items? This action cannot be undone.',
    title: 'CFM',
    loading: 'Loading',
    deleting: 'Deleting',
    errorLoadingMedia: 'Error loading media',
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
    delete_confirmation_title: 'Confirmation de suppression',
    delete_confirmation_description: 'Êtes-vous sûr de vouloir supprimer {count} éléments sélectionnés ? Cette action est irréversible.',
    title: 'CFM',
    loading: 'Chargement',
    deleting: 'Suppression',
    errorLoadingMedia: 'Erreur de chargement des médias',
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
  const t = (key: string, params?: Record<string, any>): string => {
    if (!translations[language]) return key;
    
    let text = translations[language][key] || key;
    
    // Replace parameters in the text if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    
    return text;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
