import {
    Monitor,
    Calendar,
    Settings,
    Bell,
    HardDrive,
    CalendarClock,
    Languages,
    Info,
    Power,
    Home,
} from "lucide-react";
// import {
//     LuHome
// } from "react-icons/lu";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "../ui/command";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { exit } from "@tauri-apps/plugin-process";
import { OsType, type } from "@tauri-apps/plugin-os";
import { isTauri } from "@tauri-apps/api/core";

import { ScrollArea } from "../ui/scroll-area";

import { primitive_strict_or } from "@/lib/functions/logic/or";
import { PageLinks } from "@/globals/constants/links";

const CMDK = () => {

    const [open, setOpen] = useState(false);

    const onClick = () => {
        setOpen(false);
    };

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(() => true);
            }
        };
    
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen} title="Suchmenü">
            <CommandInput placeholder="Suchen Sie nach etwas..." />
            <CommandList className="overflow-hidden">
                <ScrollArea className="h-[300px]">
                    <CommandEmpty>Keine Übereinstimmungen gefunden.</CommandEmpty>
                    <CommandGroup heading="Links">
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.HOME}
                                onClick={onClick}
                            >
                                <Home className="mr-2 h-4 w-4" />
                                <span>Startseite<span className="hidden">Home</span></span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.MY_BIRTHDAYS_PARAMS}
                                onClick={onClick}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Meine Geburtstage</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS}
                                onClick={onClick}
                            >
                                <Settings className="mr-2 h-4 w-4" />
                            <span>Einstellungen</span>
                            <CommandShortcut>⌘E</CommandShortcut>
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Einstellungen">
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS_APPEARANCE}
                                onClick={onClick}
                            >
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>Aussehen<span className="hidden">Modus,Akzentfarbe</span></span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS_NOTIFICATION}
                                onClick={onClick}
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Benachrichtigungen</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS_STORAGE}
                                onClick={onClick}
                            >
                                <HardDrive className="mr-2 h-4 w-4" />
                                <span>Speicher<span className="hidden">Verfügbarer Speicher,Speicher leeren</span></span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS_TIME}
                                onClick={onClick}
                                onPointerDown={onClick}
                            >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                <span>Datum und Uhrzeit</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS_LANGUAGE}
                                onClick={onClick}
                            >
                                <Languages className="mr-2 h-4 w-4" />
                                <span>Sprache</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to={PageLinks.SETTINGS_INFO}
                                onClick={onClick}
                            >
                                <Info className="mr-2 h-4 w-4" />
                                <span>Info</span>
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                    {!isTauri() ? null : 
                       <>
                            <CommandSeparator />
                            <CommandGroup heading="Sonstiges">
                                {!primitive_strict_or<OsType>(type(), "linux", "linux", "windows") ? null :
                                    <CommandItem onSelect={() => {
                                        (async () => {
                                            try {
                                                await exit(0)
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        })();
                                    }}>
                                        <Power className="mr-2 h-4 w-4" />
                                        <span>App schließen<span className="hidden">beenden</span></span>
                                    </CommandItem>
                                }
                            </CommandGroup>
                        </>
                    }
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    );
};

export { CMDK }; 