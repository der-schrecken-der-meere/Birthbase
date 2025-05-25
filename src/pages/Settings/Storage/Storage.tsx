import { useEffect, useState } from 'react';

import { Progress } from "@/components/ui/progress";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { NavigationEntryCore } from '@/components/settings/core/NavigationEntryCore';

import { useConfirmStore } from '@/stores/use_confirm_store';

import { useTranslation } from 'react-i18next';
import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useClearBirthdayQuery } from '@/features/manage_birthdays/query';
import { useClearSettingsQuery } from '@/features/settings/query';
import { useNavbar } from '@/hooks/core/use_navbar';
import { clear_app_storage } from '@/lib/functions/storage/clear';

import { calc_app_storage_size } from '@/lib/functions/storage/calculations';
import { storage_size_to_string } from '@/lib/functions/storage/storageToString';
import { useClearNotificationsQuery } from '@/features/notifications/queries/notifications/use_clear_notificationts';

const Storage = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.storage",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <StorageForm/>
    );
};

const StorageForm = () => {
    const [value, setValue] = useState<StorageEstimate>({usage: 0, quota: 0});

    const { mutate: clear_notifications } = useClearNotificationsQuery();
    const { mutate: clear_birthdays } = useClearBirthdayQuery();
    const { mutate: clear_settings } = useClearSettingsQuery();

    const setConfirm = useConfirmStore((state) => state.setConfirm);

    const { t, i18n } = useTranslation(["pages", "confirm"]);

    useEffect(() => {
        (async () => {
            const obj_size = await calc_app_storage_size();
            setValue(obj_size);
        })();
    }, []);

    const onDeleteClick = () => {
        setConfirm({
            title: t("sure", { ns: "confirm" }),
            description: t("msgs.empty_storage", { ns: "confirm" }),
            on_confirm: () => {
                clear_app_storage();
                clear_notifications();
                clear_birthdays();
                clear_settings();
            },
        });
    };

    const calc_usage_quota_ratio = (usage: number, quota: number) => {
        return usage / quota * 100;
    };

    return (
        <>
            <NavigationEntryCore>
                <div className='text-sm text-muted-foreground'>
                    {t("settings_storage.storage_description", {
                        usage: storage_size_to_string(i18n.language, value.usage as number),
                        quotas: storage_size_to_string(i18n.language, value.quota as number)
                    })}
                </div>
                <Progress
                    value={calc_usage_quota_ratio(value.usage as number, value.quota as number)}
                    className="w-full h-2 mt-2"
                    aria-label={t("settings_storage.progress_aria")}
                />
            </NavigationEntryCore>
            <NavigationEntryCore
                className='mt-auto flex'
                actionNode={
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDeleteClick}
                        className='gap-2'
                    >
                        <Trash2 className='w-4 h-4'/>
                        {t("settings_storage.empty_storage")}
                    </Button>
                }
            />
        </>
    );
};

export default Storage;