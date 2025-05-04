type OnMessage<T> = (event: MessageEvent<T>) => void;
type OnError = (event: ErrorEvent) => void;

class WorkerController<Req, Res> {
    private worker: Worker|null;
    worker_builder: () => Worker;
    on_message: OnMessage<Res>;
    on_error: OnError;
    
    constructor(
        worker_builder: () => Worker,
        on_message: OnMessage<Res>,
        on_error: OnError,
    ) {
        this.worker = null;
        this.worker_builder = worker_builder;
        this.on_message = on_message;
        this.on_error = on_error;
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
            this.worker.terminate();
            this.worker = null;
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