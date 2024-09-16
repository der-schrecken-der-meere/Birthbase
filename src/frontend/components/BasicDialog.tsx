import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/frontend/components/ui/dialog'
import { DialogProps } from '@radix-ui/react-dialog'
import React from 'react'

interface I_BasicDialog {
    title: string,
    description: string,
    close: React.ReactNode,
}

const BasicDialog: React.FC<DialogProps & I_BasicDialog> = ({
    children,
    title,
    description,
    close,
    ...props
}) => {
    return (
        <Dialog {...props}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                {children}
                <DialogClose>
                    {close}
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}

export default BasicDialog