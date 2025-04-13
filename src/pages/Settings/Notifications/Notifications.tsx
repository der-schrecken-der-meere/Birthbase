import type { Settings } from '@/database/tables/settings/type';

import { Switch } from '@/components/ui/switch';
import { Bell, Info, AlarmClock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { SettingsEntriesSkeleton } from '@/components/skeletons/SettingsEntriesSkeleton';
import { CollapsibleNavigationEntry } from '@/components/settings/CollapsibleNavigationEntry';
import { SettingsFormWrapper } from '@/components/settings/SettingsFormWrapper';
import { SettingsFormElement } from '@/components/settings/SettingsFormElement';

import { useNavbar } from '@/hooks/core/use_navbar';
import { useSettingsForm } from '@/hooks/use_settings_form';
import { useTranslation } from 'react-i18next';
import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';

import { obj_is_empty } from '@/lib/functions/object/empty';
import { z } from 'zod';

const Notifications = () => {
    const { breadcrumbs } = useSettingsBreadcrumbs();

    useNavbar({
        pageTitle: "settings.notifications",
        breadcrumbDisplay: breadcrumbs,
    });

    return (
        <NotificationsForm/>
    );
};

const NotificationsForm = () => {

    const { t } = useTranslation(["pages", "generally"])

    const ts = (key: string) => {
        return t(`settings_notifications.${key}`);
    };

    const formSchema = z.object({
        remember: z.coerce.number().gte(1, {
            message: ts("reminder_lower_error"),
        })
        .lte(365, {
            message: ts("reminder_higher_error"),
        }),
        notification: z.coerce.boolean(),
    });

    const { form, isFetching, onSubmit } = useSettingsForm({
        formSchema,
        checkSubmitValues: (data) => {
            const new_settings: Partial<Settings> = {};

            if (form.formState.dirtyFields.notification) {
                new_settings.notification = data.notification;
            }
            if (form.formState.dirtyFields.remember) {
                new_settings.remember = data.remember;
            }

            if (!obj_is_empty(new_settings)) {
                return new_settings;
            }
        },
        reducer: (data) => {
            const { notification, remember } = data;
            return {
                notification,
                remember,
            };
        },
    });

    if (isFetching) {
        return (
            <SettingsEntriesSkeleton entries={2} />
        );
    }

    return (
        <SettingsFormWrapper
            onSubmit={onSubmit}
            form={form}
        >
            <FormField
                control={form.control}
                name="notification"
                render={({ field: { onChange, value, ...props } }) => (
                    <SettingsFormElement
                        icon={Bell}
                        actionNode={
                            <Switch 
                                aria-label={ts("notification_aria")}
                                checked={value}
                                onCheckedChange={onChange}
                                {...props}
                            />
                        }
                        caption={ts("notification_description")}
                    >
                        <div className='flex items-center gap-2'>
                            <span className='overflow-hidden text-ellipsis whitespace-pre'>{ts("notification_title")}</span>
                            {!__IS_TAURI__ && (
                                <Popover>
                                    <PopoverTrigger className='shrink-0 mx-1'><Info className='w-4 h-4' /></PopoverTrigger>
                                    <PopoverContent className="text-sm" side="bottom">
                                        {ts("notification_hint_description")}
                                        <Separator className="my-2"/>
                                        <ul className='list-disc list-inside space-y-2'>
                                            <li>{ts("notification_hint_part_1")}</li>
                                            <li>{ts("notification_hint_part_2")}</li>
                                        </ul>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>
                    </SettingsFormElement>
                )}
            />
            <Separator/>
            <FormField
                control={form.control}
                name="remember"
                render={({ field: { onChange, ...props } }) => (
                    <CollapsibleNavigationEntry
                        icon={AlarmClock}
                        caption={ts("reminder_description")}
                        title={ts("reminder_title")}
                        aria-label={t("history_back_aria", { ns: "generally" })}
                    >
                        <SettingsFormElement
                            caption={
                                <div className='flex items-center gap-2'>
                                    <Input type="number" min={0} max={365} className='w-14 p-1 h-8 mx-1' onChange={(e) => {onChange(+e.target.value)}} {...props}/>
                                    <span>{ts("reminder_input_description")}</span>
                                </div>
                            }
                        />
                    </CollapsibleNavigationEntry>
                )}
            />
        </SettingsFormWrapper>
    );
};

export default Notifications;