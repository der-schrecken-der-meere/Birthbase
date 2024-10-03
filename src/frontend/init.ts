import { __INI_APP_SETTINGS__, db } from "../database/birthbase";
import { setIDBNotificationPermission } from "./store/notification/notificationSlice";
import { AppDispatch } from "./store/store";
import { createData } from "./store/data/dataSlice";

const init = async (dispatch: AppDispatch) => {
    await notifications(dispatch);
    await birthdayData(dispatch);
}

const notifications = async (dispatch: AppDispatch) => {
    const perm = await navigator.permissions.query({
        name: "notifications",
    });
    
    dispatch(setIDBNotificationPermission(
        __INI_APP_SETTINGS__.permissions.notification ?__INI_APP_SETTINGS__.permissions.notification as PermissionState : perm.state
    ));

    perm.onchange = (e) => {
        dispatch(setIDBNotificationPermission((e.target as PermissionStatus).state));
    }
}

const birthdayData = async (dispatch: AppDispatch) => {
    const data = await db.tables.birthdays.read();
    dispatch(createData(data));
}

export default init;