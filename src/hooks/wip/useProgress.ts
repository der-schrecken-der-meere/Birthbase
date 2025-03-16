import { useCallback, useRef, useState } from "react"

interface I_useProgress {
    startState?: boolean;
    startValue?: number;
}

const checkProgressValue = (progress: number) => {
    return (progress >= 0 && progress <= 100);
}

const useProgress = ({
    startState = false,
    startValue = 0,
}: I_useProgress) => {
    if (!checkProgressValue(startValue)) {
        throw new Error("Progress value is not between 0 and 100");
    }

    const [isFinished, setIsFinished] = useState(startState);
    const [progress, setProgress] = useState(startValue);
    const error = useRef(null);

    const start_progress = useCallback(() => {
        setIsFinished(false);
        setProgress(0);
    }, []);

    const setError = (err: any) => {
        error.current = err;
    }

    const update_progress = useCallback((progress: number) => {
        if (!checkProgressValue(progress)) {
            console.error("Progress value is not between 0 and 100");
            return;
        }
        setProgress(progress);
    }, []);

    const end_progress = useCallback(() => {
        setIsFinished(true);
        setProgress(100);
    }, []);

    return {
        end_progress,
        isFinished,
        progress,
        start_progress,
        update_progress,
        error,
        setError,
    }
}

export { useProgress };