import type { VersionNumber } from "@/lib/types/number";

const split_version_number = (version: VersionNumber) => {
    const parts = version.split(".");
    return {
        major: parts[0],
        minor: parts[1],
        fix: parts[2],
    };
};

export { split_version_number };