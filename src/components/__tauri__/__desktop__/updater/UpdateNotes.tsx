import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../../../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../ui/collapsible";
import { ScrollArea } from "../../../ui/scroll-area";
import Markdown from "react-markdown";

import { useUpdateStore } from "@/stores/use_update_store";

import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const UpdateNotes = () => {

    const [open, set_open] = useState(false);

    const notes = useUpdateStore((state) => state.notes);

    const { t } = useTranslation(["updater"]);

    const Chevron = open ? ChevronUp : ChevronDown;

    return (
        <Collapsible
            open={open}
            onOpenChange={set_open}
        >
            <div className='flex items-center shrink-0 justify-between'>
                {t("update_notes")}
                <CollapsibleTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                    >
                        <Chevron className='h-4 w-4' />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <ScrollArea className='max-h-[300px] h-[300px]'>
                    <Markdown
                        className="text-sm text-muted-foreground"
                        components={{
                            ul: ({ children, className, ...props }) => {
                                return (
                                    <ul className={cn("[&_>_li]:list-disc", className)} {...props}>
                                        {children}
                                    </ul>
                                );
                            },
                            li: ({ children, className, ...props }) => {
                                return (
                                    <li className={cn("list-outside ml-4.5", className)} {...props}>
                                        {children}
                                    </li>
                                );
                            }
                        }}
                    >
                        {notes}
                    </Markdown>
                </ScrollArea>
            </CollapsibleContent>
        </Collapsible>
    );
};

export { UpdateNotes };