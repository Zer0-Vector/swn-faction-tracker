import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import EditableDropDownText from "./EditableDropDownText";

export default {
  component: EditableDropDownText,
} as ComponentMeta<typeof EditableDropDownText>;

const Template: ComponentStory<typeof EditableDropDownText> = (args) => <EditableDropDownText {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "one",
  selectableOptions: [
    "one","two","three"
  ]
};
