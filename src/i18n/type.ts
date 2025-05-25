import type { AppLanguages } from "@/database/birthalert/settings/types";

type I18nConfig = {
    /**
     * - \<lang>: Placeholder for the language
     * - \<namespace>: Placeholder for the namespace
     */
    localesPath: string,
    initialLanguage: AppLanguages,
    fallbackLanguage: AppLanguages,
    loadAdditionalLanguages: AppLanguages[],
    namespaces: readonly string[],
};

export type { I18nConfig };