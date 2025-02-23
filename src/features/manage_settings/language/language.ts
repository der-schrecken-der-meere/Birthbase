import { use_nav_entries } from "@/hooks/use_nav_entries";
import i18n from "@/i18n/config";

const change_language = (lang: string) => {
    i18n.changeLanguage(lang);
    use_nav_entries.getState().update_language();
};

export { change_language };