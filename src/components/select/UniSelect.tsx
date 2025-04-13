import type { UniSelectProps } from "./types";

import { useSidebar } from "../ui/sidebar";

import { SelectAsRadio } from "./RadioSelect";
import { SelectShortend } from "./Select";

const UniSelect = <T,>({
    listItems,
    ...props
}: UniSelectProps<T>) => {
    const { isMobile } = useSidebar();

    return (
        isMobile ? (
            <SelectAsRadio
                radioItems={listItems}
                {...props}
            />
        ) : (
            <SelectShortend
                selectItems={listItems}
                {...props}
            />
        )
    );
};

export { UniSelect };