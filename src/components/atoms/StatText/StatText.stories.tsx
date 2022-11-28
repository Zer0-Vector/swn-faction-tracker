import React from "react";

import { Meta, Story } from "@storybook/react";

import StatText from "./StatText";

export default {
  component: StatText,
} as Meta;

export const Default: Story = (args) => <StatText {...args}>Test 123</StatText>;
