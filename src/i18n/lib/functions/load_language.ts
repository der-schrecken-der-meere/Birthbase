import { I18N_CONFIG } from "../constants/config";

const load_languages = async (languages: string[]) => {
    const languageTranslations: any = {};
    await Promise.all(languages.map(async language => {
        languageTranslations[language] = {};
        const _string = I18N_CONFIG
            .localesPath
            .replace("<lang>", language);
        await Promise.all(I18N_CONFIG.namespaces.map(async namespace => {
            try {
                const string = _string.replace("<namespace>", namespace);
                const res = await fetch(string);
                const json = await res.json();
                languageTranslations[language][namespace] = json;
            } catch {
                return "";
            }
            
        }));
    }));
    return languageTranslations;
};

export { load_languages };