import type { ComponentPropsWithRef, JSX, JSXElementConstructor } from "react";

export type ExtendedStoryProps<
  C extends JSXElementConstructor<unknown> | keyof JSX.IntrinsicElements,
  T,
> = ComponentPropsWithRef<C> & T;
