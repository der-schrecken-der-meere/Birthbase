import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { mediaScreens, MediaScreenName, MediaScreenEntry } from "@/globals/constants/media_screens";

const getMediaScreen = (name: MediaScreenName, mediaScreens: readonly MediaScreenEntry[]) => {
    const i = mediaScreens.findIndex(screen => screen.name === name);
    return {
        index: i,
        value: mediaScreens[i],
    }
};

interface MediaTypeState {
    screens: readonly MediaScreenEntry[];
};

const initialState: MediaTypeState = {
    screens: mediaScreens,
};

const mediaTypeSlice = createSlice({
    name: "mediaType",
    initialState,
    reducers: {
        setScreen: (data, action: PayloadAction<MediaScreenName>) => {
            const mediaScreenIndex = getMediaScreen(action.payload, data.screens);
            if (mediaScreenIndex) {
                data.screens = data.screens.map((screen, i) => (
                    {
                        ...screen,
                        isActive: (i <= mediaScreenIndex.index),
                    }
                ));
            }
        }
    }
});

export const { setScreen } = mediaTypeSlice.actions;
export { getMediaScreen };
export default mediaTypeSlice.reducer;