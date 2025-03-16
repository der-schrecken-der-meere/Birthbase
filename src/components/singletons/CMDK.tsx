import { type FunctionComponent, useEffect, useState } from "react";

import { Power } from "lucide-react";
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
import { Link } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";

import { useNavEntriesStore } from "@/stores/use_nav_entries_store";

import { useTranslation } from "react-i18next";

import { exit } from "@tauri-apps/plugin-process";
import { PageLinks } from "@/globals/constants/links";
import { OnlyTauri } from "../OnlyTauri";

const CMDK = () => {

    const settingsLinks = useNavEntriesStore((state) => state.settingsLinks);
    const mainLinks = useNavEntriesStore((state) => state.mainLinks);

    const { t } = useTranslation(["navigation", "generally"]);

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
        <CommandDialog open={open} onOpenChange={setOpen} title={t("search.title")}>
            <CommandInput placeholder={t("search.placeholder")} />
            <CommandList className="overflow-hidden">
                <ScrollArea className="h-[300px]">
                    <CommandEmpty>
                        {t("search.no_results")}
                    </CommandEmpty>
                    <CommandGroup heading={mainLinks.title}>
                        {mainLinks.entries.map((link) => (
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
                    <CommandGroup heading={settingsLinks.title}>
                        {settingsLinks.entries.map((link) => (
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
                    <OnlyTauri osTypes={["windows", "linux", "macos", "android", "ios"]}>
                        <CommandSeparator />
                        <CommandGroup heading={t("misc" , { ns: "generally" })}>
                            <OnlyTauri osTypes={["windows", "linux", "macos"]}>
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
                                    <span>
                                        {t("close_app", { ns: "generally" })}
                                    </span>
                                </CommandItem>
                            </OnlyTauri>
                        </CommandGroup>
                    </OnlyTauri>
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