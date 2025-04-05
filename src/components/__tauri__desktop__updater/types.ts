import { ProgressProps } from "@radix-ui/react-progress";
import { ButtonProps } from "../ui/button";

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