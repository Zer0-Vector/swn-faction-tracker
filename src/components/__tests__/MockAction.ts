import { action } from "@storybook/addon-actions";

export const MockAction = (funcName: string) => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [funcName]: (...args: any[]) => action(funcName)(args),
});
