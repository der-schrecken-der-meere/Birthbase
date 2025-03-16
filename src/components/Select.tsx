import type { CommonType } from "@/lib/types/object";
import type { DialogTriggerProps } from "@radix-ui/react-dialog";
import type { SelectProps, SelectTriggerProps } from "@radix-ui/react-select";

import { Fragment, type ReactNode } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroupProps } from "@radix-ui/react-radio-group";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { NavigationEntry } from "@/pages/Settings/Settings";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

import { useSidebar } from "./ui/sidebar";

import { cn } from "@/lib/utils";

type ListItem<T> = {
    value: T;
    item: ReactNode;
    displayText: string;
};

interface SelectShortendProps<T> extends Pick<SelectProps, "onValueChange"|"defaultValue"> {
    title: string;
    selectItems: ListItem<T>[];
};

const SelectShortend = <T,>({
    defaultValue,
    onValueChange,
    title,
    selectItems,
    children,
    ...props
}: SelectShortendProps<T> & SelectTriggerProps) => {
    return (
        <Select
            defaultValue={defaultValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger
                className="w-[180px] gap-2"
                {...props}
            >
                <SelectValue
                    placeholder={title}
                    className='flex w-full'
                >
                    {selectItems.find((v) => v.value === defaultValue)?.displayText}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {selectItems.map((v, i) => (
                        <SelectItem
                            key={i}
                            value={v.value as string}
                        >
                            {v.item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

interface SelectAsRadioProps<T> extends Pick<RadioGroupProps, "onValueChange"|"defaultValue"> {
    title: string;
    radioItems: ListItem<T>[];
}

const SelectAsRadio = <T,>({
    title,
    radioItems,
    defaultValue,
    onValueChange,
    className,
    ...props
}: SelectAsRadioProps<T> & DialogTriggerProps) => {
    return (
        <Drawer>
            <DrawerTrigger
                className={cn('flex items-center gap-1', className)}
                {...props}
            >
                <span className='text-sm text-muted-foreground'>
                    {radioItems.find((e) => e.value === defaultValue)?.displayText}
                </span>
                <ChevronRight className='h-4 w-4 text-muted-foreground'/>
            </DrawerTrigger>
            <DrawerContent className='max-h-[80%] h-full mt-0 px-4 py-2 border-0'>
                <DrawerHeader className="py-2 px-0">
                    <DrawerTitle className="text-left">{title}</DrawerTitle>
                    <DrawerDescription className="hidden">{title}</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className='pr-2'>
                    <RadioGroup
                        onValueChange={onValueChange}
                        defaultValue={defaultValue}
                        className="flex flex-col py-2"
                    >
                        {radioItems.map((v, i) => {
                            const id = `${title}-${v.value}`;
                            return (
                                <Fragment key={id}>
                                    <NavigationEntry
                                        className='min-h-0'
                                        rightElement={
                                            <RadioGroupItem
                                                value={v.value as string}
                                                id={id}
                                                className='mr-2'
                                            />
                                        }
                                    >
                                        <Label
                                            className='flex items-center'
                                            htmlFor={id}
                                        >
                                            {v.item}
                                        </Label>
                                    </NavigationEntry>
                                    {i !== radioItems.length - 1 && <Separator/>}
                                </Fragment>
                            );
                        })}
                    </RadioGroup>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
};

type UniSelectProps<T> = {
    defaultValue: T,
    onValueChange: (value: string) => void,
    placeholder: string,
    listItems: ListItem<T>[]
}

const UniSelect = <T,>({
    defaultValue,
    onValueChange,
    placeholder,
    listItems,
    ...props
}: UniSelectProps<T> & CommonType<DialogTriggerProps, SelectTriggerProps>) => {
    const { isMobile } = useSidebar();

    return (
        isMobile ? (
            <SelectAsRadio
                title={placeholder}
                radioItems={listItems}
                defaultValue={defaultValue as string}
                onValueChange={onValueChange}
                {...props}
            />
        ) : (
            <SelectShortend
                title={placeholder}
                selectItems={listItems}
                defaultValue={defaultValue as string}
                onValueChange={onValueChange}
                {...props}
            />
        )
    );
};

export {
    UniSelect,
    SelectAsRadio,
    SelectShortend,
};