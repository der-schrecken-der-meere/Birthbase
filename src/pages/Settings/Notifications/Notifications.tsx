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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect } from 'react';
import { get_default_settings, Settings } from '@/database/tables/settings/settings';
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { get_settings_query, set_settings_query } from '@/features/manage_settings/query';
import { obj_is_empty } from '@/lib/functions/object/empty';
import { isTauri } from '@tauri-apps/api/core';
import { create_toast, ToastType } from '@/hooks/use_app_toast';
import { update_navbar } from '@/hooks/use_app_navbar';

const formSchema = z.object({
    remember: z.coerce.number().gte(1, {
        message: "Es muss mindestens ein Tag sein"
    })
    .lte(366, {
        message: "Es darf nicht höher als 366 Tage sein"
    }),
    allow_notification: z.coerce.boolean(),
})

type NotificationForm = z.infer<typeof formSchema>;

const Notifications = () => {

    update_navbar({
        pageTitle: "Benachrichtigungen",
        breadcrumbDisplay: SettingsLayoutBreadcrumbs,
    });
    const { data, isError, error, isFetching } = get_settings_query();
    const { mutate: update } = set_settings_query();

    const form = useForm<NotificationForm>({
        resolver: zodResolver(formSchema),
        defaultValues: (() => {
            const default_settings = get_default_settings();
            return {
                remember: default_settings.remember,
                allow_notification: default_settings.notification,
            };
        })(),
        values: {
            allow_notification: data.notification,
            remember: data.remember,
        },
    });

    const onSubmit = useCallback((data: NotificationForm) => {
        const new_settings: Omit<Partial<Settings>, "id"> = {};

        if (form.formState.dirtyFields.remember) {
            new_settings.remember = data.remember;
        }
        if (form.formState.dirtyFields.allow_notification) {
            new_settings.notification = data.allow_notification;
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
                    name="allow_notification"
                    render={({ field: { onChange, value, ...props } }) => (
                        <SettingsFormElement
                            icon={<Bell/>}
                            rightElement={
                                <Switch 
                                    aria-label="Benachrichtigungen ein- oder ausschalten"
                                    checked={value}
                                    onCheckedChange={onChange}
                                    {...props}
                                />
                            }
                            caption="Erlaubt der App Nachrichten an das System zu senden"
                        >
                            <div className='flex items-center gap-2'>
                                <span className='overflow-hidden text-ellipsis whitespace-pre'>Benachrichtigungen</span>
                                {!isTauri() && (
                                    <Popover>
                                        <PopoverTrigger className='shrink-0 mr-1'><Info size={16} /></PopoverTrigger>
                                        <PopoverContent className="text-sm" side="bottom">
                                            Diese Berechtigung kann nur über den Browser geändert werden.
                                            <br />
                                            <Separator className="my-2"/>
                                            <ul className='list-disc list-inside space-y-2'>
                                                <li>Drücken Sie links oben neben der URL den Info- oder Einstellungsbutton und setzen Sie die Berechtigung</li>
                                                <li>Ist kein Button zu sehen, müssen Sie den Button auf der rechten Seite drücken</li>
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
                            caption="Wann Sie vor bevorstehende Geburtstagen erinnert werden"
                            title='Erinnerung'
                        >
                            <SettingsFormElement
                                caption={
                                    <div className='flex items-center'>
                                        <Input type="number" className='w-14 text-right p-1 h-8 mx-1' onChange={(e) => {onChange(+e.target.value)}} defaultValue={value} {...props}/>
                                        <span className='ml-2'>Tag/e vor Geburtstage erinnern</span>
                                    </div>
                                }
                            />
                        </CollapsibleNavEntry>
                    )}
                />
            </SettingsFormPageWrapper>
    )
};

export default Notifications