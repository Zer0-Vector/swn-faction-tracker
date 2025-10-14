import React from "react";

export interface ChildrenProps<T = React.ReactNode> {
  children?: T;
}

export type RequiredChildrenProps<T = React.ReactNode> = Required<
  ChildrenProps<T>
>;
