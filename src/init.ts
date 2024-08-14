import { __APP_SETTINGS__, db } from "./database/db";
import { setIDBNotificationPermission } from "./store/notification/notificationSlice";
import { AppDispatch } from "./store/store";
import { setData } from "./store/data/dataSlice";

const init = async (dispatch: AppDispatch) => {
    await notifications(dispatch);
    await birthdayData(dispatch);
}

const notifications = async (dispatch: AppDispatch) => {
    const perm = await navigator.permissions.query({
        name: "notifications",
    });

    dispatch(setIDBNotificationPermission(
        !__APP_SETTINGS__ ? perm.state : __APP_SETTINGS__.notification.permission as PermissionState
    ));

    perm.onchange = (e) => {
        dispatch(setIDBNotificationPermission((e.target as PermissionStatus).state));
    }
}

const birthdayData = async (dispatch: AppDispatch) => {
    const data = await db.GET(undefined, "birthday");
    dispatch(setData(data));
}

export default init;