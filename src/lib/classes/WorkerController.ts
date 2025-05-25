// External features
import i18n from "@/i18n/load";
import { ToastType, useToastStore } from "@/stores/use_toast_store";

type OnMessage<T> = (data: MessageEvent<T>) => void;
type OnError = (event: ErrorEvent) => void;

class WorkerController<Req, Res extends { error?: string }> {
    worker: Worker|null;
    worker_builder: () => Worker;
    on_message: OnMessage<Res>;
    on_error: OnError;
    
    constructor(
        worker_builder: () => Worker,
        on_message: (this: WorkerController<Req, Res>, data: Res) => void,
        on_error: OnError,
    ) {
        this.worker = null;
        this.worker_builder = worker_builder;
        const binded = on_message.bind(this);
        this.on_message = ({ data }) => {
            const setToast = useToastStore.getState().setToast;
            const { t } = i18n;

            if (data.error) {
                setToast({
                    title: t("error", { ns: "generally" }),
                    description: t(`error.${data.error}`, { ns: "error" }),
                }, ToastType.ERROR);
                return;
            }
            
            binded(data);
        }
        this.on_error = (ev) => {
            const { t } = i18n;
            useToastStore.getState().setToast({
                title: t("error", { ns: "generally" }),
                description: JSON.stringify(ev),
            }, ToastType.ERROR);

            on_error(ev);
        };
    }

    create_worker() {
        if (this.worker !== null) return;

        const { on_error, on_message } = this;

        this.worker = this.worker_builder();
        this.worker.onmessage = on_message;
        this.worker.onerror = on_error;
    }
    kill_worker() {
        if (this.worker != null) {
            console.log("kill")
            this.worker.terminate();
            this.worker = null;
            console.log(this.worker);
        }
    }
    send_message(req: Req, transfer?: Transferable[]) {
        if (this.worker != null) {
            if (transfer) {
                this.worker.postMessage(req, transfer);
            } else {
                this.worker.postMessage(req);
            }
        }
    }
}

export {
    WorkerController,
};