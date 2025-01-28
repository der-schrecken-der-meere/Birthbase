import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

import { setRemember } from "@/store/notification/notificationSlice";
import { setMode } from "@/store/mode/modeSlice";
import { setColor } from "@/store/color/colorSlice";
import { db } from "@/database/db";
import { useAppToast } from "@/hooks/useAppToast";
import { Settings } from "@/database/tables/settings/settings";
import { setSettings } from "@/database/tables/settings/db_model";

type SettingsStoreSlice = "color"|"mode"|"remember";

const updater: Record<SettingsStoreSlice, Function> = {
    remember: setRemember,
    mode: setMode,
    color: setColor,
};

const _useSettings = <T extends SettingsStoreSlice>(slice: T): {
    value: RootState[T]["value"],
    updateSettings: (newValue: RootState[T]["value"]) => void,
} => {
    const { setErrorNotification } = useAppToast();
    const dispatch = useDispatch<AppDispatch>();
    const sliceData = useSelector((state: RootState) => state[slice].value);
    const defaultValue = sliceData;

    const updateSettings = useCallback((newValue: typeof sliceData) => {
        (async () => {
            try {
                dispatch(updater[slice](newValue));
                await db.storeSettings({[slice]: newValue});
            } catch (e) {
                console.log(e);
                dispatch(updater[slice](defaultValue));
                setErrorNotification({
                    title: "Fehler beim Aktualisieren",
                    description: (e as any),
                });
            }
        })();
        
    }, []);

    return {
        value: sliceData,
        updateSettings,
    }
}

const useSettings = () => {
    const updateSettings = useCallback((
        value: Omit<Partial<Settings>, "id">,
        callback: (newData: Settings|undefined, error?: any) => void,
    ) => {
        (async () => {
            try {
                const response = await setSettings(value);
                callback(response);
            } catch (e) {
                callback(undefined, e);
            }
        })();
    }, []);

    return {
        updateSettings,
    }
}

export type { SettingsStoreSlice };
export default useSettings;