// Packages
import { Eye, Trash2 } from "lucide-react";

// External features
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Internal features
import type { NotificationEntryProps } from "../types/components";
import { useTranslation } from "react-i18next";
import { formatRelativeTime } from "@/lib/functions/formats/format_relative_time";

const NotificationEntry = ({
    children,
    className,
    notification,
    notificationTitle,
    read,
    onDelete,
    onRead,
    Icon,
    ...props
}: NotificationEntryProps) => {

    // Hooks
    const { t, i18n } = useTranslation(["generally", "pages"]);

    // Functions
    const onReadClick = () => {
        onRead(notification);
    };
    
    const onDeleteClick = () => {
        onDelete(notification);
    };

    const { timestamp } = notification;
    const timeString = formatRelativeTime(i18n.language, -timestamp, Date.now());

    return (
        <Popover>
            <PopoverTrigger
                className={cn(
                    "w-full flex rounded-lg border-[1px] p-3 gap-4 bg-secondary items-stretch",
                    read && "text-muted-foreground bg-transparent"
                )}
                {...props}
            >
                <Icon className="h-8 w-8 self-center shrink-0" />
                <div className="w-full">
                    <div className="float-end w-max h-5 text-end text-muted-foreground text-sm mx-2">
                        {timeString}
                    </div>
                    <div className="text-start text-current/80">
                        <div className="font-bold">
                            {notificationTitle}
                        </div>
                        {children}
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-1 flex flex-col gap-1">
                {!read && (
                    <Button
                        onClick={onReadClick}
                        size="sm"
                        variant="outline"
                        className="gap-2"
                    >
                        <Eye className="w-4 h-4"/>
                        {t("notifications.mark_read", { ns: "pages" })}
                    </Button>
                )}
                <Button
                    onClick={onDeleteClick}
                    size="sm"
                    variant="outline"
                    className="gap-2"
                >
                    <Trash2 className="w-4 h-4"/>
                    {t("delete_btn", { ns: "generally" })}
                </Button>
            </PopoverContent>
        </Popover>
    );
};

export { NotificationEntry };