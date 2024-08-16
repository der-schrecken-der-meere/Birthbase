import PageWrapper from '@/components/PageWrapper';
import { NavigationEntry } from '../Settings'
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from '@/components/ui/switch';
import { requestPermission } from '@tauri-apps/plugin-notification';
import { setIDBNotificationPermission } from '@/store/notification/notificationSlice';
import { isTauri } from "@/constants/environment";
import { LuInfo } from 'react-icons/lu';
import { 
    Popover,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover";
import { Separator } from '../../../components/ui/separator';
import { AppDispatch, RootState } from '@/store/store';

const Notifications = () => {
    return (
        <PageWrapper goBack={1} title='Benachrichtigungen'>
            <NavigationEntry
                caption={"Erlaubt der App Nachrichten an das System zu senden"}
                rightElement={<NotificationSwitch/>}
            >
                <div className='flex items-center gap-2'>
                    Benachrichtigungen
                    {!isTauri && (
                        <Popover>
                            <PopoverTrigger><LuInfo/></PopoverTrigger>
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

export default Notifications