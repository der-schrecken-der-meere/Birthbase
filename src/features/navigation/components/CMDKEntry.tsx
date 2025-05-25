// Packages
import { Link } from "react-router-dom";

// External features
import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { cn } from "@/lib/utils";

// Internal features
import type { CMDKEntryProps } from "../types/components";

const CMDKEntry = ({
    children,
    className,
    search,
    shortcut,
    Icon,
    onClick,
    ...props
}: CMDKEntryProps) => {
    return (
        <CommandItem asChild>
            <Link
                onClick={onClick}
                className={cn("gap-2", className)}
                {...props}
            >
                <Icon className="h-4 w-4" />
                <span>
                    {children}
                    {search && <span className="hidden">{search}</span>}
                </span>
                {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
            </Link>
        </CommandItem>
    );
};

export { CMDKEntry };