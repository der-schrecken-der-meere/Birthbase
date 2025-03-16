import { useCallback, useRef } from "react";
import { useProgress } from "./useProgress";
import { get_percantage } from "@/lib/functions/number/percentage";

type T_ProgressEvent = "abort"|"error"|"chunk"|"finished"|"start";

interface I_useFileReadingProgress {
    onEvent?: (type: T_ProgressEvent, result?: string) => void;
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

    const reader = useRef<ReadableStreamDefaultReader<Uint8Array<ArrayBufferLike>>|null>(null);

    const abort = useCallback(() => {
        if (reader) reader.current?.cancel();
    }, [reader.current]);

    const read_file = useCallback(async (file: File) => {
        const TOTAL_SIZE = file.size;
        let loaded = 0;
        start_progress();
        onEvent && onEvent("start");

        reader.current = file.stream().getReader();

        try {
            while (true) {
                const { done, value } = await reader.current.read();
                if (done) {
                    end_progress();
                    onEvent && onEvent("finished")
                    break;
                }
                loaded += value.length;
                const result = new TextDecoder().decode(value);
                update_progress(get_percantage(TOTAL_SIZE, loaded))
                onEvent && onEvent("chunk", result);
            }
        } catch (error) {
            setError(error);
            onEvent && onEvent("error")
        }
    }, [onEvent]);

    return { progress, isFinished, read_file, abort, error };
}

export type { I_useFileReadingProgress, T_ProgressEvent }
export { useFileStreamProgress };