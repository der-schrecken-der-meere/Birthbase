import PageWrapper from '@/frontend/components/PageWrapper';
import { CollapsibleNavEntry, NavigationEntry } from '../Settings'
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@/frontend/components/ui/switch';
import { requestPermission } from '@tauri-apps/plugin-notification';
import { setIDBNotificationPermission, setIDBRemember } from '@/frontend/store/notification/notificationSlice';
import { isTauri } from "@/globals/constants/environment";
import {
    Bell,
    Info,
    AlarmClock,
} from 'lucide-react';
import { 
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/frontend/components/ui/popover";
import { Separator } from '@/frontend/components/ui/separator';
import { AppDispatch, RootState } from '@/frontend/store/store';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/frontend/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useToastNotification } from '@/frontend/contexts/toastContext';

const Notifications = () => {
    return (
        <PageWrapper goBack={1} title='Benachrichtigungen'>
            <NavigationEntry
                icon={<Bell/>}
                caption={"Erlaubt der App Nachrichten an das System zu senden"}
                rightElement={<NotificationSwitch/>}
            >
                <div className='flex items-center gap-2'>
                    <span className='overflow-hidden text-ellipsis whitespace-pre'>Benachrichtigungen</span>
                    {!isTauri && (
                        <Popover>
                            <PopoverTrigger className='flex-shrink-0'><Info size={16} /></PopoverTrigger>
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
            </NavigationEntry>
            <Separator/>
            <CollapsibleNavEntry
                icon={<AlarmClock/>}
                caption="Wann Sie vor bevorstehende Geburtstagen erinnert werden"
                title='Erinnerung'
            >
                <NavigationEntry
                    caption={<RememberInput/>}
                >
                </NavigationEntry>
            </CollapsibleNavEntry>
        </PageWrapper>
    )
}

const NotificationSwitch = () => {
    const dispatch = useDispatch<AppDispatch>();
    const not = useSelector((state: RootState) => state.notification.permission);

    const onChange = (v: boolean) => {
        if (isTauri) {
            if (not === "default") {
                requestPermission().then(e => dispatch(setIDBNotificationPermission(e ? "granted" : "denied")));
            } else {
                dispatch(setIDBNotificationPermission(!v ? "denied" : "granted"));
            }
        } else {
            Notification.requestPermission();
        }
    }

    const disabled = isTauri ? false : (not !== "default");

    return (
        <Switch 
            aria-label="notification-toggle"
            disabled={disabled}
            checked={not === "granted" ? true : false}
            onCheckedChange={onChange}
        />
    )
}

const formSchema = z.object({
    remember: z.coerce.number().gte(1, {
        message: "Es muss mindestens ein Tag sein"
    })
    .lte(365, {
        message: "Es darf nicht höher als 365 Tage sein"
    }),
})

const RememberInput = ({
    className,
}: {
    className?: string,
}) => {
    const dispatch = useDispatch<AppDispatch>();

    const { setErrorNotification, setSuccessNotification } = useToastNotification();
    const remember = useSelector((state: RootState) => state.remember.remember);
    const error = useSelector((state: RootState) => state.remember.error);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            remember: remember,
        }
    })

    const onSubmit = async (v: z.infer<typeof formSchema>) => {
        dispatch(setIDBRemember(v.remember));
        if (error) {
            setErrorNotification({
                title: "Fehler",
                description: (
                    <>
                        <span>Erinnerung konnte nicht geändert werde</span>
                        <span>Fehler: {error}</span>
                    </>
                )
            })
            return;
        }
        setSuccessNotification({
            title: "Erinnerung wurde geändert"
        })
    }

    return (
        <Form {...form}>
            <form className={cn("m-1 flex flex-col", className)} onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="remember"
                    render={({ field }) => (
                        <>
                            <FormItem className='inline-flex items-center space-y-0'>
                                <FormControl>
                                    <Input type="number" className='w-14 text-right p-1 h-8 mr-1' {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Tag/e vor Geburtstage erinnern
                                </FormDescription>
                            </FormItem>
                            <FormMessage className='mt-1'/>
                        </>
                    )}
                />
                <Button
                    type='submit'
                    size="sm"
                    variant="secondary"
                    className='mt-2 max-w-24'
                >
                    Ändern
                </Button>
            </form>
            {/* <div className='inline-flex flex-col'>
                <Button variant="secondary" size="icon" className='h-4 w-6 rounded-sm'><Plus size={12}/></Button>
                <Button variant="secondary" size="icon" className='h-4 w-6 rounded-sm'><Minus size={12}/></Button>
            </div> */}
        </Form>
    )
}

export default Notifications