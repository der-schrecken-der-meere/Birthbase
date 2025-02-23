import { use_settings_breadcrumbs } from "@/components/layouts/SettingsLayout";
import { isTauri } from "@tauri-apps/api/core";
import { SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { FormField } from "@/components/ui/form";
import { z } from "zod";
import { useCallback, useMemo } from "react";
import { primitive_strict_or } from "@/lib/functions/logic/or";
import { OsType, type } from "@tauri-apps/plugin-os";
import { Switch } from "@/components/ui/switch";
import { Rocket } from "lucide-react";
import { update_navbar } from "@/hooks/use_app_navbar";
import { useTranslation } from "react-i18next";
import { use_settings_form } from "@/hooks/use_settings_form";
import { Settings } from "@/database/tables/settings/settings";
import { obj_is_empty } from "@/lib/functions/object/empty";

const App = () => {

    const { t } = useTranslation(["pages"]);
    const { breadcrumbs } = use_settings_breadcrumbs();

    const ts = useCallback((key: string) => {
        return t(`settings_app.${key}`);
    }, [t]);

    const formSchema = useMemo(() => z.object({
        autostart: z.coerce.boolean(),
    }), []);

    update_navbar({
        pageTitle: "settings.app",
        breadcrumbDisplay: breadcrumbs,
    });

    if (!isTauri()) {
        return (
            null
        );
    }

    if (!primitive_strict_or<OsType>(type(), "linux", "linux", "windows")) {
        return (
            null
        );
    }

    const { form, isFetching, onSubmit } = use_settings_form({
        form_schema: formSchema,
        on_submit: (data) => {
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.autostart) {
                new_settings.autostart = data.autostart;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        }
    });

    if (isFetching) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <SettingsFormPageWrapper
            onSubmit={onSubmit}
            form={form}
        >
            <FormField
                control={form.control}
                name="autostart"
                render={({ field: { value, onChange, ...props } }) => (
                    <SettingsFormElement
                        icon={<Rocket/>}
                        rightElement={
                            <Switch
                                aria-label={ts("autostart_aria")}
                                checked={value}
                                onCheckedChange={onChange}
                                {...props}
                            />
                        }
                        caption={ts("autostart_description")}
                    >
                        {ts("autostart_title")}
                    </SettingsFormElement>
                )}
            />
        </SettingsFormPageWrapper>
    );
};

export default App;