
import React, { createContext, useContext, useState, useEffect } from 'react';

interface Translations {
  [key: string]: string;
}

interface LanguageContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string, options?: Record<string, any>) => string;
}

const defaultLanguage = 'en';

const translations: Record<string, Translations> = {
  en: {
    // Common
    app_name: 'Media Manager',
    loading: 'Loading...',
    error: 'Error',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    save: 'Save',
    edit: 'Edit',
    refresh: 'Refresh',
    search: 'Search',
    close: 'Close',
    open: 'Open',
    preview: 'Preview',
    download: 'Download',
    upload: 'Upload',
    select: 'Select',
    deselect: 'Deselect',
    select_all: 'Select All',
    deselect_all: 'Deselect All',
    reset_columns: 'Reset Columns',
    
    // Media
    media_gallery: 'Media Gallery',
    no_media: 'No media available',
    selected_media: 'Selected Media',
    media_information: 'Media Information',
    no_detailed_information: 'No detailed information available',
    name: 'Name',
    date: 'Date',
    path: 'Path',
    size: 'Size',
    camera: 'Camera',
    hash: 'Hash',
    duplicates: 'Duplicates',
    file_type: 'File Type',
    dimensions: 'Dimensions',
    columns: 'Columns',
    show_dates: 'Show Dates',
    hide_dates: 'Hide Dates',
    
    // Filters
    filter: 'Filter',
    all: 'All',
    images: 'Images',
    videos: 'Videos',
    documents: 'Documents',
    favorites: 'Favorites',
    duplicates_only: 'Duplicates Only',
    
    // Actions
    delete_confirmation_title: 'Delete Confirmation',
    delete_confirmation_description: 'Are you sure you want to delete these {{count}} selected items?',
    delete_media_confirm: 'Are you sure you want to delete the selected media?',
    deleting: 'Deleting...',
    delete_success: 'Successfully deleted media',
    delete_error: 'Error deleting media',
    
    // Layout
    source: 'Source',
    destination: 'Destination',
    server: 'Server',
    server_status: 'Server Status',
    close_sidebars: 'Close Sidebars',
    left_panel: 'Left Panel',
    right_panel: 'Right Panel',
    
    // Server Status
    connection_status: 'Connection Status',
    online: 'Online',
    offline: 'Offline',
    connected: 'Connected',
    disconnected: 'Disconnected',
    last_execution: 'Last Execution',
    never: 'Never',
    storage_information: 'Storage Information',
    source_files: 'Source Files',
    destination_files: 'Destination Files',
    files: 'Files',
    source_directory: 'Source Directory',
    destination_directory: 'Destination Directory',
    file_count: 'File Count',
    format: 'Format',
    not_configured: 'Not Configured',
    error_fetching_server_status: 'Error Fetching Server Status',
    unknown_error: 'An unknown error occurred',
    overview: 'Overview',
    storage: 'Storage',
    
    // Settings
    settings: 'Settings',
  },
  
  fr: {
    // Common
    app_name: 'Gestionnaire Média',
    loading: 'Chargement...',
    error: 'Erreur',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    save: 'Enregistrer',
    edit: 'Modifier',
    refresh: 'Actualiser',
    search: 'Rechercher',
    close: 'Fermer',
    open: 'Ouvrir',
    preview: 'Aperçu',
    download: 'Télécharger',
    upload: 'Envoyer',
    select: 'Sélectionner',
    deselect: 'Désélectionner',
    select_all: 'Tout Sélectionner',
    deselect_all: 'Tout Désélectionner',
    reset_columns: 'Réinitialiser Colonnes',
    
    // Media
    media_gallery: 'Galerie Média',
    no_media: 'Aucun média disponible',
    selected_media: 'Médias Sélectionnés',
    media_information: 'Informations Média',
    no_detailed_information: 'Aucune information détaillée disponible',
    name: 'Nom',
    date: 'Date',
    path: 'Chemin',
    size: 'Taille',
    camera: 'Appareil Photo',
    hash: 'Empreinte',
    duplicates: 'Doublons',
    file_type: 'Type de Fichier',
    dimensions: 'Dimensions',
    columns: 'Colonnes',
    show_dates: 'Afficher les Dates',
    hide_dates: 'Masquer les Dates',
    
    // Filters
    filter: 'Filtre',
    all: 'Tous',
    images: 'Images',
    videos: 'Vidéos',
    documents: 'Documents',
    favorites: 'Favoris',
    duplicates_only: 'Doublons Uniquement',
    
    // Actions
    delete_confirmation_title: 'Confirmation de Suppression',
    delete_confirmation_description: 'Êtes-vous sûr de vouloir supprimer ces {{count}} éléments sélectionnés ?',
    delete_media_confirm: 'Êtes-vous sûr de vouloir supprimer les médias sélectionnés ?',
    deleting: 'Suppression en cours...',
    delete_success: 'Médias supprimés avec succès',
    delete_error: 'Erreur lors de la suppression',
    
    // Layout
    source: 'Source',
    destination: 'Destination',
    server: 'Serveur',
    server_status: 'État du Serveur',
    close_sidebars: 'Fermer les panneaux',
    left_panel: 'Panneau Gauche',
    right_panel: 'Panneau Droit',
    
    // Server Status
    connection_status: 'État de la Connexion',
    online: 'En ligne',
    offline: 'Hors ligne',
    connected: 'Connecté',
    disconnected: 'Déconnecté',
    last_execution: 'Dernière Exécution',
    never: 'Jamais',
    storage_information: 'Informations de Stockage',
    source_files: 'Fichiers Source',
    destination_files: 'Fichiers Destination',
    files: 'Fichiers',
    source_directory: 'Répertoire Source',
    destination_directory: 'Répertoire Destination',
    file_count: 'Nombre de Fichiers',
    format: 'Format',
    not_configured: 'Non Configuré',
    error_fetching_server_status: 'Erreur lors de la récupération de l\'état du serveur',
    unknown_error: 'Une erreur inconnue est survenue',
    overview: 'Aperçu',
    storage: 'Stockage',
    
    // Settings
    settings: 'Paramètres',
  }
};

const LanguageContext = createContext<LanguageContextType>({
  lang: defaultLanguage,
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || defaultLanguage;
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  const t = (key: string, options?: Record<string, any>) => {
    let text = translations[lang]?.[key] || translations[defaultLanguage][key] || key;
    
    // Replace variables like {{count}} with their values
    if (options) {
      Object.keys(options).forEach(optionKey => {
        text = text.replace(`{{${optionKey}}}`, options[optionKey]);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
