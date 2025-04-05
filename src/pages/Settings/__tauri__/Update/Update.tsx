import { type Settings } from "@/database/tables/settings/settings";

// import { NavigationEntry, SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { FormField } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { BarLoader } from "react-spinners";
import { RefreshCw, RotateCcw, Search } from "lucide-react";
import { OnlyTauri } from "@/components/OnlyTauri";
import { DownloadUpdate } from "@/components/__tauri__desktop__updater/DownloadUpdate";
import { CheckUpdate } from "@/components/__tauri__desktop__updater/CheckUpdate";
import { UpdaterProgress } from "@/components/__tauri__desktop__updater/UpdateProgress";

import { useUpdateStore } from "@/stores/use_update_store";

import { useSettingsBreadcrumbs } from "@/components/layouts/SettingsLayout";
import { useNavbar } from "@/hooks/core/use_navbar";
import { useSettingsForm } from "@/hooks/use_settings_form";
import { useTranslation } from "react-i18next";

import { z } from "zod";
import { obj_is_empty } from "@/lib/functions/object/empty";
import { NavigationEntry, SettingsFormElement, SettingsFormPageWrapper } from "../../Settings";

const Update = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.update",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <OnlyTauri osTypes={["linux", "windows", "macos"]}>
            <UpdateForm/>
        </OnlyTauri>
    );
};

const UpdateForm = () => {

    const isAvailable = useUpdateStore((state) => state.isAvailable);
    const lastCheck = useUpdateStore((state) => state.lastCheck);
    const isDownloading = useUpdateStore((state) => state.isDownloading);
    const isSearching = useUpdateStore((state) => state.isSearching);
    const version = useUpdateStore((state) => state.version);

    const { t, i18n } = useTranslation(["pages"]);
    const ts = (key: string) => {
        return t(`settings_update.${key}`);
    };

    const formSchema = z.object({
        relaunch: z.coerce.boolean(),
        auto_search: z.coerce.boolean(),
    });
    
    const { form, isFetching, onSubmit, data } = useSettingsForm({
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

    const caption = isSearching
    ? <BarLoader className="!block !w-full !bg-transparent my-2 h-5" color="hsl(var(--foreground))"/>
    : t("settings_update.last_checked", { last_check: new Date(lastCheck).toLocaleString(i18n.language) });

    return (
        <SettingsFormPageWrapper
            onSubmit={onSubmit}
            form={form}
        >
            <NavigationEntry
                rightElement={
                    isAvailable
                        ? (
                            <DownloadUpdate
                                relaunch={data.relaunch}
                                variant="secondary"
                                size="sm"
                                disabled={isDownloading}
                            >
                                <span>{ts("download_btn")}</span>
                            </DownloadUpdate>
                        ) : (
                            <CheckUpdate
                                variant="secondary"
                                size="sm"
                                disabled={isSearching}
                            >
                                <span>{ts("search_update")}</span>
                            </CheckUpdate>
                        )
                }
                icon={<RefreshCw/>}
                caption={caption}
            >
                {isAvailable ? ts("available_title") : ts("latest_title")}
            </NavigationEntry>
            {isDownloading && (
                <NavigationEntry
                    caption={<UpdaterProgress className="h-2 mt-2"/>}
                >
                    {t("settings_update.version", { version: version })}
                </NavigationEntry>
            )}
            <OnlyTauri osTypes={["linux"]} >
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
            </OnlyTauri>
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