import { type FunctionComponent } from "react";

import { Power } from "lucide-react";
import {
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "../ui/command";
import { Link } from "react-router-dom";

import { useNavEntriesStore } from "@/stores/use_nav_entries_store";

import { useTranslation } from "react-i18next";

import { exit } from "@tauri-apps/plugin-process";
import { PageLinks } from "@/globals/constants/links";
import { OnlyTauri } from "../OnlyTauri";

const CMDK = ({
    setOpen
}: {
    setOpen: (open: boolean) => void,
}) => {

    const settingsLinks = useNavEntriesStore((state) => state.settingsLinks);
    const mainLinks = useNavEntriesStore((state) => state.mainLinks);

    const { t } = useTranslation(["navigation", "generally"]);

    const onClick = () => {
        setOpen(false);
    };

    return (
        <>
            <CommandInput placeholder={t("search.placeholder")} />
            <CommandList className="overflow-hidden">
                <div className="h-[300px] scrollbar-visible overflow-y-auto overflow-x-hidden">
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
                                <CommandItem
                                    className="gap-2"
                                    onSelect={() => {
                                        (async () => {
                                            try {
                                                await exit(0)
                                            } catch (e) {
                                                console.error(e);
                                            }
                                        })();
                                    }}
                                >
                                    <Power className="h-4 w-4" />
                                    <span>
                                        {t("close_app", { ns: "generally" })}
                                    </span>
                                </CommandItem>
                            </OnlyTauri>
                        </CommandGroup>
                    </OnlyTauri>
                </div>
            </CommandList>
        </>
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
                className="gap-2"
            >
                <Icon className="h-4 w-4" />
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