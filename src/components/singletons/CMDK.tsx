import {
    Power,
} from "lucide-react";

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

import { FunctionComponent, useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { exit } from "@tauri-apps/plugin-process";
import { OsType, type } from "@tauri-apps/plugin-os";
import { isTauri } from "@tauri-apps/api/core";

import { ScrollArea } from "../ui/scroll-area";

import { primitive_strict_or } from "@/lib/functions/logic/or";
import { PageLinks } from "@/globals/constants/links";
import { use_nav_entries } from "@/hooks/use_nav_entries";

const CMDK = () => {

    const [open, setOpen] = useState(false);

    const main_links = use_nav_entries((state) => state.main_links);
    const settings_links = use_nav_entries((state) => state.settings_links);

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
                    <CommandGroup heading={main_links.title}>
                        {main_links.entries.map((link) => (
                            <SearchEntry
                                key={link.url}
                                to={link.url}
                                onClick={onClick}
                                Icon={link.icon}
                                title={link.title}
                                hidden={link.search}
                                shortcut={link.shortcut}
                            />
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading={settings_links.title}>
                        {settings_links.entries.map((link) => (
                            <SearchEntry
                                key={link.url}
                                to={link.url}
                                onClick={onClick}
                                Icon={link.icon}
                                title={link.title}
                                hidden={link.search}
                                shortcut={link.shortcut}
                            />
                        ))}
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

type SearchEntryProps = {
    to: PageLinks,
    onClick: () => void,
    Icon: FunctionComponent<{ className: string }>,
    title: string,
    hidden?: string,
    shortcut?: string,
};

const SearchEntry = ({
    to,
    Icon,
    onClick,
    title,
    hidden,
    shortcut,
}: SearchEntryProps) => {
    return (
        <CommandItem asChild>
            <Link
                to={to}
                onClick={onClick}
            >
                <Icon className="mr-2 h-4 w-4" />
                <span>
                    {title}
                    {hidden && <span className="hidden">{hidden}</span>}
                </span>
                {shortcut && <CommandShortcut>{shortcut}</CommandShortcut>}
            </Link>
        </CommandItem>
    );
};

export { CMDK }; 