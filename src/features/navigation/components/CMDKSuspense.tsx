// Packages
import { lazy, Suspense } from "react"
import { useTranslation } from "react-i18next";

// External features
import { CommandDialog } from "@/components/ui/command";

// Interal features
import { CMDKSkeleton } from "./CMDKSkeleton";
import { useCMDKStore } from "../stores/use_cmdk";

const CMDK = lazy(() => import('./CMDK').then(module => ({ default: module.CMDK })));

const CMDKSuspense = () => {

    const isOpen = useCMDKStore((state) => state.isOpen);
    const setIsOpen = useCMDKStore((state) => state.setIsOpen);

    const { t } = useTranslation("navigation");

    return (
        <CommandDialog open={isOpen} onOpenChange={setIsOpen} title={t("search.title")}>
            <Suspense fallback={
                <CMDKSkeleton className="mx-1 my-1" />
            }>
                <CMDK setIsOpen={setIsOpen}/>
            </Suspense>
        </CommandDialog>
    );
};

export { CMDKSuspense };