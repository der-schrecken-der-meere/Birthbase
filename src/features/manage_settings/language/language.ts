import { useNavEntriesStore } from "@/stores/use_nav_entries_store";
import i18n from "@/i18n/config";

const change_language = (lang: string) => {
    i18n.changeLanguage(lang);
    useNavEntriesStore.getState().setTranslations();
};

export { change_language };