import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to NexusHealth",
          "tagline": "Precision control for healthcare",
          "launch_portal": "Launch Hospital Portal",
          "schedule": "Schedule Consultation",
          "patient_portal": "Patient Portal",
          "clinician_hub": "Clinician Hub",
          "admin_command": "Admin Command",
          "ai_diagnostic": "AI Diagnostic",
          "feedback": "Feedback",
          "rating": "Rating",
          "comment": "Comment",
          "submit": "Submit",
          "dark_mode": "Dark Mode",
          "light_mode": "Light Mode",
          "language": "Language"
        }
      },
      hi: {
        translation: {
          "welcome": "नेक्सस हेल्थ में आपका स्वागत है",
          "tagline": "स्वास्थ्य सेवा के लिए सटीक नियंत्रण",
          "launch_portal": "अस्पताल पोर्टल लॉन्च करें",
          "schedule": "परामर्श का समय निर्धारित करें",
          "patient_portal": "रोगी पोर्टल",
          "clinician_hub": "चिकित्सक हब",
          "admin_command": "एडमिन कमांड",
          "ai_diagnostic": "एआई डायग्नोस्टिक",
          "feedback": "प्रतिक्रिया",
          "rating": "रेटिंग",
          "comment": "टिप्पणी",
          "submit": "जमा करें",
          "dark_mode": "डार्क मोड",
          "light_mode": "लाइट मोड",
          "language": "भाषा"
        }
      }
    }
  });

export default i18n;
