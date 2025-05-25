// External features
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Internal features
import type { NotificationFilterProps } from "../types/components";

const NotificationFilter = ({
    active,
    className,
    onClick,
    ...props
}: NotificationFilterProps) => {
    return (
        <Button
            size="sm"
            variant="outline"
            onClick={onClick}
            className={cn(active && "bg-accent", className)}
            {...props}
        />
    );
};

export { NotificationFilter };