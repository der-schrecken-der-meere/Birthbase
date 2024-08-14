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
} from '@/components/ui/select';
import { Label } from "@/components/ui/label"
import { Separator } from '@/components/ui/separator';

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
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';
import { SelectProps } from '@radix-ui/react-select';

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
        </PageWrapper>
    )
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
            className={"flex items-center py-2 px-4 gap-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"}
        >
            <div className="w-min">
                {icon}
            </div>
            <div className='flex-1 min-w-0'>
                <div className='overflow-hidden text-ellipsis whitespace-pre'>{children}</div>
                {caption && <span className='text-sm text-muted-foreground'>{caption}</span>}   
            </div>
            <LuChevronRight className='ml-auto'/>
        </NavLink>
    );
}

interface I_NavigationEntry {
    caption?: React.ReactElement | string;
    children: React.ReactElement[] | React.ReactElement | string;
    onlyWrapp?: boolean;
    rightElement?: React.ReactElement | string;
}

const NavigationEntry = ({
    children,
    rightElement,
    caption,
    onlyWrapp,
}: I_NavigationEntry) => {
    return (
        <div className='flex items-center py-2 gap-4'>
            {onlyWrapp ? children :
            <>
                <div className='relative w-full'>
                    <div>{children}</div>
                    {caption && <span className='text-sm text-muted-foreground'>{caption}</span>}
                </div>
                {rightElement && 
                    <div className='ml-auto grid place-items-center text-nowrap'>
                        {rightElement}
                    </div>
                }
            </>
            }
        </div>
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
                    <span className='text-sm text-muted-foreground'>{text}</span>
                    <LuChevronRight className='text-muted-foreground'></LuChevronRight>
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="py-2 px-4">
                    <DrawerTitle className="text-left">{text}</DrawerTitle>
                    <DrawerDescription className="hidden">Auswahlmenü für {text}</DrawerDescription>
                </DrawerHeader>
                <RadioGroup onValueChange={onValueChange} defaultValue={defaultValue} className="flex flex-col py-2 px-4 mb-20">
                    {values.map((v, i) => {
                        const id = `${text}-${v.value}`;
                        return (
                            <React.Fragment key={i}>
                                <NavigationEntry
                                    rightElement={<RadioGroupItem value={v.value} id={id}/>}
                                >
                                    <Label htmlFor={id}>{v.text}</Label>
                                </NavigationEntry>
                                {i !== values.length - 1 && <Separator/>}
                            </React.Fragment>
                        )
                    })}
                </RadioGroup>
            </DrawerContent>
        </Drawer>
    );
}

export default Settings;
export { NavigationEntry, NavigationLink, SelectAsRadio, SelectShortend };