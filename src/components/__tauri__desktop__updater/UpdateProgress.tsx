import type { UpdateProgressProps } from "./types";

import { Progress } from "../ui/progress";

import { useUpdateStore } from "@/stores/use_update_store";

const UpdaterProgress = ({
    value,
    ...props
}: UpdateProgressProps) => {
    const progress = useUpdateStore((state) => state.progress);

    return (
        <Progress value={progress} {...props}/>
    );
};

export { UpdaterProgress };