import { OsType } from "@tauri-apps/plugin-os";
import { primitive_strict_or } from "./or";

const is_desktop = (os_type: OsType) => {
    return primitive_strict_or<OsType>(os_type, "linux", "macos", "windows");
};

export {
    is_desktop
};