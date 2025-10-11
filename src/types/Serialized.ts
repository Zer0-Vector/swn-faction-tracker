export type Serialized<T, N extends string = string> = T & { type: N };
