// External features
import { FileUploaderDialogContent } from "@/components/dropzone/FileUploaderDialog";
import { NavigationEntryCore } from "@/components/settings/core/NavigationEntryCore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DatabaseBackup, HardDriveUpload } from "lucide-react";
import { useTranslation } from "react-i18next";

// Internal features
import { useBackupStore } from "../stores/use_backup";
import { OperationCode } from "../constants/enums/Tasks";

const BackupSettingsPage = () => {

    const isProcessing = useBackupStore((state) => state.isProcessing);
    const progress = useBackupStore((state) => state.progress);
    const setStartExport = useBackupStore((state) => state.setStartExport);
    const setStartImport = useBackupStore((state) => state.setStartImport);

    const { t } = useTranslation(["pages", "generally"]);
    const ts = (key: string) => {
        return t(`settings_backup.${key}`);
    };

    const onFileUpload = (files: File[]) => {
        setStartImport(files[0]);
    };

    console.log(progress);

    return (
        <>
            <NavigationEntryCore
                actionNode={
                    <Button
                        type="button"
                        onClick={setStartExport}
                        variant="secondary"
                        size="sm"
                        disabled={isProcessing !== null}
                        aria-label={t("create_backup_aria")}
                    >
                        {t("create_btn", { ns: "generally" })}
                    </Button>
                }
                icon={DatabaseBackup}
                caption={ts("create_backup_description")}
            >
                {ts("create_backup_title")}
            </NavigationEntryCore>
            {(isProcessing === OperationCode.EXPORT && progress < 100) && (
                <NavigationEntryCore
                    caption={
                        <Progress
                            value={progress}
                        />
                    }
                >
                    {ts("create_backup_progress")}
                </NavigationEntryCore>
            )}
            <Separator/>
            <NavigationEntryCore
                actionNode={
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                            >
                                {ts("import_backup_btn")}
                            </Button>
                        </DialogTrigger>
                        <FileUploaderDialogContent
                            accept={{
                                "application/json": [".json"],
                            }}
                            onSubmit={onFileUpload}
                            progress={isProcessing === OperationCode.IMPORT && progress}
                        />
                    </Dialog>
                }
                icon={HardDriveUpload}
                caption={ts("import_backup_description")}
            >
                {ts("import_backup_title")}
            </NavigationEntryCore>
            {(isProcessing === OperationCode.IMPORT) && (
                <NavigationEntryCore
                    caption={
                        <Progress
                            value={progress}
                        />
                    }
                >
                    {ts("import_backup_progress")}
                </NavigationEntryCore>
            )}
        </>
    );
};

export { BackupSettingsPage };