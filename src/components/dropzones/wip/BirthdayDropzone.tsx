import { DropzoneOptions, ErrorCode, useDropzone } from "react-dropzone"
import Dropzone from "../Dropzone";
import { useCallback, useMemo, useRef, useState } from "react";
// import { Format, toSmallestByteType } from "@/lib/main_util";
import Decimal from "decimal.js";
import { useToast } from "../ui/use-toast";
import DropzoneFile from "../DropzoneFile";
// import { I_useFileReadingProgress } from "@/components/hooks/useFileStreamProgress";
import { Button } from "../ui/button";

const BirthdayDropzone = () => {

    // const [files, setFiles] = useState<File[]>([]);

    // const onEvent = useCallback<Exclude<I_useFileReadingProgress["onEvent"], undefined>>((type, result) => {
    //     console.log(type);
    //     if (type === "chunk") {
    //         result = null as any;
    //     }
    //     if (type === "finished") {
    //         // setFiles([]);
    //     }
    // }, []);

    // const CONFIG = useMemo(() => ({
    //     maxFiles: 1,
    //     toastDuration: 5000,
    //     toastTitle: "Fehler beim importieren",
    //     maxSize: (() => {
    //         const size = new Decimal(1_000_000_000);
    //         const formated = toSmallestByteType(size);
    //         return {
    //             value: size,
    //             formated: Format.Byte("de", formated.u, formated.v),
    //         }
    //     })(),
    // }), []);
    // const { toast } = useToast();

    // const err_msg = (err: string): string => {
    //     switch (err) {
    //         case ErrorCode.FileInvalidType:
    //             return "Falscher Dateityp";
    //         case ErrorCode.FileTooLarge:
    //             return "Datei zu groß";
    //         case ErrorCode.TooManyFiles:
    //             return "Zu viele Dateien";
    //         default:
    //             return "Eine unerwarteter Fehler ist aufgetreten";
    //     }
    // }

    // const on_drop_rejected = useCallback<Exclude<DropzoneOptions["onDropRejected"], undefined>>((rejections, ev) => {
    //     console.log(rejections, ev);
    //     const errors: string[] = [];
    //     if (rejections.length > CONFIG.maxFiles) {
    //         errors.push(err_msg(ErrorCode.TooManyFiles))
    //     } else {
    //         rejections.forEach((rej) => {
    //             rej.errors.forEach((err) => {
    //                 errors.push(err_msg(err.code))
    //             })
    //         })
    //     }
    //     toast({
    //         title: CONFIG.toastTitle,
    //         duration: CONFIG.toastDuration,
    //         variant: "destructive",
    //         description: (
    //             errors.map((err, i) => (
    //                 <p key={`dz-err-${i}`}>{err}</p>
    //             ))
    //         )
    //     })
    // }, [])

    // const onCancel = (file_index: number) => {
    //     setFiles((files) => files.filter((_, i) => i !== file_index));
    // }

    // const on_drop_accepted = useCallback<Exclude<DropzoneOptions["onDropAccepted"], undefined>>((accepted, ev) => {
    //     console.log(accepted, ev);

    //     setFiles(accepted);
    // }, []);

    // const on_error = useCallback((e: Error) => {
    //     console.log(e);
    // }, []);

    // const dropzone = useDropzone({
    //     accept: {
    //         "application/json": [".json"]
    //     },
    //     maxSize: parseInt(CONFIG.maxSize.value.toString()),
    //     // maxFiles: CONFIG.maxFiles,
    //     onError: on_error,
    //     onDropRejected: on_drop_rejected,
    //     onDropAccepted: on_drop_accepted,
    // })

    return (
        <>
            <div></div>
            {/* <Dropzone useDropzone={dropzone} className="flex-col">
                <p className="text-sm text-muted-foreground text-center">
                    Legen Sie die Datei hierrein oder clicken Sie hierrauf.
                    <br/>
                    Maximal {CONFIG.maxSize.formated}
                    <br/>
                </p>
                <p className="text-sm text-muted-foreground text-center italic">(Nur *.json Dateien werden akzeptiert)</p>
            </Dropzone>
            <div className="flex flex-col gap-2">
                {files.map((file, i) => (
                    <DropzoneFile key={`file-${file.lastModified}`} onEvent={onEvent} file={file} onCancel={() => onCancel(i)}/>
                ))}
            </div>
            <Button
                size="sm"
                className="w-28"
                disabled={files.length === 0}
            >
                Hochladen
            </Button> */}
        </>
        
    )
}

export default BirthdayDropzone;