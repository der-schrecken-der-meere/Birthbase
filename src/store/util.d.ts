type PartiallyOptional<T, K extends keyof T> = {
    [P in keyof T as P extends K ? P : never]: T[P];  // Behalte K als verpflichtend
} & {
    [P in keyof T as P extends K ? never : P]?: T[P];  // Mach den Rest optional
};

export type { PartiallyOptional }