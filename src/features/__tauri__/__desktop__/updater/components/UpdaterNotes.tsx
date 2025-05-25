import { useTranslation } from "react-i18next";
import { useUpdateStore } from "../stores/use_update";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const UpdaterNotes = () => {
    const notes = useUpdateStore((state) => state.notes);

    const { t } = useTranslation("updater");

    return (
        <Collapsible>
            <div className='flex items-center shrink-0 justify-between'>
                {t("update_notes")}
                <CollapsibleTrigger asChild>
                    <Button
                        variant="secondary"
                        size="icon"
                    >
                        <ChevronDown className='h-4 w-4' />
                    </Button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <Markdown
                    className="text-sm text-muted-foreground scrollbar-visible max-h-[300px] h-[300px"
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
            </CollapsibleContent>
        </Collapsible>
    );
};

export { UpdaterNotes };