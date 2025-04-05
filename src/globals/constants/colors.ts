/** All availalbe color accents */
const colors = ["blue", "gray", "green", "orange", "purple", "red"] as const;
type Colors = typeof colors[number];

export type { Colors }
export { colors };