type ExtractPropertyOfArray<
    T extends any[],
    K extends keyof T[number],
> = T[number][K];

export type { ExtractPropertyOfArray}