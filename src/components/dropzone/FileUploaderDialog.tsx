import type { FileUploaderFormProps } from "./types";
import { lazy, Suspense } from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { useTranslation } from "react-i18next";


const FileUploaderForm = lazy(() => import("./FileUploaderForm").then((mod) => ({ default: mod.FileUploaderForm })));

const FileUploaderDialogContent = ({
    maxFiles,
    ...props
}: FileUploaderFormProps) => {

    const max_files = maxFiles || 1;

    const { t } = useTranslation(["dialog"]);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    {t("file_uploader.title")}
                </DialogTitle>
                <DialogDescription>
                    {t("file_uploader.description", { count: max_files })}
                </DialogDescription>
            </DialogHeader>
            <Suspense
                fallback={<Skeleton className="w-full h-10" />}
            >
                <FileUploaderForm
                    maxFiles={max_files}
                    {...props}
                />
            </Suspense>
        </DialogContent>
    );
};

export { FileUploaderDialogContent };