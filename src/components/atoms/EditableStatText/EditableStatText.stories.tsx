import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import { Maybe } from "../../../types/Maybe";

import EditableStatText from "./EditableStatText";

export default {
  component: EditableStatText,
} as ComponentMeta<typeof EditableStatText>;

const Template: ComponentStory<typeof EditableStatText> = args => {
  const [text, setText] = useState<Maybe<number>>(args.children);
  const handleUpdate = (val: number) => {
    setText(val);
    args.onUpdate(val);
  };
  return <EditableStatText {...args} onUpdate={handleUpdate}>{text}</EditableStatText>;
};

export const Default = Template.bind({});
Default.args = {
  children: 123
};

export const Placeholder = Template.bind({});
