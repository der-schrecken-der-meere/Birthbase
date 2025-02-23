type CommonKeys<T, U> = keyof T & keyof U;
type CommonType<T, U> = Pick<T, CommonKeys<T, U>>;

export type { CommonType };