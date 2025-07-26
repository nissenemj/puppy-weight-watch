import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import fi from './locales/fi.json';
import en from './locales/en.json';

const resources = {
  fi: { translation: fi },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fi', // Default language for Finnish app
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Configure date/time formatting
    react: {
      useSuspense: false,
    },
  });

export default i18n;