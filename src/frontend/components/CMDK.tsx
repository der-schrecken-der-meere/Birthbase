import {
    Monitor,
    Calendar,
    Settings,
    Bell,
    HardDrive,
    CalendarClock,
    Languages,
    Info,
} from "lucide-react"

import {
    LuHome
} from "react-icons/lu"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/frontend/components/ui/command"
import { useEffect, useState } from "react"
import { ScrollArea } from "./ui/scroll-area"
import { Link } from "react-router-dom"

const CMDK = () => {
    const [open, setOpen] = useState(false)
    const onClick = () => {
        setOpen(false);
    }
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(() => true)
            }
        }
    
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen} title="Suchmenü">
            <CommandInput placeholder="Suchen Sie nach etwas..." />
            <CommandList className="overflow-hidden">
                <ScrollArea className="h-[300px]">
                    <CommandEmpty>Keine Übereinstimmungen gefunden.</CommandEmpty>
                    <CommandGroup heading="Links">
                        <CommandItem asChild>
                            <Link
                                to="/"
                                onClick={onClick}
                            >
                                <LuHome className="mr-2 h-4 w-4" />
                                <span>Startseite<span className="hidden">Home</span></span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/my_birthdays"
                                onClick={onClick}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Meine Geburtstage</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/settings"
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
                                to="/settings/appearance"
                                onClick={onClick}
                            >
                                <Monitor className="mr-2 h-4 w-4" />
                                <span>Aussehen<span className="hidden">Modus,Akzentfarbe</span></span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/settings/notifications"
                                onClick={onClick}
                            >
                                <Bell className="mr-2 h-4 w-4" />
                                <span>Benachrichtigungen</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/settings/storage"
                                onClick={onClick}
                            >
                                <HardDrive className="mr-2 h-4 w-4" />
                                <span>Speicher<span className="hidden">Verfügbarer Speicher,Speicher leeren</span></span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/settings/time"
                                onClick={onClick}
                                onPointerDown={onClick}
                            >
                                <CalendarClock className="mr-2 h-4 w-4" />
                                <span>Datum und Uhrzeit</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/settings/language"
                                onClick={onClick}
                            >
                                <Languages className="mr-2 h-4 w-4" />
                                <span>Sprache</span>
                            </Link>
                        </CommandItem>
                        <CommandItem asChild>
                            <Link
                                to="/settings/info"
                                onClick={onClick}
                            >
                                <Info className="mr-2 h-4 w-4" />
                                <span>Info</span>
                            </Link>
                        </CommandItem>
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
        </CommandDialog>
    )
}
export default CMDK