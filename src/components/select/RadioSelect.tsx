import type { SelectAsRadioProps } from "./types";

import { Fragment } from "react/jsx-runtime";

import { ChevronRight } from "lucide-react";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { NavigationEntryCore } from "../settings/core/NavigationEntryCore";

import { cn } from "@/lib/utils";

const SelectAsRadio = <T,>({
    title,
    radioItems,
    value,
    onValueChange,
    className,
    placeholder,
    defaultValue,
    ...props
}: SelectAsRadioProps<T>) => {
    return (
        <Drawer>
            <DrawerTrigger
                className={cn('flex items-center gap-1', className)}
                {...props}
            >
                <span className='text-sm text-muted-foreground'>
                    {radioItems.find((e) => e.value === value)?.displayText}
                </span>
                <ChevronRight className='h-4 w-4 text-muted-foreground'/>
            </DrawerTrigger>
            <DrawerContent className='max-h-[80%] h-full mt-0 px-4 py-2 border-0'>
                <DrawerHeader className="py-2 px-0">
                    <DrawerTitle className="text-start">{placeholder}</DrawerTitle>
                    <DrawerDescription className="hidden">{placeholder}</DrawerDescription>
                </DrawerHeader>
                <div className='scrollbar-visible overflow-auto'>
                    <RadioGroup
                        onValueChange={onValueChange}
                        defaultValue={defaultValue as string}
                        value={value as string}
                        className="flex flex-col py-2"
                    >
                        {radioItems.map((v, i) => {
                            const id = `${title}-${v.value}`;
                            return (
                                <Fragment key={id}>
                                    <NavigationEntryCore
                                        className='min-h-0'
                                        actionNode={
                                            <RadioGroupItem
                                                value={v.value as string}
                                                id={id}
                                                className='mr-2'
                                            />
                                        }
                                    >
                                        <Label
                                            className='flex items-center justify-between'
                                            htmlFor={id}
                                        >
                                            {v.item}
                                        </Label>
                                    </NavigationEntryCore>
                                    {i !== radioItems.length - 1 && <Separator/>}
                                </Fragment>
                            );
                        })}
                    </RadioGroup>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export { SelectAsRadio };