// Packages
import { LucideProps } from "lucide-react";
import { FunctionComponent } from "react";

type NavigationMisc = {
    title: string,
    Icon: FunctionComponent<LucideProps>,
    onSelect: () => void,
};

export type {
    NavigationMisc,
};