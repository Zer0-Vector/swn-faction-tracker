import React, { useState } from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";

import EditableText from "./EditableText";

export default {
  component: EditableText,
} as ComponentMeta<typeof EditableText>;

const Template: ComponentStory<typeof EditableText> = args => {
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

export const Default = Template.bind({});
Default.args = {
  id: "story-test",
  children: "Test 1234",
};

export const Boxed = Template.bind({});
Boxed.args = {
  id: "story-test-boxed",
  children: "Boxed in test",
  sx: {
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
  }
};
Boxed.decorators = [
  story => (
    <div style={{ maxWidth: "10ch", border: "solid black 1px" }}>
      {story()}
    </div>
  )
];
