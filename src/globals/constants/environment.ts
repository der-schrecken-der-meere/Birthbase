import { isTauri } from "@tauri-apps/api/core";

const navigatorPermission = "permissions" in navigator;
const _isTauri = isTauri();

export { _isTauri as isTauri, navigatorPermission };