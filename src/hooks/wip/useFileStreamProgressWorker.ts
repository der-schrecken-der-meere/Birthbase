import { useCallback, useEffect, useRef } from "react";
import { useProgress } from "./useProgress";
import { I_useFileReadingProgress, T_ProgressEvent } from "./useFileStreamProgress";

type OnMessage = {
    type: T_ProgressEvent,
    result?: string,
    progress?: number,
    error?: any,
}

type PostMessage = {
    action: Extract<T_ProgressEvent, "abort"|"start">,
    file?: File,
}

const useFileStreamProgress = ({
    onEvent,
}: I_useFileReadingProgress) => {
    const {
        progress,
        isFinished,
        start_progress,
        update_progress,
        end_progress,
        error,
        setError,
    } = useProgress({});

    const reader = useRef<Worker|null>(null);

    const abort = useCallback(() => {
        if (reader.current) {
            reader.current.postMessage({
                action: "abort",
            } as PostMessage);
        }
    }, [reader]);

    const read_file = useCallback(async (file: File) => {
        if (reader.current) {
            reader.current.onmessage = (e) => {
                const data = e.data as OnMessage;
                switch (data.type) {
                    case "abort":
                        console.log("aborted");
                        onEvent && onEvent("abort");
                        if (reader.current) reader.current.terminate();
                        break;
                    case "error":
                        console.error(data.error);
                        setError(data.error);
                        onEvent && onEvent("error");
                        break;
                    case "chunk":
                        update_progress(data.progress as number);
                        onEvent && onEvent("chunk", data.result);
                        data.result = null as any;
                        break;
                    case "finished":
                        end_progress();
                        onEvent && onEvent("finished");
                        if (reader.current) reader.current.terminate();
                        break;
                    case "start":
                        start_progress();
                        onEvent && onEvent("start");
                        break;
                }
            }
            reader.current.onmessageerror = () => {
                setError("Can't deserialize message");
                onEvent && onEvent("error");
            }
            reader.current.onerror = (e) => {
                setError(e.error)
                onEvent && onEvent("error");
            }
            reader.current.postMessage({action: "start", file} as PostMessage);
        }
    }, [onEvent]);

    useEffect(() => {
        reader.current = new Worker(new URL("../worker/FileStreamProgressWorker", import.meta.url), {type: "module"})
        return () => {
            if (reader.current) reader.current.terminate();
            reader.current = null;
        }
    }, []);

    return { progress, isFinished, read_file, abort, error };
}

export type { I_useFileReadingProgress, OnMessage, PostMessage }
export { useFileStreamProgress };