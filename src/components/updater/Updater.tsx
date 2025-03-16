import { type ProgressProps } from '@radix-ui/react-progress';

import { Suspense, useEffect, useState } from 'react';

import Markdown from "react-markdown";
import BasicDialog from '../dialogs/BasicDialog';
import { LinuxMacUpdater } from './LinuxMacUpdater';
import { Progress } from '../ui/progress';
import { Button, type ButtonProps } from '../ui/button';
import { DialogClose } from '../ui/dialog';
import { Skeleton } from '../ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { OnlyTauri } from '../OnlyTauri';

import { useUpdateStore } from '@/stores/use_update_store';
import { useAppStore } from '@/stores/use_app_store';

import { useTranslation } from 'react-i18next';
import { useGetSettingsQuery } from '@/features/manage_settings/query';
import { useQuery } from '@/hooks/core/use_query';

import { cn } from '@/lib/utils';
import { check_update, install_update } from '@/features/updater/updater';
import { mock_check_update, mock_update } from '@/features/updater/test/update';

const UpdaterProgress = ({
    value,
    ...props
}: ProgressProps) => {
    const progress = useUpdateStore((state) => state.progress);

    return (
        <Progress value={progress} {...props}/>
    );
};

const CheckUpdate = ({
    onClick,
    children,
    ...props
}: ButtonProps) => {
    const onCheckClick = () => {
        (async () => {
            await mock_check_update();
        })();
    };

    return (
        <Button
            onClick={onCheckClick}
            {...props}
        >
            {children}
        </Button>
    )
};

const DownloadUpdate = ({
    onClick,
    children,
    relaunch,
    ...props
}: ButtonProps & {
    relaunch: boolean,
}) => {
    const osType = useAppStore((state) => state.osType);

    const onDownloadClick = () => {
        (async () => {
            await mock_update(osType, relaunch);
        })();
    };

    return (
        <Button
            onClick={onDownloadClick}
            {...props}
        >
            {children}
        </Button>
    );
};

const Updater = () => {
    const notes = useUpdateStore((state) => state.notes);
    const isDownloading = useUpdateStore((state) => state.isDownloading);
    const isPrompting = useUpdateStore((state) => state.isPrompting); 
    const update_version = useUpdateStore((state) => state.version);
    const setPrompting = useUpdateStore((state) => state.setPrompting);

    const appVersion = useAppStore((state) => state.appVersion);

    const { t } = useTranslation(["updater", "generally"]);

    const { data: { relaunch }, isFetching } = useQuery({
        useQueryFn: useGetSettingsQuery,
        tKey: "settings",
    });

    const [restart, set_restart] = useState(relaunch);
    const [open, set_open] = useState(false);

    const on_relaunch_change = (relaunch: boolean) => {
        set_restart(relaunch);
    };

    useEffect(() => {
        set_restart(relaunch);
    }, []);

    if (isFetching) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <BasicDialog
            title={t("update_to", { version: update_version })}
            description={
                <span className='mt-2 font-bold'>{t("current_version", { version: appVersion })}</span>
            }
            headerVisibility
            defaultOpen={isPrompting}
            trigger={null}
            onOpenChange={setPrompting}
        >
            {isDownloading
                ? (<UpdaterProgress/>)
                : (
                    <OnlyTauri osTypes={["linux", "macos"]}>
                        <Suspense
                            fallback={<Skeleton className='w-full h-4' />}
                        >
                            <LinuxMacUpdater
                                onCheckedChange={on_relaunch_change}
                                defaultChecked={relaunch}
                            >
                                {t("restart_app")}
                            </LinuxMacUpdater>
                        </Suspense>
                    </OnlyTauri>
                )
            }
            <Collapsible
                open={open}
                onOpenChange={set_open}
            >
                <div className='flex items-center shrink-0'>
                    {t("update_notes")}
                    <CollapsibleTrigger asChild>
                        <Button
                            className='ml-auto'
                            variant="secondary"
                            size="icon"
                        >
                            {open ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
                        </Button>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    <ScrollArea className='max-h-[300px] h-[300px]'>
                        <Markdown
                            className="text-sm text-muted-foreground"
                            components={{
                                ul: ({ children, className, ...props }) => {
                                    return (
                                        <ul className={cn("[&_>_li]:list-disc", className)} {...props}>
                                            {children}
                                        </ul>
                                    );
                                },
                                li: ({ children, className, ...props }) => {
                                    return (
                                        <li className={cn("list-outside ml-4.5", className)} {...props}>
                                            {children}
                                        </li>
                                    );
                                }
                            }}
                        >
                            {notes}
                        </Markdown>
                    </ScrollArea>
                </CollapsibleContent>
            </Collapsible>
            <div className='flex items-center shrink-0'>
                <div className='flex items-center justify-between'>
                    <DownloadUpdate
                        disabled={isDownloading}
                        relaunch={restart}
                    >
                        {t("update_btn")}
                    </DownloadUpdate>
                </div>
                <DialogClose asChild>
                    <Button
                        className='ml-auto'
                        disabled={isDownloading}
                        variant="secondary"
                    >
                        {t("cancel", { ns: "generally" })}
                    </Button>
                </DialogClose>
            </div>
        </BasicDialog>
    );
};

export {
    UpdaterProgress,
    CheckUpdate,
    DownloadUpdate
};
export default Updater;