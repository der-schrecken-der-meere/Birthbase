// Interal features
import type { COLORS } from "./lib/constants/colors";
import type { LANGUAGES } from "./lib/constants/languages";
import type { MODES } from "./lib/constants/modes";


type AppColors = typeof COLORS[number];

type AppModes = typeof MODES[number];

type AppLanguages = typeof LANGUAGES[number];

type AppSettings = {
    /** Whether to search automaticly for update if app starts */
    autosearch: boolean,
    /** Whether to autostart the app after os boot */
    autostart: boolean,
    /** Active color scheme */
    color: AppColors,
    /** Active language */
    language: AppLanguages,
    /** Active mode  */
    mode: AppModes,
    /** Whether allow to show native notifications */
    notification: boolean,
    /** Whether to relaunch the app after successfully installing an update */
    relaunch: boolean,
};

export type {
    AppSettings,
    AppColors,
    AppModes,
    AppLanguages,
};