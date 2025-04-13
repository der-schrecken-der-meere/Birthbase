const languages = [
    "de",
    "en",
] as const;
type Languages = typeof languages[number];

export type { Languages };
export { languages };