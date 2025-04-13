// import { NavigationEntry, SettingsFormElement, SettingsFormPageWrapper } from "../Settings";
import { Separator } from "@com/ui/separator";
import { FormField } from "@com/ui/form";
import { Switch } from "@com/ui/switch";
import { BarLoader } from "react-spinners";
import { RefreshCw, Search } from "lucide-react";
import { DownloadUpdate } from "@com/__tauri__/__desktop__/updater/DownloadUpdate";
import { CheckUpdate } from "@com/__tauri__/__desktop__/updater/CheckUpdate";
import { UpdaterProgress } from "@com/__tauri__/__desktop__/updater/UpdateProgress";

import { useUpdateStore } from "@stores/use_update_store";

import { useSettingsBreadcrumbs } from "@com/layouts/SettingsLayout";
import { useNavbar } from "@hooks/core/use_navbar";
import { useSettingsForm } from "@hooks/use_settings_form";
import { useTranslation } from "react-i18next";

import { z } from "zod";
import { obj_is_empty } from "@lib/functions/object/empty";
import { NavigationEntryCore } from "@/components/settings/core/NavigationEntryCore";
import { SettingsFormElement } from "@/components/settings/SettingsFormElement";
import { SettingsFormWrapper } from "@/components/settings/SettingsFormWrapper";
import { Settings } from "@/database/tables/settings/type";
import { SettingsEntriesSkeleton } from "@/components/skeletons/SettingsEntriesSkeleton";

let RelaunchFormField = null;
if (
    __TAURI_IS_MAC__ || __TAURI_IS_LINUX__
) {
    RelaunchFormField = await import("./__macos__linux__/RelaunchFormField").then(module => module.RelaunchFormField );
}

const Update = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.update",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <UpdateForm/>
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
        formSchema,
        checkSubmitValues: (data) => {
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
        },
        reducer: (data) => {
            const { relaunch, auto_search } = data;
            return {
                relaunch,
                auto_search,
            };
        },
    });
    
    if (isFetching) {
        return (
            <SettingsEntriesSkeleton entries={1}/>
        );
    }

    const caption = isSearching
    ? <BarLoader className="!block !w-full !bg-transparent my-2" height="0.25rem" color="hsl(var(--foreground))"/>
    : t("settings_update.last_checked", { last_check: new Date(lastCheck).toLocaleString(i18n.language) });

    return (
        <SettingsFormWrapper
            onSubmit={onSubmit}
            form={form}
        >
            <NavigationEntryCore
                actionNode={
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
                icon={RefreshCw}
                caption={caption}
            >
                {isAvailable ? ts("available_title") : ts("latest_title")}
            </NavigationEntryCore>
            {isDownloading && (
                <NavigationEntryCore
                    caption={<UpdaterProgress className="h-2 mt-2"/>}
                >
                    {t("settings_update.version", { version: version })}
                </NavigationEntryCore>
            )}
            <Separator/>
            {RelaunchFormField && (
                <>
                    <RelaunchFormField
                        form={form}
                        ts={ts}
                    />
                    <Separator/>
                </>
            )}
            <FormField
                control={form.control}
                name="auto_search"
                render={({ field: { onChange, value, ...props } }) => (
                    <SettingsFormElement
                        icon={Search}
                        actionNode={
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
        </SettingsFormWrapper>
    );
};

export default Update;