import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import MessageDialog from "./MessageDialog";

export default {
  component: MessageDialog,
} as ComponentMeta<typeof MessageDialog>;

const Template: ComponentStory<typeof MessageDialog> = args => <MessageDialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  open: true,
  buttonText: "Button-Text",
  title: "Dialog Title",
  message: "Dialog Message",
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  open: true,
  buttonText: "Button-Text",
  title: "Dialog Title",
  message: "Dialog Message",
  children: <div>child <b>bold</b>, more text</div>,
};
