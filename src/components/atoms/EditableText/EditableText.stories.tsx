import React from "react";

import { Meta, Story } from "@storybook/react";

import EditableText from "./EditableText";

export default {
  component: EditableText
} as Meta;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const Default: Story = (args) => <EditableText id="story-test" onUpdate={() => {}} {...args}>Test 123</EditableText>;
