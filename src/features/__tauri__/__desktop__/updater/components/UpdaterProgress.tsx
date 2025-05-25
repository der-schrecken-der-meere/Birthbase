// Packages
import type { ProgressProps } from "@radix-ui/react-progress";

// External features
import { Progress } from "@/components/ui/progress";

// Internal features
import { useUpdateStore } from "../stores/use_update";

const UpdaterProgress = ({
    value,
    ...props
}: ProgressProps) => {
    const progress = useUpdateStore((state) => state.progress);

    return (
        <Progress
            value={progress}
            {...props}
        />
    );
};

export { UpdaterProgress };