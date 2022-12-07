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
  title: "Dialog Title",
  message: "Dialog Message",
};

export const WithChildren = Template.bind({});
WithChildren.args = {
  open: true,
  title: "Dialog Title",
  message: "Dialog Message",
  children: <div>child <b>bold</b>, more text</div>,
};

export const WithButtons = Template.bind({});
WithButtons.args = {
  open: true,
  title: "Dialog Title",
  message: "Dialog Message",
  buttons: ["No", "Yes"],
  closeable: false,
};

export const NonModal = Template.bind({});
NonModal.args = {
  open: true,
  title: "Dialog Title",
  message: "Dialog Message",
  buttons: ["No", "Yes"],
  modal: false,
};

export const DisabledButton = Template.bind({});
DisabledButton.args = {
  open: true,
  title: "Dialog Title",
  message: "Dialog Message",
  buttons: ["Cancel", "No", "Yes"],
  modal: false,
  disabledButtons: ["No", "Yes"],
};
