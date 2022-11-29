import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import Link from "./Link";

export default {
  component: Link,
} as ComponentMeta<typeof Link>;

export const Default: ComponentStory<typeof Link> = args => {
  return (
    <Link {...args}>{args.children}</Link>
  );
};
Default.args = {
  children: "Test Link",
};
