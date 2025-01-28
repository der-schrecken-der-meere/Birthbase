import { FunctionComponent } from "react";
import { PageLinks } from "./links";
import {
    Bell,
    CalendarClock,
    HardDrive,
    House,
    Info,
    Languages,
    Monitor,
    PartyPopper,
    Settings
} from "lucide-react";

type LinkEntry = {
    title: string,
    url: PageLinks,
    icon: FunctionComponent,
    search?: string[],
    shortcut?: string,
};

const c_main_links: LinkEntry[] = [
    {
        title: "Startseite",
        url: PageLinks.HOME,
        icon: House,
        search: [
            "home"
        ],
    },
    {
        title: "Meine Geburtstage",
        url: PageLinks.MY_BIRTHDAYS_PARAMS,
        icon: PartyPopper,
    },
    {
        title: "Einstellungen",
        url: PageLinks.SETTINGS,
        icon: Settings,
        shortcut: "⌘E",
    },
    {
        title: "Benachrichtigungen",
        url: PageLinks.NOTIFICATIONS,
        icon: Bell,
        shortcut: "⌘P",
    }
];
const main_links = Object.freeze(c_main_links);

const c_settings_links: LinkEntry[] = [
    {
        title: "Aussehen",
        url: PageLinks.SETTINGS_APPEARANCE,
        icon: Monitor,
        search: [
            "Modus",
            "Akzentfarbe",
        ],
    },
    {
        title: "Benachrichtigungen",
        url: PageLinks.SETTINGS_NOTIFICATION,
        icon: Bell,
    },
    {
        title: "Speicher",
        url: PageLinks.SETTINGS_STORAGE,
        icon: HardDrive,
        search: [
            "Verfügbarer Speicher",
            "Speicher leeren",
        ],
    },
    {
        title: "Datum und Zeit",
        url: PageLinks.SETTINGS_TIME,
        icon: CalendarClock,
    },
    {
        title: "Sprache",
        url: PageLinks.SETTINGS_LANGUAGE,
        icon: Languages,
    },
    {
        title: "Info",
        url: PageLinks.SETTINGS_INFO,
        icon: Info,
    },
];
const settings_links = Object.freeze(c_settings_links);

export type { LinkEntry };
export { main_links, settings_links };