import React from 'react'
import { useFileReaderProgress } from './hooks/useFileStreamProgress'

const DropzoneProgress = () => {
    const {
        progress,
        isFinished,
        read_file,
    } = useFileReaderProgress();

    return (
        <div>DropzoneProgress</div>
    )
}

export default DropzoneProgress