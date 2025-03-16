import { add_ressource } from "@/lib/functions/translation/add_ressource";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const use_load_translation = (lang: string, ...namespace: string[]) => {
    const { t, i18n } = useTranslation();

    t("asd", "asda")

    const [loading, setLoading] = useState(() => {
        const 
        i18n.hasResourceBundle(lang, namespace)
    });

    useEffect(() => {
        (async () => {
            await add_ressource("/locale", namespace, i18n)
        })();
    }, []);
    const load_translation = useCallback(() => {

    }, []);

    return {
        t,
        i18n,
    }
};

export { use_load_translation };