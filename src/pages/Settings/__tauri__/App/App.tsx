import type { Settings } from "@/database/tables/settings/settings";

// import { SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Rocket } from "lucide-react";

import { useSettingsForm } from "@/hooks/use_settings_form";
import { useNavbar } from "@/hooks/core/use_navbar";
import { useTranslation } from "react-i18next";
import { useSettingsBreadcrumbs } from "@/components/layouts/SettingsLayout";
import { OnlyTauri } from "@/components/OnlyTauri";

import { z } from "zod";
import { obj_is_empty } from "@/lib/functions/object/empty";
import { SettingsFormElement, SettingsFormPageWrapper } from "../../Settings";

const App = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.app",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <OnlyTauri
            osTypes={["windows", "linux", "macos"]}
        >
            <AppForm/>
        </OnlyTauri>
    );
};

const AppForm = () => {
    const { t } = useTranslation(["pages"]);

    const ts = (key: string) => {
        return t(`settings_app.${key}`);
    };

    const formSchema = z.object({
        autostart: z.coerce.boolean(),
    });

    const { form, isFetching, onSubmit } = useSettingsForm({
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