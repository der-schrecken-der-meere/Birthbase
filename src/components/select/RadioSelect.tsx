import type { SelectAsRadioProps } from "./types";

import { Fragment } from "react/jsx-runtime";

import { ChevronRight } from "lucide-react";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import { NavigationEntry } from "@/pages/Settings/Settings";

import { cn } from "@/lib/utils";

const SelectAsRadio = <T,>({
    title,
    radioItems,
    defaultValue,
    onValueChange,
    className,
    ...props
}: SelectAsRadioProps<T>) => {
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

export { SelectAsRadio };