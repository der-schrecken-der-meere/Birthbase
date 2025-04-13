/** All available modes */
const modes = [
    "dark",
    "light",
    "system",
] as const;
type Modes = typeof modes[number];

export type { Modes };
export { modes };