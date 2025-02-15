import { SettingsLayoutBreadcrumbs } from "@/components/layouts/SettingsLayout";
import { NavigationEntry, SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { use_update_store } from "@/hooks/use_update_store";
import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { CheckUpdate, DownloadUpdate, UpdaterProgress } from "@/components/updater/Updater";
import { Separator } from "@/components/ui/separator";
import { BarLoader } from "react-spinners";
import { update_navbar } from "@/hooks/use_app_navbar";
import { use_app_store } from "@/hooks/use_app_store";
import { Skeleton } from "@/components/ui/skeleton";
import { get_settings_query, set_settings_query } from "@/features/manage_settings/query";
import { useCallback, useEffect } from "react";
import { create_toast, ToastType } from "@/hooks/use_app_toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { get_default_settings, Settings } from "@/database/tables/settings/settings";
import { obj_is_empty } from "@/lib/functions/object/empty";
import { FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
    relaunch: z.coerce.boolean(),
    auto_search: z.coerce.boolean(),
});

type UpdateForm = z.infer<typeof formSchema>;

const Update = () => {

    update_navbar({
        pageTitle: "Update",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });

    const update_available = use_update_store((state) => state.available);
    const last_check = use_update_store((state) => state.last_check);
    const is_downloading = use_update_store((state) => state.started);
    const searching = use_update_store((state) => state.searching);
    const version = use_update_store((state) => state.display_version);
    const os_type = use_app_store((state) => state.os_type);

    const { data, isError, error, isFetching } = get_settings_query();
    const { mutate: update } = set_settings_query();

    const form = useForm<UpdateForm>({
        resolver: zodResolver(formSchema),
        defaultValues: (() => {
            const default_settings = get_default_settings();
            return {
                relaunch: default_settings.relaunch,
                auto_search: default_settings.auto_search,
            };
        })(),
        values: {
            relaunch: data.relaunch,
            auto_search: data.auto_search,
        }
    });

    const on_submit = useCallback((data: UpdateForm) => {
        const new_settings: Partial<Settings> = {};

        if (form.formState.dirtyFields.relaunch) {
            new_settings.relaunch = data.relaunch;
        }

        if (form.formState.dirtyFields.auto_search) {
            new_settings.auto_search = data.auto_search;
        }

        if (!obj_is_empty(new_settings)) {
            update(new_settings, {
                onSuccess: () => {
                    create_toast({
                        title: "Erfolgreich",
                        description: "Die Einstellungen wurden aktualisiert",
                    }, ToastType.SUCCESS);
                },
                onError: (error) => {
                    create_toast({
                        title: "Fehler beim Speichern der Einstellungen",
                        description: JSON.stringify(error), 
                    }, ToastType.ERROR);
                },
            });
        }

    }, []);

    useEffect(() => {
        if (isError) {
            create_toast({
                title: "Fehler beim Anzeigen der Einstellungen",
                description: JSON.stringify(error),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    if (isFetching) {
        return (
            <>
                <Skeleton className='w-full h-36' />
            </>
        );
    }

    const caption = searching
    ? <BarLoader className="!block !w-full !bg-transparent mt-3" color="hsl(var(--foreground))"/>
    : `Letzte Überprüfung: ${last_check}`
    
    return (
        <SettingsFormPageWrapper
            onSubmit={on_submit}
            form={form}
        >
            <NavigationEntry
                rightElement={
                    update_available
                        ? (
                            <DownloadUpdate
                                relaunch={data.relaunch}
                                variant="secondary"
                                size="sm"
                                disabled={is_downloading}
                            >
                                <span>Update herunterladen</span>
                            </DownloadUpdate>
                        ) : (
                            <CheckUpdate
                                variant="secondary"
                                size="sm"
                                disabled={searching}
                            >
                                <span>Nach Update suchen</span>
                            </CheckUpdate>
                        )
                }
                icon={<RefreshCw/>}
                caption={caption}
            >
                {update_available ? "Update verfügbar" : "Sie haben die neuste Version"}
            </NavigationEntry>
            {is_downloading && (
                <NavigationEntry
                    caption={<UpdaterProgress className="h-2 mt-2"/>}
                >
                    {version}
                </NavigationEntry>
            )}
            {os_type === "linux" && (
                <>
                    <Separator/>
                    <FormField
                        control={form.control}
                        name="relaunch"
                        render={({ field: { onChange, value, ...props } }) => (
                            <SettingsFormElement
                                icon={<RotateCcw/>}
                                rightElement={
                                    <Switch
                                        aria-label="Appneustart nach Update aktivieren oder deaktivieren"
                                        checked={value}
                                        onCheckedChange={onChange}
                                        {...props}
                                    />
                                }
                                caption="Nach der Installation des Updates wird die App neugestartet"
                            >
                                Neustart nach Update
                            </SettingsFormElement>
                        )}
                    />
                </>
            )}
            <Separator/>
            <FormField
                control={form.control}
                name="auto_search"
                render={({ field: { onChange, value, ...props } }) => (
                    <SettingsFormElement
                        icon={<Search/>}
                        rightElement={
                            <Switch
                                aria-label="Automatische Updatesuche beim Appstart"
                                checked={value}
                                onCheckedChange={onChange}
                                {...props}
                            />
                        }
                        caption="Beim Start der App automatisch nach Updates suchen"
                    >
                        Automatische Updatesuche
                    </SettingsFormElement>
                )}
            />
        </SettingsFormPageWrapper>
    );
}

export default Update;