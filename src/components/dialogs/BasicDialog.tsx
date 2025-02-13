import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { DialogProps } from '@radix-ui/react-dialog'
import React from 'react'

interface I_BasicDialog {
    title: React.ReactNode,
    description: React.ReactNode,
    trigger: React.ReactNode,
    headerVisibility?: boolean,
    dialogClassName?: string,
}

const BasicDialog: React.FC<DialogProps & I_BasicDialog> = ({
    children,
    title,
    description,
    trigger,
    headerVisibility = false,
    dialogClassName,
    ...props
}) => {
    return (
        <Dialog {...props}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent
                className={dialogClassName}
            >
                <DialogHeader className={!headerVisibility ? "hidden" : ""}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription className='flex flex-col'>{description}</DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default BasicDialog