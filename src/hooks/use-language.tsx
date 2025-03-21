
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fr';

type Translations = {
  [key: string]: {
    en: string;
    fr: string;
  };
};

// Définir toutes les traductions ici
const translations: Translations = {
  title: {
    en: 'CFM media browser',
    fr: 'Navigateur média CFM'
  },
  delete: {
    en: 'Delete Selected',
    fr: 'Supprimer la sélection'
  },
  deleting: {
    en: 'Deleting...',
    fr: 'Suppression...'
  },
  refresh: {
    en: 'Refresh',
    fr: 'Actualiser'
  },
  loading: {
    en: 'Loading...',
    fr: 'Chargement...'
  },
  columns: {
    en: 'Columns:',
    fr: 'Colonnes:'
  },
  confirmDelete: {
    en: 'Confirm Deletion',
    fr: 'Confirmer la suppression'
  },
  confirmDeleteMsg: {
    en: 'Are you sure you want to delete',
    fr: 'Êtes-vous sûr de vouloir supprimer'
  },
  selectedItems: {
    en: 'selected items?',
    fr: 'éléments sélectionnés?'
  },
  cancel: {
    en: 'Cancel',
    fr: 'Annuler'
  },
  confirm: {
    en: 'Confirm',
    fr: 'Confirmer'
  },
  photo: {
    en: 'photo',
    fr: 'photo'
  },
  photos: {
    en: 'photos',
    fr: 'photos'
  },
  selectAll: {
    en: 'Select All',
    fr: 'Tout sélectionner'
  },
  deselectAll: {
    en: 'Deselect All',
    fr: 'Tout désélectionner'
  },
  mediaGallery: {
    en: 'Media Gallery',
    fr: 'Galerie Média'
  },
  noMediaFound: {
    en: 'No media found',
    fr: 'Aucun média trouvé'
  },
  selected: {
    en: 'selected',
    fr: 'sélectionné(s)'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Fonction de traduction
  const t = (key: string): string => {
    if (translations[key] && translations[key][language]) {
      return translations[key][language];
    }
    return key; // Fallback au clé si pas de traduction disponible
  };

  // Sauvegarder la préférence dans localStorage
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Récupérer la préférence au chargement
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage === 'en' || savedLanguage === 'fr') {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
