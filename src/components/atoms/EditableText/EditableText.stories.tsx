import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import EditableText from "./EditableText";

export default {
  component: EditableText,
} as ComponentMeta<typeof EditableText>;


const Template: ComponentStory<typeof EditableText> = (args) => <EditableText {...args}>Test 123</EditableText>;

export const Default = Template.bind({});
Default.args = {
  id: "story-test",
};
