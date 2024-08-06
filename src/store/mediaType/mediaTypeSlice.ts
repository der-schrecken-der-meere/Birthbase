import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type MediaScreenName = "sm"|"md"|"lg"|"xl"|"xxl";
type MediaQuery = {
    minWidth?: number;
    maxWidth?: number;
}
type MediaScreenEntry = {
    name: MediaScreenName;
    mediaQuery: MediaQuery;
    isActive: boolean;
}

const mediaScreens: readonly MediaScreenEntry[] = [
    {
        name: "sm",
        mediaQuery: {
            maxWidth: 767,
        },
        isActive: false,
    },
    {
        name: "md",
        mediaQuery: {
            minWidth: 768,
            maxWidth: 1023,
        },
        isActive: false
    },
    {
        name: "lg",
        mediaQuery: {
            minWidth: 1024,
            maxWidth: 1279,    
        },
        isActive: false
    },
    {
        name: "xl",
        mediaQuery: {
            minWidth: 1280,
            maxWidth: 1537,
        },
        isActive: false
    },
    {
        name: "xxl",
        mediaQuery: {
            minWidth: 1536,
        },
        isActive: false
    },
];

const getMediaScreen = (name: MediaScreenName, mediaScreens: readonly MediaScreenEntry[]) => {
    const found = mediaScreens.findIndex(screen => screen.name === name);
    return {
        screen: found >= 0 ? mediaScreens[found] : undefined,
        index: found,
    }
}

interface MediaTypeState {
    screens: readonly MediaScreenEntry[];
}

const initialState: MediaTypeState = {
    screens: mediaScreens,
}

const mediaTypeSlice = createSlice({
    name: "mediaType",
    initialState,
    reducers: {
        setScreen: (data, action: PayloadAction<MediaScreenName>) => {
            const mediaScreen = getMediaScreen(action.payload, data.screens);
            if (mediaScreen) {
                let index: boolean|null = null;
                data.screens = data.screens.map((screen) => {
                    if (index) {
                        return {
                            ...screen,
                            isActive: false,
                        }
                    } else {
                        if (screen.name === mediaScreen.screen?.name) {
                            index = true;
                            return {
                                ...screen,
                                isActive: true,
                            }
                        }
                        return {
                            ...screen,
                            isActive: true,
                        }
                    }
                })
            }
        }
    }
})

export const { setScreen } = mediaTypeSlice.actions;
export { getMediaScreen, mediaScreens };
export default mediaTypeSlice.reducer;