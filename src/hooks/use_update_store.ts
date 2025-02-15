import { split_version_number } from "@/lib/functions/version/version";
import type { VersionNumber } from "@/lib/types/number";
import { create } from "zustand";
import { use_app_store } from "./use_app_store";

interface UpdateStore {
    prompt_open: boolean,
    available: boolean,
    progress: number,
    started: boolean,
    last_check: string,
    searching: boolean,
    version: VersionNumber,
    display_version: string,
    update_notes: string,
    start_progress: () => void,
    update_progress: (progress: number) => void,
    finish_progress: () => void,
    set_prompt: (prompt_open: boolean) => void,
    update_last_check: (last_check: string) => void,
    update_searching: (searching: boolean) => void,
    update_available: (available: boolean) => void,
    update_version: (version: VersionNumber) => void,
    update_display_version: (display_version: string) => void,
    set_update_notes: (update_version: string) => void,
};

const use_update_store = create<UpdateStore>()((set) => ({
    searching: false,
    prompt_open: false,
    available: false,
    progress: 0,
    started: false,
    last_check: "",
    version: "0.0.0",
    display_version: "",
    update_notes: "",
    start_progress: () => set(() => ({ progress: 0, started: true })),
    update_progress: (progress) => set(() => ({ progress })),
    finish_progress: () => set(() => ({ progress: 100, started: false, available: false })),
    set_prompt: (prompt_open) => set(() => ({ prompt_open })),
    update_last_check: (last_check) => set(() => ({ last_check })),
    update_searching: (searching) => set(() => ({ searching })),
    update_available: (available) => set(() => ({ available })),
    update_version: (version) => set(() => ({ version })),
    update_display_version: (display_version) => set(() => ({ display_version })),
    set_update_notes: (update_notes) => set(() => ({ update_notes }))
}));

const update_last_check = () => {
    use_update_store.getState().update_last_check(new Date().toLocaleString());
};

const update_available = (available: boolean) => {
    use_update_store.getState().update_available(available);
};

const update_searching = (searching: boolean) => {
    use_update_store.getState().update_searching(searching);
};

const update_version = (version: VersionNumber) => {
    use_update_store.getState().update_version(version);
    const current_version_parts = split_version_number(use_app_store.getState().version);
    const version_parts = split_version_number(version);
    if (version_parts.major !== current_version_parts.major) {
        use_update_store.getState().update_display_version(`Hauptversion ${version}`);
        return;
    }
    if (version_parts.minor !== current_version_parts.minor) {
        use_update_store.getState().update_display_version(`Nebenversion ${version}`);
        return;
    }
    if (version_parts.fix !== current_version_parts.fix) {
        use_update_store.getState().update_display_version(`Patchversion ${version}`);
        return;
    }
};

export {
    use_update_store,
    update_available,
    update_last_check,
    update_searching,
    update_version,
};