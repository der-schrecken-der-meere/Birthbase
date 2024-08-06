import MdOutlineSettings from "../icons/MdOutlineSettings";
import React, { type ReactElement } from "react";
import {
    MdOutlineCottage,
    MdOutlineCelebration
} from "react-icons/md";

type NavEntry = {
    href: string,
    ariaLabel: string,
    text: string,
    className?: string,
    id?: string,
}
type NavSection = NavEntry & {
    icon: (size?: number|string) => ReactElement,
    entries?: NavEntry[],
}

const navigationList: NavSection[] = [
    {
        text: "Home",
        href: "/",
        ariaLabel: "Go to the entry site",
        id: "home",
        icon: (size = 40) => React.createElement(MdOutlineCottage, {size}),
    },
    {
        text: "Meine Geburtstage",
        href: "/my_birthdays",
        ariaLabel: "Go to your birthday site",
        id: "my_birthdays",
        icon: (size = 40) => React.createElement(MdOutlineCelebration, {size}),
    },
    {
        className: "mt-auto",
        text: "Einstellungen",
        href: "/settings",
        ariaLabel: "Go to the settings site",
        id: "settings",
        icon: (size = 40) => React.createElement(MdOutlineSettings, {size}),
        entries: [
            {
                text: "Aussehen",
                href: "/appearance",
                ariaLabel: "Go to the appearance section of the settings site"
            },
            {
                text: "Benachrichtigungen",
                href: "/notifications",
                ariaLabel: "Go to the notification section of the settings site"
            },
            {
                text: "Speicher",
                href: "/storage",
                ariaLabel: "Go to the storage section of the settings site"
            },
            {
                text: "Datum und Uhrzeit",
                href: "/time",
                ariaLabel: "Go to the time section of the settings site"
            },
            {
                text: "Sprache",
                href: "/language",
                ariaLabel: "Go to the language section of the settings site"
            },
            {
                text: "Info",
                href: "/info",
                ariaLabel: "Go to the appearance section of the settings site"
            }
        ]
    }
]

export type { NavEntry, NavSection };
export default navigationList;