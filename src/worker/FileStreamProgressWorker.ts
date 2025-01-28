import { getPercentage } from "@/lib/main_util";
import { OnMessage as PostMessage, PostMessage as OnMessage } from "../components/hooks/useFileStreamProgressWorker";

let action: OnMessage["action"]|null = null;
let reader: ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>|null = null;

const read_loop = async (file: File) => {
    postMessage({type: "start"} as PostMessage)
    const TOTAL_SIZE = file.size;
    let loaded = 0;

    reader = file.stream().getReader();

    try {
        while (true) {
            if (action === "abort") {
                reader.cancel();
                postMessage({type: "abort"} as PostMessage);
                break;
            }
            let { done, value } = await reader.read();
            if (done) {
                reader.releaseLock();
                postMessage({type: "finished"} as PostMessage)
                break;
            }
            if (value) {
                loaded += value.length;
                postMessage({type: "chunk", result: new TextDecoder().decode(value), progress: getPercentage(TOTAL_SIZE, loaded)} as PostMessage);
                value = null as any;
            }
        }
    } catch (error) {
        postMessage({type: "error", error} as PostMessage)
    }
}

onmessage = (e) => {
    const res = e.data as OnMessage;
    action = res.action;
    if (action === "start") {
        if (!res.file) throw new Error("No file provided");
        read_loop(res.file);
    }
}