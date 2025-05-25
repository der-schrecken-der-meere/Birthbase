// Internal features
import type { UpperNavbarProps } from "../types/components";
import { GoBackInHistory } from "./GoBackInHistory";
import { AppSidebarTrigger } from "./AppSidebarTrigger";

const UpperNavbarMobile = ({
    pageTitle
}: UpperNavbarProps) => {
    return (
        <>
            <GoBackInHistory
                variant="ghost"
                size="icon"
                className='w-7 h-7'
            />
            <div className='whitespace-pre text-ellipsis overflow-hidden text-xl flex-1'>
                {pageTitle}
            </div>
            <AppSidebarTrigger className="h-7 w-7" />
        </>
    );
};

export { UpperNavbarMobile };