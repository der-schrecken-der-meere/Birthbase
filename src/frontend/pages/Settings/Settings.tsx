import React from 'react';

// Custom Components
import PageWrapper from '../../components/PageWrapper'

// Shadcn UI
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/frontend/components/ui/select';
import { Label } from "@/frontend/components/ui/label"
import { Separator } from '@/frontend/components/ui/separator';

import { 
    LuChevronRight,
    LuMonitor,
    LuBell,
    LuInfo,
    LuHardDrive,
    LuCalendarClock,
    LuLanguages
} from "react-icons/lu";

import { NavLink } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/frontend/components/ui/drawer';
import { RadioGroupItem, RadioGroup } from '@/frontend/components/ui/radio-group';
import { SelectProps } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/frontend/components/ui/scroll-area';

const Settings = () => {
    return (
        <PageWrapper
            docTitle='Birthbase - Einstellungen'
            goBack={0}
            title='Einstellungen'
            className='h-full overflow-auto'
        >
            <NavigationLink
                to={"./appearance"}
                icon={<LuMonitor size={24} />}
                caption="Modus, Farbe"
            >
                Aussehen
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./notifications"}
                icon={<LuBell size={24} />}
                caption="Berechtigung"
            >
                Benachrichtigungen
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./storage"}
                icon={<LuHardDrive size={24}/>}
                caption="Speicherverbrauch, Daten löschen"
            >
                Speicher
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./time"}
                icon={<LuCalendarClock size={24}/>}
                caption="Zeitzone, akutelle Uhrzeit"
            >
                Datum und Uhrzeit
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./language"}
                icon={<LuLanguages size={24} />}
                caption={"Sprache, Land, Region"}
            >
                Sprache
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./info"}
                icon={<LuInfo size={24}/>}
                caption={"Über die App"}
            >
                Info
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./info"}
                icon={<LuInfo size={24}/>}
                caption={"Über die App"}
            >
                Info
            </NavigationLink>
            <Separator/>
            <NavigationLink
                to={"./info"}
                icon={<LuInfo size={24}/>}
                caption={"Über die App"}
            >
                Info
            </NavigationLink>
        </PageWrapper>
    )
}

interface I_NavigationLinkCore {
    icon?: React.ReactNode;
    className?: string;
    rightElement?: React.ReactNode;
    children?: React.ReactNode;
    caption?: React.ReactNode;
}

const NavigationLinkCore = ({
    icon,
    className,
    rightElement,
    children,
    caption
}: I_NavigationLinkCore) => {
    return (
        <div className={cn("flex items-center py-2 gap-2 min-h-16", className)}>
            {icon &&
                <div className="w-min px-2">
                    {icon}
                </div>
            }
            <div className='flex-1 min-w-0 h-full'>
                <div className='overflow-hidden text-ellipsis whitespace-pre'>{children}</div>
                {caption && <span className='text-sm text-muted-foreground'>{caption}</span>}
            </div>
            {rightElement && 
                <div className='ml-auto grid place-items-center text-nowrap mr-1'>
                    {rightElement}
                </div>
            }
        </div>
    );
}

interface I_NavigationLink {
    caption?: string;
    children?: React.ReactElement[] | string;
    icon: React.ReactElement;
    to: string;
}

const NavigationLink = ({
    to,
    children,
    icon,
    caption
}: I_NavigationLink) => {
    return (
        <NavLink
            to={to}
            relative="path"
        >
            <NavigationLinkCore
                icon={icon}
                className='rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"'
                caption={caption}
                rightElement={<LuChevronRight className='mr-3'/>}
            >
                {children}
            </NavigationLinkCore>
        </NavLink>
    );
}

interface I_NavigationEntry {
    className?: string;
    caption?: React.ReactElement | string;
    children: React.ReactElement[] | React.ReactElement | string;
    rightElement?: React.ReactElement | string;
    icon?: React.ReactElement;
}

const NavigationEntry = ({
    children,
    rightElement,
    className,
    caption,
    icon,
}: I_NavigationEntry) => {
    return (
        <NavigationLinkCore
            className={className}
            icon={icon}
            caption={caption}
            rightElement={rightElement}
        >
            {children}
        </NavigationLinkCore>
    );
}

type SelectValue = {
    value: string;
    text: string;
}

interface I_SelectShortend extends Pick<SelectProps, "onValueChange" | "defaultValue"> {
    ariaLabel: string;
    text: string;
    values: SelectValue[];
}

const SelectShortend = ({
    defaultValue,
    onValueChange,
    text,
    ariaLabel,
    values
}: I_SelectShortend) => {
    return (
        <Select defaultValue={defaultValue} onValueChange={onValueChange} >
            <SelectTrigger aria-label={ariaLabel} className="w-[180px] gap-2">
                <SelectValue aria-label={defaultValue} placeholder={text} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {values.map((v, i) => (
                        <SelectItem
                            key={i}
                            value={v.value}
                        >
                            {v.text}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

const SelectAsRadio = ({
    text,
    values,
    defaultValue,
    onValueChange,
}: Omit<I_SelectShortend, "ariaLabel">) => {
    return (
        <Drawer>
            <DrawerTrigger>
                <div className='flex items-center gap-1'>
                    <span className='text-sm text-muted-foreground'>{values.find((e) => e.value === defaultValue)?.text}</span>
                    <LuChevronRight className='text-muted-foreground'></LuChevronRight>
                </div>
            </DrawerTrigger>
            <DrawerContent className='max-h-[80%] h-full mt-0 px-4 py-2'>
                <DrawerHeader className="py-2 px-0">
                    <DrawerTitle className="text-left">{text}</DrawerTitle>
                    <DrawerDescription className="hidden">Auswahlmenü für {text}</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className='pr-2'>
                    <RadioGroup onValueChange={onValueChange} defaultValue={defaultValue} className="flex flex-col py-2">
                        {values.map((v, i) => {
                            const id = `${text}-${v.value}`;
                            return (
                                <React.Fragment key={id}>
                                    <NavigationEntry
                                        className='min-h-0'
                                        rightElement={<RadioGroupItem value={v.value} id={id} className='mr-2'/>}
                                    >
                                        <Label htmlFor={id}>{v.text}</Label>
                                    </NavigationEntry>
                                    {i !== values.length - 1 && <Separator/>}
                                </React.Fragment>
                            )
                        })}
                    </RadioGroup>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}

export default Settings;
export { NavigationEntry, NavigationLink, SelectAsRadio, SelectShortend };