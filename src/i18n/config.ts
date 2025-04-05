import i18n from "i18next";
import { initReactI18next } from "react-i18next";

/** All JSON translation file names */
const ns: readonly string[] = [
    "birthday_form",
    "confirm",
    "dialog",
    "generally",
    "navigation",
    "notification",
    "pages",
    "table",
    "toast",
    "updater",
];


/** Fetches all JSON translation files for a specific language and return all as one object */
const get_lng_ns = async (lng: string, ns: readonly string[]) => {
    const translation: any = {};
    for (const namespace of ns) {
        const res = await fetch(`/locales/${lng}/${namespace}.json`);
        const json = await res.json();
        translation[namespace] = json;
    }
    return translation;
};

i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        resources: {
            de: await get_lng_ns("de", ns),
            en: await get_lng_ns("en", ns),
        },
        // React will handle by itself
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;