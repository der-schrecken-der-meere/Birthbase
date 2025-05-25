// Packages
import { type Options } from "@tauri-apps/plugin-notification";
import { type TFunction, type TOptions } from "i18next";

/**
 * Create default notification options
 * 
 * @param t Translation function
 * @param translation_key Translation group key
 * @param options Additional Notification options
 * @param t_options Additional translation options for the body
 * @returns Notification options
 */
const create_default_options = (
    t: TFunction,
    translation_key: string,
    options?: Omit<Options, "title"|"body">,
    t_options?: TOptions
): Options => {
    return {
        title: t(`${translation_key}.title`, { ns: "notification" }),
        body: t(`${translation_key}.body`, {
            ns: "notification",
            ...t_options,
        }),
        ...options,
    };
};

export { create_default_options };