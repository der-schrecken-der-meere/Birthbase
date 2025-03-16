import type { SelectProps, SelectTriggerProps } from '@radix-ui/react-select';
import type { DialogTriggerProps } from '@radix-ui/react-dialog';
import type { RadioGroupProps } from '@radix-ui/react-radio-group';
import type { FieldValues, UseFormReturn } from 'react-hook-form';

import { type ReactElement, type ReactNode, Fragment, useState } from 'react';

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
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';
import { Form, FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronUp } from 'lucide-react';
import { PulseLoader } from 'react-spinners';

import { useNavEntriesStore } from '@/stores/use_nav_entries_store';
import { useSettingsBreadcrumbs } from '@/components/layouts/SettingsLayout';
import { useNavbar } from '@/hooks/core/use_navbar';
import { useTranslation } from 'react-i18next';

import { cn } from '@/lib/utils';

const Settings = () => {

    const { breadcrumbs } = useSettingsBreadcrumbs();
    const settingsLinks = useNavEntriesStore((state) => state.settingsLinks);
    
    useNavbar({
        pageTitle: "main.settings",
        breadcrumbDisplay: () => {
            const breads = structuredClone(breadcrumbs);
            breads[0].type.length = 1;
            return breads;
        }
    });

    return (
        <ScrollArea className='h-full'>
            {settingsLinks.entries.map((link_entry, i) => (
                <Fragment
                    key={link_entry.url}
                >
                    {i !== 0 && <Separator/>}
                    <NavigationLink
                        to={link_entry.url}
                        icon={<link_entry.icon className="w-6 h-6" />}
                        caption={!link_entry.search ? "" : link_entry.search}
                    >
                        {link_entry.title}
                    </NavigationLink>
                </Fragment>
            ))}
        </ScrollArea>
    )
}

interface I_NavigationLinkCore {
    icon?: ReactNode;
    className?: string;
    rightElement?: ReactNode;
    children?: ReactNode;
    caption?: ReactNode;
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
    children?: ReactElement<any>[] | string;
    icon: ReactElement<any>;
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
                rightElement={<ChevronRight size={16} className='mr-3'/>}
            >
                {children}
            </NavigationLinkCore>
        </NavLink>
    );
}

interface I_NavigationEntry {
    className?: string;
    /** Short description of Context */
    caption?: ReactNode;
    /** The title of Context */
    children?: ReactNode;
    /** Element (mostly interactive) on the far right side of Context */
    rightElement?: ReactNode;
    /** Descriptive Icon of Context */
    icon?: ReactNode;
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
    children?: ReactNode,
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
                <ChevronRight size={16} className='text-muted-foreground'></ChevronRight>
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
                                <Fragment key={id}>
                                    <NavigationEntry
                                        className='min-h-0'
                                        rightElement={<RadioGroupItem value={v.value} id={id} className='mr-2'/>}
                                    >
                                        <Label className='flex items-center' htmlFor={id}>{v.item}</Label>
                                    </NavigationEntry>
                                    {i !== radioItems.length - 1 && <Separator/>}
                                </Fragment>
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
    const { t } = useTranslation(["generally"]);

    return (
        <Form {...form}>
            <form className='h-full flex flex-col' onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset className='h-full flex flex-col' disabled={form.formState.isSubmitting}>
                    <ScrollArea className='h-full pr-2'>
                        {children}
                    </ScrollArea>
                    <Button type='submit' className='self-end screen-h-lg:mb-10 mb-1 mr-1' disabled={!form.formState.isDirty}>
                        {form.formState.isSubmitting
                            ? <PulseLoader
                                color='hsl(var(--foreground))'
                                size="0.5rem"
                            />
                            : t("save_btn")
                        }
                    </Button>
                </fieldset>
            </form>
        </Form>
    );
}

export { NavigationEntry, NavigationLink, SelectAsRadio, SelectShortend, CollapsibleNavEntry, SettingsFormElement, SettingsFormPageWrapper };
export default Settings;