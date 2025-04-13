import type { CollapsibleNavigationEntryProps } from "./types";

import { useState } from "react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { NavigationEntryCore } from "./core/NavigationEntryCore";

/**
 * A collapsible element that resembles a navigation entry.
 * 
 * It can be used to group large amount of elements in a single entry.
 * 
 * @example
 * ```tsx
 * <CollapsibleNavigationEntry
 *   icon={<Icon />}
 *   caption="This is a caption or description"
 *   title="This is a title"
 * >
 *   <p>This content will be shown when the entry is open</p>
 * </CollapsibleNavigationEntry>
 * ```
 */
const CollapsibleNavigationEntry = ({
    title,
    children,
    ...props
}: CollapsibleNavigationEntryProps) => {
    const [open, setOpen] = useState(false);

    const CollapsibleTriggerIcon = open ? ChevronUp : ChevronDown;

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <NavigationEntryCore
                actionNode={
                    <CollapsibleTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                        >
                            <CollapsibleTriggerIcon className="w-4 h-4" />
                        </Button>
                    </CollapsibleTrigger>
                }
                {...props}
            >
                {title}
            </NavigationEntryCore>
            <CollapsibleContent>
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
};

export { CollapsibleNavigationEntry };