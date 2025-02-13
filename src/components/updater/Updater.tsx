import BasicDialog from '../dialogs/BasicDialog';

import { Progress } from '../ui/progress';
import { Button, ButtonProps } from '../ui/button';
import { DialogClose } from '../ui/dialog';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { mock_check_update, mock_update } from '@/features/updater/test/update';
import { use_update_store } from '@/hooks/use_update_store';
import { ProgressProps } from '@radix-ui/react-progress';
import { use_app_store } from '@/hooks/use_app_store';
import { primitive_strict_or } from '@/lib/functions/logic/or';
import { OsType } from '@tauri-apps/plugin-os';
import { Skeleton } from '../ui/skeleton';
import { LinuxMacUpdater } from './LinuxMacUpdater';
import { get_settings_query } from '@/features/manage_settings/query';
import { create_toast, ToastType } from '@/hooks/use_app_toast';

const UpdaterProgress = ({
    value,
    ...props
}: ProgressProps) => {
    const progress = use_update_store((state) => state.progress);

    return (
        <Progress value={progress} {...props}/>
    );
};

const CheckUpdate = ({
    onClick,
    children,
    ...props
}: ButtonProps) => {
    const onCheckClick = useCallback(() => {
        (async () => {
            await mock_check_update();
        })();
    }, []);

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
    const os_type = use_app_store((state) => state.os_type);

    const onDownloadClick = useCallback(() => {
        (async () => {
            await mock_update(os_type, relaunch);
        })();
    }, [relaunch]);

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
    const is_downloading = use_update_store((state) => state.started);
    const is_prompt_open = use_update_store((state) => state.prompt_open);
    const set_prompt = use_update_store((state) => state.set_prompt);
    const current_version = use_app_store((state) => state.version);
    const update_version = use_update_store((state) => state.version);
    const os_type = use_app_store((state) => state.os_type);

    const { data: { relaunch }, isError, error, isFetching } = get_settings_query();

    const [restart, setRestart] = useState(relaunch);

    useEffect(() => {
        if (isError) {
            create_toast({
                title: "Fehler beim Anzeigen der Neustartfunktion",
                description: JSON.stringify(error),
            }, ToastType.ERROR);
        }
    }, [isError, error]);

    useEffect(() => {
        setRestart(relaunch);
    }, [relaunch]);

    const on_relaunch_change = useCallback((relaunch: boolean) => {
        setRestart(relaunch);
    }, []);

    if (isFetching) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <BasicDialog
            title={`Auf Version ${update_version} updaten`}
            description={
                <span className='mt-2 font-bold'>Aktuelle Version: {current_version}</span>
            }
            headerVisibility
            defaultOpen={is_prompt_open}
            trigger={null}
            onOpenChange={set_prompt}
        >
            {is_downloading
                ? (<UpdaterProgress/>)
                : (
                    <>
                        {primitive_strict_or<OsType>(os_type, "linux", "windows") && (
                            <Suspense
                                fallback={<Skeleton className='w-full h-4' />}
                            >
                                <LinuxMacUpdater
                                    onCheckedChange={on_relaunch_change}
                                    defaultChecked={relaunch}
                                />
                            </Suspense>
                        )}
                    </>
                )
            }
            <div className='flex items-center'>
                <div className='flex items-center justify-between'>
                    <DownloadUpdate disabled={is_downloading} relaunch={restart}>
                        Updaten
                    </DownloadUpdate>
                </div>
                <DialogClose asChild>
                    <Button className='ml-auto' disabled={is_downloading} variant="secondary">Abbrechen</Button>
                </DialogClose>
            </div>
        </BasicDialog>
    );
}

export { UpdaterProgress, CheckUpdate, DownloadUpdate };
export default Updater;