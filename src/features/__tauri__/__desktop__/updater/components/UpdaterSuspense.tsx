import { lazy, Suspense } from "react";
import { useUpdateStore } from "../stores/use_update";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/use_app_store";
import { Skeleton } from "@/components/ui/skeleton";

const UpdaterContent = lazy(() => import("./UpdaterContent").then(module => ({ default: module.UpdateContent })));

const UpdaterSuspense = () => {

    const isAvailable = useUpdateStore((state) => state.isAvailable);
    const isPrompting = useUpdateStore((state) => state.isPrompting);
    const updateVersion = useUpdateStore((state) => state.version);
    const appVersion = useAppStore((state) => state.appVersion);
    const setPrompting = useUpdateStore((state) => state.setPrompting);

    const { t } = useTranslation("updater");

    if (!isAvailable) {
        return null;
    }

    return (
        <Dialog
            defaultOpen={isPrompting}
            onOpenChange={setPrompting}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("update_to", { version: updateVersion })}
                    </DialogTitle>
                    <DialogDescription>
                        {t("current_version", { version: appVersion })}
                    </DialogDescription>
                </DialogHeader>
                <Suspense
                    fallback={
                        <Skeleton className="h-10" />
                    }
                >
                    <UpdaterContent/>
                </Suspense>
            </DialogContent>
        </Dialog>
    );
};

export { UpdaterSuspense };