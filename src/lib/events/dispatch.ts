import { ToastError } from "@/components/App";
import { c_events } from "@/globals/constants/events";

const dispatch_toast_error = (detail: ToastError) => {
    window.dispatchEvent(new CustomEvent<ToastError>(c_events.TOAST_ERR, {
        detail,
    }));
};

export {
    dispatch_toast_error,
}