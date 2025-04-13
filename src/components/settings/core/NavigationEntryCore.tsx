import { cn } from "@lib/utils";
import { NavigationEntryCoreProps } from "../types";

/**
 * A core component for navigation entries.
 * 
 * @example
 * ```tsx
 * <NavigationEntryCore
 *   icon={<Icon />}
 *   caption="This is a caption or description"
 *   actionNode={<Button>I do something</Button>}
 * >
 *   This is a title
 * </NavigationEntryCore>
 * ```
 */
const NavigationEntryCore = ({
    icon: Icon,
    className,
    actionNode,
    children,
    caption,
    ...props
}: NavigationEntryCoreProps) => {
    return (
        <div
            className={cn(
                "flex items-center justify-between py-2 px-2 gap-2 min-h-16",
                className
            )}
            {...props}
        >
            <div className="flex items-center gap-2 w-full">
                {Icon &&
                    <Icon className="w-6 h-6 mx-2 shrink-0" />
                }
                <div className='flex flex-col gap-1 justify-between w-full'>
                    {children &&
                        <div
                            className={cn(
                                !caption && 'my-auto'
                            )}
                        >
                            {children}
                        </div>
                    }
                    {caption &&
                        <span
                            className={cn(
                                'text-sm text-muted-foreground',
                                !children && 'my-auto'
                            )}
                        >
                            {caption}
                        </span>
                    }
                </div>
            </div>
            {actionNode && 
                <div className='grid place-items-center'>
                    {actionNode}
                </div>
            }
        </div>
    );
};

export { NavigationEntryCore };