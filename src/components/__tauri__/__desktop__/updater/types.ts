import { ButtonProps } from "@/components/ui/button";
import { ProgressProps } from "@radix-ui/react-progress";

type UpdateProgressProps = ProgressProps & {

};

type CheckUpdateProps = ButtonProps & {

};

type DownloadUpdateProps = ButtonProps & {
    relaunch: boolean,
};

export type {
    CheckUpdateProps,
    DownloadUpdateProps,
    UpdateProgressProps,
};