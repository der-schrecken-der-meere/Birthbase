import { storage_size_to_string } from "@/lib/functions/storage/storageToString";
import { cn } from "@/lib/utils";
import { type MouseEventHandler } from "react";
import { type DropzoneOptions, useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";

const Dropzone = ({
    maxFiles,
    // value,
    onChange,
    onDrop,
    ...props
}: DropzoneOptions & {
    // value: File[],
    onChange: (files: File[]) => void,
}) => {
    const max_files = maxFiles || 1;

    const {
        getRootProps,
        getInputProps,
        isDragReject,
        acceptedFiles,
        isDragActive,
    } = useDropzone({
        maxFiles: max_files,
        onDrop: (acceptedFiles, rejectedFiles) => {
            console.log(rejectedFiles);
            onChange(acceptedFiles);
        },
        ...props,
    });

    const reset: MouseEventHandler<HTMLElement> = () => {
        onChange([]);
    };

    const { t, i18n } = useTranslation(["dialog"]);

    const ts = (key: string) => t(`file_uploader.${key}`);

    return (
        <section className="flex flex-col gap-4">
            <div
                className={cn(
                    "text-center text-muted-foreground/50 bg-muted/50",
                    "px-4 py-2 gap-2 min-h-20",
                    "border-2 border-dashed border-border",
                    "focus-within:border-primary focus:border-primary focus-visible:border-primarys",
                    "grid place-items-center",
                    isDragActive && "border-primary",
                    isDragReject && "border-destructive"
                )}
                {...getRootProps({ onClick: reset })}
            >
                <input {...getInputProps()}/>
                {isDragReject
                    ? <p className="font-bold -z-50">
                        {ts("file_not_accepted")}
                    </p>
                    : <p className="-z-50">
                        {t("file_uploader.area_description", { count: max_files })}
                    </p>
                }
            </div>
            <div className="flex flex-col">
                <p className="font-medium">
                    {ts("accepted_files_title")}
                </p>
                {acceptedFiles.map((file) => (
                    <div
                        key={file.name}
                        className="mt-2 border rounded-lg px-4 py-2 flex gap-2 text-sm"
                    >
                        <span className="w-full [word-break:break-word]">
                            {file.name}
                        </span>
                        <span className="text-end text-nowrap">
                            {storage_size_to_string(i18n.language, file.size)}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export { Dropzone };