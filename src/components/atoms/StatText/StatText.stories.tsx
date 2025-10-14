import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import StatText from "./StatText";

export default {
  component: StatText,
} as ComponentMeta<typeof StatText>;

export const Default: ComponentStory<typeof StatText> = (args) => (
  <StatText {...args} />
);
Default.args = {
  children: "Test 123",
};
