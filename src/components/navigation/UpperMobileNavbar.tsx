import { GoBackInHistory } from "../History";
import { CustomSidebarTrigger } from "../Sidebar";
import type { UpperNavbarProps } from "./types";

const UpperMobileNavbar = ({
    pageTitle,
}: UpperNavbarProps) => {
    return (
        <>
            <GoBackInHistory
                variant="ghost"
                size="icon"
                className='w-7 h-7'
            />
            <div className='whitespace-pre text-ellipsis overflow-hidden text-xl flex-1'>{pageTitle}</div>
            <CustomSidebarTrigger className='h-7 w-7'/>
        </>
    );
};

export { UpperMobileNavbar };