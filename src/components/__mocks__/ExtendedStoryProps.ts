import { ComponentProps, JSXElementConstructor } from "react";

export type ExtendedStoryProps<
  C extends JSXElementConstructor<unknown> | keyof JSX.IntrinsicElements,
  T,
> = ComponentProps<C> & T;
