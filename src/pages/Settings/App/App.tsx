import { SettingsLayoutBreadcrumbs } from "@/components/layouts/SettingsLayout";
import { useNavbar } from "@/hooks/useNavbar";
import { isTauri } from "@tauri-apps/api/core";
import { SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { FormField } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enable, isEnabled, disable } from "@tauri-apps/plugin-autostart";
import { useCallback, useEffect, useState } from "react";
import { primitive_strict_or } from "@/lib/functions/logic/or";
import { OsType, type } from "@tauri-apps/plugin-os";
import { Switch } from "@/components/ui/switch";
import { Rocket } from "lucide-react";

const formSchema = z.object({
    autostart: z.coerce.boolean(),
});

type AppForm = z.infer<typeof formSchema>;

const App = () => {

    useNavbar({
        pageTitle: "App",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
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

    const [ autostart, setAutostart ] = useState(false);
    const [ disabled, setDisabled ] = useState(true);

    const form = useForm<AppForm>({
        resolver: zodResolver(formSchema),
        defaultValues: ({
            autostart: false,
        }),
        values: {
            autostart,
        }
    })

    useEffect(() => {
        (async () => {
            const autostart_enabled = await isEnabled();
            setDisabled(false);
            if (autostart_enabled) {
                setAutostart(true);
                return;
            }
            setAutostart(false);
        })();
    }, []);

    const onSubmit = useCallback((data: AppForm) => {
        (async () => {
            if (data.autostart) {
                await enable();
                setAutostart(true);
                return;
            }
            await disable();
            setAutostart(false);
        })();
    }, []);

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
                                aria-label="Autostart ein- oder ausschalten"
                                checked={value}
                                onCheckedChange={onChange}
                                disabled={disabled}
                                {...props}
                            />
                        }
                        caption={"Öffnet beim Start des Betriebssystems die App"}
                    >
                        Autostart
                    </SettingsFormElement>
                )}
            />
        </SettingsFormPageWrapper>
    );
};

export default App;