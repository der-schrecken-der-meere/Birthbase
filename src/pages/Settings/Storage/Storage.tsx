import { useCallback, useEffect, useState } from 'react'
import { NavigationEntry } from '../Settings'
import { Progress } from "@/components/ui/progress"
import { Separator } from '@/components/ui/separator'
import { byte_format } from '@/lib/intl/storage'
// import Table from "@/components/tables/storagesize/Table"
import { use_settings_breadcrumbs } from '@/components/layouts/SettingsLayout'
import { to_smallest_byte_type } from '@/lib/functions/storage/unit'
import { calc_app_storage_size } from '@/lib/functions/storage/calculations'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { clear_app_storage } from '@/lib/functions/storage/clear'
import { clear_notification_query } from '@/features/latest_notifications/query'
import { clear_birthday_query } from '@/features/manage_birthdays/query'
import { clear_settings_query } from '@/features/manage_settings/query'
import { update_navbar } from '@/hooks/use_app_navbar'
import { open_confirm } from '@/hooks/use_app_confirm'
import { useTranslation } from 'react-i18next'
// import { toSmallestByteType } from '@/lib/functions/storage/unit'

const Storage = () => {
    const [value, setValue] = useState<StorageEstimate>({usage: 0, quota: 0});

    const { mutate: clear_notifications } = clear_notification_query();
    const { mutate: clear_birthdays } = clear_birthday_query();
    const { mutate: clear_settings } = clear_settings_query();

    const { t, i18n } = useTranslation(["pages", "confirm"]);

    const { breadcrumbs } = use_settings_breadcrumbs();

    update_navbar({
        pageTitle: "settings.storage",
        breadcrumbDisplay: breadcrumbs,
    });

    useEffect(() => {
        (async () => {
            const obj_size = await calc_app_storage_size();
            setValue(obj_size);
        })()
    }, []);

    const onDeleteClick = useCallback(() => {
        open_confirm({
            title: t("sure", { ns: "confirm" }),
            description: t("msgs.empty_storage", { ns: "confirm" }),
            on_confirm: () => {
                clear_app_storage();
                clear_notifications();
                clear_birthdays();
                clear_settings();
            },
        });
    }, []);

    const storage_size_to_string = useCallback((value: number) => {
        const obj_size = to_smallest_byte_type(value);
        return byte_format(i18n.language, obj_size.u, obj_size.v);
    }, [i18n]);

    const calc_usage_quota_ratio = useCallback((usage: number, quota: number) => {
        return usage / quota * 100;
    }, []);

    return (
        <>
            <NavigationEntry>
                <div className='text-sm text-muted-foreground'>
                    {t("settings_storage.storage_description", { usage: storage_size_to_string(value.usage as number), quotas: storage_size_to_string(value.quota as number) })}
                </div>
                <Progress value={calc_usage_quota_ratio(value.usage as number, value.quota as number)} className="w-full h-2 mt-2"/>
            </NavigationEntry>
            <Separator/>
            <NavigationEntry
                className='mt-auto flex'
                rightElement={
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDeleteClick}
                    >
                        <Trash2 className='w-4 h-4 mr-1'/>
                        {t("settings_storage.empty_storage")}
                    </Button>
                }
            />
        </>
    )
}
export default Storage