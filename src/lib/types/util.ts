type Primitive = string|number|bigint|boolean|undefined|null|symbol;
type ComparePrimitive = Exclude<Primitive, symbol|undefined>;

export type {
    Primitive,
    ComparePrimitive,
};