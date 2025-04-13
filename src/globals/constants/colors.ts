/** All available color accents */
const colors = [
    "purple",
    "blue",
    "green",
    "orange",
    "red",
    "gray",
] as const;
type Colors = typeof colors[number];

export type { Colors }
export { colors };