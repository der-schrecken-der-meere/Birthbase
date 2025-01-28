import { Mode } from "@/database/tables/settings/settings";

const change_mode = (mode: Mode) => {
    window.document.body.classList.remove("light", "dark");
    window.document.body.classList.add(match_media(mode));
}
const match_media = (mode: Mode): Mode => {
    return (mode === "system") ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : mode; 
}

export { change_mode };