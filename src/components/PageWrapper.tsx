import React from 'react'
import { cn } from '@/lib/utils';
import { LuArrowLeft } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button'

interface I_PageWrapper {
    /** The Titel of the page */
    title?: string;
    children?: React.ReactNode;
    className?: string;
    /** The amount of how many times the history should go back */
    goBack?: number;
    docTitle?: string;
}

interface I_GoBackHistory {
    /** The amount of how many times the history should go back */
    amount?: number;
}

const PageWrapper = ({
    title,
    children,
    className,
    goBack,
    docTitle,
}: I_PageWrapper) => {

    document.title = docTitle ? docTitle : document.title;

    return (
        <>
            <div className='flex items-center pb-2.5 px-2'>
                {(goBack || typeof goBack === "number")  && 
                    <GoBackInHistory
                        amount={goBack}
                    />
                }
                <h1 
                    className={`text-3xl font-semibold tracking-tight whitespace-pre text-ellipsis
                        overflow-hidden flex-1
                    `}
                >
                    {title}
                </h1>
            </div>
            <div className={cn(className, "h-full overflow-auto px-2 py-2")}>
                {children}
            </div>
        </>
    );
};

const GoBackInHistory = ({
    amount = 1,
}: I_GoBackHistory) => {
    const navigate = useNavigate();

    return (
        <Button
            className="mr-2"
            variant="ghost"
            size="icon"
            disabled={amount === 0}
            onClick={() => navigate((amount * -1))}
        >
            <LuArrowLeft size={24}/>
        </Button>
    );
};

export default PageWrapper;