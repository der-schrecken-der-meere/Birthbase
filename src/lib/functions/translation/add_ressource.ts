import { i18n } from "i18next";

const add_ressource = async (file_path: string, namespace: string, i18n: i18n) => {
    const lang = i18n.language;
    const has_ressource = i18n.hasResourceBundle(lang, namespace);
    if (!has_ressource) {
        const res = await fetch(`${file_path}/${lang}/${namespace}`);
        const json = await res.json();
        i18n.addResources(lang, namespace, json);
    }
};

export { add_ressource };