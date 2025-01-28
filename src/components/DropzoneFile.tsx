import { useCallback, useEffect } from "react";
import { I_useFileReadingProgress, useFileStreamProgress } from "./hooks/useFileStreamProgressWorker";
import { Button } from "./ui/button";
import { X } from "lucide-react"
import { useBirthdayFileProgress } from "./hooks/useBirthdayFileProgress";

interface I_DropzoneFile extends I_useFileReadingProgress {
    file: File;
    onCancel: () => void;
};

const DropzoneFile = ({
    onEvent,
    file,
    onCancel,
}: I_DropzoneFile) => {
    const {
        progress,
        isFinished,
        abort,
        read_file,
    } = useBirthdayFileProgress();

    useEffect(() => {
        read_file(file);
        return () => {
            abort();
        }
    }, []);

    return (
        <div className="w-full flex items-center overflow-hidden py-1 px-2 border border-1 border-border rounded-md">
            <span className="whitespace-pre text-ellipsis overflow-hidden mr-auto text-sm">{file.name}</span>
            <span className="mx-2 text-sm">{progress.toFixed(0)}%</span>
            {/* <Progress value={progress} className="h-2 mx-2" /> */}
            <Button
                onClick={onCancel}
                variant="ghost"
                size="icon"
                className="shrink-0 h-4 w-4 mr-1"
            >
                <X className="h-4 w-4" />
                <span className="sr-only">Entfernen</span>
            </Button>
        </div>
        
    )
}

export default DropzoneFile;