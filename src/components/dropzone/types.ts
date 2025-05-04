import { type DropzoneOptions } from "react-dropzone";

type FileUploaderFormProps = DropzoneOptions & {
    onSubmit: (files: File[]) => void;
    progress?: number | false;
};

export type {
    FileUploaderFormProps,
};