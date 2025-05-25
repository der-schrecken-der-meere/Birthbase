// Packages
import { useTranslation } from "react-i18next";

// External features
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Internal features
import type { BirthdayEntryProps } from "../types/components";
import { BirthdayUntilBadge } from "./BirthdayUntilBadge";

const BirthdayEntry = ({
    birthday,
    className,
    onBirthdayClick,
    ...props
}: BirthdayEntryProps) => {

    const { t, i18n } = useTranslation("pages");

    const { age, until, birthdayRecord: { timestamp, name: { first, last } } } = birthday;

    const turns = t("home.turns", {
        new_age: age + 1,
        date: new Intl.DateTimeFormat(i18n.language, {
            month: "2-digit",
            day: "2-digit",
        }).format(timestamp),
    });

    const name = t("home.person_full_name", {
        first_name: first,
        last_name: last,
    });

    const onClick = () => {
        onBirthdayClick(birthday);
    };

    return (
        <Button
            className={cn(
                "border border-border rounded-xl px-4 py-2 flex gap-4 items-center w-full justify-between",
                className
            )}
            onClick={onClick}
            type="button"
            {...props}
        >
            <div className="flex flex-col gap-1 items-start">
                <div className="font-medium text-lg text-wrap">
                    {name}
                </div>
                <div className="flex flex-nowrap items-center gap-1 mt-auto text-sm text-muted-foreground">
                    {turns}
                </div>
            </div>
            <BirthdayUntilBadge
                until={until}
            />
        </Button>
    );
};

export { BirthdayEntry };