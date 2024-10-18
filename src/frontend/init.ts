import { __INI_APP_SETTINGS__, db } from "@/database/database_exports";
import { setIDBNotificationPermission } from "./store/notification/notificationSlice";
import { AppDispatch } from "./store/store";
import { createData } from "./store/data/dataSlice";
import { isTauri } from "@/globals/constants/environment";

const init = async (dispatch: AppDispatch) => {
    await notifications(dispatch);
    await birthdayData(dispatch);
}

const notifications = async (dispatch: AppDispatch) => {
    if (!isTauri) {
        const perm = await navigator.permissions.query({
            name: "notifications",
        });

        perm.onchange = () => {
            dispatch(setIDBNotificationPermission(perm.state));
        }
    }
}

const birthdayData = async (dispatch: AppDispatch) => {
    const data = await db.read("birthdays");
    if (data.length > 0) dispatch(createData(data));
}

export default init;