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
  children: <p>child <b>bold</b>, more text</p>,
  title: "Dialog Title",
  message: "Dialog Message",
};
