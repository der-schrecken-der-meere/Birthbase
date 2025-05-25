// External features
import type { AppLanguages } from "@/database/birthalert/settings/types";
import { useNavEntriesStore } from "@/stores/use_nav_entries_store";
import i18n from "@/i18n/load";

const change_language = (lang: AppLanguages) => {
    i18n.changeLanguage(lang);
    useNavEntriesStore.getState().setTranslations();
};

export { change_language };