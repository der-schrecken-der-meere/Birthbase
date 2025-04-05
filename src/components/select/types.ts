import type { CommonType } from "@/lib/types/object";
import type { DialogTriggerProps } from "@radix-ui/react-dialog";
import { RadioGroupProps } from "@radix-ui/react-radio-group";
import type { SelectProps, SelectTriggerProps } from "@radix-ui/react-select";
import type { ReactNode } from "react";

type ListItem<T> = {
    value: T;
    item: ReactNode;
    displayText: string;
};

type UniSelectProps<T> = CommonType<DialogTriggerProps, SelectTriggerProps> & {
    defaultValue: T,
    onValueChange: (value: string) => void,
    placeholder: string,
    listItems: ListItem<T>[]
};

type SelectAsRadioProps<T> = Pick<RadioGroupProps, "onValueChange"|"defaultValue"> & DialogTriggerProps & {
    title: string;
    radioItems: ListItem<T>[];
};

type SelectShortendProps<T> = Pick<SelectProps, "onValueChange"|"defaultValue"> & SelectTriggerProps & {
    title: string;
    selectItems: ListItem<T>[];
};


export type {
    ListItem,
    UniSelectProps,
    SelectShortendProps,
    SelectAsRadioProps,
};