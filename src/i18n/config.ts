import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const get_lng_ns = async (lng: string, ns: string[]) => {
    const translation: any = {};
    for (const namespace of ns) {
        const res = await fetch(`/locales/${lng}/${namespace}.json`);
        const json = await res.json();
        translation[namespace] = json;
    }
    return translation;
};

const ns = ["pages", "navigation", "dialog", "confirm", "toast", "generally", "birthday_form", "updater", "table"];

const de = await get_lng_ns("de", ns);
const en = await get_lng_ns("en", ns);

i18n
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        resources: {
            de,
            en
        },
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;