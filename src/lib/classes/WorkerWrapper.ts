class WorkerWrapper<Req, Res extends { error?: string }> {
    port: MessagePort | null = null;
    private callback: (this: WorkerWrapper<Req, Res>, data: Req) => void;
    constructor(cb: typeof this.callback) {
        this.callback = cb.bind(this);
        self.onmessage = this.onMessage.bind(this);
    };

    private async onMessage({
        data,
        ports
    }: MessageEvent<Req>) {
        try {
            if (ports.length > 0) {
                this.port = ports[0];
                const binded = this.onMessage.bind(this);
                this.port.onmessage = binded;
            }
            this.callback(data);
        } catch (e) {
            if (typeof e === "object") {
                this.postError((e as Error).message);
                return;
            }
            if (typeof e === "string") {
                this.postError(e);
                return;
            }
        }
    }

    postError(error: string) {
        /** @ts-ignore  */
        this.postMessage({ error });
    }

    postMessage(msg: Res, transfer?: Transferable[]) {
        if (transfer) {
            self.postMessage(msg, transfer);
            return;
        }
        self.postMessage(msg);
    }
}

export { WorkerWrapper };