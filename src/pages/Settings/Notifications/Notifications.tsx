import { CollapsibleNavEntry, SettingsFormElement, SettingsFormPageWrapper } from '../Settings'
import { Switch } from '@/components/ui/switch';
import {
    Bell,
    Info,
    AlarmClock,
} from 'lucide-react';
import { 
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';
import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { Settings } from '@/database/tables/settings/settings';
import { use_settings_breadcrumbs } from '@/components/layouts/SettingsLayout';
import { obj_is_empty } from '@/lib/functions/object/empty';
import { isTauri } from '@tauri-apps/api/core';
import { update_navbar } from '@/hooks/use_app_navbar';
import { use_settings_form } from '@/hooks/use_settings_form';
import { useTranslation } from 'react-i18next';

const Notifications = () => {

    const { t } = useTranslation(["pages"])

    const ts = useCallback((key: string) => {
        return t(`settings_notifications.${key}`);
    }, [t]);

    const { breadcrumbs } = use_settings_breadcrumbs()

    update_navbar({
        pageTitle: "settings.notifications",
        breadcrumbDisplay: breadcrumbs,
    });

    const formSchema = useMemo(() => {
        return z.object({
            remember: z.coerce.number().gte(1, {
                message: ts("reminder_lower_error"),
            })
            .lte(365, {
                message: ts("reminder_higher_error"),
            }),
            notification: z.coerce.boolean(),
        });
    }, [t]);

    const { form, isFetching, onSubmit } = use_settings_form({
        form_schema: formSchema,
        on_submit: (data) => {
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
                name="notification"
                render={({ field: { onChange, value, ...props } }) => (
                    <SettingsFormElement
                        icon={<Bell/>}
                        rightElement={
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
                            {!isTauri() && (
                                <Popover>
                                    <PopoverTrigger className='shrink-0 mr-1'><Info size={16} /></PopoverTrigger>
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
                render={({ field: { onChange, value, ...props } }) => (
                    <CollapsibleNavEntry
                        icon={<AlarmClock/>}
                        caption={ts("reminder_description")}
                        title={ts("reminder_title")}
                    >
                        <SettingsFormElement
                            caption={
                                <div className='flex items-center'>
                                    <Input type="number" className='w-14 text-right p-1 h-8 mx-1' onChange={(e) => {onChange(+e.target.value)}} defaultValue={value} {...props}/>
                                    <span className='ml-2'>{ts("reminder_input_description")}</span>
                                </div>
                            }
                        />
                    </CollapsibleNavEntry>
                )}
            />
        </SettingsFormPageWrapper>
    );
};

export default Notifications;