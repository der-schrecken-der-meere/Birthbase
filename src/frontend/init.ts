import { __INI_APP_SETTINGS__, db } from "@/database/database_exports";
import { setPermission } from "./store/notification/notificationSlice";
import { AppDispatch } from "./store/store";
import { createData } from "./store/data/dataSlice";
import { onPermissionChange } from "@/apis/tauri_notification";

const init = async (dispatch: AppDispatch) => {
    await notifications(dispatch);
    await birthdayData(dispatch);
}

const notifications = async (dispatch: AppDispatch) => {
    onPermissionChange((state) => dispatch(setPermission(state)));
}

const birthdayData = async (dispatch: AppDispatch) => {
    const data = await db.read("birthdays");
    if (data.length > 0) dispatch(createData(data));
}

export default init;