import type { PropsWithChildren } from "react";

export type ReadonlyPropsWithChildren<T = object> = Readonly<
  PropsWithChildren<T>
>;
