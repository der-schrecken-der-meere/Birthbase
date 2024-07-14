// Custom Components
import PageWrapper from '../components/PageWrapper'

// Shadcn UI
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '../components/ui/select';
import { Label } from "../components/ui/label"
import { Switch } from '../components/ui/switch';

// React Redux
import { useDispatch, useSelector } from 'react-redux';

// Store Slices
import { setMode } from "../store/mode/modeSlice";
import { setColor } from "../store/color/colorSlice"



const Settings = () => {

    document.title = "Birthbase - Einstellungen";

    return (
        <PageWrapper title='Einstellungen' className='flex flex-col gap-4'>
            <div className='flex gap-[15px] items-center'>
                <Label className="text-base font-light" htmlFor="msg">Benachrichtigungen erlauben</Label>
                <NotificationSwitch id="msg"/>
            </div>
            <div className='flex gap-[15px] items-center'>
                <Label className="flex gap-4 items-center text-base font-light">Modus
                    <ModeSelect/>
                </Label>
            </div>
            <div className='flex gap-[15px] items-center'>
                <Label className="flex gap-4 items-center text-base font-light">Farbe
                    <ColorSelect/>
                </Label>
            </div>
            {/* <div className='flex gap-[15px] items-center'>
                <Label className="flex gap-4 items-center text-base font-light">Design
                    <Select defaultValue='normal' id="mode" >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Design" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="glass">Glass</SelectItem>
                                <SelectItem value="neu">Neu</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Label>
            </div> */}
        </PageWrapper>
    )
}

const NotificationSwitch = ({ id }) => {
    // const dispatch = useDispatch();
    const not = useSelector((state) => state.notification.value);

    return (
        <Switch 
            aria-label="notification-toggle"
            id={id}
            disabled={not !== "default"}
            checked={not === "granted" ? true : false}
            onCheckedChange={(v) => {
                Notification.requestPermission();
            }}
        />
    )
}

const ModeSelect = () => {
    const mode = useSelector((state) => state.mode.value);
    const dispatch = useDispatch();
    
    return (
        <Select defaultValue={mode} onValueChange={(v) => {dispatch(setMode(v))}} >
            <SelectTrigger aria-label="theme-toggle" className="w-[180px]">
                <SelectValue aria-label={mode} placeholder="Modus" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value="dark">Dunkel</SelectItem>
                <SelectItem value="light">Hell</SelectItem>
                <SelectItem value="system">System</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

const ColorSelect = () => {
    const dispatch = useDispatch();
    const color = useSelector((state) => state.color.value);

    return (
        <Select defaultValue={color} onValueChange={(v) => {dispatch(setColor(v))}} >
            <SelectTrigger aria-label="color-palette-toggle" className="w-[180px]">
                <SelectValue aria-label={color} placeholder="Farbe" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectItem value="blue">Blau</SelectItem>
                    <SelectItem value="gray">Grau</SelectItem>
                    <SelectItem value="green">Grün</SelectItem>
                    <SelectItem value="purple">Lila</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="red">Rot</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export default Settings