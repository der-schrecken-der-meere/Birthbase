import type { I18nConfig } from "@/i18n/type";
import { create_default_settings } from "@/database/birthalert/settings/default";

const I18N_CONFIG = Object.freeze<I18nConfig>({
    localesPath: "/locales/<lang>/<namespace>.json",
    initialLanguage: create_default_settings().language,
    fallbackLanguage: "en",
    loadAdditionalLanguages: ["de"],
    namespaces: Object.freeze([
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
        "error",
    ]),
});

export { I18N_CONFIG };