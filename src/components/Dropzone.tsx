import { cn } from '@/lib/utils'
import React from 'react'
import { DropzoneState } from 'react-dropzone'

const Dropzone = ({
    className,
    useDropzone,
    children,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    useDropzone: DropzoneState,
}) => {

    return (
        <div className={cn(
            "flex items-center justify-center py-10 px-5",
            "border border-dashed border-input rounded-md",
            "focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden focus-visible:ring-2",
            "bg-background ring-offset-background transition-colors ",
            "disabled:pointer-events-none disabled:opacity-50",
            (useDropzone.isFocused || useDropzone.isDragActive) && "ring-ring ring-offset-2 outline-hidden ring-2",
            (useDropzone.isDragReject || useDropzone.fileRejections.length > 0) && "ring-destructive ring-offset-2 outline-hidden ring-2",
            className,
        )} {...useDropzone.getRootProps()} {...props}>
            <input {...useDropzone.getInputProps()}/>
            {children}
        </div>
    )
}

export default Dropzone
