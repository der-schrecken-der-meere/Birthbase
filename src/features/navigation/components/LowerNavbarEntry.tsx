// Packages
import type { CSSProperties } from "react";
import { NavLink, type LinkProps } from "react-router-dom";

// External features
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LowerNavbarEntry = ({
    className,
    ...props
}: LinkProps) => {
    return (
        <NavLink
            className={({ isActive }) => cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                isActive && "bg-primary text-primary-foreground",
                className
            )}
            style={({ isActive }) => ({
                "--bg": isActive ? "var(--primary)" : "var(--background)",
                "--text": isActive ? "var(--primary-foreground)" : "var(--primary)",
            }) as CSSProperties}
            {...props}
        />
    );
};

export { LowerNavbarEntry };