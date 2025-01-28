import React, { ReactNode, useState } from 'react';

// Custom Components

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
import { SelectProps, SelectTriggerProps } from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { DialogTriggerProps } from '@radix-ui/react-dialog';
import { RadioGroupProps } from '@radix-ui/react-radio-group';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useNavbar } from '@/hooks/useNavbar';
import { SettingsLayoutBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { PageLinks } from '@/globals/constants/links';

const Settings = () => {
    useNavbar({
        pageTitle: "Einstellungen",
        breadcrumbDisplay: () => {
            const breads = structuredClone(SettingsLayoutBreadcrumbs);
            breads[0].type = [
                {
                    display: "Startseite",
                    href: PageLinks.HOME,
                }
            ];
            return breads;
        }
    });

    return (
        <ScrollArea className='h-full'>
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
        </ScrollArea>
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
        <div className={cn("flex items-center py-2 gap-2 min-h-16 shrink-0", className)}>
            {icon &&
                <div className="w-min px-2">
                    {icon}
                </div>
            }
            <div className='flex-1 min-w-0 h-full'>
                {children && <div className='overflow-hidden text-ellipsis whitespace-pre'>{children}</div>}
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
    children?: React.ReactElement<any>[] | string;
    icon: React.ReactElement<any>;
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
                className='rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-hidden disabled:pointer-events-none disabled:opacity-50 data-active:bg-accent/50 data-[state=open]:bg-accent/50"'
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
    /** Short description of Context */
    caption?: React.ReactNode;
    /** The title of Context */
    children?: React.ReactNode;
    /** Element (mostly interactive) on the far right side of Context */
    rightElement?: React.ReactNode;
    /** Descriptive Icon of Context */
    icon?: React.ReactNode;
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

interface SettingsFormProps extends I_NavigationEntry {
    
}

const SettingsFormElement = ({
    rightElement,
    children,
    ...props
}: SettingsFormProps) => {
    
    return (
        <FormItem>
            <NavigationEntry
                rightElement={
                    <FormControl>
                        {rightElement}
                    </FormControl>
                }
                {...props}
            >
                <FormLabel className='text-base font-normal'>{children}</FormLabel>
            </NavigationEntry>
        </FormItem>
    );
}

interface I_CollapsibleNavEntry extends Omit<I_NavigationEntry, "rightElement"|"children"> {
    /** The Title of Context */
    title?: string,
    /** Collapsible Content */
    children?: React.ReactNode,
}

const CollapsibleNavEntry = ({
    title,
    caption,
    icon,
    children,
    className,
}: I_CollapsibleNavEntry) => {
    const [open, setOpen] = useState(false);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <NavigationEntry
                icon={icon}
                caption={caption}
                rightElement={
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                    </CollapsibleTrigger>
                }
                className={className}
            >
                {title}
            </NavigationEntry>
            <CollapsibleContent>
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}

interface SelectShortendProps extends Pick<SelectProps, "onValueChange"|"defaultValue"> {
    title: string;
    selectItems: ListItem[];
}

const SelectShortend = ({
    defaultValue,
    onValueChange,
    title,
    selectItems,
}: SelectShortendProps & SelectTriggerProps) => {
    return (
        <Select defaultValue={defaultValue} onValueChange={onValueChange} >
            <SelectTrigger className="w-[180px] gap-2">
                <SelectValue placeholder={title} className='flex w-full'>
                    {selectItems.find((v) => v.value === defaultValue)?.displayText}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {selectItems.map((v, i) => (
                        <SelectItem
                            key={i}
                            value={v.value}
                        >
                            {v.item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}

export interface ListItem {
    value: string;
    item: ReactNode;
    displayText: string;
}

interface SelectAsRadioProps extends Pick<RadioGroupProps, "onValueChange"|"defaultValue"> {
    title: string;
    radioItems: ListItem[];
}

const SelectAsRadio = ({
    title,
    radioItems,
    defaultValue,
    onValueChange,
    className,
    ...props
}: SelectAsRadioProps & DialogTriggerProps) => {
    return (
        <Drawer>
            <DrawerTrigger {...props} className={cn('flex items-center gap-1', className)}>
                <span className='text-sm text-muted-foreground'>{radioItems.find((e) => e.value === defaultValue)?.displayText}</span>
                <LuChevronRight className='text-muted-foreground'></LuChevronRight>
            </DrawerTrigger>
            <DrawerContent className='max-h-[80%] h-full mt-0 px-4 py-2 border-0'>
                <DrawerHeader className="py-2 px-0">
                    <DrawerTitle className="text-left">{title}</DrawerTitle>
                    <DrawerDescription className="hidden">Auswahlmenü für {title}</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className='pr-2'>
                    <RadioGroup onValueChange={onValueChange} defaultValue={defaultValue} className="flex flex-col py-2">
                        {radioItems.map((v, i) => {
                            const id = `${title}-${v.value}`;
                            return (
                                <React.Fragment key={id}>
                                    <NavigationEntry
                                        className='min-h-0'
                                        rightElement={<RadioGroupItem value={v.value} id={id} className='mr-2'/>}
                                    >
                                        <Label className='flex items-center' htmlFor={id}>{v.item}</Label>
                                    </NavigationEntry>
                                    {i !== radioItems.length - 1 && <Separator/>}
                                </React.Fragment>
                            )
                        })}
                    </RadioGroup>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}

const SettingsFormPageWrapper = <T extends FieldValues,>({
    form,
    children,
    onSubmit,
}: {
    form: UseFormReturn<T, any, undefined>,
    children: ReactNode,
    onSubmit: (data: T) => void,
}) => {
    return (
        <Form {...form}>
            <form className='h-full flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className='h-full pr-2'>
                    {children}
                </ScrollArea>
                <Button type='submit' className='self-end screen-h-lg:mb-10 mb-1 mr-1' disabled={!form.formState.isDirty}>
                    Speichern
                </Button>
            </form>
        </Form>
    );
}

export default Settings;
export { NavigationEntry, NavigationLink, SelectAsRadio, SelectShortend, CollapsibleNavEntry, SettingsFormElement, SettingsFormPageWrapper };