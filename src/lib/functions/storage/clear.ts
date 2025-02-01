import { db } from "@/database/db";

const clear_local_storage = () => {
    localStorage.clear();
};

const clear_session_storage = () => {
    sessionStorage.clear();
};

const clear_app_storage = async () => {
    clear_local_storage();
    clear_session_storage();
    await db.clear("birthdays");
    await db.clear("notifications");
    await db.clear("settings");
};

export {
    clear_local_storage,
    clear_session_storage,
    clear_app_storage,
};