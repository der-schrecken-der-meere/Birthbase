import { lazy, Suspense, useEffect, useState } from "react"
import { useTranslation } from "react-i18next";
import { CommandDialog } from "../ui/command";
import { Skeleton } from "../ui/skeleton";

const CMDK = lazy(() => import('../singletons/CMDK').then(module => ({ default: module.CMDK })));

const CMDKSuspense = () => {

    const { t } = useTranslation(["navigation", "generally"]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen(() => true);
            }
        };
    
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <CommandDialog open={open} onOpenChange={setOpen} title={t("search.title")}>
            <Suspense fallback={
                <Skeleton className="h-12 mx-1 my-1" />
            }>
                <CMDK setOpen={setOpen}/>
            </Suspense>
        </CommandDialog>
    );
};

export { CMDKSuspense };