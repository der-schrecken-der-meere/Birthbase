import {  useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

import { useUpdateStore } from '@/stores/use_update_store';
import { useAppStore } from '@/stores/use_app_store';

import { useTranslation } from 'react-i18next';
import { useGetSettingsQuery } from '@/features/manage_settings/query';
import { useQuery } from '@/hooks/core/use_query';

import { UpdateNotes } from './UpdateNotes';
import { UpdaterProgress } from './UpdateProgress';
import { DownloadUpdate } from './DownloadUpdate';

let LinuxMacUpdater = null;
if (
    __TAURI_IS_MAC__ || __TAURI_IS_LINUX__
) {
    LinuxMacUpdater = await import("./__macos__linux__/UpdaterSwitch").then(module => module.LinuxMacUpdater);
}

const Updater = () => {
    const isDownloading = useUpdateStore((state) => state.isDownloading);
    const isPrompting = true;
    const update_version = useUpdateStore((state) => state.version);
    const setPrompting = useUpdateStore((state) => state.setPrompting);

    const appVersion = useAppStore((state) => state.appVersion);

    const { t } = useTranslation(["updater", "generally"]);

    const { data: { relaunch }, isFetching } = useQuery({
        useQueryFn: useGetSettingsQuery,
        tKey: "settings",
    });

    const [restart, set_restart] = useState(relaunch);

    const on_relaunch_change = (relaunch: boolean) => {
        set_restart(relaunch);
    };

    useEffect(() => {
        set_restart(relaunch);
    }, []);

    const Status = isDownloading
        ? (<UpdaterProgress/>)
        : (LinuxMacUpdater && (
            <LinuxMacUpdater
                onCheckedChange={on_relaunch_change}
                defaultChecked={relaunch}
            >
                {t("restart_app")}
            </LinuxMacUpdater>
        ));

    const Content = isFetching
        ? (<Skeleton className='w-full h-10'/>)
        : (
            <>
                {Status}
                <UpdateNotes/>
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
            </>
        );

    return (
        <Dialog
            defaultOpen={isPrompting}
            onOpenChange={setPrompting}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("update_to", { version: update_version })}
                    </DialogTitle>
                    <DialogDescription className='flex flex-col'>
                        <span className='mt-2 font-bold'>
                            {t("current_version", { version: appVersion })}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                {Content}
            </DialogContent>
        </Dialog>
    );
};

export { Updater };