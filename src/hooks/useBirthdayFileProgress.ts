import React, { useCallback, useRef, useState } from 'react'
import { useProgress } from './useProgress'
import { useFileStreamProgress } from './useFileStreamProgressWorker';
import { stringSliceToJSON } from '@/lib/main_util';

const useBirthdayFileProgress = () => {
    const rem = useRef<string>("");
    const start = useRef<boolean>(false);

    const {
        isFinished,
        progress,
        error,
        abort,
        read_file,
    } = useFileStreamProgress({
        onEvent: (type, result) => {
            if (result) {
                if (!start.current) {
                    result = result.slice(1);
                    start.current = true;
                }
                if (result[result.length - 1] === "]") result = result.slice(0, -1);
                if (rem.current) result = rem.current + result;
                const r = stringSliceToJSON(result, (str) => {
                    console.log(type, str);
                });
                console.log(r);
                if (r) rem.current = r;
            }
        }
    });

    return { progress, isFinished, abort, read_file }
};

export { useBirthdayFileProgress };