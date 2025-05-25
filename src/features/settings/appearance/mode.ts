import { type Mode } from "@/database/tables/settings/settings";

/** Changes the mode class on the body tag */
const change_mode = (mode: Mode) => {
    // Remove dark and light classes
    window.document.body.classList.remove("light", "dark");
    window.document.body.classList.add(match_media(mode));
};

/** Gets the class of the user desired mode. If system is specified use the current mode of the os */
const match_media = (mode: Mode): Mode => {
    return (mode === "system") ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode; 
};

export { change_mode };