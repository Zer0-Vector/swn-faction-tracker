import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import ConfirmDialog from "./ConfirmDialog";

export default {
  component: ConfirmDialog,
} as ComponentMeta<typeof ConfirmDialog>;

export const Default: ComponentStory<typeof ConfirmDialog> = args => <ConfirmDialog {...args} />;
Default.args = {
  open: true,
  title: "Dialog Title",
  message: "Dialog Message",
  buttonText: "OK Button",
  children: (<p><b>child</b> CHILD <i>child</i></p>),
};
