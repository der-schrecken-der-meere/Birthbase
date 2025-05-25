// External features
import { Button, type ButtonProps } from "@/components/ui/button";

// Internal features
import { install_update } from "../lib/functions/install_update";

const UpdaterDownloadButton = ({
    ...props
}: ButtonProps) => {

    const onDownloadClick = async () => {
        await install_update();
    };

    return (
        <Button
            onClick={onDownloadClick}
            {...props}
        />
    )
};

export { UpdaterDownloadButton };