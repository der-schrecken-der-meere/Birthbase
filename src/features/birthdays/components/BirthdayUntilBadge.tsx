// Packages
import { PartyPopper } from "lucide-react";
import { useTranslation } from "react-i18next";

// Internal features
import type { BirthdayUntilBadgeProps } from "../types/components";
import { cn } from "@/lib/utils";

const BirthdayUntilBadge = ({
    until,
    className,
    ...props
}: BirthdayUntilBadgeProps) => {

    const { t } = useTranslation("generally");

    const content = until === 0
        ? (
            <PartyPopper className="w-6 h-6" />
        ) : (
            <>
                <span className='text-lg'>{until}</span>
                <span className='text-xs'>{t("day", { count: until })}</span>
            </>
        );

    return (
        <div
            className={cn("flex flex-col justify-center items-center", className)}
            {...props}
        >
            {content}
        </div>
    );
};

export { BirthdayUntilBadge };