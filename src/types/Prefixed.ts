export type Prefixed<T, P extends string> = {
  [K in keyof T as K extends string
    ? `${Lowercase<P>}${Capitalize<K>}`
    : never]: T[K];
};
