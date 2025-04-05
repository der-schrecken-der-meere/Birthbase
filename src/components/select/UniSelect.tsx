import type { UniSelectProps } from "./types";

import { useSidebar } from "../ui/sidebar";

import { SelectAsRadio } from "./RadioSelect";
import { SelectShortend } from "./Select";

const UniSelect = <T,>({
    defaultValue,
    onValueChange,
    placeholder,
    listItems,
    ...props
}: UniSelectProps<T>) => {
    const { isMobile } = useSidebar();

    return (
        isMobile ? (
            <SelectAsRadio
                title={placeholder}
                radioItems={listItems}
                defaultValue={defaultValue as string}
                onValueChange={onValueChange}
                {...props}
            />
        ) : (
            <SelectShortend
                title={placeholder}
                selectItems={listItems}
                defaultValue={defaultValue as string}
                onValueChange={onValueChange}
                {...props}
            />
        )
    );
};

export { UniSelect };