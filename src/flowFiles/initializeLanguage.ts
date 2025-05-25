import type { AppLanguages } from "@/database/birthalert/settings/types";
import i18n from "@/i18n/load";

i18n.on("languageChanged", (language: AppLanguages) => {
    document.documentElement.lang = language;
    document.documentElement.dir = i18n.dir(language);
});

console.log(i18n.resolvedLanguage);