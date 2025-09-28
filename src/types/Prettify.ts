export type Prettify<T> = { [K in keyof T]: T[K] } & {}; // NOSONAR prettify hack
