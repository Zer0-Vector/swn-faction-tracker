import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import EditableText from "./EditableText";

export default {
  component: EditableText,
} as ComponentMeta<typeof EditableText>;


export const Default: ComponentStory<typeof EditableText> = args => {
  const [text, setText] = useState<string>(args.children);
  const handleUpdate = (val: string) => {
    setText(val);
    args.onUpdate && args.onUpdate(val);
  };
  return (
    <EditableText {...args} onUpdate={handleUpdate}>
      {text}
    </EditableText>
  );
};
Default.args = {
  id: "story-test",
  children: "Test 1234",
};
