type MediaScreenName = "sm"|"md"|"lg"|"xl"|"xxl";
type MediaQuery = {
    "min-width"?: number;
    "max-width"?: number;
};
type MediaScreenEntry = {
    name: MediaScreenName;
    mediaQuery: MediaQuery;
    isActive: boolean;
};

const _mediaScreens: MediaScreenEntry[] = [
    {
        name: "sm",
        mediaQuery: {
            "max-width": 767,
        },
        isActive: false,
    },
    {
        name: "md",
        mediaQuery: {
            "min-width": 768,
            "max-width": 1023,
        },
        isActive: false,
    },
    {
        name: "lg",
        mediaQuery: {
            "min-width": 1024,
            "max-width": 1279,
        },
        isActive: false,
    },
    {
        name: "xl",
        mediaQuery: {
            "min-width": 1280,
            "max-width": 1537,
        },
        isActive: false,
    },
    {
        name: "xxl",
        mediaQuery: {
            "min-width": 1536,
        },
        isActive: false,
    },
];
const mediaScreens = Object.freeze(_mediaScreens);
export { mediaScreens };
export type { MediaQuery, MediaScreenEntry, MediaScreenName };