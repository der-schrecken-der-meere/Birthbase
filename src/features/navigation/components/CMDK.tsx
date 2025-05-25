// Packages
import { useTranslation } from "react-i18next";

// External features
import { CommandEmpty, CommandGroup, CommandInput, CommandList, CommandSeparator } from "@/components/ui/command";

// Internal features
import type { CMDKProps } from "../types/components";
import { useNavigationLinksStore } from "../stores/use_navigation_links";
import { CMDKEntry } from "./CMDKEntry";

const CMDK = ({
    setIsOpen,
}: CMDKProps) => {

    const mainLinks = useNavigationLinksStore((state) => state.mainLinks);
    const settingsLinks = useNavigationLinksStore((state) => state.settingsLinks);
    const miscActions = useNavigationLinksStore((state) => state.miscActions);

    const { t } = useTranslation("navigation");

    const onEntryClick = () => {
        setIsOpen(false);
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
                        {mainLinks.links.map(({ url, Icon, title, search, shortcut }) => (
                            <CMDKEntry
                                key={url}
                                to={url || "/"}
                                onClick={onEntryClick}
                                Icon={Icon}
                                search={search}
                                shortcut={shortcut}
                            >
                                {title}
                            </CMDKEntry>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading={settingsLinks.title}>
                        {settingsLinks.links.map(({ url, Icon, title, search, shortcut }) => (
                            <CMDKEntry
                                key={url}
                                to={url || "/"}
                                onClick={onEntryClick}
                                Icon={Icon}
                                search={search}
                                shortcut={shortcut}
                            >
                                {title}
                            </CMDKEntry>
                        ))}
                    </CommandGroup>
                    {(miscActions.links.length > 0) && (
                        <>
                            <CommandSeparator />
                            <CommandGroup heading={miscActions.title}>
                                {miscActions.links.map(({ Icon, title, onClick }) => (
                                    <CMDKEntry
                                        key={title}
                                        to={"#"}
                                        onClick={onClick}
                                        Icon={Icon}
                                    >
                                        {title}
                                    </CMDKEntry>
                                ))}
                            </CommandGroup>
                        </>
                    )}
                </div>
            </CommandList>
        </>
    );
};

export { CMDK };