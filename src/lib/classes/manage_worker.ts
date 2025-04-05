type OnMessage<T> = (event: MessageEvent<T>) => void;
type OnError = (event: ErrorEvent) => void;

class WorkerController<Req, Res> {
    private worker: Worker|null;
    url: URL;
    on_message: OnMessage<Res>;
    on_error: OnError;
    
    constructor(
        url: URL,
        on_message: OnMessage<Res>,
        on_error: OnError,
    ) {
        console.log(url);
        this.worker = null;
        this.url = url;
        this.on_message = on_message;
        this.on_error = on_error;
    }

    create_worker() {
        const { on_error, on_message } = this;
        this.worker = new Worker(this.url, {
            type: "module",
        });
        this.worker.onmessage = on_message;
        this.worker.onerror = on_error;
    }
    kill_worker() {
        if (this.worker != null) {
            this.worker.terminate();
            this.worker = null;
        }
    }
    send_message(req: Req) {
        if (this.worker != null) {
            console.log("2");
            this.worker.postMessage(req);
        }
    }
}

export {
    WorkerController,
};