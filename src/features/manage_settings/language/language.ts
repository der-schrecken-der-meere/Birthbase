import { useNavEntriesStore } from "@/stores/use_nav_entries_store";
import i18n from "@/i18n/config";

// Changes the language and translates all nav entries
const change_language = (lang: string) => {
    i18n.changeLanguage(lang);
    useNavEntriesStore.getState().setTranslations();
};

export { change_language };