import type { NavigationEntryCoreProps } from "./types";

import { FormControl, FormItem, FormLabel } from "../ui/form";
import { NavigationEntryCore } from "./core/NavigationEntryCore";

/**
 * A form element that resembles a navigation entry and should only be used on setting pages.
 * 
 * @example
 * ```tsx
 * <SettingsFormElement
 *   actionNode={<Button>I update something in the form</Button>}
 *   icon={<Icon />}
 *   caption="This is a caption or description"
 * >
 *   This is a title
 * </SettingsFormElement>
 * ```
 */
const SettingsFormElement = ({
    actionNode,
    children,
    ...props
}: NavigationEntryCoreProps) => {
    return (
        <FormItem>
            <NavigationEntryCore
                actionNode={
                    <FormControl>
                        {actionNode}
                    </FormControl>
                }
                {...props}
            >
                <FormLabel className='text-base font-normal'>
                    {children}
                </FormLabel>
            </NavigationEntryCore>
        </FormItem>
    );
};

export { SettingsFormElement };