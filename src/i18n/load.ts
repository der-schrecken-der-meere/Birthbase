import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { load_languages } from "./lib/functions/load_language";
import { I18N_CONFIG } from "./lib/constants/config";

i18n
    .use(initReactI18next)
    .init({
        lng: I18N_CONFIG.initialLanguage,
        fallbackLng: I18N_CONFIG.fallbackLanguage,
        resources: await load_languages([I18N_CONFIG.initialLanguage, ...I18N_CONFIG.loadAdditionalLanguages]),
        // React will handle by itself
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;