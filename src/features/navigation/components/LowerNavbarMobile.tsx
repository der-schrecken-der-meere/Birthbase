// Packages
import type { HTMLAttributes } from "react";

// Externa features
import { BirthdayAddButtonMobile } from "@/features/birthdays/components/BirthdayAddButtonMobile";
import { cn } from "@/lib/utils";

// Internal features
import type { LinkEntry } from "../types/store";
import { LowerNavbarEntry } from "./LowerNavbarEntry";
import { PageLinks } from "../lib/constants/enums/PageLinks";
import { useNavigationLinksStore } from "../stores/use_navigation_links";

const LowerNavbarMobile = ({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) => {

    const mainLinks = useNavigationLinksStore((state) => state.mainLinks);

    const findLink = (pageLink: PageLinks) => {
        return mainLinks.links.find((link) => link.url === pageLink) || "empty";
    };

    const lowerNavbarEntries: (LinkEntry|string)[] = [
        findLink(PageLinks.HOME),
        findLink(PageLinks.MY_BIRTHDAYS_PARAMS),
        "addBirthday",
        findLink(PageLinks.NOTIFICATIONS),
        findLink(PageLinks.SETTINGS),
    ];

    return (
        <div
            className={cn(
                "flex items-center justify-between",
                className
            )}
            {...props}
        >
            {lowerNavbarEntries.map((entry) => {
                if (typeof entry === "string") {
                    if (entry === "addBirthday") {
                        return (
                            <BirthdayAddButtonMobile
                                key={"addBirthday"}
                                className="h-10"
                            />
                        );
                    }
                    return null;
                }

                const { url, Icon, title } = entry;

                return (
                    <LowerNavbarEntry
                        key={url}
                        to={url || "/"}
                        aria-label={title}
                    >
                        <Icon className="w-4 h-4" />
                    </LowerNavbarEntry>
                );
            })}
        </div>
    );
};

export { LowerNavbarMobile };