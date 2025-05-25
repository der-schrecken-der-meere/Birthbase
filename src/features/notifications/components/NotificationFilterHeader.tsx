import { cn } from "@/lib/utils";
import { NotificationFilterHeaderProps } from "../types/components";
import { NotificationFilter } from "./NotificationFilter";

const NotificationFilterHeader = ({
    activeFilterIndex,
    className,
    filters,
    ...props
}: NotificationFilterHeaderProps) => {
    return (
        <div
            className={cn("shrink-0 mb-2 table-fixed overflow-auto scrollbar-visible", className)}
            {...props}
        >
            <div className="flex gap-2">
                {filters.map(({ onClick, text }, index) => {
                    return (
                        <NotificationFilter
                            key={`${index}-${text}`}
                            onClick={onClick}
                            active={index === activeFilterIndex}
                        >
                            {text}
                        </NotificationFilter>
                    );
                })}
            </div>
        </div>
    );
};

export { NotificationFilterHeader };