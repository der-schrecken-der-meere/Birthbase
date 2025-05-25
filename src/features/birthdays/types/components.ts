// Packages
import type { HTMLAttributes } from "react";

// External features
import type { ButtonProps } from "@/components/ui/button";

// Internal features
import type { ComputedAppBirthday } from "./query";

type BirthdayMonthGroupProps = {
    birthdays: ComputedAppBirthday[],
    month: string,
    onBirthdayClick: (birthday: ComputedAppBirthday) => void,
};

type BirthdayUntilBadgeProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    until: number,
};

type BirthdayEntryProps = Omit<ButtonProps, "onClick"|"children"> & {
    birthday: ComputedAppBirthday,
    onBirthdayClick: (birthday: ComputedAppBirthday) => void,
};

export type {
    BirthdayEntryProps,
    BirthdayMonthGroupProps,
    BirthdayUntilBadgeProps,
};