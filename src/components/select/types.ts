import type { CommonType } from "@/lib/types/object";
import type { DialogTriggerProps } from "@radix-ui/react-dialog";
import type { SelectTriggerProps } from "@radix-ui/react-select";
import type { ReactNode } from "react";

type ListItem<T> = {
    value: T;
    item: ReactNode;
    displayText: string;
};

type UniSelectProps<T> = CommonType<DialogTriggerProps, SelectTriggerProps> & {
    // defaultValue: T,
    onValueChange: (value: string) => void,
    placeholder: string,
    listItems: ListItem<T>[]
};

type SelectAsRadioProps<T> = Omit<UniSelectProps<T>, "listItems"> & {
    radioItems: ListItem<T>[];
};

type SelectShortendProps<T> = Omit<UniSelectProps<T>, "listItems"> & {
    selectItems: ListItem<T>[];
};


export type {
    ListItem,
    UniSelectProps,
    SelectShortendProps,
    SelectAsRadioProps,
};