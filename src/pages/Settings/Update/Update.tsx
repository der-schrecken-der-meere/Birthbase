import { use_settings_breadcrumbs } from "@/components/layouts/SettingsLayout";
import { NavigationEntry, SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { use_update_store } from "@/hooks/use_update_store";
import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { CheckUpdate, DownloadUpdate, UpdaterProgress } from "@/components/updater/Updater";
import { Separator } from "@/components/ui/separator";
import { BarLoader } from "react-spinners";
import { update_navbar } from "@/hooks/use_app_navbar";
import { use_app_store } from "@/hooks/use_app_store";
import { Skeleton } from "@/components/ui/skeleton";
import { useCallback, useMemo } from "react";
import { z } from "zod";
import { Settings } from "@/database/tables/settings/settings";
import { obj_is_empty } from "@/lib/functions/object/empty";
import { FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { use_settings_form } from "@/hooks/use_settings_form";
import { isTauri } from "@tauri-apps/api/core";
import { primitive_strict_or } from "@/lib/functions/logic/or";
import { OsType } from "@tauri-apps/plugin-os";

const Update = () => {

    const { t, i18n } = useTranslation(["pages"]);
    const { breadcrumbs } = use_settings_breadcrumbs();

    const ts = useCallback((key: string) => {
        return t(`settings_update.${key}`);
    }, [t]);

    const formSchema = useMemo(() => z.object({
        relaunch: z.coerce.boolean(),
        auto_search: z.coerce.boolean(),
    }), [ts]);

    const type = use_app_store((state) => state.os_type);

    update_navbar({
        pageTitle: "settings.update",
        breadcrumbDisplay: breadcrumbs,
    });

    if (!isTauri()) {
        return (
            null
        );
    }

    if (!primitive_strict_or<OsType>(type, "linux", "linux", "windows")) {
        return (
            null
        );
    }

    const update_available = use_update_store((state) => state.available);
    const last_check = use_update_store((state) => state.last_check);
    const is_downloading = use_update_store((state) => state.started);
    const searching = use_update_store((state) => state.searching);
    const version = use_update_store((state) => state.version);
    const os_type = use_app_store((state) => state.os_type);

    const { form, isFetching, onSubmit, data } = use_settings_form({
        form_schema: formSchema,
        on_submit: (data) => {
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.auto_search) {
                new_settings.auto_search = data.auto_search;
            }
            if (form.formState.dirtyFields.relaunch) {
                new_settings.relaunch = data.relaunch;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        }
    });

    if (isFetching) {
        return (
            <>
                <Skeleton className='w-full h-36' />
            </>
        );
    }

    const caption = searching
    ? <BarLoader className="!block !w-full !bg-transparent mt-3" color="hsl(var(--foreground))"/>
    : t("settings_update.last_checked", { last_check: new Date(last_check).toLocaleString(i18n.language) });
    
    return (
        <SettingsFormPageWrapper
            onSubmit={onSubmit}
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
                                <span>{ts("download_btn")}</span>
                            </DownloadUpdate>
                        ) : (
                            <CheckUpdate
                                variant="secondary"
                                size="sm"
                                disabled={searching}
                            >
                                <span>{ts("search_update")}</span>
                            </CheckUpdate>
                        )
                }
                icon={<RefreshCw/>}
                caption={caption}
            >
                {update_available ? ts("available_title") : ts("latest_title")}
            </NavigationEntry>
            {is_downloading && (
                <NavigationEntry
                    caption={<UpdaterProgress className="h-2 mt-2"/>}
                >
                    {t("settings_update.version", { version: version })}
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
                                        aria-label={ts("relaunch_aria")}
                                        checked={value}
                                        onCheckedChange={onChange}
                                        {...props}
                                    />
                                }
                                caption={ts("relaunch_description")}
                            >
                                {ts("relaunch_title")}
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
                                aria-label={ts("autosearch_aria")}
                                checked={value}
                                onCheckedChange={onChange}
                                {...props}
                            />
                        }
                        caption={ts("autosearch_description")}
                    >
                        {ts("autosearch_title")}
                    </SettingsFormElement>
                )}
            />
        </SettingsFormPageWrapper>
    );
};

export default Update;