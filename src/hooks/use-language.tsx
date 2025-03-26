
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Define supported languages
export type Language = 'en' | 'fr';

export interface Translations {
  [key: string]: string;
}

// Define the context type
interface LanguageContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: Language[];
}

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  t: (key: string) => key,
  language: 'en',
  setLanguage: () => {},
  availableLanguages: ['en', 'fr']
});

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

// Translations data for each language
const translations: Record<Language, Translations> = {
  en: {
    media_gallery: 'Media Gallery',
    columns: 'Columns',
    refresh: 'Refresh',
    delete: 'Delete',
    select_all: 'Select All',
    deselect_all: 'Deselect All',
    show_dates: 'Show Dates',
    hide_dates: 'Hide Dates',
    selected: 'Selected',
    no_media_found: 'No media found',
    no_media_description: 'There are no media files available in this directory.',
    source: 'Source',
    destination: 'Destination',
    preview: 'Preview',
    download: 'Download',
    close_sidebars: 'Close Sidebars',
    confirm_delete: 'Confirm Delete',
    confirm_delete_description: 'Are you sure you want to delete the selected media? This action cannot be undone.',
    cancel: 'Cancel',
    server: 'Server',
    server_status: 'Server Status',
    server_running: 'Server is running',
    server_stopped: 'Server is not running',
    server_running_description: 'The server is currently running and processing tasks.',
    server_stopped_description: 'The server is currently stopped or not responding.',
    error_fetching_status: 'Error fetching server status',
    error_try_again: 'There was an error connecting to the server. Please try again later.',
    retry: 'Retry',
    loading_server_status: 'Loading server status...',
    last_updated: 'Last updated',
    unknown: 'Unknown',
    cpu_usage: 'CPU Usage',
    memory_usage: 'Memory Usage',
    disk_usage: 'Disk Usage',
    uptime: 'Uptime',
    active_processes: 'Active Processes',
    processes: 'processes',
    processes_running: '{count} processes running',
    cpu_cores: 'Cores',
    reset_columns: 'Reset Columns',
    reset_columns_tooltip: 'Reset all gallery columns to default values',
  },
  fr: {
    media_gallery: 'Galerie Média',
    columns: 'Colonnes',
    refresh: 'Actualiser',
    delete: 'Supprimer',
    select_all: 'Tout sélectionner',
    deselect_all: 'Tout désélectionner',
    show_dates: 'Afficher les dates',
    hide_dates: 'Masquer les dates',
    selected: 'Sélectionné',
    no_media_found: 'Aucun média trouvé',
    no_media_description: 'Aucun fichier média disponible dans ce répertoire.',
    source: 'Source',
    destination: 'Destination',
    preview: 'Aperçu',
    download: 'Télécharger',
    close_sidebars: 'Fermer les panneaux',
    confirm_delete: 'Confirmer la suppression',
    confirm_delete_description: 'Êtes-vous sûr de vouloir supprimer les médias sélectionnés? Cette action ne peut pas être annulée.',
    cancel: 'Annuler',
    server: 'Serveur',
    server_status: 'État du serveur',
    server_running: 'Le serveur est en cours d\'exécution',
    server_stopped: 'Le serveur n\'est pas en cours d\'exécution',
    server_running_description: 'Le serveur fonctionne actuellement et traite des tâches.',
    server_stopped_description: 'Le serveur est actuellement arrêté ou ne répond pas.',
    error_fetching_status: 'Erreur lors de la récupération de l\'état du serveur',
    error_try_again: 'Une erreur s\'est produite lors de la connexion au serveur. Veuillez réessayer plus tard.',
    retry: 'Réessayer',
    loading_server_status: 'Chargement de l\'état du serveur...',
    last_updated: 'Dernière mise à jour',
    unknown: 'Inconnu',
    cpu_usage: 'Utilisation CPU',
    memory_usage: 'Utilisation Mémoire',
    disk_usage: 'Utilisation Disque',
    uptime: 'Temps de fonctionnement',
    active_processes: 'Processus Actifs',
    processes: 'processus',
    processes_running: '{count} processus en cours',
    cpu_cores: 'Cœurs',
    reset_columns: 'Réinitialiser',
    reset_columns_tooltip: 'Réinitialiser toutes les colonnes des galeries aux valeurs par défaut',
  },
};

export function LanguageProvider({ children, defaultLanguage = 'en' }: LanguageProviderProps) {
  const [language, setLanguage] = useLocalStorage<Language>('preferred-language', defaultLanguage);
  const [availableLanguages] = useState<Language[]>(['en', 'fr']);

  // Get translation for a key
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Get the translation for the key
    const translation = translations[language][key] || key;
    
    // If there are no params, return the translation as is
    if (!params) return translation;
    
    // Replace the placeholders with the values
    return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
      return acc.replace(`{${paramKey}}`, String(paramValue));
    }, translation);
  };

  // Value to be provided by the context
  const contextValue: LanguageContextType = {
    t,
    language,
    setLanguage,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
