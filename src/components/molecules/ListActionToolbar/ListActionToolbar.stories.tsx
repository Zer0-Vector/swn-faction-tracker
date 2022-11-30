import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import ListActionToolbar from "./ListActionToolbar";

export default {
  component: ListActionToolbar,
} as ComponentMeta<typeof ListActionToolbar>;

const Template: ComponentStory<typeof ListActionToolbar> = args => <ListActionToolbar {...args} />;

export const Default = Template.bind({});

export const Removable = Template.bind({});
Removable.args = {
  removable: true,
};

